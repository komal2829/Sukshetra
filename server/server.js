require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// ✅ CORS (allow all for now — fix later if needed)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / direct calls

    if (
      origin.includes("vercel.app") ||
      origin === "http://localhost:3000"
    ) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.options('*', cors()); // ✅ handle preflight

// ✅ Middleware
app.use(express.json());

// ======================
// MongoDB Connection
// ======================
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ======================
// Booking Schema
// ======================
const bookingSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  location: String,
  fromDate: Date,
  toDate: Date,
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

// ======================
// Nodemailer Setup
// ======================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ======================
// Routes
// ======================

// ✅ GET bookings
app.get("/api/bookings", async (req, res) => {
  try {
    console.log("📥 GET /api/bookings");

    const bookings = await Booking.find()
      .sort({ fromDate: 1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    console.error("❌ GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { firstName, lastName, phone, email, location, fromDate, toDate } =
      req.body;

    if (!firstName || !phone || !email || !location || !fromDate) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const start = new Date(fromDate);
    start.setHours(0, 0, 0, 0);

    const end = toDate ? new Date(toDate) : new Date(fromDate);
    end.setHours(0, 0, 0, 0);

    if (end < start) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date range" });
    }

    // ✅ Check conflicts
    const conflicts = await Booking.find({
      location,
      fromDate: { $lte: end },
      toDate: { $gte: start },
    }).lean();

    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Selected date range is already booked.",
      });
    }

    // ✅ Save booking
    const booking = new Booking({
      firstName,
      lastName,
      phone,
      email,
      location,
      fromDate: start,
      toDate: end,
    });

    await booking.save();

    // ======================
    // EMAIL (non-blocking)
    // ======================
    setImmediate(async () => {
      try {
        const ownerMail = {
          from: process.env.FROM_EMAIL || process.env.SMTP_USER,
          to: process.env.OWNER_EMAIL || "komsred@gmail.com",
          subject: `New booking: ${location}`,
          text: `New booking:\n${firstName} ${lastName}\n${phone}\n${email}\n${location}\n${start.toISOString()} - ${end.toISOString()}`,
        };

        const userMail = {
          from: process.env.FROM_EMAIL || process.env.SMTP_USER,
          to: email,
          subject: `Booking Confirmation`,
          text: `Hi ${firstName}, your booking is confirmed.`,
        };

        await transporter.sendMail(ownerMail);
        await transporter.sendMail(userMail);

        console.log("📧 Emails sent");
      } catch (err) {
        console.error("❌ Email error:", err);
      }
    });

    res.json({ success: true, booking });
  } catch (err) {
    console.error("❌ POST error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});