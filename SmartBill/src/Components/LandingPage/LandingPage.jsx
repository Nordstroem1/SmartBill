import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="lp2-container">
      {/* Hero Section */}
      <section className="lp2-hero">
        <div className="lp2-hero-fade"></div>
        <div className="lp2-hero-container">
          <div className="lp2-hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Smartbill is a Smart and Simple Way to Manage Your Invoices and jobs
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lp2-hero-subtitle"
            >
              One of the most important part of your business is getting paid. 
              SmartBill streamlines your invoicing process alongside your jobs to help you create and overview your finances.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lp2-cta"
            >
              <button 
                className="lp2-cta-button"
                onClick={() => navigate('/register')}
              >
                Get Started
              </button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lp2-hero-image"
          >
          <div className="lp2-phone-mockup">
            <div className="lp2-phone-screen">
              <div className="lp2-app-ui">
                <div className="lp2-ui-header">
                  <div className="lp2-ui-title">SmartBill</div>
                  <div className="lp2-ui-icon">📊</div>
                </div>
                <div className="lp2-ui-content">
                  <div className="lp2-ui-item active">Create Invoice</div>
                  <div className="lp2-ui-item">Track Payments</div>
                  <div className="lp2-ui-item">Manage Clients</div>
                </div>
              </div>
            </div>
          </div>
          {/* Floating decorative elements */}
          <div className="lp2-float-element lp2-float-1">💰</div>
          <div className="lp2-float-element lp2-float-2">📄</div>
          <div className="lp2-float-element lp2-float-3">✓</div>
        </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="lp2-features">
        <div className="lp2-features-grid">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lp2-feature"
          >
            <div className="lp2-feature-icon">👥</div>
            <h3>Easy Client Management</h3>
            <p>Keep track of all your clients and their payment history in one organized place.</p>
          </motion.div>
          
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lp2-feature"
          >
            <div className="lp2-feature-icon">✨</div>
            <h3>Professional Templates</h3>
            <p>Beautiful, customizable invoice templates that make your business look professional.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lp2-feature"
          >
            <div className="lp2-feature-icon">🎯</div>
            <h3>Smart Analytics</h3>
            <p>Gain insights into your business performance with detailed reports and analytics.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="lp2-cta-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="lp2-cta-content"
        >
          <h2>Ready to streamline your invoicing?</h2>
          <button 
            className="lp2-cta-button"
            onClick={() => navigate('/register')}
          >
            Start Your Free Trial
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
