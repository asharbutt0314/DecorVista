import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './assets/Components/Navbar/Navbar';
import Footer from './assets/Components/Footer/Footer';
import Login from './assets/Components/Login/Login';
import Signup from './assets/Components/SignUp/Signup';
import OtpVerify from './assets/Components/SignUp/OtpVerify';
import ResetPassword from './assets/Components/ResetPassword/ResetPassword';
import ForgotPassword from './assets/Components/ForgotPassword/ForgotPassword';
import ResetOTPVerify from './assets/Components/ResetOTPVerify/ResetOTPVerify';
import NewPassword from './assets/Components/NewPassword/NewPassword';
import { ToastProvider } from './assets/Components/Toast/ToastProvider';
import './App.css';
import Dashboard from './assets/Components/Dashboard/Dashboard';
import Products from './assets/Components/Products/Products';
import Inspiration from './assets/Components/Inspiration/Inspiration';
import Consultations from './assets/Components/Consultations/Consultations';
import Profile from './assets/Components/Profile/Profile';
import Blog from './assets/Components/Blog/Blog';
import Designers from './assets/Components/Designers/Designers';
import DesignerProfile from './components/DesignerProfile';
import Notifications from './assets/Components/Notifications/Notifications';
import Reviews from './assets/Components/Reviews/Reviews';
import CartPage from './components/CartPage';
import OrderHistory from './components/OrderHistory';
import Checkout from './components/Checkout';


const App = () => {
  const isLoggedIn = !!localStorage.getItem('user');



  return (
    <ToastProvider>
      <Router>
        <div className="decorvista-app">
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />} />
            <Route path="/otp-verify" element={isLoggedIn ? <Navigate to="/dashboard" /> : <OtpVerify />} />
            <Route path="/reset-password" element={isLoggedIn ? <Navigate to="/dashboard" /> : <ResetPassword />} />
            <Route path="/forgot-password" element={isLoggedIn ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
            <Route path="/reset-otp-verify" element={isLoggedIn ? <Navigate to="/dashboard" /> : <ResetOTPVerify />} />
            <Route path="/new-password" element={isLoggedIn ? <Navigate to="/dashboard" /> : <NewPassword />} />
            <Route path="/*" element={
              isLoggedIn ? (
                <>
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/designers" element={<Designers />} />
                      <Route path="/designer/:designerId" element={<DesignerProfile />} />
                      <Route path="/inspiration" element={<Inspiration />} />
                      <Route path="/consultations" element={<Consultations />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/reviews" element={<Reviews />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/orders" element={<OrderHistory />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              ) : (
                <Navigate to="/login" />
              )
            } />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App;