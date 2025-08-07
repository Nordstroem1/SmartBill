import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import './PricingSelection.css';

const PricingSelection = () => {
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Currency detection based on user's location
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        if (timezone.includes('Europe/Stockholm') || timezone.includes('Europe/Gothenburg')) {
          setCurrency('SEK');
          setCurrencySymbol('kr');
        } else if (timezone.includes('Europe/') && !timezone.includes('London')) {
          setCurrency('EUR');
          setCurrencySymbol('€');
        } else if (timezone.includes('Europe/London')) {
          setCurrency('GBP');
          setCurrencySymbol('£');
        } else {
          setCurrency('USD');
          setCurrencySymbol('$');
        }
      } catch (error) {
        console.log('Could not detect currency, defaulting to USD');
        setCurrency('USD');
        setCurrencySymbol('$');
      }
    };

    detectCurrency();
  }, []);

  // Redirect if user is not a Business Owner
  useEffect(() => {
    if (user && user.role !== 'BusinessOwner') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    switch (newCurrency) {
      case 'SEK':
      case 'NOK':
      case 'DKK':
        setCurrencySymbol('kr');
        break;
      case 'EUR':
        setCurrencySymbol('€');
        break;
      case 'GBP':
        setCurrencySymbol('£');
        break;
      default:
        setCurrencySymbol('$');
    }
  };

  const getPricing = () => {
    const pricingMap = {
      USD: { free: 0, pro: 29 },
      EUR: { free: 0, pro: 25 },
      SEK: { free: 0, pro: 299 },
      GBP: { free: 0, pro: 22 },
      NOK: { free: 0, pro: 299 },
      DKK: { free: 0, pro: 199 }
    };
    return pricingMap[currency] || pricingMap.USD;
  };

  const handlePlanSelect = async (plan) => {
    setIsLoading(true);
    
    try {
      // Store selected plan and currency
      sessionStorage.setItem('selectedPlan', plan);
      sessionStorage.setItem('selectedCurrency', currency);
      
      // Navigate to subscription processing
      navigate('/subscription/complete');
    } catch (error) {
      console.error('Error selecting plan:', error);
      setIsLoading(false);
    }
  };

  const pricing = getPricing();

  if (!user || user.role !== 'BusinessOwner') {
    return (
      <div className="pricing-selection-container">
        <div className="pricing-content">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-selection-container">
      <motion.div
        className="pricing-selection-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="pricing-header">
          <h2>Choose Your Plan</h2>
          <p>Select the plan that best fits your business needs</p>
          
          <div className="currency-selector">
            <label htmlFor="currency-select">Currency:</label>
            <select 
              id="currency-select"
              value={currency} 
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="currency-dropdown"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="SEK">SEK (kr)</option>
              <option value="GBP">GBP (£)</option>
              <option value="NOK">NOK (kr)</option>
              <option value="DKK">DKK (kr)</option>
            </select>
          </div>
        </div>

        <div className="pricing-plans">
          {/* Free Plan */}
          <motion.div 
            className="pricing-plan free-plan"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="plan-header">
              <h3>Free Plan</h3>
              <div className="price">
                <span className="amount">{currencySymbol}{pricing.free}</span>
                <span className="period">/month</span>
              </div>
            </div>
            
            <div className="plan-features">
              <ul>
                <li>✅ Up to 5 team members</li>
                <li>✅ 10 invoices per month</li>
                <li>✅ Basic job tracking</li>
                <li>✅ Invoice templates</li>
                <li>✅ Email support</li>
              </ul>
            </div>
            
            <button 
              className="plan-button free-button"
              onClick={() => handlePlanSelect('free')}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Start Free'}
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            className="pricing-plan pro-plan featured"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="featured-badge">Most Popular</div>
            <div className="plan-header">
              <h3>Pro Plan</h3>
              <div className="price">
                <span className="amount">{currencySymbol}{pricing.pro}</span>
                <span className="period">/month</span>
              </div>
              <div className="trial-notice">14-day free trial</div>
            </div>
            
            <div className="plan-features">
              <ul>
                <li>✅ Unlimited team members</li>
                <li>✅ Unlimited invoices</li>
                <li>✅ Advanced job tracking</li>
                <li>✅ Custom invoice templates</li>
                <li>✅ Time tracking</li>
                <li>✅ Expense management</li>
                <li>✅ Advanced reporting</li>
                <li>✅ Priority support</li>
                <li>✅ API access</li>
              </ul>
            </div>
            
            <button 
              className="plan-button pro-button"
              onClick={() => handlePlanSelect('pro')}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Start 14-Day Trial'}
            </button>
          </motion.div>
        </div>

        <div className="pricing-footer">
          <p>You can change or cancel your plan at any time</p>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingSelection;
