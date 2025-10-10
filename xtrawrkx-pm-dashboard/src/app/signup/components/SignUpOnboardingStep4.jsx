import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

const SignUpOnboardingStep4 = ({ onContinue, onSkip, onBack }) => {
  const [projectName, setProjectName] = useState('');
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTask();
    }
  };

  const removeTask = (indexToRemove) => {
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
  };

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onContinue) {
        onContinue({
          projectName,
          tasks,
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
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Let's setup your first project</h2>
              <p className="text-sm text-gray-600">
                What's you and your team are currently working on?
              </p>
            </div>

            <div className="space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="Yellow Branding"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                />
              </div>

              {/* Add Tasks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Tasks
                </label>
                
                {/* Display existing tasks */}
                {tasks.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {tasks.map((task, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">{task}</span>
                        <button
                          onClick={() => removeTask(index)}
                          className="text-gray-400 hover:text-red-500 text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Task input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  />
                  <button
                    onClick={handleAddTask}
                    disabled={!newTask.trim()}
                    className="flex items-center space-x-1 px-4 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Task</span>
                  </button>
                </div>
              </div>

              {/* Sample tasks hint */}
              {tasks.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-2">Example tasks you might add:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Moodboard</li>
                      <li>• Logo Options</li>
                      <li>• Color Palette</li>
                      <li>• Typography Selection</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={handleSkip}
                disabled={isLoading}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Skip
              </button>
              <button
                onClick={handleGetStarted}
                disabled={isLoading || !projectName.trim()}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Setting up...' : 'Get Started'}
              </button>
            </div>

            {/* Progress indicator */}
            <div className="text-center mt-8">
              <p className="text-xs text-gray-500">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs mr-1">
                  4
                </span>
                4 of 4 steps to onboarding you with xtrawrkx
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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

export default SignUpOnboardingStep4;
