import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './Components/Dashboard/Dashboard'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import Login from './Components/Login/Login'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import { isAuthenticated } from './utils/auth'

function App() {

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                <Navigate 
                  to={isAuthenticated() ? "/dashboard" : "/login"} 
                  replace 
                />
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
