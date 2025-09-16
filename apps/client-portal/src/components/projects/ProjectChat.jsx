"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export default function ProjectChat({ messages }) {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Placeholder for sending message
      console.log('Sending message:', newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Project Chat</h2>
        <p className="text-sm text-gray-500">Real-time discussions</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isMine 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{message.sender}</span>
                  <span className="text-xs opacity-75">{message.time}</span>
                </div>
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <Button 
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 px-6"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
