import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CompanyForm.css';
import '../../index.css';

const CompanyForm = ({ onSubmit }) => {
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [name, setName] = useState('');
  const [orgNumber, setOrgNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [isVatRegistered, setIsVatRegistered] = useState(false);
  const [vatNumber, setVatNumber] = useState('');
  const [bankgiro, setBankgiro] = useState('');
  const [plusgiro, setPlusgiro] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [currency, setCurrency] = useState('SEK');

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const companyData = { 
      logo, 
      name, 
      orgNumber, 
      address,
      city,
      postalCode,
      email,
      phone,
      website,
      isVatRegistered,
      vatNumber: isVatRegistered ? vatNumber : '',
      bankgiro,
      plusgiro,
      paymentTerms,
      currency
    };
    if (onSubmit) {
      onSubmit(companyData);
    } else {
      console.log('Company Data:', companyData);
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.1 } },
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
              {logo ? 'Change Logotype' : 'Add Logotype'}
            </label>
            {logoPreview && (
              <motion.img
                 src={logoPreview}
                 alt="Logo Preview"
                 className="logo-preview"
                variants={fieldVariants}
               />
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">Company Name</label>
          <motion.input
             type="text"
             id="name"
             value={name}
             onChange={(e) => setName(e.target.value)}
             placeholder="Enter company name"
             required
            variants={fieldVariants}
           />
         </div>

         <div className="form-group">
           <label htmlFor="orgNumber">Organisation / Personal Number</label>
           <motion.input
             type="text"
             id="orgNumber"
             value={orgNumber}
             onChange={(e) => setOrgNumber(e.target.value)}
             placeholder="Enter organisation or personal number"
             required
            variants={fieldVariants}
           />
         </div>

         {/* Address Section */}
         <div className="form-group">
           <label htmlFor="address">Street Address</label>
           <motion.input
             type="text"
             id="address"
             value={address}
             onChange={(e) => setAddress(e.target.value)}
             placeholder="Enter street address"
             required
            variants={fieldVariants}
           />
         </div>

         <div className="form-row">
           <div className="form-group half-width">
             <label htmlFor="postalCode">Postal Code</label>
             <motion.input
               type="text"
               id="postalCode"
               value={postalCode}
               onChange={(e) => setPostalCode(e.target.value)}
               placeholder="12345"
               required
               variants={fieldVariants}
             />
           </div>
           <div className="form-group half-width">
             <label htmlFor="city">City</label>
             <motion.input
               type="text"
               id="city"
               value={city}
               onChange={(e) => setCity(e.target.value)}
               placeholder="Stockholm"
               required
               variants={fieldVariants}
             />
           </div>
         </div>

         {/* Contact Information */}
         <div className="form-group">
           <label htmlFor="email">Email</label>
           <motion.input
             type="email"
             id="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             placeholder="company@example.com"
             required
            variants={fieldVariants}
           />
         </div>

         <div className="form-group">
           <label htmlFor="phone">Phone Number</label>
           <motion.input
             type="tel"
             id="phone"
             value={phone}
             onChange={(e) => setPhone(e.target.value)}
             placeholder="+46 8 123 456 78"
             required
            variants={fieldVariants}
           />
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
               <span className="checkbox-text">VAT Registered (Momsregistrerad)</span>
             </label>
           </div>
         </div>

         {isVatRegistered && (
           <motion.div 
             className="form-group"
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
             transition={{ duration: 0.3 }}
           >
             <label htmlFor="vatNumber">VAT Number (Momsregistreringsnummer)</label>
             <motion.input
               type="text"
               id="vatNumber"
               value={vatNumber}
               onChange={(e) => setVatNumber(e.target.value)}
               placeholder="SE123456789012"
               required={isVatRegistered}
               variants={fieldVariants}
             />
           </motion.div>
         )}

         {/* Banking Information */}
         <div className="form-section-title">
           <h3>Payment Information</h3>
         </div>

         <div className="form-row">
           <div className="form-group half-width">
             <label htmlFor="bankgiro">Bankgiro (Optional)</label>
             <motion.input
               type="text"
               id="bankgiro"
               value={bankgiro}
               onChange={(e) => setBankgiro(e.target.value)}
               placeholder="123-4567"
               variants={fieldVariants}
             />
           </div>
           <div className="form-group half-width">
             <label htmlFor="plusgiro">Plusgiro (Optional)</label>
             <motion.input
               type="text"
               id="plusgiro"
               value={plusgiro}
               onChange={(e) => setPlusgiro(e.target.value)}
               placeholder="123456-7"
               variants={fieldVariants}
             />
           </div>
         </div>

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

        <motion.button
          type="submit"
          className="submit-btn"
          variants={fieldVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Lägg Till Företag
        </motion.button>
      </motion.form>
     </div>
   );
};

export default CompanyForm;
