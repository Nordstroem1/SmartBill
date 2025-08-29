import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGoogleAuthSecure } from '../../hooks/useGoogleAuthSecure';
import { useAuth } from '../../hooks/useAuth.jsx';
import RoleSelection from '../RoleSelection/RoleSelection';
import SubscriptionModal from '../SubscriptionModal/SubscriptionModal';
import "./Register.css";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const { initiateGoogleAuth, isLoading, error } = useGoogleAuthSecure();
  const { login, user, isLoading: authLoading } = useAuth(); 
  const hasProcessedCode = useRef(false);

  const sendGoogleCodeToAPI = async (GoogleCode) => {
    setBackendError(null);
    
    try {
      const codeVerifier = sessionStorage.getItem('google_code_verifier');
      
      const requestBody = {
        GoogleCode: GoogleCode,
        ProofKeyForCodeExchange: codeVerifier
      };

      const response = await fetch('https://localhost:7094/api/User/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include', 
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        // Store tokens if they're in the response
        if (userData.accessToken) {
          localStorage.setItem('SmartBill_auth_token', userData.accessToken);
        }
        if (userData.refreshToken) {
          localStorage.setItem('SmartBill_auth_RefreshToken', userData.refreshToken);
        }
        
        login(userData);
        
        setUserData(userData);
        setShowRoleSelection(true);
        
        return userData;
      } else {
        
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const responseText = await response.text();
          
          if (responseText.trim()) {
            try {
              const errorData = JSON.parse(responseText);
              
              errorMessage = errorData.message || 
                           errorData.error || 
                           errorData.title || 
                           errorData.detail ||
                           errorData.errors ||
                           responseText;
            } catch (jsonParseError) {
              errorMessage = responseText;
            }
          }
          
        } catch (readError) {
          console.error('Could not read response:', readError);
          errorMessage = `HTTP ${response.status}: Could not read error response`;
        }
        
        console.error('Register error:', errorMessage);
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error in sendGoogleCodeToAPI:', error);
      
      if (!backendError) {
        setBackendError(error.message || 'An unexpected error occurred during registration');
      }
      
      throw error;
    }
  };

  // Handle Google OAuth callback
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      setBackendError(`Authentication failed: ${error}`);
      return;
    }

    if (code && !hasProcessedCode.current) {
      hasProcessedCode.current = true;
      
      // Check if this is a registration flow
      const authFlowType = sessionStorage.getItem('auth_flow_type');
      
      if (authFlowType === 'register') {
        
        sendGoogleCodeToAPI(code)
          .then((userData) => {
            // Clean up the flow type
            sessionStorage.removeItem('auth_flow_type');
            navigate('/register', { replace: true });
          })
          .catch((error) => {
            console.error('Registration failed:', error);
            sessionStorage.removeItem('auth_flow_type');
            // Clear the URL parameters even on error
            navigate('/register', { replace: true });
          });
      } else {
        // If not a register flow, redirect to login
        const currentParams = new URLSearchParams(window.location.search);
        navigate(`/login?${currentParams.toString()}`, { replace: true });
      }
    }
  }, [searchParams, navigate]);

  // If user refreshes while on /register and is already authenticated, decide next step
  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
  if (showSubscriptionModal) return;

    const isBusinessOwner = (val) => {
      if (val === null || val === undefined) return false;
      const v = typeof val === 'string' ? val.toLowerCase() : val;
      // support backend enum numbers and strings
      return v === 'businessowner' || v === 0 || v === '0';
    };

    // If role not chosen yet, show RoleSelection again
    if (user.role === null || user.role === undefined) {
      setShowRoleSelection(true);
      return;
    }

    if (isBusinessOwner(user.role)) {
      const hasCompany = !!(user.companyId || (user.company && user.company.id));
      if (!hasCompany) {
        setShowSubscriptionModal(true);
      } else {
        navigate('/dashboard');
      }
      return;
    }

    // Non-owners go to dashboard
    navigate('/dashboard');
  }, [user, authLoading, showSubscriptionModal, navigate]);

  const handleGoogleRegister = () => {
    setBackendError(null);
    
    // Store a flag to indicate this is a registration flow
    sessionStorage.setItem('auth_flow_type', 'register');
    
    initiateGoogleAuth();
  };

  const redirectBasedOnRole = (role) => {
    if (role === 'BusinessOwner') {
      setShowSubscriptionModal(true);
    } else {
      navigate('/dashboard');
    }
  };

  const handleRoleSelection = (role, updatedUserData) => {
    console.log('Role selected:', role, updatedUserData);
    
    // Update the auth context with the new role
    if (updatedUserData) {
      login(updatedUserData);
    }
    
    setShowRoleSelection(false);
    redirectBasedOnRole(role);
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <img 
          src="https://res.cloudinary.com/dhpjnh2q0/image/upload/v1754384355/12085250_20944064_mfselk.jpg" 
          alt="SmartBill" 
          className="hero-image"
        />
        
        <div className="register-form">
          <div className="register-text">
            <h1>Create Your Account</h1>
            <p>Join SmartBill to manage your invoices and business efficiently</p>
          </div>

          {(backendError || error) && (
            <div className="error-message">
              {backendError || error}
            </div>
          )}

          <div className="separator"></div>

          <button 
            className="google-register-btn"
            onClick={handleGoogleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              <svg
              className="google-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            )}
            {isLoading ? 'Creating account...' : 'Sign up with Google'}
          </button>

          <div className="register-footer">
            <p>Already have an account? 
              <a href="/login">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>

      {showRoleSelection && (
        <RoleSelection
          onRoleSelect={handleRoleSelection}
          userData={userData}
        />
      )}

      {showSubscriptionModal && (
        <SubscriptionModal onClose={() => {
          setShowSubscriptionModal(false);
          navigate('/dashboard');
        }} />
      )}
    </div>
  );
};

export default Register;
