require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

console.log("🚀 Server starting...");

// ======================
// ✅ CORS (fix preflight)
// ======================
app.use(cors());
app.options("*", cors()); // <-- IMPORTANT for preflight

// ======================
// ✅ Middleware
// ======================
app.use(express.json());

// ======================
// ✅ Health Check
// ======================
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ======================
// Booking Schema
// ======================
const bookingSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

// ======================
// Nodemailer Setup
// ======================
let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  console.log("📧 Mailer ready");
} else {
  console.warn("⚠️ Email disabled (missing SMTP env)");
}

// ======================
// Routes
// ======================

// ✅ GET bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ fromDate: 1 }).lean();
    res.json(bookings);
  } catch (err) {
    console.error("❌ GET bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { firstName, lastName, phone, email, location, fromDate, toDate } = req.body;

    if (!firstName || !phone || !email || !location || !fromDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const start = new Date(fromDate);
    start.setHours(0, 0, 0, 0);

    const end = toDate ? new Date(toDate) : new Date(fromDate);
    end.setHours(0, 0, 0, 0);

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range",
      });
    }

    // ✅ Check conflicts
    const conflicts = await Booking.find({
      location,
      fromDate: { $lte: end },
      toDate: { $gte: start },
    });

    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Selected date range is already booked.",
      });
    }

    const booking = await Booking.create({
      firstName,
      lastName,
      phone,
      email,
      location,
      fromDate: start,
      toDate: end,
    });

    // ✅ Send emails (non-blocking)
    if (transporter) {
      setImmediate(async () => {
        try {
          await transporter.sendMail({
            from: process.env.FROM_EMAIL || process.env.SMTP_USER,
            to: process.env.OWNER_EMAIL || "komsred@gmail.com",
            subject: `New booking: ${location}`,
            text: `New booking: ${firstName} ${lastName || ""}`,
          });

          await transporter.sendMail({
            from: process.env.FROM_EMAIL || process.env.SMTP_USER,
            to: email,
            subject: "Booking Confirmation",
            text: `Hi ${firstName}, your booking is confirmed.`,
          });

          console.log("📧 Emails sent");
        } catch (err) {
          console.error("❌ Email error:", err.message);
        }
      });
    }

    res.json({ success: true, booking });

  } catch (err) {
    console.error("❌ POST booking error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================
// ✅ Connect DB FIRST, then start server
// ======================
// ======================
// ✅ Start server FIRST (CRITICAL for Railway)
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ======================
// ✅ Connect Mongo (NON-BLOCKING)
// ======================
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI missing");
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ Mongo error:", err.message));
}