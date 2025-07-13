import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import "./LandingPage.css";

// Variants for scroll-in animations
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
// Variants for list animations
const listVariants = { visible: { transition: { staggerChildren: 0.2 } }, hidden: {} };
const itemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

const LandingPage = () => (
  <>
    <div className="landing-container">
      <motion.section
        className="hero-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        tabIndex={0}
        aria-label="Hero Section"
      >
        <h2 className="hero-title">Effortless Invoicing for Businesses & Freelancers</h2>
        <Link to="/signup" className="cta-button">
          Start Your Free Trial
        </Link>
      </motion.section>

      <motion.section
        className="features-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        tabIndex={0}
        aria-label="Features Section"
      >
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
        <motion.ul className="features-list" variants={listVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {["Get paid on time with reminders", "Organize jobs & track time and money", "Easily search for projects", "Sign up with Google", "Professional invoices", "Save time"].map(text => (
            <motion.li key={text} variants={itemVariants}>
              {text}
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>

      {/* Promo Section with image and benefits list */}
      <motion.section
        className="promo-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        tabIndex={0}
        aria-label="Promo Section"
      >
        <h2 className="promo-text">Jobs & Invoice Dashboard</h2>
        <img
          src="https://res.cloudinary.com/dhpjnh2q0/image/upload/v1752054119/b808ea7dedf_uzmqlk.png"
          alt="Invoice Dashboard Overview"
          className="promo-image"
        />
        <motion.ul className="promo-list" variants={listVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {["Mark jobs with paid status", "Search for jobs and see linked invoices", "Customize invoice templates to match your brand identity", "Automate reminders to clients and reduce late payments", "And much more to boost your productivity"].map(text => (
            <motion.li key={text} variants={itemVariants}>
              {text}
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>

      <motion.section
        className="how-it-works-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        tabIndex={0}
        aria-label="How It Works Section"
      >
        <h2>How It Works</h2>
        <motion.ol
          className="how-it-works-list"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {["Sign up instantly—no credit card needed.", "Enter your details and choose payment options.", "Send your invoice in no time."].map(text => (
            <motion.li key={text} variants={itemVariants}>
              {text}
            </motion.li>
          ))}
        </motion.ol>
      </motion.section>
      <motion.section
        className="cta-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        tabIndex={0}
        aria-label="Call to Action Section"
      >
        <Link to="/login" className="GSN-button">
          Get Started Now
        </Link>
      </motion.section>
    </div>
  </>
);

export default LandingPage;
