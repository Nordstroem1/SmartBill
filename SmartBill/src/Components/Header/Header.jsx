import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../index.css';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
                    {/* Left side spacer for perfect balance */}
                    <div className="header-spacer"></div>
                    
                    {/* Centered Logo */}
                    <div className="logo-section">
                        <motion.h1 
                            className="logo-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
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
                                        ease: [0.25, 0.1, 0.25, 1]
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
                                        ease: [0.25, 0.1, 0.25, 1]
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
            </motion.div>
        </header>
    );
};

export default Header;