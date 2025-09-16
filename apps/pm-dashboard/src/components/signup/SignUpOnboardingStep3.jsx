import React, { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const SignUpOnboardingStep3 = ({ onContinue, onSkip, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMac, setIsMac] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onContinue) {
        onContinue({
          globalSearchCompleted: true,
          step: 'complete'
        });
      }
    }, 800);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip({ step: 'complete' });
    }
  };

  const demoSearchItems = [
    'Project Alpha - Marketing Campaign',
    'Task: Review design mockups',
    'Sub-task: Update color palette',
    'Comment by John: "Looks great!"',
    'People: Sarah Johnson',
    'Document: Brand Guidelines.pdf'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Global Search</h2>
              <p className="text-sm text-gray-600 mb-8">
                Use global search to search anything you're looking for around the workspace such as project, task, sub-task, comment, people, etc.
              </p>
            </div>

            <div className="mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects, tasks, people..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-20 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">
                    {isMac ? '⌘ + F' : 'Ctrl + F'}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 text-center text-xs text-gray-500">
                Press {isMac ? '⌘ + F' : 'Ctrl + F'} to open global search from anywhere
              </div>
            </div>

            {searchTerm && (
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Search Results Demo:</h4>
                  <div className="space-y-2">
                    {demoSearchItems
                      .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
                      .slice(0, 4)
                      .map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 hover:bg-white rounded">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    {searchTerm && demoSearchItems.filter(item => 
                      item.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length === 0 && (
                      <div className="text-center text-gray-500 text-sm py-4">
                        No results found. Try searching for "project", "task", or "people"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <div className="text-blue-600 mt-0.5">💡</div>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Pro Tip:</p>
                  <p>Global search works across all your workspaces and can find content inside documents, comments, and even archived items.</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSkip}
                disabled={isLoading}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Skip
              </button>
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Completing...' : 'Continue'}
              </button>
            </div>

            <div className="text-center mt-8">
              <p className="text-xs text-gray-500">
                3 of 4 steps to onboarding you with xtrawrkx
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-50 py-4 text-center text-xs text-gray-500 border-t border-gray-200">
        <div className="flex flex-wrap justify-center items-center gap-4">
          <span>© 2024 xtrawrkx</span>
          <a href="/terms" className="hover:text-gray-700 transition-colors">
            Terms of Service
          </a>
          <a href="/privacy" className="hover:text-gray-700 transition-colors">
            Privacy Policy
          </a>
          <a href="/support" className="hover:text-gray-700 transition-colors">
            Support
          </a>
          <div className="inline-flex items-center cursor-pointer hover:text-gray-700 transition-colors">
            <span>🌐 English</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpOnboardingStep3;