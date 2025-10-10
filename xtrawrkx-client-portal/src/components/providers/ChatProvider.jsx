"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRealTimeChat } from "@/hooks/useRealTimeChat";

const ChatContext = createContext();

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Real-time chat functionality
  const {
    initializeConnection,
    sendMessage: wsSendMessage,
    joinConversation,
    leaveConversation,
    setTypingStatus,
    addEventListener,
    removeEventListener,
  } = useRealTimeChat();

  // Initialize with mock data
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        name: "Gabriel Matuła",
        role: "Project Manager",
        lastMessage: "Thanks for the feedback on the designs!",
        time: "2 min ago",
        unread: 3,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        isOnline: true,
        isPinned: true,
      },
      {
        id: 2,
        name: "Layla Amora",
        role: "Design Lead",
        lastMessage: "The wireframes look great, let's proceed",
        time: "1 hour ago",
        unread: 0,
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b47e?w=40&h=40&fit=crop&crop=face",
        isOnline: false,
        isPinned: false,
      },
      {
        id: 3,
        name: "Ansel Finn",
        role: "Developer",
        lastMessage: "SEO optimization is complete",
        time: "3 hours ago",
        unread: 1,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        isOnline: true,
        isPinned: false,
      },
      {
        id: 4,
        name: "Support Team",
        role: "Customer Support",
        lastMessage: "Your issue has been resolved",
        time: "1 day ago",
        unread: 0,
        avatar:
          "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face",
        isOnline: true,
        isPinned: true,
      },
    ];

    setConversations(mockConversations);

    // Initialize messages for each conversation
    const initialMessages = {};
    mockConversations.forEach((conv) => {
      initialMessages[conv.id] = [
        {
          id: Date.now() + Math.random(),
          text: conv.lastMessage,
          sender: "team",
          timestamp: new Date(),
          status: "received",
        },
      ];
    });
    setMessages(initialMessages);

    // Calculate initial unread count
    const totalUnread = mockConversations.reduce(
      (sum, conv) => sum + conv.unread,
      0
    );
    setUnreadCount(totalUnread);

    // Initialize WebSocket connection
    initializeConnection("client-user-123");
  }, [initializeConnection]);

  // Set up real-time event listeners
  useEffect(() => {
    const handleNewMessage = (data) => {
      const { conversationId, message } = data;

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), message],
      }));

      // Update conversation last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: message.text,
                time: "now",
                unread:
                  conv.sender === "client" ? conv.unread : conv.unread + 1,
              }
            : conv
        )
      );
    };

    const handleTypingStatus = (data) => {
      const { conversationId, isTyping: typing } = data;
      setIsTyping((prev) => ({ ...prev, [conversationId]: typing }));
    };

    const handleUserOnline = (data) => {
      setOnlineUsers((prev) => new Set([...prev, data.userId]));
    };

    const handleUserOffline = (data) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    };

    // Add event listeners
    addEventListener("newMessage", handleNewMessage);
    addEventListener("typingStatus", handleTypingStatus);
    addEventListener("userOnline", handleUserOnline);
    addEventListener("userOffline", handleUserOffline);

    // Cleanup event listeners
    return () => {
      removeEventListener("newMessage", handleNewMessage);
      removeEventListener("typingStatus", handleTypingStatus);
      removeEventListener("userOnline", handleUserOnline);
      removeEventListener("userOffline", handleUserOffline);
    };
  }, [addEventListener, removeEventListener]);

  // Send message
  const sendMessage = useCallback(
    async (conversationId, messageText, attachments = []) => {
      if (!messageText.trim() && attachments.length === 0) return;

      const newMessage = {
        id: Date.now(),
        text: messageText,
        sender: "client",
        timestamp: new Date(),
        attachments,
        status: "sending",
      };

      // Add message to conversation
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMessage],
      }));

      // Update conversation last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: messageText,
                time: "now",
                unread:
                  conv.sender === "client" ? conv.unread : conv.unread + 1,
              }
            : conv
        )
      );

      // Send via WebSocket
      wsSendMessage(conversationId, newMessage);

      // Update message status to sent
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [conversationId]: prev[conversationId].map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
          ),
        }));
      }, 1000);
    },
    [wsSendMessage]
  );

  // Generate contextual team responses
  const generateTeamResponse = (message) => {
    const responses = [
      "Thank you for your message! We'll get back to you shortly.",
      "I understand your concern. Let me check on that for you.",
      "That's a great question! Let me provide you with more details.",
      "I'll look into this and update you as soon as possible.",
      "Thanks for bringing this to our attention. We're on it!",
      "I can help you with that. Let me gather the information you need.",
      "Perfect! I'll make sure this gets handled right away.",
      "I appreciate your patience. We're working on this for you.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Mark conversation as read
  const markAsRead = useCallback((conversationId) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      )
    );
  }, []);

  // Get messages for a conversation
  const getMessages = useCallback(
    (conversationId) => {
      return messages[conversationId] || [];
    },
    [messages]
  );

  // Get unread count for a conversation
  const getUnreadCount = useCallback(
    (conversationId) => {
      const conversation = conversations.find(
        (conv) => conv.id === conversationId
      );
      return conversation?.unread || 0;
    },
    [conversations]
  );

  // Check if user is typing
  const isUserTyping = useCallback(
    (conversationId) => {
      return isTyping[conversationId] || false;
    },
    [isTyping]
  );

  // Update conversation
  const updateConversation = useCallback((conversationId, updates) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, ...updates } : conv
      )
    );
  }, []);

  // Add new conversation
  const addConversation = useCallback((conversation) => {
    setConversations((prev) => [...prev, conversation]);
    setMessages((prev) => ({
      ...prev,
      [conversation.id]: [],
    }));
  }, []);

  // Remove conversation
  const removeConversation = useCallback((conversationId) => {
    setConversations((prev) =>
      prev.filter((conv) => conv.id !== conversationId)
    );
    setMessages((prev) => {
      const newMessages = { ...prev };
      delete newMessages[conversationId];
      return newMessages;
    });
  }, []);

  // Calculate total unread count
  useEffect(() => {
    const totalUnread = conversations.reduce(
      (sum, conv) => sum + conv.unread,
      0
    );
    setUnreadCount(totalUnread);
  }, [conversations]);

  const value = {
    conversations,
    activeConversation,
    messages,
    unreadCount,
    isTyping,
    onlineUsers,
    setActiveConversation,
    sendMessage,
    markAsRead,
    getMessages,
    getUnreadCount,
    isUserTyping,
    updateConversation,
    addConversation,
    removeConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
