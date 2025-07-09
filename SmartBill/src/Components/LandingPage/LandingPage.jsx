import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => (
  <>
    <div className="landing-container">
      <section className="hero-section">
        <h1>SmartBill</h1>
        <p>Effortless Invoicing for Businesses & Freelancers</p>
        <Link to="/signup" className="cta-button">
          Start Your Free Trial
        </Link>
      </section>

      <section className="features-section">
        <h2>Why SmartBill?</h2>
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
          <li>Fast & intuitive interface for quick invoice creation</li>
          <li>Fully compliant with Swedish and international regulations</li>
          <li>Responsive design for seamless mobile usage</li>
          <li>Secure data handling with bank-level encryption</li>
        </ul>
      </section>

      {/* Promo Section with image and benefits list */}
      <section className="promo-section">
        <img
          src="https://res.cloudinary.com/dhpjnh2q0/image/upload/v1752054119/b808ea7dedf_uzmqlk.png"
          alt="Invoice Dashboard Overview"
          className="promo-image"
        />
        <p className="promo-text">
          Experience a real-time overview of your invoicing process with our easy-to-read dashboard.
        </p>
        <ul className="promo-list">
          <li>Visualize outstanding payments and due dates at a glance</li>
          <li>Customize invoice templates to match your brand identity</li>
          <li>Automate reminders to clients and reduce late payments</li>
          <li>Generate customizable reports with one click</li>
        </ul>
      </section>

      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <ol>
          <li>Sign up instantly—no credit card needed.</li>
          <li>Fill in your company or personal details.</li>
          <li>Select VAT and payment options.</li>
          <li>Send your invoice with a click.</li>
        </ol>
      </section>

        <Link to="/signup" className="cta-button">
          Get Started Now
        </Link>
    </div>
  </>
);

export default LandingPage;