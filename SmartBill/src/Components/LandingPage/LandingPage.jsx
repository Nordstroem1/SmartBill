import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => (
  <>
    <div className="landing-container">
      <section className="features-section">
        <h2>Become A Partner Today</h2>
        {/* Write your compelling text here */}
        <p className="features-description">
          {/* Your description about why SmartBill is perfect for your business */}
        </p>
        {/* Optional image below description */}
        <img
          src="https://res.cloudinary.com/dhpjnh2q0/image/upload/v1752054419/2760426_kl1dgz.jpg"
          alt="Why SmartBill Overview"
          className="features-image"
        />
        {/* Bullet list of benefits */}
        <ul className="features-list">
          <li>Get paid on time with reminders</li>
          <li>Organize jobs & track time and money</li>
          <li>Easily search for projects</li>
          <li>Sign up easily with Google</li>
          <li>Professional invoices</li>
          <li>Save time</li>
        </ul>
      </section>

      {/* Promo Section with image and benefits list */}
      <section className="promo-section">
        <h2 className="promo-text">Jobs & Invoice Dashboard</h2>
        <img
          src="https://res.cloudinary.com/dhpjnh2q0/image/upload/v1752054119/b808ea7dedf_uzmqlk.png"
          alt="Invoice Dashboard Overview"
          className="promo-image"
        />
        <ul className="promo-list">
          <li>Mark jobs with paid status to </li>
          <li>Search for jobs See linked invoices</li>
          <li>Customize invoice templates to match your brand identity</li>
          <li>Automate reminders to clients and reduce late payments</li>
          <li>And much more to boost your productivity</li>
        </ul>
      </section>

      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <ul>
          <li>Sign up instantly—no credit card needed.</li>
          <li>Fill in your company or personal details.</li>
          <li>Select VAT and payment options.</li>
          <li>Send your invoice with a click.</li>
        </ul>
      </section>
      <section className="cta-section">
        <Link to="/login" className="cta-button">
          Get Started Now
        </Link>
      </section>
    </div>
  </>
);

export default LandingPage;
