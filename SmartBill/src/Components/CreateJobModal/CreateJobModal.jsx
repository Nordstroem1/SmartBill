import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CreateJobModal.css";

function CreateJobModal({ isOpen, onClose, onCreateJob }) {
  // Get today's date in YYYY-MM-DD format
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [jobData, setJobData] = useState({
    title: '',
    client: '',
    date: getTodaysDate(),
    amount: '',
    description: '',
    status: 'waiting'
  });
  const [isCreating, setIsCreating] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Set today's date when modal opens
  useEffect(() => {
    if (isOpen) {
      setJobData(prev => ({
        ...prev,
        date: getTodaysDate()
      }));
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setJobData({
      ...jobData,
      [field]: field === 'amount' ? value.replace(/[^0-9]/g, '') : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setShowValidationErrors(true);
    
    // Validation
    if (!jobData.title.trim() || !jobData.client.trim() || !jobData.date || !jobData.amount) {
      return;
    }

    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newJob = {
        id: Date.now(), // Simple ID generation for demo
        title: jobData.title.trim(),
        client: jobData.client.trim(),
        date: jobData.date,
        amount: parseInt(jobData.amount) || 0,
        description: jobData.description.trim(),
        status: jobData.status,
        hasInvoice: false,
        invoiceUrl: null
      };
      
      onCreateJob(newJob);
      setIsCreating(false);
      resetForm();
      onClose();
      
      alert(`Nytt jobb "${newJob.title}" har skapats!`);
    }, 1000);
  };

  const resetForm = () => {
    setJobData({
      title: '',
      client: '',
      date: getTodaysDate(), // Reset to today's date
      amount: '',
      description: '',
      status: 'waiting'
    });
    setShowValidationErrors(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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

  const statusOptions = [
    { value: 'waiting', label: 'Väntar', color: '#f59e0b' },
    { value: 'sent', label: 'Skickad', color: '#3b82f6' },
    { value: 'paid', label: 'Betald', color: '#10b981' }
  ];

  const handleStatusSelect = (value) => {
    handleInputChange('status', value);
    setIsStatusDropdownOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="create-job-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <motion.div
            className="create-job-modal-content"
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
            <div className="create-job-modal-header">
              <h2>Logga nytt arbete</h2>
              <button className="create-job-modal-close" onClick={handleClose}>
                ×
              </button>
            </div>

            <form className="create-job-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Jobbtitel *</label>
                  <input
                    type="text"
                    id="title"
                    value={jobData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="T.ex. Webbdesign för företag"
                    className={`form-input ${showValidationErrors && !jobData.title.trim() ? 'error' : ''}`}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="client">Klient *</label>
                  <input
                    type="text"
                    id="client"
                    value={jobData.client}
                    onChange={(e) => handleInputChange('client', e.target.value)}
                    placeholder="T.ex. Tech Solutions AB"
                    className={`form-input ${showValidationErrors && !jobData.client.trim() ? 'error' : ''}`}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Datum *</label>
                  <input
                    type="date"
                    id="date"
                    value={jobData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`form-input ${showValidationErrors && !jobData.date ? 'error' : ''}`}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Belopp (kr) *</label>
                  <input
                    type="text"
                    id="amount"
                    value={jobData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="25000"
                    className={`form-input ${showValidationErrors && !jobData.amount ? 'error' : ''}`}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <div className="custom-select-wrapper" ref={dropdownRef}>
                    <div 
                      className="custom-select"
                      style={{ 
                        backgroundColor: getStatusColor(jobData.status),
                        color: 'white'
                      }}
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    >
                      <span>{getStatusText(jobData.status)}</span>
                      <svg 
                        className={`dropdown-arrow ${isStatusDropdownOpen ? 'open' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {isStatusDropdownOpen && (
                      <div className="custom-select-dropdown">
                        {statusOptions.map((option) => (
                          <div
                            key={option.value}
                            className="custom-select-option"
                            style={{
                              backgroundColor: option.color,
                              color: 'white'
                            }}
                            onClick={() => handleStatusSelect(option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Beskrivning</label>
                <textarea
                  id="description"
                  value={jobData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Beskrivning av arbetet som utförts..."
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="cancel-btn"
                  onClick={handleClose}
                  disabled={isCreating}
                >
                  Avbryt
                </button>
                <button 
                  type="submit"
                  className="create-btn"
                  disabled={isCreating}
                >
                  {isCreating ? 'Skapar...' : 'Skapa Jobb'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CreateJobModal;
