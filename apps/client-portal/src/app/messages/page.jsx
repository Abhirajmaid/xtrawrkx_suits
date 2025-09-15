"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ProjectChatList,
  ChatWindow,
  ChatInput,
} from "@/components/messages";

export default function MessagesPage() {
  const [activeProjectId, setActiveProjectId] = useState(1);
  const chatWindowRef = useRef(null);

  // Mock projects data
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      unreadCount: 3,
      lastMessage: {
        text: "The wireframes look great! When can we start development?",
        timestamp: "2024-01-15T10:30:00Z",
        user: "Sarah Johnson",
      },
    },
    {
      id: 2,
      name: "Mobile App Development",
      unreadCount: 0,
      lastMessage: {
        text: "I've finished the user authentication flow",
        timestamp: "2024-01-15T09:15:00Z",
        user: "Mike Chen",
      },
    },
    {
      id: 3,
      name: "Brand Identity",
      unreadCount: 1,
      lastMessage: {
        text: "The logo concepts are ready for review",
        timestamp: "2024-01-14T16:45:00Z",
        user: "Emma Wilson",
      },
    },
    {
      id: 4,
      name: "Marketing Campaign",
      unreadCount: 0,
      lastMessage: {
        text: "Let's schedule a meeting to discuss the strategy",
        timestamp: "2024-01-14T14:20:00Z",
        user: "John Doe",
      },
    },
  ];

  // Mock messages data for each project
  const projectMessages = {
    1: [
      {
        id: 1,
        user: "Sarah Johnson",
        avatar: null,
        text: "Hey team! I've reviewed the wireframes and they look amazing. Great work!",
        timestamp: "2024-01-15T08:00:00Z",
      },
      {
        id: 2,
        user: "You",
        avatar: null,
        text: "Thanks Sarah! I'm glad you like them. We can start development next week.",
        timestamp: "2024-01-15T08:15:00Z",
      },
      {
        id: 3,
        user: "Mike Chen",
        avatar: null,
        text: "I'm ready to start on the frontend components. Should I begin with the header?",
        timestamp: "2024-01-15T08:30:00Z",
      },
      {
        id: 4,
        user: "Sarah Johnson",
        avatar: null,
        text: "Yes, that sounds good. The header should be responsive and include the navigation menu.",
        timestamp: "2024-01-15T09:00:00Z",
      },
      {
        id: 5,
        user: "You",
        avatar: null,
        text: "Perfect! I'll create a detailed component breakdown for you.",
        timestamp: "2024-01-15T09:15:00Z",
      },
      {
        id: 6,
        user: "Sarah Johnson",
        avatar: null,
        text: "The wireframes look great! When can we start development?",
        timestamp: "2024-01-15T10:30:00Z",
      },
    ],
    2: [
      {
        id: 1,
        user: "Mike Chen",
        avatar: null,
        text: "I've finished the user authentication flow. Ready for testing!",
        timestamp: "2024-01-15T09:15:00Z",
      },
      {
        id: 2,
        user: "You",
        avatar: null,
        text: "Excellent work! Can you also add password reset functionality?",
        timestamp: "2024-01-15T09:30:00Z",
      },
      {
        id: 3,
        user: "Mike Chen",
        avatar: null,
        text: "Sure! I'll add that feature today.",
        timestamp: "2024-01-15T09:45:00Z",
      },
    ],
    3: [
      {
        id: 1,
        user: "Emma Wilson",
        avatar: null,
        text: "I've created three logo concepts. Let me know which direction you prefer.",
        timestamp: "2024-01-14T16:45:00Z",
      },
      {
        id: 2,
        user: "You",
        avatar: null,
        text: "I love the second concept! It's modern and clean.",
        timestamp: "2024-01-14T17:00:00Z",
      },
    ],
    4: [
      {
        id: 1,
        user: "John Doe",
        avatar: null,
        text: "Let's schedule a meeting to discuss the marketing strategy for next quarter.",
        timestamp: "2024-01-14T14:20:00Z",
      },
      {
        id: 2,
        user: "You",
        avatar: null,
        text: "Sounds good! How about next Tuesday at 2 PM?",
        timestamp: "2024-01-14T14:30:00Z",
      },
    ],
  };

  const handleProjectSelect = useCallback((projectId) => {
    setActiveProjectId(projectId);
    // Scroll to top when a new project is selected
    setTimeout(() => {
      chatWindowRef.current?.scrollToTop();
    }, 100);
  }, []);

  const handleSendMessage = useCallback((message) => {
    console.log("Sending message:", message);
    // Here you would typically send the message to your backend
    // For now, we'll just log it
  }, []);

  const currentMessages = projectMessages[activeProjectId] || [];
  const currentProject = projects.find(p => p.id === activeProjectId);

  // Ensure we start at the top when the page loads
  useEffect(() => {
    // Small delay to ensure the component is mounted
    const timer = setTimeout(() => {
      chatWindowRef.current?.scrollToTop();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-full min-h-0">
      {/* Project Chat List */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200">
        <ProjectChatList
          projects={projects}
          activeProjectId={activeProjectId}
          onProjectSelect={handleProjectSelect}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {currentProject?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{currentProject?.name}</h3>
              <p className="text-sm text-gray-500">
                {currentMessages.length} message{currentMessages.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 min-h-0">
          <ChatWindow
            ref={chatWindowRef}
            messages={currentMessages}
            currentUser="You"
          />
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0">
          <ChatInput
            onSend={handleSendMessage}
            placeholder={`Message ${currentProject?.name}...`}
          />
        </div>
      </div>
    </div>
  );
}
