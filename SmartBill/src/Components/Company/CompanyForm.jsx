import React, { useState } from "react";
import { motion } from "framer-motion";
import "./CompanyForm.css";
import "../../index.css";

const CompanyForm = ({ onSubmit }) => {
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
  const [paymentTerms, setPaymentTerms] = useState("30");
  const [currency, setCurrency] = useState("SEK");
  // International support: country, IBAN, SWIFT
  const [country, setCountry] = useState("SE");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");
  const [formError, setFormError] = useState("");
  // Custom form errors
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState(
    country === "SE" ? "bankgiro" : "iban"
  );

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  // Clear selected logo and preview
  const handleLogoRemove = () => {
    setLogo(null);
    setLogoPreview(null);
    // reset file input value if needed
    const input = document.getElementById('logo');
    if (input) input.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    // Basic validations
    if (!name.trim()) newErrors.name = 'Company Name is required.';
    if (!orgNumber.trim()) newErrors.orgNumber = 'Organisation/Personal Number is required.';
    if (!address.trim()) newErrors.address = 'Street Address is required.';
    if (!postalCode.trim()) newErrors.postalCode = 'Postal Code is required.';
    if (!city.trim()) newErrors.city = 'City is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    if (!phone.trim()) newErrors.phone = 'Phone Number is required.';
    if (isVatRegistered && !vatNumber.trim()) newErrors.vatNumber = 'VAT Number is required.';
    // Payment validations
    if (country === 'SE') {
      if (!bankgiro.trim() && !plusgiro.trim()) newErrors.paymentInfo = 'Please fill in either Bankgiro or Plusgiro.';
    } else {
      if (!iban.trim()) newErrors.iban = 'IBAN is required.';
      if (!swift.trim()) newErrors.swift = 'SWIFT/BIC is required.';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    const companyData = {
      logo,
      name,
      orgNumber,
      address,
      country,
      city,
      postalCode,
      email,
      phone,
      website,
      isVatRegistered,
      vatNumber: isVatRegistered ? vatNumber : "",
      // Include appropriate banking info
      ...(country === "SE" ? { bankgiro, plusgiro } : { iban, swift }),
      paymentTerms,
      currency,
    };
    if (onSubmit) {
      onSubmit(companyData);
    } else {
      console.log("Company Data:", companyData);
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
      <motion.form
        className="company-form"
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        {/* Main Page Title */}
        <h1 className="create-company-title">Create Company</h1>

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
          <label htmlFor="orgNumber">Organisation / Personal Number</label>
          <motion.input
            type="text"
            id="orgNumber"
            value={orgNumber}
            onChange={(e) => setOrgNumber(e.target.value)}
            placeholder="Enter organisation or personal number"
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
        <div className="form-group payment-method">
          <label htmlFor="paymentMethod">Payment Method</label>
          <motion.select
            id="paymentMethod"
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            variants={fieldVariants}
          >
            <option value="bankgiro">Bankgiro</option>
            <option value="plusgiro">Plusgiro</option>
            <option value="iban">IBAN & SWIFT</option>
          </motion.select>
        </div>

        {/* Conditional Banking: Swedish vs International */}
        {paymentMethod === "bankgiro" && (
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

        {paymentMethod === "plusgiro" && (
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

        {paymentMethod === "iban" && (
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

        {/* Business Settings */}
        <div className="form-section-title">
          <h3>Invoice Settings</h3>
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="paymentTerms">Payment Terms (Days)</label>
            <motion.select
              id="paymentTerms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              variants={fieldVariants}
            >
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="45">45 days</option>
              <option value="60">60 days</option>
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
};

export default CompanyForm;
