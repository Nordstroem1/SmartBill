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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const companyData = { logo, name, orgNumber, address };
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
        <div className="form-group logo-upload">
          <label htmlFor="logo">Company Logo</label>
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoChange}
          />
          {/* Custom placeholder/text for file selection */}
          <label htmlFor="logo" className="file-text">
            {logo ? logo.name : 'Klicka för att välja logotyp'}
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

         <div className="form-group">
           <label htmlFor="address">Företagsadress</label>
           <motion.textarea
             id="address"
             rows={3}
             value={address}
             onChange={(e) => setAddress(e.target.value)}
             placeholder="Ange företagsadress"
             required
            variants={fieldVariants}
           />
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
