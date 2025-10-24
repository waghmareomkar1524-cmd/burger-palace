import React, { useState, useEffect } from 'react';
import { AuthServiceNew } from './auth-service-new';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication effect
  useEffect(() => {
    const unsubscribe = AuthServiceNew.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        setCurrentPage('home');
      } else {
        setCurrentPage('landing');
      }
    });

    return () => unsubscribe();
  }, []);

  // Navigation handlers
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleLoginSuccess = (user) => {
    setUser(user);
    setCurrentPage('home');
  };

  const handleRegisterSuccess = (user) => {
    setUser(user);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-red-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">☕</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Classic Cafe...</p>
        </div>
      </div>
    );
  }

  // Route to different pages based on currentPage state
  switch (currentPage) {
    case 'login':
      return (
        <LoginPage 
          onBack={() => setCurrentPage('landing')} 
          onSuccess={handleLoginSuccess}
        />
      );
    
    case 'register':
      return (
        <RegisterPage 
          onBack={() => setCurrentPage('landing')} 
          onSuccess={handleRegisterSuccess}
        />
      );
    
    case 'home':
      return (
        <HomePage 
          user={user} 
          onLogout={handleLogout}
        />
      );
    
    default:
      return (
        <LandingPage 
          onNavigate={handleNavigate}
        />
      );
  }
};

export default App;








