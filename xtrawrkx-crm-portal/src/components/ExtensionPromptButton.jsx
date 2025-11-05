"use client";

import { useState } from "react";
import { Chrome } from "lucide-react";
import ExtensionDownloadModal from "./ExtensionDownloadModal";

export default function ExtensionPromptButton() {
  const [showModal, setShowModal] = useState(false);

  // Check if extension is installed
  const isExtensionInstalled = () => {
    return window.xtrawrkxExtensionInstalled === true;
  };

  // Don't show button if extension is already installed
  if (isExtensionInstalled()) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-brand-primary rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 group shadow-lg"
        title="Get LinkedIn Extension"
      >
        <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      <ExtensionDownloadModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}

