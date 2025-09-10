import React, { useState } from 'react';
import { ChevronDown, ArrowLeft, Lock } from 'lucide-react';

const SignUpOnboardingStep1 = ({ onContinue, onSkip, onBack }) => {
  const [primaryRole, setPrimaryRole] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableRoles = [
    'Developer',
    'Designer', 
    'Marketing',
    'PM',
    'Operations',
    'Sales',
    'Support',
    'QA',
    'DevOps',
    'Data Analyst',
    'Product Owner',
    'Scrum Master',
    'Other'
  ];

  const toggleRole = (role) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      } else {
        if (prev.length < 5) {
          return [...prev, role];
        }
        return prev;
      }
    });
  };

  const handleContinue = async () => {
    if (!primaryRole) {
      alert('Please select your primary role to continue');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (onContinue) {
        onContinue({
          primaryRole,
          selectedRoles,
          onboardingCompleted: true,
          timestamp: new Date().toISOString()
        });
      }
    }, 1000);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip({
        onboardingSkipped: true,
        timestamp: new Date().toISOString()
      });
    }
  };

  const canProceed = () => {
    return primaryRole.length > 0;
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
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us a little bit about you, Jonathan
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                This helps us customize your dashboard experience
              </p>
              <p className="text-sm text-gray-600">
                By continuing, I agree to the <a href="/privacy" className="text-blue-600 hover:underline">XTRAWRKX Privacy Policy</a> and <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What's your primary role? *
                </label>
                <div className="relative">
                  <select
                    value={primaryRole}
                    onChange={(e) => setPrimaryRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all duration-200"
                    required
                  >
                    <option value="">Select your primary role</option>
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What best describes you? (Select up to 5)
                </label>
                
                <div className="flex flex-wrap gap-2">
                  {availableRoles.map((role) => {
                    const isSelected = selectedRoles.includes(role);
                    const isPrimary = primaryRole === role;
                    
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        disabled={!isSelected && selectedRoles.length >= 5}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                          isSelected
                            ? isPrimary
                              ? 'bg-blue-100 text-blue-800 border-blue-300 ring-2 ring-blue-200'
                              : 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                      >
                        {role}
                        {isPrimary && <span className="ml-1 text-xs">(Primary)</span>}
                      </button>
                    );
                  })}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {selectedRoles.length}/5 roles
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700 flex items-center">
                  <span className="mr-2">💡</span>
                  We'll use this information to show you relevant features and templates
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Please wait...' : 'Skip'}
                </button>
                
                <button
                  onClick={handleContinue}
                  disabled={isLoading || !canProceed()}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Setting up...' : 'Continue'}
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center">
                <Lock className="w-3 h-3 mr-1" />
                All of this info can be changed later in settings
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

export default SignUpOnboardingStep1;