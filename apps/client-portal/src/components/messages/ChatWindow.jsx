"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import ChatMessage from "./ChatMessage";

const ChatWindow = forwardRef(({ 
  messages = [],
  currentUser = "You",
  className = "" 
}, ref) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useImperativeHandle(ref, () => ({
    scrollToTop,
    scrollToBottom
  }));

  // Only auto-scroll to bottom when new messages are added, not when project changes
  useEffect(() => {
    if (messages.length > 0) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]); // Only trigger when message count changes, not on every message change

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  if (messages.length === 0) {
    return (
      <div className={`flex-1 flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-500">Start the conversation by sending a message</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col bg-white ${className}`}>
      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center mb-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {formatDate(date)}
              </span>
            </div>
            
            {/* Messages for this date */}
            <div className="space-y-4">
              {dateMessages.map((message, index) => (
                <ChatMessage
                  key={index}
                  user={message.user}
                  avatar={message.avatar}
                  text={message.text}
                  time={message.timestamp}
                  isOwnMessage={message.user === currentUser}
                />
              ))}
            </div>
          </div>
        ))}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
});

ChatWindow.displayName = "ChatWindow";

export default ChatWindow;
