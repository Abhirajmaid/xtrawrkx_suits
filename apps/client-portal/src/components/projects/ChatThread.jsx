"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Users
} from "lucide-react";

export default function ChatThread({ 
  messages = [],
  onSendMessage,
  currentUser = "You",
  className = "" 
}) {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateObj.toDateString() === today.toDateString()) {
      return "Today";
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (onSendMessage) {
      onSendMessage({
        text: newMessage,
        timestamp: new Date().toISOString(),
        type: "text",
      });
    }
    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className={`bg-white rounded-xl border border-neutral-200 flex flex-col h-96 ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">P</span>
          </div>
          <div>
            <h4 className="font-medium text-neutral-900">Project Chat</h4>
            <p className="text-xs text-gray-500">3 members online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Users className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">Start the conversation</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center mb-4">
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>
              
              {/* Messages for this date */}
              {dateMessages.map((message, index) => {
                const isCurrentUser = message.user === currentUser;
                const showAvatar = index === 0 || dateMessages[index - 1].user !== message.user;
                
                return (
                  <div key={index} className={`flex gap-3 ${isCurrentUser ? 'justify-end' : ''}`}>
                    {/* Avatar */}
                    {!isCurrentUser && (
                      <div className={`w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 ${!showAvatar ? 'invisible' : ''}`}>
                        <span className="text-white text-xs font-semibold">
                          {message.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* Message Content */}
                    <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-first' : ''}`}>
                      {!isCurrentUser && showAvatar && (
                        <span className="text-xs text-gray-500 mb-1 block">{message.user}</span>
                      )}
                      <div className={`rounded-lg px-3 py-2 ${
                        isCurrentUser 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Current User Avatar */}
                    {isCurrentUser && (
                      <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">
                          {message.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">S</span>
            </div>
            <span>Sarah is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-neutral-200">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="flex-1 flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
