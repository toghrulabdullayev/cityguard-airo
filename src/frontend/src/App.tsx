/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

function AnimatedRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return sessionStorage.getItem('userEmail');
  });
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return sessionStorage.getItem('authToken');
  });

  const handleLoginSuccess = (email: string, token: string) => {
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('authToken', token);
    setUserEmail(email);
    setAuthToken(token);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('authToken');
    setUserEmail(null);
    setAuthToken(null);
    navigate('/');
  };

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route 
          path="/" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <LandingPage onEnterTerminal={() => navigate('/auth')} />
            </motion.div>
          } 
        />
        <Route 
          path="/auth" 
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <AuthPage 
                onLoginSuccess={handleLoginSuccess} 
                onBackToLanding={() => navigate('/')} 
              />
            </motion.div>
          } 
        />
        <Route 
          path="/login" 
          element={<Navigate to="/auth" replace />} 
        />
        <Route 
          path="/signup" 
          element={<Navigate to="/auth" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={
            userEmail ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'linear' }}
              >
                <DashboardPage 
                  userEmail={userEmail} 
                  authToken={authToken}
                  onLogout={handleLogout} 
                />
              </motion.div>
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#04040A] text-[#7E7F94] relative select-none">
        <AnimatedRouter />
      </div>
    </Router>
  );
}
