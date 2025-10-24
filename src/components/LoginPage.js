import React, { useState } from 'react';
import { LogIn, ArrowLeft, Loader } from 'lucide-react';
import { AuthServiceNew } from '../auth-service-new';

const LoginPage = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('mobile'); // 'mobile' or 'otp'
  const [otp, setOtp] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await AuthServiceNew.sendLoginOTP(formData.mobile.trim());

      if (result.success) {
        setStep('otp');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Failed to send OTP. Please try again.' });
    }

    setLoading(false);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await AuthServiceNew.verifyLoginOTP(otp);

      if (result.success) {
        onSuccess(result.user);
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'OTP verification failed. Please try again.' });
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-red-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="absolute left-6 top-6 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="text-4xl mb-4">☕</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Classic Cafe account</p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {errors.general}
          </div>
        )}

        {/* Login Form */}
        {step === 'mobile' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.mobile ? 'border-red-500' : 'border-gray-300 focus:border-orange-500'
                }`}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border-2 border-blue-400"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Send OTP
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-center text-2xl tracking-widest ${
                  errors.otp ? 'border-red-500' : 'border-gray-300 focus:border-orange-500'
                }`}
                maxLength="6"
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
              <p className="text-sm text-gray-500 mt-1">
                OTP sent to +91{formData.mobile}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border-2 border-green-400"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Verifying OTP...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Verify OTP
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('mobile')}
              className="w-full text-gray-600 hover:text-gray-800 transition-colors"
            >
              Change mobile number
            </button>
          </form>
        )}

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => onBack()}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Register here
            </button>
          </p>
        </div>

        {/* reCAPTCHA Container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default LoginPage;
