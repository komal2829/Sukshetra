import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import '../Style/Bookpage.css';
import Footer from "./Footer";
import heroImage from '../Images/general/hero-trees.webp'; // Add hero image

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

  async function fetchBookings() {
    try {
      console.log("API URL:", process.env.REACT_APP_API_URL);

    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings`)
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
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
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
    
    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(day.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${dayOfMonth}`;
    
    const bookedLocations = bookingMap[dateKey] || [];
    
    if (bookedLocations.length === 2) {
      setMessage({ type: "danger", text: "Both locations are fully booked on this date. Please choose another date." });
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
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      const bookedLocations = bookingMap[dateKey] || [];
      
      if (bookedLocations.length === 2) {
        return 'fully-booked-tile';
      } else if (bookedLocations.includes("Organo") && !bookedLocations.includes("Farmhouse")) {
        return 'farmhouse-available-tile';
      } else if (bookedLocations.includes("Farmhouse") && !bookedLocations.includes("Organo")) {
        return 'organo-available-tile';
      } else {
        return 'both-available-tile';
      }
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.phone.trim() || !form.email.trim() || !form.location || !form.fromDate) {
      setMessage({ type: "danger", text: "Please fill all required fields." });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        location: form.location,
        fromDate: form.fromDate,
        toDate: form.toDate
      };
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings`, payload);
      if (res.status === 200 || res.status === 201) {
      setMessage({ type: "success", text: "Booking confirmed! ✅" });
      setShowModal(false);
      fetchBookings();
    }

  } catch (err) {
    console.error(err);

    const serverMsg = err.response?.data?.message;

    if (err.response?.status === 409) {
      setMessage({ type: "danger", text: "Dates already booked ❌" });
    } else {
      setMessage({ type: "danger", text: serverMsg || "Error while booking. Try again." });
    }

  } finally {
    setSubmitting(false);
  }
}

  return (
    <div className="bookpage-wrapper w-100">
      {/* Header - Same as Home */}
      <header className="header w-100 d-flex justify-content-between align-items-center p-3 shadow-sm">
        <nav className="d-flex gap-4">
          <a href="/" className="nav-link-custom">Home</a>
          <a href="/book" className="nav-link-custom">Book Now</a>
        </nav>
      </header>

      {/* Hero Section - Same as Home */}
      <section className="hero text-center py-5 px-3" style={{'--hero-bg': `url(${heroImage})`}}>
        <h1 className="fw-bold hero-title">Book Your Stay</h1>
        <h4>Choose Your Perfect Getaway</h4>
        <p className="hero-desc mx-auto">
          Select your preferred dates and location below to reserve your natural escape.
        </p>
      </section>

      {/* Booking Calendar Section */}
      <div className="container my-5">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card shadow-sm p-3">
              <div className="mb-3">
                <strong>Legend:</strong>
                <span className="badge ms-2" style={{background:'#90EE90'}}> Both Available</span>
                <span className="badge ms-2" style={{background:'#FFD700'}}> Organo Available</span>
                <span className="badge ms-2" style={{background:'#87CEEB'}}> Farmhouse Available</span>
                <span className="badge ms-2" style={{background:'#FF6B6B'}}> Both Booked</span>
              </div>

              <Calendar
                onClickDay={onDateClick}
                tileClassName={tileClassName}
              />

              {message && (
                <div className={`alert alert-${message.type} mt-3`} role="alert">
                  {message.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Booking: {form.location} ({form.fromDate} to {form.toDate})</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">First name *</label>
                  <input name="firstName" value={form.firstName} onChange={handleFormChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last name</label>
                  <input name="lastName" value={form.lastName} onChange={handleFormChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleFormChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input name="email" value={form.email} onChange={handleFormChange} className="form-control" required type="email" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location *</label>
                  <select name="location" value={form.location} onChange={handleFormChange} className="form-select" required>
                    <option value="Organo" disabled={selectedDate && bookingMap[form.fromDate]?.includes("Organo")}>
                      Organo {selectedDate && bookingMap[form.fromDate]?.includes("Organo") ? "(Booked)" : ""}
                    </option>
                    <option value="Farmhouse" disabled={selectedDate && bookingMap[form.fromDate]?.includes("Farmhouse")}>
                      Farmhouse {selectedDate && bookingMap[form.fromDate]?.includes("Farmhouse") ? "(Booked)" : ""}
                    </option>
                  </select>
                </div>

                <div className="row">
                  <div className="col">
                    <label className="form-label">From</label>
                    <input name="fromDate" value={form.fromDate} onChange={handleFormChange} className="form-control" type="date" readOnly />
                  </div>
                  <div className="col">
                    <label className="form-label">To</label>
                    <input name="toDate" value={form.toDate} onChange={handleFormChange} className="form-control" type="date" min={form.fromDate} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={submitting}>{submitting ? "Submitting..." : "Submit Booking"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}