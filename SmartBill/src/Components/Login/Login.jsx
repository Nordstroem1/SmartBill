import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import "./Login.css";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState(null);
  const { initiateGoogleAuth, handleAuthCallback, isLoading, error } = useGoogleAuth();
  const hasProcessedCode = useRef(false);

  // Function to send Google code to your API
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

      const response = await fetch('https://localhost:7094/api/User/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include', 
        body: JSON.stringify(requestBody)
      });
      console.log("Google code sent to API:", GoogleCode);
      console.log("PKCE code verifier sent:", codeVerifier ? "Present" : "Missing");
      
      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        console.log('API Error - Status:', response.status);
        console.log('API Error - Headers:', [...response.headers.entries()]);
        
        let errorMessage = `HTTP error! status: ${response.status}`;
        let rawResponse = null;
        
        try {
          // First, clone the response to read it multiple times if needed
          const responseClone = response.clone();
          const responseText = await response.text();
          
          console.log('Raw API response:', responseText);
          
          // Try to parse as JSON first
          if (responseText.trim()) {
            try {
              const errorData = JSON.parse(responseText);
              console.log('Parsed JSON error:', errorData);
              
              // Check for different possible error message fields
              errorMessage = errorData.message || 
                           errorData.error || 
                           errorData.title || 
                           errorData.detail ||
                           errorData.errors ||
                           responseText;
            } catch (jsonParseError) {
              console.log('Not valid JSON, using raw text');
              // If it's not JSON, use the raw text
              errorMessage = responseText;
            }
          }
          
        } catch (readError) {
          console.error('Could not read response:', readError);
          errorMessage = `HTTP ${response.status}: Could not read error response`;
        }
        
        console.error('Final error message to display:', errorMessage);
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error sending Google code to API:', error);
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
      console.error('OAuth error:', errorParam);
      return;
    }

    if (code && state && !hasProcessedCode.current) {
      hasProcessedCode.current = true;
      // Send the Google code to your API
      sendGoogleCodeToAPI(code)
        .then((userData) => {
          console.log('Authentication successful:', userData);
          // Redirect to company page after successful login
          navigate('/company');
        })
        .catch((err) => {
          console.error('Authentication failed:', err);
          hasProcessedCode.current = false; // Reset on error to allow retry
        });
    }
  }, [searchParams, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await initiateGoogleAuth();
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img
          src="https://res.cloudinary.com/dhpjnh2q0/image/upload/v1751476138/20944187_qzasma.jpg"
          alt="Login illustration"
          className="hero-image"
        />
      </div>
      <div className="login-content">
        <div className="login-form">
          <div className="login-text">
            <h1>Välkommen till SmartBill</h1>
            <p>
              Hantera dina arbeten och fakturor enkelt. Logga in för att komma
              igång.
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
              <div className="loading-spinner"></div>
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
            {isLoading ? 'Loggar in...' : 'Fortsätt med Google'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
