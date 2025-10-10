"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { formatDistanceToNow } from "date-fns";

export function MessageList({ messages }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">💬</span>
          </div>
          <p className="text-gray-500">No messages yet</p>
          <p className="text-sm text-gray-400">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          message={message}
          isLast={index === messages.length - 1}
        />
      ))}
    </div>
  );
}

function MessageItem({ message, isLast }) {
  const isClient = message.sender === "client";
  const isTeam = message.sender === "team";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isClient ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-end space-x-2 max-w-[70%] ${isClient ? "flex-row-reverse space-x-reverse" : ""}`}
      >
        {/* Avatar for team messages */}
        {isTeam && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src="/images/team-avatar.png" />
            <AvatarFallback>XT</AvatarFallback>
          </Avatar>
        )}

        {/* Message bubble */}
        <div
          className={`relative px-4 py-2 rounded-2xl ${
            isClient
              ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          {/* Message text */}
          <p className="text-sm leading-relaxed">{message.text}</p>

          {/* Message timestamp */}
          <div
            className={`text-xs mt-1 ${
              isClient ? "text-pink-100" : "text-gray-500"
            }`}
          >
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </div>

          {/* Message status indicator for client messages */}
          {isClient && (
            <div className="absolute -bottom-1 -right-1">
              <MessageStatus status={message.status} />
            </div>
          )}

          {/* Message tail */}
          <div
            className={`absolute bottom-0 ${
              isClient ? "right-0 translate-x-1" : "left-0 -translate-x-1"
            }`}
          >
            <div
              className={`w-3 h-3 transform rotate-45 ${
                isClient
                  ? "bg-gradient-to-r from-pink-500 to-red-500"
                  : "bg-gray-100"
              }`}
            />
          </div>
        </div>

        {/* Avatar for client messages */}
        {isClient && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src="/images/client-avatar.png" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        )}
      </div>
    </motion.div>
  );
}

function MessageStatus({ status }) {
  const getStatusIcon = () => {
    switch (status) {
      case "sending":
        return (
          <div className="w-3 h-3 border border-pink-200 border-t-pink-500 rounded-full animate-spin" />
        );
      case "sent":
        return (
          <div className="w-3 h-3 bg-pink-200 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
          </div>
        );
      case "delivered":
        return (
          <div className="w-3 h-3 bg-pink-200 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
          </div>
        );
      case "read":
        return (
          <div className="w-3 h-3 bg-pink-200 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
          </div>
        );
      default:
        return null;
    }
  };

  return getStatusIcon();
}
