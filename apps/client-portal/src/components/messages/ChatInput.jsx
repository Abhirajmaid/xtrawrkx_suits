"use client";

import { useState } from "react";
import { Send, Smile, Paperclip } from "lucide-react";

export default function ChatInput({ 
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  className = "" 
}) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    if (onSend) {
      onSend({
        text: message,
        timestamp: new Date().toISOString(),
        type: "text",
      });
    }
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiClick = () => {
    // This would open an emoji picker
    console.log("Emoji picker clicked");
  };

  const handleAttachmentClick = () => {
    // This would open file picker
    console.log("Attachment clicked");
  };

  return (
    <div className={`bg-white border-t border-gray-200 p-4 ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* Attachment Button */}
        <button
          type="button"
          onClick={handleAttachmentClick}
          disabled={disabled}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          
          {/* Emoji Button */}
          <button
            type="button"
            onClick={handleEmojiClick}
            disabled={disabled}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Smile className="w-4 h-4" />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
