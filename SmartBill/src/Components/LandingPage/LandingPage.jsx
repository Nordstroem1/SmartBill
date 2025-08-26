import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import { SiGoogleanalytics } from "react-icons/si";
import { VscNotebookTemplate } from "react-icons/vsc";
import { FaMoneyCheckAlt } from "react-icons/fa";

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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.8 }}
            >
              Smartbill is a Smart and Simple Way to Manage Your Invoices and
              jobs
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.8, delay: 0.05 }}
              className="lp2-hero-subtitle"
            >
              One of the most important part of your business is getting paid.
              SmartBill streamlines your invoicing process alongside your jobs
              to help you create and overview your finances.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.8, delay: 0.1 }}
              className="lp2-cta"
            >
              <button
                className="lp2-cta-button"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 480, damping: 32, mass: 0.9, delay: 0.1 }}
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
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="lp2-features">
        <div className="lp2-features-grid">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 32, mass: 0.85 }}
            viewport={{ once: true, amount: 0.2 }}
            className="lp2-feature"
          >
            <div className="lp2-feature-icon">
              <FaMoneyCheckAlt size={60} color="white" aria-label="Money" />
            </div>
            <h3>Easy Client Management</h3>
            <p>
              Keep track of all your clients and their payment history in one
              organized place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 32, mass: 0.85, delay: 0.05 }}
            viewport={{ once: true, amount: 0.2 }}
            className="lp2-feature"
          >
            <div className="lp2-feature-icon">
              <VscNotebookTemplate
                size={50}
                color="white"
                aria-label="Template"
              />
            </div>
            <h3>Professional Templates</h3>
            <p>
              Beautiful, customizable invoice templates that make your business
              look professional.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 32, mass: 0.85, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="lp2-feature"
          >
            <div className="lp2-feature-icon">
              <SiGoogleanalytics
                size={50}
                color="white"
                aria-label="Analytics"
              />
            </div>
            <h3>Smart Analytics</h3>
            <p>
              Gain insights into your business performance with detailed reports
              and analytics.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
