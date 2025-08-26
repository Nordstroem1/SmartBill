import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getStoredUser, isAuthenticated, logout } from "../../utils/auth";
import JobModal from "../JobModal/JobModal";
import CreateJobModal from "../CreateJobModal/CreateJobModal";
import AnalyticsPanel from "../AnalyticsPanel/AnalyticsPanel";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [bounceAll, setBounceAll] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    Math.max(new Date().getFullYear(), 2025)
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString('en-US', { month: 'long' })
  );
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [jobsData, setJobsData] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const [company, setCompany] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    // if (!isAuthenticated()) {
    //     navigate('/login');
    //     return;
    // }

    // Get user data
    const userData = getStoredUser();
    setUser(userData);
    // Mock company info for display at top (replace with API/user-bound data when available)
    setTimeout(() => {
      setCompany({
        name: "SmartBill Studio AB",
        logoUrl: "https://res.cloudinary.com/dhpjnh2q0/image/upload/v1756215727/PlaceholderLogo_kx7rce.png",
        address: "123 Invoice St, Billing City"
      });
    }, 150);
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

  // Removed Whole year CTA in favor of month-only flow

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

  // Reset pagination when year or search changes (not on month selection)
  useEffect(() => {
    setPage(1);
  }, [selectedYear, query]);

  // Generate year options (from 2025 onwards, up to current year + 5)
  const currentYear = new Date().getFullYear();
  const startYear = 2025;
  const endYear = Math.max(currentYear + 5, startYear + 10);
  const yearOptions = [];
  for (let i = startYear; i <= endYear; i++) {
    yearOptions.push(i);
  }

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  // Month counts for selected year
  const monthCounts = useMemo(() => {
    const counts = Array(12).fill(0);
    jobsData.forEach(job => {
      const date = new Date(job.date);
      if (date.getFullYear() === selectedYear) counts[date.getMonth()]++;
    });
    return counts;
  }, [jobsData, selectedYear]);

  // Filtered jobs by year and search query (full year list)
  const filteredJobs = useMemo(() => {
    const inYear = jobsData.filter(j => new Date(j.date).getFullYear() === selectedYear);
    const q = query.trim().toLowerCase();
    if (!q) return inYear.sort((a,b)=> new Date(b.date) - new Date(a.date));
    return inYear.filter(j =>
      j.title?.toLowerCase().includes(q) ||
      new Date(j.date).toLocaleDateString('en-GB').includes(q)
    ).sort((a,b)=> new Date(b.date) - new Date(a.date));
  }, [jobsData, selectedYear, query]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, page]);

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'short', day: '2-digit'
  });

  // Analytics are handled inside AnalyticsPanel

  //    if (!user) {
  //      return (
  //         <div className="dashboard">
  //           <div className="loading">Something went wrong... try refreshing the page or log out.</div>
  //     </div>
  //        );
  //}

  return (
    <>
      <motion.main
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
        {company && (
          <motion.header
            className="dashboard-header"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="dashboard-user-info">
              <img
                src={company.logoUrl || ""}
                alt={`${company.name} logo`}
                className="user-avatar"
              />
              <div className="user-details">
                <h2>{company.name}</h2>
                <p>{company.address || "Unknown Address"}</p>
              </div>
            </div>
          </motion.header>
        )}
        {/* Toolbar to toggle analytics visibility */}
        <div className="dashboard-toolbar">
          <button
            className={`analytics-toggle ${showAnalytics ? 'active' : ''}`}
            onClick={() => setShowAnalytics(v => !v)}
            aria-expanded={showAnalytics}
            aria-controls="analytics-section"
          >
            {showAnalytics ? 'Hide analytics' : 'Show analytics'}
          </button>
        </div>

        {/* Analytics summary for owner (collapsible) */}
        {showAnalytics && (
          <AnalyticsPanel
            selectedYear={selectedYear}
            monthCounts={monthCounts}
            monthNames={monthNames}
            jobsData={jobsData}
          />
        )}
        <motion.section
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
            Select month for jobs and invoices
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
              Log new job
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
              placeholder="Search jobs..."
              className="search-input"
              value={query}
              onChange={(e)=> setQuery(e.target.value)}
        aria-label="Search jobs"
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
            {monthNames.map((month, index) => (
              <motion.button
                key={month}
                className={`month-btn ${selectedMonth===month ? 'is-active' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.45 + 0.03 * index,
                  type: "ease",
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
                aria-label={`${month} (${monthCounts[index]} jobs)`}
              >
                {month}
                <span
                  className={`month-badge ${monthCounts[index] === 0 ? 'is-zero' : 'is-some'}`}
                  aria-hidden="true"
                >
                  {monthCounts[index]}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Jobs List */}
          <motion.div
            className="jobs-list"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.42 }}
          >
            <div className="jobs-list-header">
              <h3>
                All jobs in {selectedYear}
              </h3>
              <span className="jobs-count">{filteredJobs.length} jobs</span>
            </div>
            {filteredJobs.length === 0 ? (
              <div className="empty-state">
                <p>No jobs found{query ? ' for your search' : ''}.</p>
                <button className="create-inline-btn" onClick={handleCreateJob}>Create first job</button>
              </div>
            ) : (
              <ul className="jobs-items" role="list">
                {paginatedJobs.map(job => (
                  <li key={job.id} className="job-item">
                    <div className="job-meta">
                      <span className="job-date">{formatDate(job.date)}</span>
                      <span className="job-title">{job.title}</span>
                    </div>
                    <button className="job-open-btn" onClick={() => setModalOpen(true)}>Open</button>
                  </li>
                ))}
              </ul>
            )}
            {filteredJobs.length > pageSize && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  ‹ Prev
                </button>
                <span className="page-status">Page {page} of {totalPages}</span>
                <button
                  className="page-btn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  Next ›
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
        </motion.section>
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
    </>
  );
}

export default Dashboard;
