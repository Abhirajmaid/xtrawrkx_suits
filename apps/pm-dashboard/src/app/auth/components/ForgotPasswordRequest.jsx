import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ForgotPasswordRequest = ({ onStateChange }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendReset = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onStateChange('forgot-reset');
    }, 1000);
  };

  const handleBackToLogin = () => {
    onStateChange('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">X</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">xtrawrkx</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/signup" className="text-gray-600 hover:text-gray-900 font-medium">
              Sign Up
            </a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Main forgot password card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Forgot your password?</h2>
              <p className="text-sm text-gray-600">
                Enter your email address to reset your password. We&apos;ll send you a link.
              </p>
            </div>

            <form onSubmit={handleSendReset} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Request'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              <button
                onClick={handleBackToLogin}
                className="text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-50 py-4 text-center text-xs text-gray-500 border-t border-gray-200">
        <div className="flex flex-wrap justify-center items-center gap-4">
          <span>© 2024 xtrawrkx</span>
          <a href="/terms" className="hover:text-gray-700 transition-colors duration-200">
            Terms of Service
          </a>
          <a href="/privacy" className="hover:text-gray-700 transition-colors duration-200">
            Privacy Policy
          </a>
          <a href="/support" className="hover:text-gray-700 transition-colors duration-200">
            Support
          </a>
          <div className="inline-flex items-center cursor-pointer hover:text-gray-700 transition-colors duration-200">
            <span>🌐 English</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordRequest;
