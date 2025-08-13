import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SubscriptionComplete.css';

const SubscriptionComplete = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const processSubscription = async () => {
      try {
        const qpPlan = searchParams.get('plan');
        const qpCurrency = searchParams.get('currency');
        const selectedPlan = qpPlan || sessionStorage.getItem('selectedPlan');
        const selectedCurrency = qpCurrency || sessionStorage.getItem('selectedCurrency');

        if (!selectedPlan) {
          navigate('/dashboard');
          return;
        }

        // Both Free and Pro: go directly to company registration
  sessionStorage.removeItem('selectedPlan');
  sessionStorage.removeItem('selectedCurrency');
  navigate('/company');
  return;
      } catch (e) {
        setError(e.message || 'Subscription error');
      } finally {
        setIsProcessing(false);
      }
    };

    processSubscription();
  }, [navigate, searchParams]);

  if (isProcessing) {
    return (
      <div className="subscription-processing">
        <p>Processing subscription…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="subscription-processing">
        <p>Error: {error}</p>
      </div>
    );
  }
  return null;
};

export default SubscriptionComplete;
