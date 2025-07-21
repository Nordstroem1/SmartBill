import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getStoredUser, isAuthenticated, logout } from "../../utils/auth";
import JobModal from "../JobModal/JobModal";
import CreateJobModal from "../CreateJobModal/CreateJobModal";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [bounceAll, setBounceAll] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    Math.max(new Date().getFullYear(), 2025)
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigate = useNavigate();
  const [jobsData, setJobsData] = useState([]);

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

  // Fetch job data to determine which months to display
  useEffect(() => {
    // Simulate API call - replace with actual API integration
    setTimeout(() => {
      const mockJobs = [
        { id: 1, title: "Webbdesign för företag", date: "2025-01-15" },
        { id: 2, title: "Logo design", date: "2025-01-22" },
        { id: 3, title: "E-handel lösning", date: "2025-01-10" },
        { id: 4, title: "Mobil app UI/UX", date: "2025-01-28" },
      ];
      setJobsData(mockJobs);
    }, 800);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleWholeYearClick = () => {
    setBounceAll(true);
    setTimeout(() => setBounceAll(false), 600);
    setSelectedMonth("Hela året");
    setModalOpen(true);
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    setModalOpen(true);
  };

  const handleCreateJob = () => {
    setCreateModalOpen(true);
  };

  const handleJobCreated = (newJob) => {
    console.log("New job created:", newJob);
    // Here you would typically add the job to your state or send it to an API
    // For now, we'll just log it and show a success message
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  // Generate year options (from 2025 onwards, up to current year + 5)
  const currentYear = new Date().getFullYear();
  const startYear = 2025;
  const endYear = Math.max(currentYear + 5, startYear + 10);
  const yearOptions = [];
  for (let i = startYear; i <= endYear; i++) {
    yearOptions.push(i);
  }

  // Month names and filter based on jobs
  const monthNames = [
    "Januari", "Februari", "Mars", "April", "Maj", "Juni",
    "Juli", "Augusti", "September", "Oktober", "November", "December"
  ];
  // Determine which months have jobs for the selected year
  const visibleMonths = monthNames.filter((_, idx) =>
    jobsData.some(job => {
      const date = new Date(job.date);
      return date.getFullYear() === selectedYear && date.getMonth() === idx;
    })
  );

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
      transition={{ duration: 0.3 }}
    >
      <motion.header
        className="dashboard-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <motion.div
          className="dashboard-user-info"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
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
            transition={{ duration: 0.2, delay: 0.15 }}
            whileHover={{ scale: 1.05 }}
          />
          <motion.div
            className="user-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.25 }}
            >
              Välkommen, {user?.name || "Gäst"}!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
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
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.div
          className="month-selector"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            Välj månad för arbete och fakturor
          </motion.h2>
          <motion.div
            className="create-job-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.27 }}
          >
            <button
              className="create-job-btn"
              onClick={handleCreateJob}
            >
              Logga nytt arbete 
            </button>
          </motion.div>
          <motion.div
            className="search-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.28 }}
          >
            <input
              type="text"
              placeholder="Sök efter arbeten..."
              className="search-input"
            />
          </motion.div>
          <motion.div
            className="year-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.32 }}
          >
            <select
              id="year-select"
              value={selectedYear}
              onChange={handleYearChange}
              className="year-dropdown"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </motion.div>
          <motion.div
            className="month-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.38 }}
          >
            <motion.button
              className="month-btn whole-year-btn"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{
                opacity: 1,
                scale: bounceAll ? [1, 1.1, 1] : 1,
                y: bounceAll ? [0, -10, 0] : 0,
              }}                transition={{
                  duration: bounceAll ? 0.4 : 0.3,
                  delay: bounceAll ? 0 : 0.42,
                  type: "spring",
                  stiffness: 120,
                  damping: 15,
                }}
              whileHover={{
                scale: 1.05,
                y: -8,
                transition: {
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
              whileTap={{
                scale: 0.95,
                y: -2,
                transition: { duration: 0.1 },
              }}
              onClick={handleWholeYearClick}
            >
              Hela året
            </motion.button>
            {visibleMonths.map((month, index) => (
              <motion.button
                key={month}
                className="month-btn"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: bounceAll ? [1, 1.1, 1] : 1,
                  y: bounceAll ? [0, -10, 0] : 0,
                }}
                transition={{
                  duration: bounceAll ? 0.4 : 0.3,
                  delay: bounceAll ? 0.03 * index : 0.45 + 0.03 * index,
                  type: bounceAll ? "spring" : "ease",
                  stiffness: bounceAll ? 120 : undefined,
                  damping: bounceAll ? 15 : undefined,
                }}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  transition: {
                    duration: 0.2,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
                }}
                whileTap={{
                  scale: 0.95,
                  y: -2,
                  transition: { duration: 0.1 },
                }}
                onClick={() => handleMonthClick(month)}
              >
                {month}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </motion.main>
      
      <JobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
      
      <CreateJobModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateJob={handleJobCreated}
      />
    </motion.div>
  );
}

export default Dashboard;
