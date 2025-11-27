"use client";

import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Paperclip,
  Smile,
  Send,
  MessageCircle,
} from "lucide-react";
import { Card } from "../../components/ui";
import { useState, useEffect, useRef } from "react";
import PageHeader from "../../components/shared/PageHeader";
import messageService from "../../lib/messageService";
import { useAuth } from "../../contexts/AuthContext";

export default function Message() {
  const { user, loading: authLoading } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Get current user ID
  const getCurrentUserId = () => {
    return user?.id || user?._id || user?.xtrawrkxUserId || null;
  };

  // Load conversations and users
  useEffect(() => {
    if (authLoading) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const currentUserId = getCurrentUserId();
        
        if (!currentUserId) {
          console.warn("No user ID found");
          setLoading(false);
          return;
        }

        // Load conversations and users in parallel
        const [conversationsData, usersData] = await Promise.all([
          messageService.getConversations(currentUserId),
          messageService.getUsers(),
        ]);

        setConversations(conversationsData || []);
        setAllUsers(usersData || []);

        // If there are conversations, select the first one
        if (conversationsData && conversationsData.length > 0) {
          setSelectedConversation(conversationsData[0]);
        }
      } catch (error) {
        console.error("Error loading messages data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const currentUserId = getCurrentUserId();
        if (!currentUserId || !selectedConversation.userId) return;

        const conversationMessages = await messageService.getConversationMessages(
          currentUserId,
          selectedConversation.userId
        );

        setMessages(conversationMessages || []);

        // Mark conversation as read
        await messageService.markAsRead(currentUserId, selectedConversation.userId);
        
        // Update conversation unread status
        setConversations((prev) =>
          prev.map((conv) =>
            conv.userId === selectedConversation.userId
              ? { ...conv, unread: false }
              : conv
          )
        );
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [selectedConversation, user]);

  // Real-time updates: Poll for new messages every 3 seconds
  useEffect(() => {
    if (!selectedConversation || authLoading) return;

    const pollInterval = setInterval(async () => {
      try {
        const currentUserId = getCurrentUserId();
        if (!currentUserId || !selectedConversation.userId) return;

        const conversationMessages = await messageService.getConversationMessages(
          currentUserId,
          selectedConversation.userId
        );

        // Compare message IDs to detect changes more accurately
        if (conversationMessages) {
          setMessages((prevMessages) => {
            const prevIds = new Set(prevMessages.map((m) => m.id));
            const newIds = new Set(conversationMessages.map((m) => m.id));
            
            // Check if there are any new messages
            const hasNewMessages = conversationMessages.some(
              (m) => !prevIds.has(m.id)
            );
            
            // Check if messages were deleted
            const hasDeletedMessages = prevMessages.some(
              (m) => !newIds.has(m.id)
            );
            
            // Only update if there are actual changes
            if (hasNewMessages || hasDeletedMessages || prevMessages.length !== conversationMessages.length) {
              return conversationMessages;
            }
            
            return prevMessages;
          });
        }

        // Refresh conversations list to update last message and unread status
        const updatedConversations = await messageService.getConversations(currentUserId);
        setConversations((prev) => {
          // Only update if conversations actually changed
          const prevIds = new Set(prev.map((c) => c.userId));
          const newIds = new Set((updatedConversations || []).map((c) => c.userId));
          
          const hasChanges = 
            prev.length !== (updatedConversations || []).length ||
            prev.some((c) => {
              const updated = (updatedConversations || []).find((uc) => uc.userId === c.userId);
              return !updated || 
                     updated.lastMessage !== c.lastMessage ||
                     updated.unread !== c.unread ||
                     updated.timestamp !== c.timestamp;
            });
          
          return hasChanges ? (updatedConversations || []) : prev;
        });
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [selectedConversation?.userId, user?.id, authLoading]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    const messageText = newMessage.trim();
      setNewMessage("");
    setSending(true);

    try {
      const currentUserId = getCurrentUserId();
      if (!currentUserId || !selectedConversation.userId) {
        throw new Error("User ID or conversation ID missing");
      }

      // Send message
      await messageService.sendMessage(
        currentUserId,
        selectedConversation.userId,
        messageText
      );

      // Reload messages immediately
      const updatedMessages = await messageService.getConversationMessages(
        currentUserId,
        selectedConversation.userId
      );
      setMessages(updatedMessages || []);

      // Refresh conversations list
      const updatedConversations = await messageService.getConversations(currentUserId);
      setConversations(updatedConversations || []);

      // Update selected conversation
      const updatedConv = updatedConversations?.find(
        (c) => c.userId === selectedConversation.userId
      );
      if (updatedConv) {
        setSelectedConversation(updatedConv);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Restore message text on error
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  // Handle selecting a user/conversation
  const handleSelectUser = async (userId) => {
    try {
      const currentUserId = getCurrentUserId();
      if (!currentUserId) return;

      // Check if conversation already exists
      const existingConv = conversations.find((c) => c.userId === userId);
      if (existingConv) {
        setSelectedConversation(existingConv);
        return;
      }

      // Create new conversation entry
      const user = allUsers.find((u) => u.id === userId);
      if (user) {
        const newConversation = {
          userId: user.id,
          name: user.name,
          initials: messageService.getInitials(user.name),
          lastMessage: "",
          timestamp: new Date().toISOString(),
          unread: false,
        };

        setConversations((prev) => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
        setMessages([]); // Clear messages for new conversation
      }
    } catch (error) {
      console.error("Error selecting user:", error);
    }
  };

  // Get current user ID for filtering
  const currentUserId = getCurrentUserId();

  // Combine users with their conversation data
  const usersWithConversations = allUsers
    .filter((u) => u.id !== currentUserId) // Exclude current user
    .map((user) => {
      const conversation = conversations.find((c) => c.userId === user.id);
      return {
        ...user,
        initials: messageService.getInitials(user.name),
        lastMessage: conversation?.lastMessage || "",
        timestamp: conversation?.timestamp || null,
        unread: conversation?.unread || false,
        hasConversation: !!conversation,
      };
    })
    .sort((a, b) => {
      // Sort by: has conversation first, then by timestamp (most recent first), then by name
      if (a.hasConversation && !b.hasConversation) return -1;
      if (!a.hasConversation && b.hasConversation) return 1;
      if (a.timestamp && b.timestamp) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      if (a.timestamp) return -1;
      if (b.timestamp) return 1;
      return a.name.localeCompare(b.name);
    });

  // Filter users by search query
  const filteredUsers = usersWithConversations.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get user initials
  const getUserInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format message time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    return messageService.formatTime(timestamp);
  };

  // Get current user initials
  const getCurrentUserInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || user.name?.split(" ")[0] || "";
    const lastName = user.lastName || user.name?.split(" ")[1] || "";
    return (
      (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() ||
      user.email?.charAt(0).toUpperCase() ||
      "U"
    );
  };

  if (authLoading || loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="p-4 space-y-4">
          <PageHeader
            title="Messages"
            subtitle="Communicate with your team members"
            breadcrumb={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Messages", href: "/message" },
            ]}
            showSearch={false}
            showActions={false}
          />
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading messages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="p-4 space-y-4">
        {/* Page Header */}
        <PageHeader
          title="Messages"
          subtitle="Communicate with your team members"
          breadcrumb={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Messages", href: "/message" },
          ]}
          showSearch={false}
          showActions={false}
        />

        <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Left Sidebar - Conversations List */}
          <div className="w-80 space-y-4 flex-shrink-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 placeholder:text-gray-400"
              />
          </div>

            {/* Users List */}
            <Card glass={true} className="p-0 overflow-hidden flex-1 overflow-y-auto">
              <div className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                <div
                      key={user.id}
                      onClick={() => handleSelectUser(user.id)}
                  className={`p-4 cursor-pointer transition-colors duration-200 ${
                        selectedConversation?.userId === user.id
                          ? "bg-orange-50 border-l-4 border-orange-500"
                          : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.initials}
                      </div>
                          {user.unread && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {user.name}
                        </h3>
                            {user.timestamp && (
                              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                {formatMessageTime(user.timestamp)}
                        </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {user.hasConversation
                              ? user.lastMessage || "No messages yet"
                              : "Click to start conversation"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">
                      {searchQuery
                        ? "No users found"
                        : "No users available"}
                    </p>
                  </div>
                )}
            </div>
          </Card>
        </div>

        {/* Right Side - Chat Interface */}
        <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <Card glass={true} className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {selectedConversation.initials}
                </div>
                <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Messages Area */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50"
                >
                  {messages.length > 0 ? (
                    messages.map((message) => {
                      const isMe = message.senderId === getCurrentUserId();
                      const senderName = isMe
                        ? user?.firstName && user?.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user?.name || "You"
                        : selectedConversation.name;

                      return (
                <div
                  key={message.id}
                          className={`flex gap-3 ${
                            isMe ? "justify-end" : "justify-start"
                          }`}
                >
                          {!isMe && (
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs mt-1 flex-shrink-0">
                              {selectedConversation.initials}
                    </div>
                  )}

                          <div className={`max-w-md ${isMe ? "order-first" : ""}`}>
                  <div
                              className={`flex items-center gap-2 mb-1 ${
                                isMe ? "justify-end" : "justify-start"
                              }`}
                  >
                              <span className="text-xs font-medium text-gray-700">
                                {senderName}
                      </span>
                              <span className="text-xs text-gray-500">
                                {formatMessageTime(message.createdAt)}
                          </span>
                    </div>

                    <div
                      className={`p-3 rounded-xl ${
                                isMe
                                  ? "bg-orange-500 text-white"
                                  : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                              <p className="text-sm whitespace-pre-wrap">
                                {message.message || message.content}
                              </p>
                    </div>
                  </div>

                          {isMe && (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs mt-1 flex-shrink-0">
                              {getCurrentUserInitials()}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                        placeholder="Write a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        disabled={sending}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 placeholder:text-gray-400 pr-20"
                  />

                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Attach file"
                        >
                          <Paperclip className="w-4 h-4 text-gray-500" />
                    </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Emoji"
                        >
                          <Smile className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                      {sending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send</span>
                        </>
                      )}
                </button>
              </div>
            </div>
          </Card>
            ) : (
              <Card glass={true} className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Select a conversation</p>
                  <p className="text-sm">
                    Choose a conversation from the list or start a new one
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
