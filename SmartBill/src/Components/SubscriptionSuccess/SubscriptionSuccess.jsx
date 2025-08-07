import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import './SubscriptionSuccess.css';

const SubscriptionSuccess = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        // Check if this is a mock payment
        const isMockPayment = sessionStorage.getItem('mockPayment');
        const pendingCompanyId = sessionStorage.getItem('pendingCompanyId');
        
        if (isMockPayment) {
          console.log('🧪 Simulating Stripe payment verification...');
          
          // Mock verification delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Mock successful verification
          const mockSubscriptionData = {
            subscription: {
              id: 'sub_mock_' + Date.now(),
              status: 'active',
              plan: 'pro',
              currency: sessionStorage.getItem('selectedCurrency') || 'USD',
              amount: 2900, // $29.00
              trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
            },
            company: {
              id: pendingCompanyId,
              name: `${user?.name}'s Company`,
              subscription_status: 'active'
            }
          };
          
          console.log('✅ Mock Stripe payment verified:', mockSubscriptionData);
          setSubscriptionData(mockSubscriptionData);
          
          // Clean up session storage
          sessionStorage.removeItem('selectedPlan');
          sessionStorage.removeItem('selectedCurrency');
          sessionStorage.removeItem('mockPayment');
          sessionStorage.removeItem('pendingCompanyId');
          
          // Redirect to company dashboard after 5 seconds
          setTimeout(() => {
            navigate('/company');
          }, 5000);
          
        } else {
          // Real Stripe payment verification (commented out for demo)
          const sessionId = searchParams.get('session_id');
          
          if (!sessionId) {
            throw new Error('No session ID found');
          }

          // Real API call would go here
          throw new Error('Real Stripe integration not available in demo mode');
        }
      } catch (err) {
        console.error('Subscription verification error:', err);
        setError(err.message);
      } finally {
        setIsVerifying(false);
      }
    };

    if (user) {
      verifySubscription();
    }
  }, [user, searchParams, navigate]);

  if (isVerifying) {
    return (
      <div className="subscription-success-container">
        <div className="subscription-content">
          <div className="verification-spinner">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <h2>Verifying your payment...</h2>
          <p>Please wait while we confirm your subscription.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscription-success-container">
        <div className="subscription-content error">
          <div className="error-icon">❌</div>
          <h2>Verification Failed</h2>
          <p>{error}</p>
          <button 
            className="continue-btn"
            onClick={() => navigate('/dashboard')}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-success-container">
      <div className="subscription-content success">
        <div className="success-icon">🎉</div>
        <h2>Welcome to SmartBill Pro!</h2>
        <p>Your subscription has been activated successfully.</p>
        
        {subscriptionData && (
          <div className="subscription-details">
            <h3>Subscription Details</h3>
            <div className="detail-row">
              <span>Plan:</span>
              <strong>SmartBill Pro</strong>
            </div>
            <div className="detail-row">
              <span>Status:</span>
              <strong className="status-active">{subscriptionData.subscription?.status || 'Active'}</strong>
            </div>
            <div className="detail-row">
              <span>Currency:</span>
              <strong>{subscriptionData.subscription?.currency || 'USD'}</strong>
            </div>
            {subscriptionData.subscription?.trial_end && (
              <div className="detail-row">
                <span>Trial Ends:</span>
                <strong>{new Date(subscriptionData.subscription.trial_end).toLocaleDateString()}</strong>
              </div>
            )}
            <div className="mock-notice">
              <p><strong>🧪 Payment Demo:</strong> Stripe payment verification is simulated</p>
            </div>
          </div>
        )}

        <div className="plan-features">
          <h3>Your Pro Plan Includes:</h3>
          <ul>
            <li>✅ Unlimited invoices</li>
            <li>✅ Advanced job tracking</li>
            <li>✅ Custom invoice templates</li>
            <li>✅ Priority support</li>
            <li>✅ Advanced analytics</li>
            <li>✅ Multiple currencies</li>
          </ul>
        </div>

        <div className="countdown">
          <p>Redirecting to your dashboard in 5 seconds...</p>
          <button 
            className="continue-btn"
            onClick={() => navigate('/dashboard')}
          >
            Continue Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
