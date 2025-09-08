import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import "../../index.css";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false); // Close menu after logout
      navigate("/"); // Redirect to landing page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu after navigation
  };

  // Format full name so each part starts with an uppercase letter (handles hyphens/apostrophes)
  const formatName = (fullName) => {
    if (!fullName || typeof fullName !== "string") return "";
    return fullName
      .trim()
      .split(/\s+/)
      .map((part) =>
        part
          // split but keep delimiters to properly rejoin hyphenated or apostrophe names
          .split(/([-'])/)
          .map((seg) =>
            /^[-']$/.test(seg)
              ? seg
              : seg
              ? seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase()
              : ""
          )
          .join("")
      )
      .join(" ");
  };

  return (
    <header className="header">
      <motion.div
        className="header-bar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          {/* Left logo */}
          <div className="header-spacer">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/");
              }}
              aria-label="Go to home"
            >
              <img
                src="https://res.cloudinary.com/dhpjnh2q0/image/upload/v1756211273/SB-logo-cut_jaqxms.png"
                alt="SmartBill logo"
                className="brand-logo"
                draggable="false"
              />
            </a>
          </div>

          {/* Centered Logo */}
          <div className="logo-section">
            <motion.h1
              className="logo-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              onClick={() => handleNavigation("/")}
              style={{ cursor: "pointer" }}
            >
              SmartBill
            </motion.h1>
          </div>

          {/* Right side hamburger/close button */}
          <motion.button
            className="hamburger-btn"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {!isMenuOpen ? (
                // Hamburger icon
                <motion.svg
                  key="hamburger"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="hamburger-icon"
                  initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <path
                    d="M3 12h18M3 6h18M3 18h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              ) : (
                // X icon
                <motion.svg
                  key="close"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="close-icon"
                  initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="menu-content">
                {isAuthenticated ? (
                  // Authenticated user menu
                  <>
                    {user && (
                      <button
                        className="user-info"
                        onClick={() => handleNavigation('/user')}
                        aria-label="Go to your profile"
                        style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                      >
                        <p>{formatName(user?.fullName)}</p>
                      </button>
                    )}
                    <button
                      className="nav-btn dashboard-btn"
                      onClick={() => handleNavigation("/dashboard")}
                    >
                      Dashboard
                    </button>
                    <button
                      className="nav-btn logout-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  // Non-authenticated user menu
                  <>
                    <button 
                      className="nav-btn login-btn"
                      onClick={() => handleNavigation('/login')}
                    >
                      <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Login</span>
                    </button>
                    <button 
                      className="nav-btn register-btn"
                      onClick={() => handleNavigation('/register')}
                    >
                      <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="9.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M20 8v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span>Register</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
};

export default Header;
