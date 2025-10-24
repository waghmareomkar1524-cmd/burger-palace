import React from 'react';
import { LogIn, UserPlus, Coffee, ArrowRight } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-red-700">
      {/* Header */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">☕</div>
            <h1 className="text-3xl font-bold text-white">Classic Cafe</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="text-center text-white max-w-4xl">
          {/* Main Heading */}
          <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to
            <br />
            <span className="text-yellow-300">Classic Cafe</span>
          </h2>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto">
            Experience the finest coffee and delicious meals in a cozy atmosphere. 
            Order now and enjoy our premium service.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate('login')}
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl border-2 border-white min-w-[200px]"
            >
              <LogIn size={24} />
              Login
              <ArrowRight size={20} />
            </button>
            
            <button
              onClick={() => onNavigate('register')}
              className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl border-2 border-orange-500 min-w-[200px]"
            >
              <UserPlus size={24} />
              Register
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">☕</div>
              <h3 className="text-xl font-bold mb-2">Premium Coffee</h3>
              <p className="text-gray-200">Freshly brewed coffee made with the finest beans</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold mb-2">Delicious Food</h3>
              <p className="text-gray-200">Mouth-watering meals prepared with love</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Quick Service</h3>
              <p className="text-gray-200">Fast and efficient service for your convenience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-white pb-8">
        <p className="text-gray-200">
          © 2024 Classic Cafe. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;

