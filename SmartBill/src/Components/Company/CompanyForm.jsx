import React, { useEffect, useRef, useState } from "react";
import fetchWithAuth from '../../utils/fetchWithAuth';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./CompanyForm.css";
import "../../index.css";

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

// Small info button with a clickable popover
const InfoButton = ({ message }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const popoverId = "company-info-popover";

  return (
    <span className="info-button-wrap" ref={wrapRef}>
      <motion.button
        type="button"
        className="info-button"
        aria-label="Form information"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Inline SVG info icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <circle cx="12" cy="8" r="1" />
        </svg>
      </motion.button>
      {open && (
        <div id={popoverId} className="info-popover" role="dialog" aria-live="polite">
          {message}
        </div>
      )}
    </span>
  );
}

const CompanyForm = ({ onSubmit }) => {
  // Validation function for required fields
  const buildErrors = () => {
    const errors = {};
    if (isEmpty(name)) errors.name = 'Company name is required.';
    if (entityType === 'Freelancer') {
      if (isEmpty(orgNumber)) errors.orgNumber = 'Personal number is required.';
    } else {
      if (isEmpty(orgNumber)) errors.orgNumber = 'Organisation number is required.';
    }
    if (isEmpty(address)) errors.address = 'Street address is required.';
    if (isEmpty(postalCode)) errors.postalCode = 'Postal code is required.';
    if (isEmpty(city)) errors.city = 'City is required.';
    if (isEmpty(email)) errors.email = 'Email is required.';
    // Payment method validation
    if (paymentMethodType === 'BankGiro' && isEmpty(bankgiro)) errors.bankgiro = 'Bankgiro is required.';
    if (paymentMethodType === 'PlusGiro' && isEmpty(plusgiro)) errors.plusgiro = 'Plusgiro is required.';
    if (paymentMethodType === 'IBANSWIFT') {
      if (isEmpty(iban)) errors.iban = 'IBAN is required.';
      if (isEmpty(swift)) errors.swift = 'SWIFT/BIC is required.';
    }
    if (paymentMethodType === 'Swish' && isEmpty(swishNumber)) errors.swishNumber = 'Swish number is required.';
    if (isVatRegistered && isEmpty(vatNumber)) errors.vatNumber = 'VAT number is required.';
    if (isEmpty(paymentMethodType)) errors.paymentMethodType = 'Payment method is required.';
    return errors;
  };
  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [name, setName] = useState("");
  const [orgNumber, setOrgNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [isVatRegistered, setIsVatRegistered] = useState(false);
  const [vatNumber, setVatNumber] = useState("");
  const [bankgiro, setBankgiro] = useState("");
  const [plusgiro, setPlusgiro] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Days30");
  const [currency, setCurrency] = useState("SEK");
  // International support: country, IBAN, SWIFT
  const [country, setCountry] = useState("SE");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");
  const [swishNumber, setSwishNumber] = useState("");
  const [entityType, setEntityType] = useState("Company");
  const [formError, setFormError] = useState("");
  // Custom form errors
  const [errors, setErrors] = useState({});
  const [paymentMethodType, setPaymentMethodType] = useState(
    country === "SE" ? "BankGiro" : "IBANSWIFT"
  );

  // Success toast state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  // Validation helpers
  const isEmpty = (v) => v == null || String(v).trim() === "";
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = buildErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    const companyData = {
      EntityType: entityType,
      PaymentMethodTypes: paymentMethodType,
      OrganizationNumber: entityType === 'Freelancer' ? undefined : (orgNumber || undefined),
      PersonalNumber: entityType === 'Freelancer' ? (orgNumber || undefined) : undefined,
      Country: country,
      Name: name,
      StreetAddress: address,
      PostalCode: postalCode,
      City: city,
      CompanyEmail: email,
      PhoneNumber: phone || undefined,
      WebsiteUrl: website || undefined,
      VATRegistered: isVatRegistered,
      VATNumber: isVatRegistered ? (vatNumber || undefined) : undefined,
      PaymentTerm: paymentTerms,
      Logo: logo || undefined,
      BankGiroNumber: paymentMethodType === 'BankGiro' ? bankgiro : undefined,
      PlusGiroNumber: paymentMethodType === 'PlusGiro' ? plusgiro : undefined,
      Iban: paymentMethodType === 'IBANSWIFT' ? iban : undefined,
      SwiftCode: paymentMethodType === 'IBANSWIFT' ? swift : undefined,
      SwishNumber: paymentMethodType === 'Swish' ? swishNumber : undefined,
      Currency: currency,
    };

    // Build FormData for multipart/form-data
    const formData = new FormData();
    Object.entries(companyData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    try {
      let response = await fetchWithAuth('https://localhost:7094/api/Company/Create', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setSuccessMsg('Company created successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/dashboard');
        }, 1500);
      } else {
        const text = await response.text();
        setShowSuccess(false);
        setSuccessMsg("");
        alert('Failed to create company: ' + text);
        return;
      }
    } catch (err) {
      alert('Error connecting to API: ' + err.message);
    }
  };
  const handleLogoRemove = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  // Logo file change handler (must be inside component)
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="company-form-container">
      {/* Success Toast */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="success-toast"
          style={{
            position: "fixed",
            top: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(90deg,#10b981,#059669)",
            color: "#fff",
            borderRadius: "0.75rem",
            boxShadow: "0 8px 32px rgba(16,185,129,0.18)",
            padding: "1.1rem 2.5rem",
            fontWeight: 700,
            fontSize: "1.15rem",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            letterSpacing: "0.01em",
          }}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" fill="#059669" />
            <path d="M8 12.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {successMsg}
        </motion.div>
      )}
      <motion.form
        className="company-form"
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        {/* Main Page Title + Info */}
        <div className="title-with-info">
          <h1 className="create-company-title">Create Company</h1>
          <InfoButton message="This information is essential for creating invoices. You can update it later." />
        </div>

        <div className="form-group logo-upload">
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoChange}
          />
          <div className="logo-upload-area">
            {/* Custom file upload button */}
            <label htmlFor="logo" className="file-text">
              {logo ? "Change Logotype" : "Add Logotype"}
            </label>
            {logoPreview && (
              <div className="logo-preview-container">
                <motion.img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="logo-preview"
                  variants={fieldVariants}
                />
                <button
                  type="button"
                  className="remove-logo-btn"
                  onClick={handleLogoRemove}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Country Selection */}
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <motion.select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            variants={fieldVariants}
          >
            <option value="SE">Sweden</option>
            <option value="NO">Norway</option>
            <option value="DK">Denmark</option>
            <option value="FI">Finland</option>
            <option value="EU">Other EU</option>
            <option value="US">United States</option>
            <option value="Other">Other</option>
          </motion.select>
        </div>
        {/* Entity Type */}
        <div className={`form-group ${errors.entityType ? 'error' : ''}`}>
          <label htmlFor="entityType">Business Type</label>
          <motion.select
            id="entityType"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            variants={fieldVariants}
          >
            <option value="Company">Company</option>
            <option value="Freelancer">Freelancer</option>
          </motion.select>
        </div>
        <div className={`form-group ${errors.name ? 'error' : ''}`}>
          <label htmlFor="name">Company Name</label>
          <motion.input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter company name"
            variants={fieldVariants}
          />
          {errors.name && <div className="error-text">{errors.name}</div>}
        </div>

        <div className={`form-group ${errors.orgNumber ? 'error' : ''}`}>
          <label htmlFor="orgNumber">{entityType === 'Freelancer' ? 'Personal Number' : 'Organisation Number'}</label>
          <motion.input
            type="text"
            id="orgNumber"
            value={orgNumber}
            onChange={(e) => setOrgNumber(e.target.value)}
            placeholder={entityType === 'Freelancer' ? 'Enter personal number' : 'Enter organisation number'}
            variants={fieldVariants}
          />
          {errors.orgNumber && <div className="error-text">{errors.orgNumber}</div>}
        </div>

        {/* Address Section */}
        <div className={`form-group ${errors.address ? 'error' : ''}`}>
          <label htmlFor="address">Street Address</label>
          <motion.input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter street address"
            variants={fieldVariants}
          />
          {errors.address && <div className="error-text">{errors.address}</div>}
        </div>

        <div className="form-row">
          <div className={`form-group half-width ${errors.postalCode ? 'error' : ''}`}>
            <label htmlFor="postalCode">Postal Code</label>
            <motion.input
              type="text"
              id="postalCode"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="12345"
              variants={fieldVariants}
            />
            {errors.postalCode && <div className="error-text">{errors.postalCode}</div>}
          </div>
          <div className={`form-group half-width ${errors.city ? 'error' : ''}`}>
            <label htmlFor="city">City</label>
            <motion.input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Stockholm"
              variants={fieldVariants}
            />
            {errors.city && <div className="error-text">{errors.city}</div>}
          </div>
        </div>

        {/* Contact Information */}
        <div className={`form-group ${errors.email ? 'error' : ''}`}>
          <label htmlFor="email">Email</label>
          <motion.input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="company@example.com"
            variants={fieldVariants}
          />
          {errors.email && <div className="error-text">{errors.email}</div>}
        </div>

        <div className={`form-group ${errors.phone ? 'error' : ''}`}>
          <label htmlFor="phone">Phone Number</label>
          <motion.input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+46 8 123 456 78"
            variants={fieldVariants}
          />
          {errors.phone && <div className="error-text">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="website">Website (Optional)</label>
          <motion.input
            type="url"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://www.example.com"
            variants={fieldVariants}
          />
        </div>

        {/* VAT Section */}
        <div className="form-group">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isVatRegistered}
                onChange={(e) => setIsVatRegistered(e.target.checked)}
              />
              <span className="checkbox-text">
                VAT Registered (Momsregistrerad)
              </span>
            </label>
          </div>
        </div>

        {isVatRegistered && (
          <div className={`form-group ${errors.vatNumber ? 'error' : ''}`}>
            <label htmlFor="vatNumber">VAT Number (Momsregistreringsnummer)</label>
            <motion.input
              type="text"
              id="vatNumber"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              placeholder="SE123456789012"
              variants={fieldVariants}
            />
          </div>
        )}

        {/* Banking Information */}
        <div className="form-section-title">
          <h3>Payment Information</h3>
        </div>

        {/* Payment Method Selection */}
        <div className={`form-group payment-method ${errors.paymentMethodType ? 'error' : ''}`}>
          <label htmlFor="paymentMethodTypes">Payment Method</label>
          <motion.select
            id="paymentMethodTypes"
            value={paymentMethodType}
            onChange={e => setPaymentMethodType(e.target.value)}
            variants={fieldVariants}
          >
            <option value="BankGiro">Bankgiro</option>
            <option value="PlusGiro">Plusgiro</option>
            <option value="Swish">Swish</option>
            <option value="IBANSWIFT">IBAN & SWIFT</option>
          </motion.select>
          {errors.paymentMethodType && <div className="error-text">{errors.paymentMethodType}</div>}
        </div>

        {/* Conditional Banking: Swedish vs International */}
        {paymentMethodType === "BankGiro" && (
          <div className="form-group">
            <label htmlFor="bankgiro">Bankgiro</label>
            <motion.input
              type="text"
              id="bankgiro"
              className="payment-input"
              inputMode="numeric"
              pattern="[0-9-]*"
              value={bankgiro}
              onChange={(e) => setBankgiro(e.target.value.replace(/[^0-9-]/g, ''))}
              placeholder="1234-5678"
              variants={fieldVariants}
            />
            {errors.bankgiro && <div className="error-text">{errors.bankgiro}</div>}
          </div>
        )}

        {paymentMethodType === "PlusGiro" && (
          <div className="form-group">
            <label htmlFor="plusgiro">Plusgiro</label>
            <motion.input
              type="text"
              id="plusgiro"
              className="payment-input"
              inputMode="numeric"
              pattern="[0-9-]*"
              value={plusgiro}
              onChange={(e) => setPlusgiro(e.target.value.replace(/[^0-9-]/g, ''))}
              placeholder="1234567-8"
              variants={fieldVariants}
            />
            {errors.plusgiro && <div className="error-text">{errors.plusgiro}</div>}
          </div>
        )}

        {paymentMethodType === "IBANSWIFT" && (
          <>
            <div className="form-group">
              <label htmlFor="iban">IBAN</label>
              <motion.input
                type="text"
                id="iban"
                className="payment-input"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="SE12 3456 7890 1234 5678 90"
                variants={fieldVariants}
              />
              {errors.iban && <div className="error-text">{errors.iban}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="swift">SWIFT/BIC</label>
              <motion.input
                type="text"
                id="swift"
                className="payment-input"
                value={swift}
                onChange={(e) => setSwift(e.target.value)}
                placeholder="AAAASESSXXX"
                variants={fieldVariants}
              />
              {errors.swift && <div className="error-text">{errors.swift}</div>}
            </div>
          </>
        )}

        {paymentMethodType === "Swish" && (
          <div className={`form-group ${errors.swishNumber ? 'error' : ''}`}>
            <label htmlFor="swishNumber">Swish Number</label>
            <motion.input
              type="tel"
              id="swishNumber"
              className="payment-input"
              value={swishNumber}
              onChange={(e) => setSwishNumber(e.target.value)}
              placeholder="07X-XXXXXXX"
              variants={fieldVariants}
            />
            {errors.swishNumber && <div className="error-text">{errors.swishNumber}</div>}
          </div>
        )}

        {/* Business Settings */}
        <div className="form-section-title">
          <h3>Invoice Settings</h3>
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="paymentTerms">Payment Terms</label>
            <motion.select
              id="paymentTerms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              variants={fieldVariants}
            >
              <option value="Days14">14 days</option>
              <option value="Days30">30 days</option>
              <option value="Days45">45 days</option>
              <option value="Days60">60 days</option>
            </motion.select>
          </div>
          <div className="form-group half-width">
            <label htmlFor="currency">Default Currency</label>
            <motion.select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              variants={fieldVariants}
            >
              <option value="SEK">SEK (Swedish Krona)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="GBP">GBP (British Pound)</option>
              <option value="NOK">NOK (Norwegian Krone)</option>
              <option value="DKK">DKK (Danish Krone)</option>
            </motion.select>
          </div>
        </div>

        {/* Error Messages */}
        {errors.iban && <div className="error-text">{errors.iban}</div>}
        {errors.swift && <div className="error-text">{errors.swift}</div>}

        <motion.button
          type="submit"
          className="submit-btn"
          variants={fieldVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add Company
        </motion.button>
      </motion.form>
    </div>
  );
}

export default CompanyForm;
