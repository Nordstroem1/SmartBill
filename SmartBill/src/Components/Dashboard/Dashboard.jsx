import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getStoredUser, isAuthenticated, logout } from '../../utils/auth';
import './Dashboard.css';

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        // if (!isAuthenticated()) {
        //     navigate('/login');
        //     return;
        // }

        // Get user data
        const userData = getStoredUser();
        setUser(userData);
    }, [navigate]);

    const handleLogout = async () => {
        await logout();
    };

//    if (!user) {
  //      return (
   //         <div className="dashboard">
     //           <div className="loading">Something went wrong... try refreshing the page or log out.</div>
       //     </div>
        //        );
    //}

    return (
        <motion.div 
            className="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.header 
                className="dashboard-header"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <motion.div 
                    className="dashboard-user-info"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <motion.img
                        src={
                            user?.picture ||
                            "https://res.cloudinary.com/dhpjnh2q0/image/upload/v1752503192/placeholder.profilePic_blktiv.jpg"
                        }
                        alt="Profile"
                        className="user-avatar"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                    />
                    <motion.div 
                        className="user-details"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                        >
                            Välkommen, {user?.name || "Gäst"}!
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                        >
                            {user?.email || "guest@example.com"}
                        </motion.p>
                    </motion.div>
                </motion.div>
            </motion.header>
            <motion.main 
                className="dashboard-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    Dashboard
                </motion.h1>
                <motion.div 
                    className="month-selector"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                >
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        Välj månad för jobb och fakturor
                    </motion.h2>
                    <motion.div 
                        className="month-buttons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                    >
                        {['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 
                          'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'].map((month, index) => (
                            <motion.button 
                                key={month}
                                className="month-btn"
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: 1.0 + (0.08 * index),
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 15
                                }}
                                whileHover={{ 
                                    scale: 1.05,
                                    y: -8,
                                    transition: { 
                                        duration: 0.3,
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20
                                    }
                                }}
                                whileTap={{ 
                                    scale: 0.95,
                                    y: -2,
                                    transition: { duration: 0.1 }
                                }}
                            >
                                {month}
                            </motion.button>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.main>
        </motion.div>
    );
}

export default Dashboard;