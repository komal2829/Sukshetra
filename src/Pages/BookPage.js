import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import '../Style/Bookpage.css';
import Footer from "./Footer";
import heroImage from '../Images/general/hero-trees.webp';

// ✅ Define once globally
const API_URL = process.env.REACT_APP_API_URL;

export default function BookPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
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

  // ✅ FIXED FUNCTION
  async function fetchBookings() {
    try {
      console.log("API URL:", API_URL);

      if (!API_URL) {
        console.error("API URL missing");
        return;
      }

      const res = await axios.get(`${API_URL}/api/bookings`);
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

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      let d = new Date(start);
      while (d <= end) {
        const dateKey = d.toISOString().split("T")[0];

        if (!bookingMap[dateKey]) {
          bookingMap[dateKey] = [];
        }

        if (!bookingMap[dateKey].includes(b.location)) {
          bookingMap[dateKey].push(b.location);
        }

        d.setDate(d.getDate() + 1);
      }
    });

    return bookingMap;
  }

  const bookingMap = getBookingsByLocation();

  function onDateClick(day) {
    setMessage(null);

    const dateKey = day.toISOString().split("T")[0];
    const bookedLocations = bookingMap[dateKey] || [];

    if (bookedLocations.length === 2) {
      setMessage({
        type: "danger",
        text: "Both locations are fully booked on this date."
      });
      return;
    }

    let defaultLocation = "Organo";
    if (bookedLocations.includes("Organo")) {
      defaultLocation = "Farmhouse";
    }

    setSelectedDate(new Date(day));
    setForm({
      ...form,
      location: defaultLocation,
      fromDate: dateKey,
      toDate: dateKey
    });
    setShowModal(true);
  }

  function tileClassName({ date, view }) {
    if (view === 'month') {
      const dateKey = date.toISOString().split("T")[0];
      const bookedLocations = bookingMap[dateKey] || [];

      if (bookedLocations.length === 2) return 'fully-booked-tile';
      if (bookedLocations.includes("Organo")) return 'farmhouse-available-tile';
      if (bookedLocations.includes("Farmhouse")) return 'organo-available-tile';

      return 'both-available-tile';
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.firstName || !form.phone || !form.email) {
      setMessage({ type: "danger", text: "Fill all required fields." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await axios.post(`${API_URL}/api/bookings`, form);

      if (res.status === 200 || res.status === 201) {
        setMessage({ type: "success", text: "Booking confirmed! ✅" });
        setShowModal(false);
        fetchBookings();
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage({ type: "danger", text: "Dates already booked ❌" });
      } else {
        setMessage({
          type: "danger",
          text: err.response?.data?.message || "Error occurred"
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bookpage-wrapper w-100">
      <header className="header p-3">
        <a href="/">Home</a> | <a href="/book">Book</a>
      </header>

      <section className="hero text-center" style={{ backgroundImage: `url(${heroImage})` }}>
        <h1>Book Your Stay</h1>
      </section>

      <div className="container my-5">
        <Calendar onClickDay={onDateClick} tileClassName={tileClassName} />

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal d-block">
          <form onSubmit={handleSubmit}>
            <input name="firstName" onChange={handleFormChange} required />
            <input name="phone" onChange={handleFormChange} required />
            <input name="email" onChange={handleFormChange} required />

            <button type="submit">
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}