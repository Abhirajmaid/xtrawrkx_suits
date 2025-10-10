import React, { useState } from 'react';
import { Eye, EyeOff, ChevronDown, ArrowLeft } from 'lucide-react';

const SignUpPassword = ({ email = "user@example.com", onContinue, onBack }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false
  });

  const validatePassword = (pwd) => {
    return {
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
  };

  const getPasswordStrength = () => {
    const validation = validatePassword(password);
    return Object.values(validation).filter(Boolean).length;
  };

  const getPasswordStrengthDisplay = () => {
    const strength = getPasswordStrength();
    
    if (strength === 0) return { color: 'text-gray-400', text: '' };
    if (strength <= 2) return { color: 'text-red-500', text: 'Weak' };
    if (strength <= 3) return { color: 'text-yellow-500', text: 'Fair' };
    if (strength <= 4) return { color: 'text-blue-500', text: 'Good' };
    return { color: 'text-green-500', text: 'Strong' };
  };

  const passwordsMatch = () => {
    return password === confirmPassword;
  };

  const isFormValid = () => {
    const validation = validatePassword(password);
    const allRequirementsMet = Object.values(validation).every(Boolean);
    return allRequirementsMet && passwordsMatch() && password.length > 0;
  };

  const handleContinue = async () => {
    if (!isFormValid()) {
      setTouched({ password: true, confirmPassword: true });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (onContinue) {
        onContinue({ 
          email,
          passwordCreated: true,
          timestamp: new Date().toISOString()
        });
      }
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validation = validatePassword(password);
  const strengthDisplay = getPasswordStrengthDisplay();

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
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              {onBack && (
                <div className="flex justify-start mb-4">
                  <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to xtrawrkx</h2>
              <p className="text-sm text-gray-600">
                By continuing, I agree to the <a href="/privacy" className="text-blue-600 hover:underline">XTRAWRKX Privacy Policy</a> and <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is your email address?
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onBlur={() => handleBlur('password')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Must be at least 8 characters</p>
                    {password.length > 0 && (
                      <p className={`text-xs font-medium ${strengthDisplay.color}`}>
                        {strengthDisplay.text}
                      </p>
                    )}
                  </div>
                  
                  {touched.password && password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className={`text-xs flex items-center ${validation.minLength ? 'text-green-600' : 'text-red-500'}`}>
                        <span className="mr-2">{validation.minLength ? '✓' : '✗'}</span>
                        At least 8 characters
                      </div>
                      <div className={`text-xs flex items-center ${validation.hasUpperCase ? 'text-green-600' : 'text-red-500'}`}>
                        <span className="mr-2">{validation.hasUpperCase ? '✓' : '✗'}</span>
                        One uppercase letter
                      </div>
                      <div className={`text-xs flex items-center ${validation.hasLowerCase ? 'text-green-600' : 'text-red-500'}`}>
                        <span className="mr-2">{validation.hasLowerCase ? '✓' : '✗'}</span>
                        One lowercase letter
                      </div>
                      <div className={`text-xs flex items-center ${validation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                        <span className="mr-2">{validation.hasNumber ? '✓' : '✗'}</span>
                        One number
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onBlur={() => handleBlur('confirmPassword')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {touched.confirmPassword && confirmPassword.length > 0 && (
                  <div className="mt-1">
                    {passwordsMatch() ? (
                      <p className="text-xs text-green-600 flex items-center">
                        <span className="mr-2">✓</span>
                        Passwords match
                      </p>
                    ) : (
                      <p className="text-xs text-red-500 flex items-center">
                        <span className="mr-2">✗</span>
                        Passwords do not match
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleContinue}
                disabled={isLoading || !isFormValid()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Continue'}
              </button>
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

export default SignUpPassword;