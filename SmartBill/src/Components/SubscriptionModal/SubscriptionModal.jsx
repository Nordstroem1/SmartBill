import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './SubscriptionModal.css';

const SubscriptionModal = ({ onClose }) => {
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      } catch (e) {
        setCurrency('USD');
        setCurrencySymbol('$');
      }
    };
    detectCurrency();
  }, []);

  // Prices should be equal to 150 :-
  const getPricing = () => {
    const pricingMap = {
  USD: { free: 0, pro: 15 },
  EUR: { free: 0, pro: 13 },
  SEK: { free: 0, pro: 150 },
  GBP: { free: 0, pro: 11 },
  NOK: { free: 0, pro: 150 },
  DKK: { free: 0, pro: 99 },
    };
    return pricingMap[currency] || pricingMap.USD;
  };

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

  const handlePlanSelect = async (plan) => {
    setIsLoading(true);
    try {
      sessionStorage.setItem('selectedPlan', plan);
      sessionStorage.setItem('selectedCurrency', currency);
      // Also include as query params to survive any storage/timing issues
      navigate(`/subscription/complete?plan=${encodeURIComponent(plan)}&currency=${encodeURIComponent(currency)}`);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const pricing = getPricing();

  return (
    <div className="subscription-modal-overlay" onClick={(e) => e.stopPropagation()}>
      <motion.div
        className="subscription-modal"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="modal-header">
          <h3>Choose Your Plan</h3>
          {onClose && (
            <button className="modal-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          )}
        </div>

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

        <div className="plans">
          <div className="plan-card free">
            <div className="plan-head">
              <h4>Free</h4>
              <div className="price">
                <span className="amount">{currencySymbol}{pricing.free}</span>
                <span className="period">/mo</span>
              </div>
            </div>
            <ul className="features">
              <li>10 invoices / month</li>
              <li>Basic job tracking</li>
            </ul>
            <button
              className="plan-btn free-btn"
              disabled={isLoading}
              onClick={() => handlePlanSelect('free')}
            >
              {isLoading ? 'Processing...' : 'Start Free'}
            </button>
          </div>

          <div className="plan-card pro">
            <div className="badge">Most Popular</div>
            <div className="plan-head">
              <h4>Pro</h4>
              <div className="price">
                <span className="amount">{currencySymbol}{pricing.pro}</span>
                <span className="period">/mo</span>
              </div>
            </div>
            <ul className="features">
              <li>Unlimited team & invoices</li>
              <li>Analytics tool</li>
              <li>Priority support</li>
            </ul>
            <button
              className="plan-btn pro-btn"
              disabled={isLoading}
              onClick={() => handlePlanSelect('pro')}
            >
              {isLoading ? 'Processing...' : 'Get pro license'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionModal;
