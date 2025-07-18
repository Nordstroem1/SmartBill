import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './Components/Dashboard/Dashboard'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import Login from './Components/Login/Login'
import CompanyForm from './Components/Company/CompanyForm'
import LandingPage from './Components/LandingPage/LandingPage'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import { isAuthenticated } from './utils/auth'

function App() {

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                // <ProtectedRoute>
                  <Dashboard />
                // </ProtectedRoute>
              } 
            />
            <Route 
              path="/company" 
              element={
                // <ProtectedRoute>
                  <CompanyForm />
                // </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
