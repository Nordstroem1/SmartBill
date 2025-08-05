import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient';
import './RoleSelection.css';

const RoleSelection = ({ onRoleSelect, userData }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prevent closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRoleSelect = async (role) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.request('https://localhost:7094/api/User/ChangeRole', {
        method: 'POST',
        body: JSON.stringify({
          UserId: userData.id,
          NewRole: role === 'BusinessOwner' ? 1 : 0
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Role updated successfully:', updatedUser);
        onRoleSelect(role, updatedUser);
      } else {
        const errorText = await response.text();
        console.error('Role update failed:', errorText);
        throw new Error(errorText || 'Failed to update role');
      }
    } catch (err) {
      console.error('Role selection error:', err);
      setError('Failed to select role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="role-selection-overlay"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="role-selection-container">
        <div className="role-selection-content">
          <h2>Choose your company role</h2>
          {error && (
            <div className="role-error-message">
              {error}
            </div>
          )}

          <div className="role-options">
            <button 
              className={`role-option ${selectedRole === 'Employee' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('Employee')}
              disabled={isLoading}
            >
              <div className="role-title">Employee</div>
            </button>

            <button 
              className={`role-option ${selectedRole === 'BusinessOwner' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('BusinessOwner')}
              disabled={isLoading}
            >
              <div className="role-title">Business Owner</div>
            </button>
          </div>

          {isLoading && (
            <div className="role-loading">
              <div className="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <span>Updating your role...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
