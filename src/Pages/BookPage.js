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

  // ✅ FIXED API URL (fallback added)
  const API = process.env.REACT_APP_API_URL || "https://sukshetra-production.up.railway.app";

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await axios.get(`${API}/api/bookings`);
      const data = Array.isArray(res.data) ? res.data : [];
      setBookings(data);
    } catch (err) {
      console.error("fetch bookings error", err);
      setBookings([]);
    }
  }

  function getBookingsByLocation() {
    const map = {};

    bookings.forEach(b => {
      let d = new Date(b.fromDate);
      const end = new Date(b.toDate);

      d.setHours(0,0,0,0);
      end.setHours(0,0,0,0);

      while (d <= end) {
        const key = d.toISOString().slice(0,10);
        if (!map[key]) map[key] = [];
        if (!map[key].includes(b.location)) {
          map[key].push(b.location);
        }
        d.setDate(d.getDate() + 1);
      }
    });

    return map;
  }

  const bookingMap = getBookingsByLocation();

  function onDateClick(day) {
    const key = day.toISOString().slice(0,10);
    const booked = bookingMap[key] || [];

    if (booked.length === 2) {
      setMessage({ type: "danger", text: "Fully booked!" });
      return;
    }

    const location = booked.includes("Organo") ? "Farmhouse" : "Organo";

    setForm({
      ...form,
      location,
      fromDate: key,
      toDate: key
    });

    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.firstName || !form.phone || !form.email) {
      setMessage({ type: "danger", text: "Fill required fields" });
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post(`${API}/api/bookings`, form);

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
      <header className="header">
        <a href="/">Home</a>
        <a href="/book">Book Now</a>
      </header>

      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <h1>Book Your Stay</h1>
        <p>Choose your perfect getaway</p>
      </section>

      <div className="calendar-container">
        <Calendar onClickDay={onDateClick} />
        {message && <div className={`msg ${message.type}`}>{message.text}</div>}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <form onSubmit={handleSubmit}>
              <input name="firstName" placeholder="First Name" onChange={e => setForm({...form, firstName: e.target.value})} />
              <input name="phone" placeholder="Phone" onChange={e => setForm({...form, phone: e.target.value})} />
              <input name="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
              <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Book"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}