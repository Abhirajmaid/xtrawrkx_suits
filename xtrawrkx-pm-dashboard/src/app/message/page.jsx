"use client";

import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Paperclip,
  Smile,
  Send,
  MoreHorizontal,
} from "lucide-react";
import { Card } from "../../components/ui";
import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";

export default function Message() {
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [newMessage, setNewMessage] = useState("");

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      name: "Jane Cooper",
      lastMessage: "I was thinking a subtle blue or green coul...",
      time: "3 min ago",
      initials: "JC",
      avatar: null,
      unread: false,
    },
    {
      id: 2,
      name: "Susan Drake",
      lastMessage: "Hi Jonathan, please check this and mak...",
      time: "3 min ago",
      initials: "SD",
      avatar: null,
      unread: true,
    },
    {
      id: 3,
      name: "Ronald Richards",
      lastMessage: "Thanks!",
      time: "3 min ago",
      initials: "RR",
      avatar: null,
      unread: false,
    },
    {
      id: 4,
      name: "Mark Atenson",
      lastMessage: "Thats good bro!",
      time: "3 min ago",
      initials: "MA",
      avatar: null,
      unread: false,
    },
  ];

  // Mock data for current conversation messages
  const messages = [
    {
      id: 1,
      sender: "Jane Cooper",
      content: "Hi Jonathan",
      time: "Jan 27, 2024",
      isMe: false,
      avatar: "JC",
    },
    {
      id: 2,
      sender: "Jane Cooper",
      content:
        "I wanted to chat about the new landing page design project. Have you had a chance to review the initial concepts?",
      time: "Jan 27, 2024",
      isMe: false,
      avatar: "JC",
    },
    {
      id: 3,
      sender: "Jonathan Bustos",
      content: "Hi Jane! I'm good",
      time: "Jan 27, 2024",
      isMe: true,
      avatar: "JB",
    },
    {
      id: 4,
      sender: "Jonathan Bustos",
      content:
        "Yes, I've taken a look at the concepts. Overall, they're solid, but I have a few thoughts.",
      time: "Jan 27, 2024",
      isMe: true,
      avatar: "JB",
    },
    {
      id: 5,
      sender: "Jonathan Bustos",
      content:
        "Firstly, I think the color scheme could use a bit more contrast. It feels a bit monotone right now. What do you think?",
      time: "Jan 27, 2024",
      isMe: true,
      avatar: "JB",
    },
    {
      id: 6,
      sender: "Jane Cooper",
      content:
        "I see your point. Maybe we can introduce a secondary color to make certain elements pop. What color palette are you thinking?",
      time: "Jan 27, 2024",
      isMe: false,
      avatar: "JC",
    },
    {
      id: 7,
      sender: "Jonathan Bustos",
      content:
        "I was thinking a subtle blue or green could complement the existing colors without being too overpowering. What are your thoughts on that?",
      time: "Jan 27, 2024",
      isMe: true,
      avatar: "JB",
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add logic to send message
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <PageHeader
          title="Messages"
          subtitle="Communicate with your team members"
          breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Messages", href: "/message" }]}
          showSearch={true}
          showActions={false}
        />
      </div>
      <div className="flex-1 flex space-x-6 px-6 pb-6">
        {/* Left Sidebar - Conversations List */}
        <div className="w-80 space-y-4">
          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-foreground">
                Message
              </h2>
              <button className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                <Filter className="w-4 h-4 text-brand-text-light" />
                <ChevronDown className="w-4 h-4 text-brand-text-light" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-light" />
              <input
                type="text"
                placeholder="Search message or name"
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary focus:bg-white/15 transition-all duration-300 placeholder:text-brand-text-light"
              />
            </div>
          </div>

          {/* Conversations List */}
          <Card glass={true} className="p-0 overflow-hidden">
            <div className="divide-y divide-white/10">
              {conversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(index)}
                  className={`p-4 cursor-pointer transition-colors duration-200 ${
                    selectedConversation === index
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {conversation.initials}
                      </div>
                      {conversation.unread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-brand-foreground truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-brand-text-light">
                          {conversation.time}
                        </span>
                      </div>
                      <p className="text-sm text-brand-text-light truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side - Chat Interface */}
        <div className="flex-1 flex flex-col">
          <Card
            glass={true}
            className="flex-1 flex flex-col p-0 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  JC
                </div>
                <div>
                  <h3 className="font-semibold text-brand-foreground">
                    Message Jane Cooper
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                  <Plus className="w-4 h-4 text-brand-text-light" />
                  <span className="text-sm text-brand-foreground">
                    Attach Task
                  </span>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isMe ? "justify-end" : "justify-start"}`}
                >
                  {!message.isMe && (
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-xs mt-1">
                      {message.avatar}
                    </div>
                  )}

                  <div
                    className={`max-w-md ${message.isMe ? "order-first" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-brand-foreground">
                        {message.sender}
                      </span>
                      <span className="text-xs text-brand-text-light">
                        {message.time}
                      </span>
                      {message.isMe && (
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">
                            JB
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-xl ${
                        message.isMe
                          ? "bg-blue-500 text-white ml-auto"
                          : "bg-white/15 text-brand-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>

                  {message.isMe && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs mt-1">
                      {message.avatar}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">JB</span>
                </div>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Write a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary focus:bg-white/15 transition-all duration-300 placeholder:text-brand-text-light pr-20"
                  />

                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <button className="p-1 hover:bg-white/20 rounded transition-colors">
                      <Paperclip className="w-4 h-4 text-brand-text-light" />
                    </button>
                    <button className="p-1 hover:bg-white/20 rounded transition-colors">
                      <Smile className="w-4 h-4 text-brand-text-light" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
                >
                  Send Message
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
