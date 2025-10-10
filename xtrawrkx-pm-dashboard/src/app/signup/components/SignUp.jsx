import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaApple, FaGoogle } from 'react-icons/fa';

const SignUp = ({ onContinue, initialEmail = '' }) => {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState({
    email: false,
    apple: false,
    google: false
  });

  const handleEmailSignUp = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(prev => ({ ...prev, email: true }));
    
    setTimeout(() => {
      setIsLoading(prev => ({ ...prev, email: false }));
      
      if (onContinue) {
        onContinue({ email, signupMethod: 'email' });
      }
    }, 500);
  };

  const handleAppleSignUp = async () => {
    setIsLoading(prev => ({ ...prev, apple: true }));
    
    setTimeout(() => {
      setIsLoading(prev => ({ ...prev, apple: false }));
      
      const appleUserData = {
        email: 'user@icloud.com',
        signupMethod: 'apple',
        firstName: 'John',
        lastName: 'Doe'
      };
      
      if (onContinue) {
        onContinue(appleUserData);
      }
    }, 1000);
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(prev => ({ ...prev, google: true }));
    
    setTimeout(() => {
      setIsLoading(prev => ({ ...prev, google: false }));
      
      const googleUserData = {
        email: 'user@gmail.com',
        signupMethod: 'google',
        firstName: 'John',
        lastName: 'Doe'
      };
      
      if (onContinue) {
        onContinue(googleUserData);
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEmailSignUp();
    }
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
            <a href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Login
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
          {/* Main signup card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign Up</h2>
              <p className="text-sm text-gray-600">
                By signing up, I agree to the <a href="/privacy" className="text-blue-600 hover:underline">XTRAWRKX Privacy Policy</a> and <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  disabled={isLoading.email}
                />
              </div>

              <button
                onClick={handleEmailSignUp}
                disabled={isLoading.email || !email}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading.email ? 'Please wait...' : 'Sign up with Email'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAppleSignUp}
                  disabled={isLoading.apple}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaApple className="mr-2 text-lg" />
                  {isLoading.apple ? 'Connecting...' : 'Continue with Apple'}
                </button>
                
                <button
                  onClick={handleGoogleSignUp}
                  disabled={isLoading.google}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaGoogle className="mr-2 text-lg text-red-500" />
                  {isLoading.google ? 'Connecting...' : 'Continue with Google'}
                </button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-50 py-4 text-center text-xs text-gray-500 border-t border-gray-200">
        <div className="flex flex-wrap justify-center items-center gap-4">
          <span>© 2025
             xtrawrkx</span>
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

export default SignUp;