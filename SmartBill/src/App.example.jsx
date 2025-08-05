// Example of how to set up your App.jsx with the new auth system

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Header from './Components/Header/Header';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Dashboard from './Components/Dashboard/Dashboard';
import CompanyForm from './Components/Company/CompanyForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Header />
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/company" element={
              <ProtectedRoute>
                <Header />
                <CompanyForm />
              </ProtectedRoute>
            } />
            
            {/* Default redirect */}
            <Route path="/" element={
              <ProtectedRoute redirectTo="/login">
                <Header />
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;