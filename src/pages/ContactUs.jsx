import React from "react";
import Nav from "../components/Nav"; // Import the Nav component
import "./css/ContactUs.css"; // Import your custom CSS file

function ContactUs() {
  return (
    <div>
      <Nav />
      <br />
      <br />
      <br />
      <div className="contact-us-container">
        <h2>Contact Us</h2>
        <div className="contact-info">
          <div className="contact-item">
            <i className="fas fa-user icon"></i>
            <p>Name: Health-Hub</p>
          </div>
          <div className="contact-item">
            <i className="fas fa-envelope icon"></i>
            <p>Email: healthhub@gmail.com</p>
          </div>
          <div className="contact-item">
            <i className="fab fa-whatsapp icon"></i>
            <p>
              Contact via WhatsApp:{" "}
              <a
                href="https://wa.me/+6001110542466" // Replace with your WhatsApp number
                target="_blank"
                rel="noopener noreferrer"
              >
                Message us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
