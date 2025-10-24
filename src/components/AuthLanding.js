import React from 'react';
import { LogIn, UserPlus, Coffee, ArrowRight } from 'lucide-react';

const AuthLanding = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-red-700 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 bg-opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300 bg-opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-bounce">☕</div>
            <span className="text-2xl font-bold text-white">Classic Cafe</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center h-[calc(100vh-120px)] px-4">
        <div className="text-center text-white max-w-6xl">
          {/* Main heading with animation */}
          <div className="mb-8 animate-fade-scale">
            <h1 className="text-6xl md:text-7xl font-black mb-4 leading-tight">
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent animate-glow">
                WELCOME TO
              </span>
              <span className="block text-yellow-300 font-black drop-shadow-2xl text-6xl md:text-7xl animate-glow">CLASSIC CAFE</span>
            </h1>
            <p className="text-xl md:text-2xl font-light mb-2 opacity-90 animate-slide-up">
              Please login or register to continue
            </p>
          </div>

          {/* Authentication Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button
              onClick={() => onNavigate('login')}
              className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-110 shadow-2xl hover:shadow-blue-500/50 min-w-[250px] border-2 border-blue-400"
            >
              <span className="relative z-10 flex items-center gap-3">
                <LogIn size={28} />
                LOGIN
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button
              onClick={() => onNavigate('register')}
              className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-orange-500 hover:to-red-600 transition-all transform hover:scale-110 shadow-2xl hover:shadow-orange-500/50 min-w-[250px] border-2 border-blue-400 hover:border-orange-400"
            >
              <span className="relative z-10 flex items-center gap-3">
                <UserPlus size={28} />
                REGISTER
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:bg-opacity-50 border border-white border-opacity-20">
              <div className="text-4xl mb-3 animate-bounce">⚡</div>
              <h3 className="text-xl font-bold mb-2 text-white">Quick Order</h3>
              <p className="text-sm text-white text-opacity-90">Order your favorite items instantly</p>
            </div>
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:bg-opacity-50 border border-white border-opacity-20">
              <div className="text-4xl mb-3 animate-bounce" style={{animationDelay: '0.2s'}}>🎯</div>
              <h3 className="text-xl font-bold mb-2 text-white">Track Orders</h3>
              <p className="text-sm text-white text-opacity-90">Monitor your order status</p>
            </div>
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:bg-opacity-50 border border-white border-opacity-20">
              <div className="text-4xl mb-3 animate-bounce" style={{animationDelay: '0.4s'}}>💯</div>
              <h3 className="text-xl font-bold mb-2 text-white">Order History</h3>
              <p className="text-sm text-white text-opacity-90">View all your past orders</p>
            </div>
          </div>

          {/* Floating cafe animations */}
          <div className="absolute top-20 left-10 text-6xl animate-float opacity-20">☕</div>
          <div className="absolute top-40 right-20 text-4xl animate-bounce opacity-30">🥐</div>
          <div className="absolute bottom-40 left-20 text-5xl animate-float opacity-25">🍰</div>
          <div className="absolute bottom-20 right-10 text-3xl animate-bounce opacity-30">🥧</div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-white">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default AuthLanding;
