import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { useAuth } from '../../hooks/useAuth.jsx';
import "./Login.css";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState(null);
  const { initiateGoogleAuth, handleAuthCallback, isLoading, error } = useGoogleAuth();
  const { login } = useAuth(); // Add useAuth hook
  const hasProcessedCode = useRef(false);

  // Function to send Google code to your API for login
  const sendGoogleCodeToAPI = async (GoogleCode) => {
    // Clear any previous backend errors
    setBackendError(null);
    
    try {
      // Get the PKCE code verifier from sessionStorage
      const codeVerifier = sessionStorage.getItem('google_code_verifier');
      
      const requestBody = {
        GoogleCode: GoogleCode,
        ProofKeyForCodeExchange: codeVerifier
      };

      const response = await fetch('https://localhost:7094/api/User/Login', {
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
        
        // Update auth context with user data
        login(userData);

        // Helper checks: role may be string or numeric (BusinessOwner = 0)
        const isBusinessOwner = (val) => {
          if (val === null || val === undefined) return false;
          const v = typeof val === 'string' ? val.toLowerCase() : val;
          return v === 'businessowner' || v === 0 || v === '0';
        };
        const hasCompany = (u) => !!(u?.companyId || (u?.company && u.company.id));

        // Redirect based on role and company presence
        if (isBusinessOwner(userData.role) && !hasCompany(userData)) {
          navigate('/company');
        } else {
          navigate('/dashboard');
        }
        
        return userData;
      } else {
        
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const responseText = await response.text();
          
          if (responseText.trim()) {
            try {
              const errorData = JSON.parse(responseText);
              
              // Check for different possible error message fields
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
          errorMessage = `HTTP ${response.status}: Could not read error response`;
        }
        
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      setBackendError(error.message);
      throw error;
    }
  };

  // Handle OAuth callback
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    if (errorParam) {
  return;
    }

    if (code && state && !hasProcessedCode.current) {
      hasProcessedCode.current = true;
      
      // Check if this is a login flow
      const authFlowType = sessionStorage.getItem('auth_flow_type');
      
      if (authFlowType === 'login') {
        // Send the Google code to your API for login
        sendGoogleCodeToAPI(code)
          .then((userData) => {
            // Login successful, redirect to dashboard
            // Clean up the flow type
            sessionStorage.removeItem('auth_flow_type');
          })
          .catch((err) => {
            sessionStorage.removeItem('auth_flow_type');
            hasProcessedCode.current = false; // Reset on error to allow retry
          });
      } else {
        // If not a login flow, redirect to register
        const currentParams = new URLSearchParams(window.location.search);
        navigate(`/register?${currentParams.toString()}`, { replace: true });
      }
    }
  }, [searchParams, navigate]);

  const handleGoogleLogin = async () => {
    try {
      // Store a flag to indicate this is a login flow
      sessionStorage.setItem('auth_flow_type', 'login');
      
      await initiateGoogleAuth();
    } catch (err) {
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img
          src="https://res.cloudinary.com/dhpjnh2q0/image/upload/v1754385756/10040776_vkiw0o.jpg"
          alt="Login illustration"
          className="hero-image"
        />
      </div>
      <div className="login-content">
        <div className="login-form">
          <div className="login-text">
            <h1>Welcome Back to SmartBill</h1>
            <p>
              Manage your work and invoices easily. Sign in to get started.
            </p>
          </div>

          <div className="separator"></div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {backendError && (
            <div className="backend-error-message">
              <div className="error-header">Login Error</div>
              <div className="error-details">{backendError}</div>
            </div>
          )}

          <button 
            className="google-login-btn" 
            onClick={handleGoogleLogin}
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
            {isLoading ? 'Logging in...' : 'Continue with Google'}
          </button>

          <div className="login-footer">
            <p>Don't have an account? <a href="/register">Sign up here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
