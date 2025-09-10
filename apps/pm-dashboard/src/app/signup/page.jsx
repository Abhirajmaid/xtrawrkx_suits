"use client";

import React, { useState } from 'react';
import { SignUp, SignUpPassword, SignUpOnboardingStep1, SignUpOnboardingStep2, SignUpOnboardingStep3 } from './components';

/**
 * Main Sign Up Page Component
 * 
 * This is the entry point for the signup flow. It manages the navigation between
 * different signup steps using local state. Each step is a separate component
 * that handles its own form logic and validation.
 * 
 * Navigation Flow:
 * 1. SignUp (email entry + social login options)
 * 2. SignUpPassword (password creation)
 * 3. SignUpOnboardingStep1 (role selection and onboarding)
 * 
 * State Management:
 * - currentStep: tracks which step the user is on
 * - formData: stores user data across steps for persistence
 */
export default function SignUpPage() {
  // Current step in the signup flow
  const [currentStep, setCurrentStep] = useState('signup');
  
  // Form data that persists across steps
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    primaryRole: '',
    selectedRole: ''
  });

  /**
   * Handle progression to the next step
   * Updates both the current step and stores form data
   * 
   * @param {Object} data - Form data from the current step
   */
  const handleNextStep = (data) => {
    // Update form data with new information
    setFormData(prev => ({ ...prev, ...data }));
    
    // Navigate to next step based on current position
    if (currentStep === 'signup') {
      setCurrentStep('password');
    } else if (currentStep === 'password') {
      setCurrentStep('onboarding');
    } else if (currentStep === 'onboarding') {
      setCurrentStep('onboarding2');
    } else if (currentStep === 'onboarding2') {
      setCurrentStep('onboarding3');
    } else if (currentStep === 'onboarding3') {
      // Here you would typically redirect to dashboard or complete signup
      console.log('Signup completed with data:', { ...formData, ...data });
      alert('Welcome to Xtrawrkx! Setup completed successfully!');
    }
  };

  /**
   * Handle skip action (primarily for onboarding step)
   * Allows users to skip optional steps
   */
  const handleSkip = () => {
    if (currentStep === 'onboarding') {
      setCurrentStep('onboarding2');
    } else if (currentStep === 'onboarding2') {
      setCurrentStep('onboarding3');
    } else if (currentStep === 'onboarding3') {
      console.log('Onboarding skipped');
      alert('Welcome to Xtrawrkx! Setup completed.');
    }
  };

  /**
   * Render the appropriate component based on current step
   * Each component receives the necessary props for form handling
   */
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'signup':
        return (
          <SignUp 
            onContinue={handleNextStep}
            initialEmail={formData.email}
          />
        );
      
      case 'password':
        return (
          <SignUpPassword 
            email={formData.email}
            onContinue={handleNextStep}
            onBack={() => setCurrentStep('signup')}
          />
        );
      
      case 'onboarding':
        return (
          <SignUpOnboardingStep1 
            onContinue={handleNextStep}
            onSkip={handleSkip}
            onBack={() => setCurrentStep('password')}
          />
        );
      
      case 'onboarding2':
        return (
          <SignUpOnboardingStep2 
            onContinue={handleNextStep}
            onSkip={handleSkip}
            onBack={() => setCurrentStep('onboarding')}
          />
        );
      
      case 'onboarding3':
        return (
          <SignUpOnboardingStep3 
            onContinue={handleNextStep}
            onSkip={handleSkip}
            onBack={() => setCurrentStep('onboarding2')}
          />
        );
      
      default:
        return (
          <SignUp 
            onContinue={handleNextStep}
            initialEmail={formData.email}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentStep()}
    </div>
  );
}
