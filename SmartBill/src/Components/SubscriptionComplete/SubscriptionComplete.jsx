import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import './SubscriptionComplete.css';

const SubscriptionComplete = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const processSubscription = async () => {
      try {
        // Get stored plan and currency from sessionStorage
        const selectedPlan = sessionStorage.getItem('selectedPlan');
        const selectedCurrency = sessionStorage.getItem('selectedCurrency');

        if (!selectedPlan) {
          // No plan selected, redirect to dashboard
          navigate('/dashboard');
          return;
        }

        // Check if user has Business Owner role
        if (!user || user.role !== 'BusinessOwner') {
          // Only Business Owners can create companies/subscriptions
          console.log('User is not a Business Owner, redirecting to dashboard');
          sessionStorage.removeItem('selectedPlan');
          sessionStorage.removeItem('selectedCurrency');
          navigate('/dashboard');
          return;
        }

        // For free plan, create company with free subscription
        if (selectedPlan === 'free') {
          const response = await fetch('https://localhost:7094/api/Company/CreateWithSubscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('SmartBill_auth_token')}`
            },
            body: JSON.stringify({
              UserId: user.id,
              Plan: 'free',
              Currency: selectedCurrency || 'USD',
              CompanyName: `${user.name}'s Company`
            })
          });

          if (response.ok) {
            const { company } = await response.json();
            setSubscriptionStatus('free');
            // Clean up sessionStorage
            sessionStorage.removeItem('selectedPlan');
            sessionStorage.removeItem('selectedCurrency');
            
            // Redirect after 3 seconds
            setTimeout(() => {
              navigate('/company'); // Go to company dashboard
            }, 3000);
          } else {
            throw new Error('Failed to create company with free plan');
          }
        } else {
          // For pro plan, create company and mock Stripe checkout
          console.log('🔄 Creating company for Pro plan...');
          
          const response = await fetch('https://localhost:7094/api/Company/CreateWithProSubscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('SmartBill_auth_token')}`
            },
            body: JSON.stringify({
              UserId: user.id,
              Plan: selectedPlan,
              Currency: selectedCurrency || 'USD',
              CompanyName: `${user.name}'s Company`,
              SuccessUrl: `${window.location.origin}/subscription/success`,
              CancelUrl: `${window.location.origin}/dashboard`
            })
          });

          if (response.ok) {
            const { checkoutUrl, companyId } = await response.json();
            console.log('✅ Company created, mocking Stripe checkout...');
            
            // Store company ID for later
            sessionStorage.setItem('pendingCompanyId', companyId);
            sessionStorage.setItem('mockPayment', 'true');
            
            // Mock "redirecting to Stripe" with a brief message
            setSubscriptionStatus('processing_payment');
            
            // After 3 seconds, simulate successful payment
            setTimeout(() => {
              console.log('💳 Simulating successful Stripe payment...');
              navigate('/subscription/success');
            }, 3000);
          } else {
            throw new Error(`Failed to create company: ${response.status}`);
          }
        }
      } catch (err) {
        console.error('Subscription processing error:', err);
        setError(err.message);
      } finally {
        setIsProcessing(false);
      }
    };

    if (user) {
      processSubscription();
    }
  }, [user, navigate]);

  if (isProcessing) {
    return (
      <div className="subscription-complete-container">
        <div className="subscription-content">
          <div className="subscription-spinner">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <h2>Processing your subscription...</h2>
          <p>Please wait while we set up your account.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscription-complete-container">
        <div className="subscription-content error">
          <div className="error-icon">❌</div>
          <h2>Subscription Error</h2>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => navigate('/dashboard')}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (subscriptionStatus === 'processing_payment') {
    return (
      <div className="subscription-complete-container">
        <div className="subscription-content">
          <div className="subscription-spinner">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <h2>Redirecting to Payment...</h2>
          <p>🔄 Your company has been created. Simulating Stripe payment flow...</p>
          <div className="mock-notice">
            <p><strong>🧪 Payment Demo:</strong> Stripe integration is simulated</p>
          </div>
        </div>
      </div>
    );
  }

  if (subscriptionStatus === 'free') {
    return (
      <div className="subscription-complete-container">
        <div className="subscription-content success">
          <div className="success-icon">🎉</div>
          <h2>Welcome to SmartBill Free!</h2>
          <p>Your company has been created with the free plan.</p>
          <div className="plan-features">
            <h3>Your Free Plan Includes:</h3>
            <ul>
              <li>✅ Up to 5 team members</li>
              <li>✅ 10 invoices per month</li>
              <li>✅ Basic job tracking</li>
              <li>✅ Invoice templates</li>
              <li>✅ Email support</li>
            </ul>
          </div>
          <p className="redirect-message">Redirecting to company setup...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default SubscriptionComplete;
