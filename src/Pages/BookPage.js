import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import '../Style/Bookpage.css';

import heroImage from '../Images/general/hero-trees.webp';

export default function BookPage() {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    location: "Organo",
    fromDate: "",
    toDate: ""
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("fetch bookings error", err);
    }
  }

  function getBookingsByLocation() {
    const bookingMap = {};

    bookings.forEach(b => {
      const start = new Date(b.fromDate);
      const end = new Date(b.toDate);

      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);

      let d = new Date(start);
      while (d <= end) {
        const key = d.toISOString().slice(0,10);
        if (!bookingMap[key]) bookingMap[key] = [];
        if (!bookingMap[key].includes(b.location)) {
          bookingMap[key].push(b.location);
        }
        d.setDate(d.getDate() + 1);
      }
    });

    return bookingMap;
  }

  const bookingMap = getBookingsByLocation();

  function onDateClick(day) {
    setMessage(null);

    const dateKey = day.toISOString().slice(0,10);
    const booked = bookingMap[dateKey] || [];

    if (booked.length === 2) {
      setMessage({ type: "danger", text: "Fully booked!" });
      return;
    }

    const location = booked.includes("Organo") ? "Farmhouse" : "Organo";

    setForm({
      ...form,
      location,
      fromDate: dateKey,
      toDate: dateKey
    });

    setShowModal(true);
  }

  function tileClassName({ date, view }) {
    if (view === 'month') {
      const key = date.toISOString().slice(0,10);
      const booked = bookingMap[key] || [];

      if (booked.length === 2) return 'fully-booked';
      if (booked.includes("Organo")) return 'farmhouse-available';
      if (booked.includes("Farmhouse")) return 'organo-available';
      return 'both-available';
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.firstName || !form.phone || !form.email) {
      setMessage({ type: "danger", text: "Fill required fields" });
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookings`,
        form
      );

      if (res.data.success) {
        setShowModal(false);
        setMessage({ type: "success", text: "Booking confirmed!" });
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "danger", text: "Booking failed" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>

      {/* HEADER */}
      <header className="header">
        <a href="/">Home</a>
        <a href="/book">Book Now</a>
      </header>

      {/* HERO */}
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <h1>Book Your Stay</h1>
        <p>Choose your perfect getaway</p>
      </section>

      {/* CALENDAR */}
      <div className="calendar-container">
        <Calendar
          onClickDay={onDateClick}
          tileClassName={tileClassName}
        />

        {message && (
          <div className={`msg ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>

      {showModal && (
  <div className="modal-overlay">
    <div className="modal-container">

      {/* HEADER */}
      <div className="modal-header">
        <h2>
          {form.location} ({form.fromDate})
        </h2>
        <button
          type="button"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="modal-form">

        <div className="form-group">
          <label>First Name *</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName || ""}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName || ""}
            onChange={handleFormChange}
          />
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={form.phone || ""}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={form.email || ""}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <select
            name="location"
            value={form.location}
            onChange={handleFormChange}
          >
            <option value="Organo">Organo</option>
            <option value="Farmhouse">Farmhouse</option>
          </select>
        </div>

        <div className="date-row">
          <div>
            <label>From</label>
            <input
              type="date"
              value={form.fromDate}
              readOnly
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
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Book Now"}
          </button>
        </div>

      </form>
    </div>
  </div>
)}      )}

    </div>
    
  );
}