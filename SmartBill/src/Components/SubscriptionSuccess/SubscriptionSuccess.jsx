import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
  setTimeout(() => navigate('/company'), 200);
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Subscription Successful</h2>
  <p>Redirecting you to company registration…</p>
    </div>
  );
};

export default SubscriptionSuccess;
