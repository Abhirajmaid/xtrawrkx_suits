"use client";

import React, { useState } from 'react';
import { SignUp, SignUpPassword, SignUpOnboardingStep1 } from '../signup/components';

export default function SignUpDemoPage() {
  const [currentStep, setCurrentStep] = useState('signup');
  const [userData, setUserData] = useState({});

  const handleStepChange = (data) => {
    setUserData(prev => ({ ...prev, ...data }));
    if (data.step) {
      setCurrentStep(data.step);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'signup':
        return <SignUp onContinue={(data) => { setUserData(data); setCurrentStep('password'); }} />;
      case 'password':
        return <SignUpPassword email={userData.email} onContinue={(data) => { setUserData(prev => ({...prev, ...data})); setCurrentStep('onboarding'); }} />;
      case 'onboarding':
        return <SignUpOnboardingStep1 onContinue={() => setCurrentStep('complete')} onSkip={() => setCurrentStep('complete')} />;
      case 'complete':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome!</h2>
              <button onClick={() => setCurrentStep('signup')} className="bg-blue-600 text-white py-2 px-4 rounded-lg">
                Start Over
              </button>
            </div>
          </div>
        );
      default:
        return <SignUp onContinue={(data) => { setUserData(data); setCurrentStep('password'); }} />;
    }
  };

  return (
    <div>
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4">
        <h3 className="font-bold mb-2">Demo Controls</h3>
        <div className="space-x-2">
          <button onClick={() => setCurrentStep('signup')} className={`px-3 py-1 rounded text-sm ${currentStep === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Step 1</button>
          <button onClick={() => setCurrentStep('password')} className={`px-3 py-1 rounded text-sm ${currentStep === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Step 2</button>
          <button onClick={() => setCurrentStep('onboarding')} className={`px-3 py-1 rounded text-sm ${currentStep === 'onboarding' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Step 3</button>
        </div>
      </div>
      {renderCurrentStep()}
    </div>
  );
}
