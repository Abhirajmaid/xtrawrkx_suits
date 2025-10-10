"use client";

import { useEffect, useRef } from "react";
import { Card } from "./Card";

export default function BaseModal({
  isOpen,
  onClose,
  size = "small",
  children,
  className = "",
}) {
  const modalRef = useRef(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus the modal container for accessibility
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle modal click (prevent closing when clicking inside modal)
  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    small: "max-w-md",
    big: "max-w-2xl",
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <Card
        ref={modalRef}
        glass={true}
        className={`w-full ${sizeClasses[size]} bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl max-h-[90vh] flex flex-col ${className}`}
        onClick={handleModalClick}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {children}
      </Card>
    </div>
  );
}
