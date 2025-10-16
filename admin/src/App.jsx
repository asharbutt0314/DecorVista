import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Users from './components/Users'
import Designers from './components/Designers'
import Products from './components/Products'
import Categories from './components/Categories'
import Blogs from './components/Blogs'
import Orders from './components/Orders'
import Reviews from './components/Reviews'
import Consultations from './components/Consultations'
import Notifications from './components/Notifications'
import Settings from './components/Settings'
import Analytics from './components/Analytics'
import Profile from './components/Profile'
import AdminLogin from './assets/Components/AdminLogin/AdminLogin'
import AdminForgotPassword from './assets/Components/AdminForgotPassword/AdminForgotPassword'
import AdminResetOTPVerify from './assets/Components/AdminResetOTPVerify/AdminResetOTPVerify'
import AdminNewPassword from './assets/Components/AdminNewPassword/AdminNewPassword'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'
import './styles/responsive.css'
import './styles/responsive-admin.css'

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('admin'))

  useEffect(() => {
    const handlePopState = () => {
      if (!localStorage.getItem('admin')) {
        window.location.replace('/login')
      }
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<AdminLogin onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin-reset-otp-verify" element={<AdminResetOTPVerify />} />
        <Route path="/admin-new-password" element={<AdminNewPassword />} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    )
  }

  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="container-fluid">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/designers" element={<Designers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/admin-forgot-password" element={<Navigate to="/" />} />
          <Route path="/admin-reset-otp-verify" element={<Navigate to="/" />} />
          <Route path="/admin-new-password" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App