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

  useEffect(() => {
    if (isOpen) {
      // Simulate API call - replace with actual API call later
      setLoading(true);
      setTimeout(() => {
        // Mock data for demonstration
        const mockJobs = [
          {
            id: 1,
            title: "Webbdesign för företag",
            client: "Tech Solutions AB",
            date: "2025-01-15",
            amount: 25000,
            status: "paid",
            description: "Komplett webbdesign och utveckling av företagshemsida",
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
            description: "Skapande av logotyp och visuell identitet",
            hasInvoice: true,
            invoiceUrl: "/invoices/invoice-002.pdf"
          },
          {
            id: 3,
            title: "E-handel lösning",
            client: "Fashion Store",
            date: "2025-01-10",
            amount: 45000,
            status: "waiting",
            description: "Utveckling av e-handelsplattform med betalningslösningar",
            hasInvoice: false,
            invoiceUrl: null
          },
          {
            id: 4,
            title: "Mobil app UI/UX",
            client: "HealthTech",
            date: "2025-01-28",
            amount: 35000,
            status: "paid",
            description: "Design av användargränssnitt för hälsoapp",
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
        return "Betald";
      case "sent":
        return "Skickad";
      case "waiting":
        return "Väntar";
      default:
        return status;
    }
  };

  const totalAmount = filteredJobs.reduce((sum, job) => sum + job.amount, 0);

  const handleEditJob = (job) => {
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
    alert(`Faktura genererad för "${job.title}"`);
  };

  const handleRemoveInvoice = (job) => {
    if (window.confirm(`Är du säker på att du vill ta bort fakturan för "${job.title}"?`)) {
      setJobs(jobs.map(j => 
        j.id === job.id 
          ? { ...j, hasInvoice: false, invoiceUrl: null }
          : j
      ));
      alert(`Faktura borttagen för "${job.title}"`);
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
        alert(`Ny faktura uppladdad för "${job.title}"`);
      }, 1500);
    } else {
      alert('Endast PDF-filer är tillåtna');
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
                <h2>Jobb för {selectedMonth} {selectedYear}</h2>
                <div className="job-modal-summary">
                  <span className="job-count">{filteredJobs.length} jobb</span>
                  <span className="total-amount">
                    {totalAmount.toLocaleString('sv-SE')} kr
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
                placeholder="Sök bland jobb..."
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
              <p>Laddar jobb...</p>
            </div>
              ) : (
                <div className="job-list">
                  {filteredJobs.length === 0 ? (
                    <div className="no-jobs">
                      <p>Inga jobb hittades för {selectedMonth} {selectedYear}</p>
                    </div>
                  ) : (
                    filteredJobs.map((job, index) => (
                      <motion.div
                        onClick={() => handleEditJob(job)}
                        key={job.id}
                        className="job-card"
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
                              placeholder="Jobbtitel"
                            />
                          ) : (
                            <h3 onClick={() => handleEditJob(job)}>{job.title}</h3>
                          )}
                          {editingJob === job.id ? (
                            <select
                              value={editedJobData.status || ''}
                              onChange={(e) => handleInputChange('status', e.target.value)}
                              className="edit-select status-select"
                              style={{ 
                                backgroundColor: getStatusColor(editedJobData.status || job.status),
                                color: 'white'
                              }}
                            >
                              <option value="waiting">Väntar</option>
                              <option value="sent">Skickad</option>
                              <option value="paid">Betald</option>
                            </select>
                          ) : (
                            <span 
                              className="job-status"
                              style={{ backgroundColor: getStatusColor(job.status) }}
                              onClick={() => handleEditJob(job)}
                            >
                              {getStatusText(job.status)}
                            </span>
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
                                placeholder="Klient"
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
                                placeholder="Belopp"
                              />
                            </>
                          ) : (
                            <>
                              <p className="job-client" onClick={() => handleEditJob(job)}>{job.client}</p>
                              <p className="job-date" onClick={() => handleEditJob(job)}>{new Date(job.date).toLocaleDateString('sv-SE')}</p>
                              <p className="job-amount" onClick={() => handleEditJob(job)}>{job.amount.toLocaleString('sv-SE')} kr</p>
                            </>
                          )}
                        </div>
                        {editingJob === job.id ? (
                          <>
                            <textarea
                              value={editedJobData.description || ''}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                              className="edit-textarea"
                              placeholder="Beskrivning"
                              rows="3"
                            />
                            {job.hasInvoice && (
                              <div className="edit-invoice-actions">
                                <button 
                                  className="invoice-btn remove-invoice-btn"
                                  onClick={() => handleRemoveInvoice(job)}
                                >
                                   Ta bort
                                </button>
                                <button 
                                  className="invoice-btn update-invoice-btn"
                                  onClick={() => triggerFileUpload(job.id)}
                                  disabled={uploadingInvoice === job.id}
                                >
                                  {uploadingInvoice === job.id ? 'Laddar upp...' : 'Lägg till'}
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
                                Spara
                              </button>
                              <button 
                                className="cancel-btn"
                                onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                              >
                                Avbryt
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
                                     Visa Faktura
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
                                     Generera Faktura
                                  </button>
                                  <button 
                                    className="invoice-btn upload-invoice-btn"
                                    onClick={() => triggerFileUpload(job.id)}
                                    disabled={uploadingInvoice === job.id}
                                  >
                                    {uploadingInvoice === job.id ? 'Laddar upp...' : 'Ladda upp PDF'}
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
