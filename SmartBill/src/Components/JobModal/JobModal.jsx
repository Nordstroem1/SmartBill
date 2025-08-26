import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./JobModal.css";

function JobModal({ isOpen, onClose, selectedMonth, selectedYear }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [editedJobData, setEditedJobData] = useState({});
  const [uploadingInvoice, setUploadingInvoice] = useState(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Simulate API call - replace with actual API call later
      setLoading(true);
      setTimeout(() => {
        // Mock data for demonstration
        const mockJobs = [
          {
            id: 1,
            title: "Website design for company",
            client: "Tech Solutions AB",
            date: "2025-01-15",
            amount: 25000,
            status: "paid",
            description: "Complete website design and development for corporate site",
            hasInvoice: true,
            invoiceUrl: "/invoices/invoice-001.pdf"
          },
          {
            id: 2,
            title: "Logo design",
            client: "StartUp Nordic",
            date: "2025-01-22",
            amount: 8000,
            status: "sent",
            description: "Creation of logo and visual identity",
            hasInvoice: true,
            invoiceUrl: "/invoices/invoice-002.pdf"
          },
          {
            id: 3,
            title: "E-commerce solution",
            client: "Fashion Store",
            date: "2025-01-10",
            amount: 45000,
            status: "waiting",
            description: "Development of an e-commerce platform with payment solutions",
            hasInvoice: false,
            invoiceUrl: null
          },
          {
            id: 4,
            title: "Mobile app UI/UX",
            client: "HealthTech",
            date: "2025-01-28",
            amount: 35000,
            status: "paid",
            description: "Design of user interface for health app",
            hasInvoice: true,
            invoiceUrl: "/invoices/invoice-004.pdf"
          }
        ];
        setJobs(mockJobs);
        setLoading(false);
      }, 800);
    }
  }, [isOpen, selectedMonth, selectedYear]);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "#10b981";
      case "sent":
        return "#3b82f6";
      case "waiting":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "sent":
        return "Sent";
      case "waiting":
        return "Waiting";
      default:
        return status;
    }
  };

  const totalAmount = filteredJobs.reduce((sum, job) => sum + job.amount, 0);

  const handleEditJob = (job) => {
  setStatusMenuOpen(null);
    setEditingJob(job.id);
    setEditedJobData({ ...job });
  };

  const handleSaveJob = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...editedJobData } : job
    ));
    setEditingJob(null);
    setEditedJobData({});
  };

  const handleCancelEdit = () => {
    setEditingJob(null);
    setEditedJobData({});
  };

  const handleInputChange = (field, value) => {
    setEditedJobData({
      ...editedJobData,
      [field]: field === 'amount' ? parseInt(value) || 0 : value
    });
  };

  const handleViewInvoice = (job) => {
    if (job.hasInvoice && job.invoiceUrl) {
      // Open invoice in new tab - replace with actual implementation
      window.open(job.invoiceUrl, '_blank');
    }
  };

  const toggleStatusMenu = (e, jobId) => {
    e.stopPropagation();
    setEditingJob(null);
    setStatusMenuOpen(prev => (prev === jobId ? null : jobId));
  };

  const updateJobStatus = (jobId, status) => {
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, status } : j)));
    setStatusMenuOpen(null);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setStatusMenuOpen(null);
    };
    const onClick = (e) => {
      // Close if clicking outside the dropdown area
      const inDropdown = e.target.closest?.('.status-dropdown');
      if (inDropdown) return;
      setStatusMenuOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const handleGenerateInvoice = (job) => {
    // Simulate invoice generation - replace with actual implementation
  console.log(`Generating invoice for job: ${job.title}`);
    
    // Update job to have invoice after generation
    setJobs(jobs.map(j => 
      j.id === job.id 
        ? { ...j, hasInvoice: true, invoiceUrl: `/invoices/invoice-${job.id.toString().padStart(3, '0')}.pdf` }
        : j
    ));
    
    // Show success message or redirect to invoice generation page
  alert(`Invoice generated for "${job.title}"`);
  };

  const handleRemoveInvoice = (job) => {
  if (window.confirm(`Are you sure you want to remove the invoice for "${job.title}"?`)) {
      setJobs(jobs.map(j => 
        j.id === job.id 
          ? { ...j, hasInvoice: false, invoiceUrl: null }
          : j
      ));
  alert(`Invoice removed for "${job.title}"`);
    }
  };

  const handleFileUpload = (job, event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadingInvoice(job.id);
      
      // Simulate file upload - replace with actual implementation
      setTimeout(() => {
        const newInvoiceUrl = `/invoices/custom-${job.id}-${Date.now()}.pdf`;
        setJobs(jobs.map(j => 
          j.id === job.id 
            ? { ...j, hasInvoice: true, invoiceUrl: newInvoiceUrl }
            : j
        ));
        setUploadingInvoice(null);
  alert(`New invoice uploaded for "${job.title}"`);
      }, 1500);
    } else {
  alert('Only PDF files are allowed');
    }
  };

  const triggerFileUpload = (jobId) => {
    const fileInput = document.getElementById(`file-input-${jobId}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="job-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="job-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="job-modal-header">
              <div className="job-modal-title">
                <h2>Jobs for {selectedMonth} {selectedYear}</h2>
                <div className="job-modal-summary">
                  <span className="job-count">{filteredJobs.length} jobs</span>
                  <span className="total-amount">
                    {totalAmount.toLocaleString('en-SE')} SEK
                  </span>
                </div>
              </div>
              <button className="job-modal-close" onClick={onClose}>
                ×
              </button>
            </div>

            <div className="job-modal-search">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="job-search-input"
              />
            </div>

            <div className="job-modal-body">
              {loading ? (
            <div className="job-loading">
              <div className="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <p>Loading jobs...</p>
            </div>
              ) : (
                <div className="job-list">
                  {filteredJobs.length === 0 ? (
                    <div className="no-jobs">
                      <p>No jobs found for {selectedMonth} {selectedYear}</p>
                    </div>
                  ) : (
                    filteredJobs.map((job, index) => (
                      <motion.div
                        onClick={() => handleEditJob(job)}
                        key={job.id}
                        className="job-card"
                        data-status={editingJob === job.id ? (editedJobData.status ?? job.status) : job.status}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="job-card-header">
                          {editingJob === job.id ? (
                            <input
                              type="text"
                              value={editedJobData.title || ''}
                              onChange={(e) => handleInputChange('title', e.target.value)}
                              className="edit-input title-input"
                              placeholder="Job title"
                            />
                          ) : (
                            <h3 onClick={() => handleEditJob(job)}>{job.title}</h3>
                          )}
                          {editingJob === job.id ? (
                            <select
                              value={editedJobData.status ?? job.status}
                              onChange={(e) => handleInputChange('status', e.target.value)}
                              className="edit-select status-select"
                              style={{ 
                                backgroundColor: getStatusColor(editedJobData.status ?? job.status),
                                color: 'white'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="waiting">Waiting</option>
                              <option value="sent">Sent</option>
                              <option value="paid">Paid</option>
                            </select>
                          ) : (
                            <div className="status-dropdown" onClick={(e) => e.stopPropagation()}>
                              <button 
                                type="button"
                                className="job-status status-trigger"
                                style={{ backgroundColor: getStatusColor(job.status) }}
                                aria-haspopup="listbox"
                                aria-expanded={statusMenuOpen === job.id}
                                onClick={(e) => toggleStatusMenu(e, job.id)}
                              >
                                {getStatusText(job.status)}
                                <span className="caret" aria-hidden>▾</span>
                              </button>
                              {statusMenuOpen === job.id && (
                                <ul className="status-menu" role="listbox" aria-label="Change status">
                                  <li role="option" aria-selected={job.status==='waiting'}>
                                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateJobStatus(job.id, 'waiting'); }}>
                                      Waiting
                                    </button>
                                  </li>
                                  <li role="option" aria-selected={job.status==='sent'}>
                                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateJobStatus(job.id, 'sent'); }}>
                                      Sent
                                    </button>
                                  </li>
                                  <li role="option" aria-selected={job.status==='paid'}>
                                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateJobStatus(job.id, 'paid'); }}>
                                      Paid
                                    </button>
                                  </li>
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="job-card-details">
                          {editingJob === job.id ? (
                            <>
                              <input
                                type="text"
                                value={editedJobData.client || ''}
                                onChange={(e) => handleInputChange('client', e.target.value)}
                                className="edit-input"
                                placeholder="Client"
                              />
                              <input
                                type="date"
                                value={editedJobData.date || ''}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className="edit-input"
                              />
                              <input
                                type="number"
                                value={editedJobData.amount || ''}
                                onChange={(e) => handleInputChange('amount', e.target.value)}
                                className="edit-input amount-input"
                                placeholder="Amount"
                              />
                            </>
                          ) : (
                            <>
                              <p className="job-client" onClick={() => handleEditJob(job)}>{job.client}</p>
                              <p className="job-date" onClick={() => handleEditJob(job)}>{new Date(job.date).toLocaleDateString('en-GB')}</p>
                              <p className="job-amount" onClick={() => handleEditJob(job)}>{job.amount.toLocaleString('en-GB')} SEK</p>
                            </>
                          )}
                        </div>
                        {editingJob === job.id ? (
                          <>
                            <textarea
                              value={editedJobData.description || ''}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                              className="edit-textarea"
                              placeholder="Description"
                              rows="3"
                            />
                            {job.hasInvoice && (
                              <div className="edit-invoice-actions">
                                <button 
                                  className="invoice-btn remove-invoice-btn"
                                  onClick={() => handleRemoveInvoice(job)}
                                >
                                   Remove
                                </button>
                                <button 
                                  className="invoice-btn update-invoice-btn"
                                  onClick={() => triggerFileUpload(job.id)}
                                  disabled={uploadingInvoice === job.id}
                                >
                                  {uploadingInvoice === job.id ? 'Uploading...' : 'Add'}
                                </button>
                                <input
                                  id={`file-input-${job.id}`}
                                  type="file"
                                  accept=".pdf"
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleFileUpload(job, e)}
                                />
                              </div>
                            )}
                            <div className="edit-actions">
                              <button 
                                className="save-btn"
                                onClick={() => handleSaveJob(job.id)}
                              >
                                Save
                              </button>
                              <button 
                                className="cancel-btn"
                                onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="job-description" onClick={() => handleEditJob(job)}>{job.description}</p>
                            <div className="job-actions">
                              {job.hasInvoice ? (
                                <div className="invoice-actions">
                                  <button 
                                    className="invoice-btn view-invoice-btn"
                         onClick={() => handleViewInvoice(job)}
                                  >
                           View Invoice
                                  </button>
                                  <input
                                    id={`file-input-${job.id}`}
                                    type="file"
                                    accept=".pdf"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(job, e)}
                                  />
                                </div>
                              ) : (
                                <div className="invoice-actions">
                                  <button 
                                    className="invoice-btn generate-invoice-btn"
                         onClick={() => handleGenerateInvoice(job)}
                                  >
                           Generate Invoice
                                  </button>
                                  <button 
                                    className="invoice-btn upload-invoice-btn"
                                    onClick={() => triggerFileUpload(job.id)}
                                    disabled={uploadingInvoice === job.id}
                                  >
                                      {uploadingInvoice === job.id ? 'Uploading...' : 'Upload PDF'}
                                  </button>
                                  <input
                                    id={`file-input-${job.id}`}
                                    type="file"
                                    accept=".pdf"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(job, e)}
                                  />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default JobModal;
