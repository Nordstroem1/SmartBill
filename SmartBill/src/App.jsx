import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.jsx'
import Dashboard from './Components/Dashboard/Dashboard'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import Login from './Components/Login/Login'
import CompanyForm from './Components/Company/CompanyForm'
import LandingPage from './Components/LandingPage/LandingPage'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import Register from './Components/Register/Register'
import PricingSelection from './Components/PricingSelection/PricingSelection'
import SubscriptionComplete from './Components/SubscriptionComplete/SubscriptionComplete'
import SubscriptionSuccess from './Components/SubscriptionSuccess/SubscriptionSuccess'

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/pricing-selection" 
                element={
                  <ProtectedRoute>
                    <PricingSelection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/complete" 
                element={
                  <ProtectedRoute>
                    <SubscriptionComplete />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/success" 
                element={
                  <ProtectedRoute>
                    <SubscriptionSuccess />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/company" 
                element={
                  <ProtectedRoute>
                    <CompanyForm />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
