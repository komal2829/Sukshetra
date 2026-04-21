// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
//app.use(cors());




// ✅ CORS CONFIG (PUT HERE)
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({
  origin: [
    "https://sukshetram-dev.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(express.json());


// ✅ Body parser AFTER CORS
app.use(bodyParser.json());

// Connect to MongoDB
// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined");
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB connected");
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});
// Booking schema
const bookingSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  location: String, // Organo or Farmhouse
  fromDate: Date,
  toDate: Date,
  createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// setup nodemailer transport (use .env)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Utility: check if date ranges overlap
function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return (aStart <= bEnd) && (bStart <= aEnd);
}

// GET bookings
app.get('/api/bookings', async (req, res) => {
  try {
    console.log("📥 GET /api/bookings called");

    const all = await Booking.find().sort({ fromDate: 1 }).lean();

    console.log("✅ Data fetched:", all);

    res.json(all);
  } catch (err) {
    console.error("❌ BOOKINGS ERROR FULL:", err);
    console.error("❌ STACK:", err.stack);

    res.status(500).json({ message: 'Server error' });
  }
});

// POST booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, location, fromDate, toDate } = req.body;
    // basic validation
    if (!firstName || !phone || !email || !location || !fromDate) {
      return res.status(400).json({ success:false, message: 'Missing required fields' });
    }
    // parse dates (normalize to midnight)
    const start = new Date(fromDate);
    start.setHours(0,0,0,0);
    const end = toDate ? new Date(toDate) : new Date(fromDate);
    end.setHours(0,0,0,0);

    if (end < start) return res.status(400).json({ success:false, message: 'Invalid date range' });

    // Check for conflicting bookings (same location only)
    const conflicts = await Booking.find({
      location: location,
      $or: [
        { fromDate: { $lte: end }, toDate: { $gte: start } } // overlap
      ]
    }).lean();

    if (conflicts.length > 0) {
      return res.status(409).json({ success:false, message: 'Selected date range is already booked for this location.' });
    }

    // Save booking
    const booking = new Booking({
      firstName, lastName, phone, email, location, fromDate: start, toDate: end
    });
    await booking.save();

    // Send email to owner and user (owner: komsred@gmail.com)
    const ownerMail = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.OWNER_EMAIL || 'komsred@gmail.com',
      subject: `New booking: ${location} (${fromDate} to ${toDate || fromDate})`,
      text: `New booking received:\n\nName: ${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email}\nLocation: ${location}\nFrom: ${start.toISOString().slice(0,10)}\nTo: ${end.toISOString().slice(0,10)}\n\n`
    };

    const userMail = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: `Your booking confirmation for ${location}`,
      text: `Hi ${firstName},\n\nYour booking for ${location} from ${start.toISOString().slice(0,10)} to ${end.toISOString().slice(0,10)} has been received. We will contact you soon.\n\nThank you,\nSukshetra`
    };

    // send owner email
    transporter.sendMail(ownerMail, (err, info) => {
      if (err) console.error('owner mail err', err);
      else console.log('owner mail sent', info.response);
    });
    // send user email
    transporter.sendMail(userMail, (err, info) => {
      if (err) console.error('user mail err', err);
      else console.log('user mail sent', info.response);
    });

    res.json({ success:true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
