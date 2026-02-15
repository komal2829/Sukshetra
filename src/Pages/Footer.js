import React from 'react';
import '../Style/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container py-5">
        <div className="row g-4">
          {/* Contact Us */}
          <div className="col-md-4">
            <h5 className="footer-title mb-3">Contact Us</h5>
            <div className="contact-info">
              <p className="mb-2">
                <i className="bi bi-telephone-fill me-2"></i>
                <a href="tel:+919063356113" className="footer-link">+91 9063356113</a>
              </p>
              <p className="mb-2">
                <i className="bi bi-envelope-fill me-2"></i>
                <a href="mailto: sukshetra24@gmail.com" className="footer-link">sukshetra24@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Organo Location */}
          <div className="col-md-4">
            <h5 className="footer-title mb-3">Organo Location</h5>
            <p className="mb-2 text-muted">Eco-friendly community living</p>
            <a 
              href="https://maps.app.goo.gl/bRBieZjegGtAn4gP9" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-location"
            >
              <i className="bi bi-geo-alt-fill me-2"></i>
              View on Google Maps
            </a>
          </div>

          {/* Farmhouse Location */}
          <div className="col-md-4">
            <h5 className="footer-title mb-3">Farmhouse Location</h5>
            <p className="mb-2 text-muted">Peaceful countryside retreat</p>
            <a 
              href="https://maps.app.goo.gl/GkUnFM1wHjNtVc6a7" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-location"
            >
              <i className="bi bi-geo-alt-fill me-2"></i>
              View on Google Maps
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="row mt-4 pt-4 border-top">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-muted">© 2024 Sukshetra. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="/" className="footer-link me-3">Home</a>
            <a href="/book" className="footer-link">Book Now</a>
          </div>
        </div>
      </div>
    </footer>
  );
}