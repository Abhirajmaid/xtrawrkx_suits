"use client";

import React, { useState } from "react";
import {
  Login,
  ForgotPasswordRequest,
  ForgotPasswordReset,
  ForgotPasswordSuccess,
} from "../../components/auth";

const AuthPage = () => {
  const [currentState, setCurrentState] = useState("login");

  const handleStateChange = (newState) => {
    setCurrentState(newState);
  };

  const renderCurrentComponent = () => {
    switch (currentState) {
      case "login":
        return <Login onStateChange={handleStateChange} />;
      case "forgot-request":
        return <ForgotPasswordRequest onStateChange={handleStateChange} />;
      case "forgot-reset":
        return <ForgotPasswordReset onStateChange={handleStateChange} />;
      case "forgot-success":
        return <ForgotPasswordSuccess onStateChange={handleStateChange} />;
      default:
        return <Login onStateChange={handleStateChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">{renderCurrentComponent()}</div>
  );
};

export default AuthPage;
