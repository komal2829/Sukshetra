import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "../Style/Bookpage.css";
import Footer from "./Footer";
import heroImage from "../Images/general/hero-trees.webp";

// API URL
const API_URL = process.env.REACT_APP_API_URL;

export default function BookPage() {
const [bookings, setBookings] = useState([]);
const [showModal, setShowModal] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [message, setMessage] = useState(null);

const [form, setForm] = useState({
firstName: "",
lastName: "",
phone: "",
email: "",
location: "Organo",
fromDate: "",
toDate: "",
});

useEffect(() => {
fetchBookings();
}, []);

async function fetchBookings() {
try {
if (!API_URL) {
console.error("❌ API URL missing");
return;
}

```
  const res = await axios.get(`${API_URL}/api/bookings`);
  setBookings(res.data || []);
} catch (err) {
  console.error("❌ fetch bookings error:", err);
}
```

}

function getBookingsByLocation() {
const bookingMap = {};

```
bookings.forEach((b) => {
  const start = new Date(b.fromDate);
  const end = new Date(b.toDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  let d = new Date(start);

  while (d <= end) {
    const key = d.toISOString().split("T")[0];

    if (!bookingMap[key]) bookingMap[key] = [];

    if (!bookingMap[key].includes(b.location)) {
      bookingMap[key].push(b.location);
    }

    d.setDate(d.getDate() + 1);
  }
});

return bookingMap;
```

}

const bookingMap = getBookingsByLocation();

function onDateClick(day) {
setMessage(null);

```
const dateKey = day.toISOString().split("T")[0];
const bookedLocations = bookingMap[dateKey] || [];

if (bookedLocations.length === 2) {
  setMessage({
    type: "danger",
    text: "Both locations are fully booked.",
  });
  return;
}

let defaultLocation = "Organo";
if (bookedLocations.includes("Organo")) {
  defaultLocation = "Farmhouse";
}

setForm({
  ...form,
  location: defaultLocation,
  fromDate: dateKey,
  toDate: dateKey,
});

setShowModal(true);
```

}

function tileClassName({ date, view }) {
if (view === "month") {
const key = date.toISOString().split("T")[0];
const booked = bookingMap[key] || [];

```
  if (booked.length === 2) return "fully-booked-tile";
  if (booked.includes("Organo")) return "farmhouse-available-tile";
  if (booked.includes("Farmhouse")) return "organo-available-tile";

  return "both-available-tile";
}
```

}

function handleFormChange(e) {
const { name, value } = e.target;
setForm((prev) => ({ ...prev, [name]: value }));
}

async function handleSubmit(e) {
e.preventDefault();

```
if (!form.firstName || !form.phone || !form.email) {
  setMessage({ type: "danger", text: "Fill all required fields." });
  return;
}

setSubmitting(true);
setMessage(null);

try {
  const res = await axios.post(
    `${API_URL}/api/bookings`,
    form
  );

  setMessage({ type: "success", text: "Booking confirmed! ✅" });
  setShowModal(false);
  fetchBookings();
} catch (err) {
  console.error(err);

  if (err.response?.status === 409) {
    setMessage({ type: "danger", text: "Dates already booked ❌" });
  } else {
    setMessage({
      type: "danger",
      text: err.response?.data?.message || "Error occurred",
    });
  }
} finally {
  setSubmitting(false);
}
```

}

return ( <div className="bookpage-wrapper">
{/* HEADER */} <header className="header"> <a href="/">Home</a> | <a href="/book">Book Now</a> </header>

```
  {/* HERO */}
  <section
    className="hero"
    style={{
      backgroundImage: `url(${heroImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <h1>Book Your Stay</h1>
  </section>

  {/* CALENDAR */}
  <div className="calendar-wrapper">
    <div className="calendar-card">
      <Calendar
        onClickDay={onDateClick}
        tileClassName={tileClassName}
      />
    </div>
  </div>

  {/* MESSAGE */}
  {message && (
    <div className={`alert alert-${message.type}`}>
      {message.text}
    </div>
  )}

  {/* MODAL */}
  {showModal && (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="modal-header">
          <h3>
            Booking: {form.location} ({form.fromDate} to {form.toDate})
          </h3>
          <button
            className="close-btn"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>First name *</label>
          <input name="firstName" onChange={handleFormChange} required />

          <label>Last name</label>
          <input name="lastName" onChange={handleFormChange} />

          <label>Phone *</label>
          <input name="phone" onChange={handleFormChange} required />

          <label>Email *</label>
          <input name="email" onChange={handleFormChange} required />

          <label>Location *</label>
          <select
            name="location"
            value={form.location}
            onChange={handleFormChange}
          >
            <option>Organo</option>
            <option>Farmhouse</option>
          </select>

          <div className="date-row">
            <div>
              <label>From</label>
              <input
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label>To</label>
              <input
                type="date"
                name="toDate"
                value={form.toDate}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button type="submit" className="submit-btn">
              {submitting ? "Submitting..." : "Submit Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  <Footer />
</div>
```

);
}
