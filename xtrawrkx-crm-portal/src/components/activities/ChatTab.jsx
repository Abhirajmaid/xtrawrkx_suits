"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Edit, Trash2, Search, MoreVertical, X } from "lucide-react";
import { Button, Avatar } from "../ui";
import chatService from "../../lib/api/chatService";
import { useAuth } from "../../contexts/AuthContext";
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";

const ChatTab = ({ entityType, entityId }) => {
  const { user } = useAuth();
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  
  // Refs
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastMessageIdRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatMessages.length > 0) {
      scrollToBottom();
    }
  }, [chatMessages]);

  // Close message menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMessageMenu && !event.target.closest(".message-menu-container")) {
        setShowMessageMenu(null);
      }
    };

    if (showMessageMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMessageMenu]);

  // Polling for new messages
  useEffect(() => {
    if (entityId) {
      // Start polling for new messages every 3 seconds
      pollingIntervalRef.current = setInterval(() => {
        fetchChatMessages(true); // Pass true to indicate silent polling
      }, 3000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [entityId]);

  // Fetch chat messages on mount
  useEffect(() => {
    if (entityId) {
      fetchChatMessages();
    }
  }, [entityId, entityType]);

  // Fetch Chat Messages from separate chat system
  const fetchChatMessages = async (silent = false) => {
    try {
      // Only show loading on initial fetch, not on polling or refresh
      if (!silent) {
        setLoadingChat(true);
      }

      const response = await chatService.getMessages(entityType, entityId);
      const messages = response?.data || [];

      // Transform messages to expected format
      const transformed = messages
        .map((msg) => {
          const message = msg.attributes || msg;
          return {
            id: msg.id,
            message: message.message,
            description: message.message, // Keep for compatibility
            createdAt: message.createdAt,
            createdBy: message.createdBy?.data?.attributes || message.createdBy,
            isEdited: message.isEdited || false,
            editedAt: message.editedAt,
          };
        })
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest first for chat

      // For silent refresh (after sending message), always update
      if (silent) {
        setChatMessages(transformed);
        if (transformed.length > 0) {
          lastMessageIdRef.current = transformed[transformed.length - 1].id;
        }
        // Always scroll to bottom after sending a message
        setTimeout(scrollToBottom, 100);
        return;
      }

      // For polling, only update if there are new messages
      const lastMessage = transformed[transformed.length - 1];
      if (lastMessage && lastMessage.id !== lastMessageIdRef.current) {
        setChatMessages(transformed);
        // Auto-scroll only if user is near bottom
        const container = messagesContainerRef.current;
        if (container) {
          const isNearBottom =
            container.scrollHeight -
              container.scrollTop -
              container.clientHeight <
            100;
          if (isNearBottom) {
            setTimeout(scrollToBottom, 100);
          }
        }
      } else if (!silent) {
        // Initial load - always set messages
        setChatMessages(transformed);
        if (transformed.length > 0) {
          lastMessageIdRef.current = transformed[transformed.length - 1].id;
        }
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      if (!silent) {
        setChatMessages([]);
      }
    } finally {
      if (!silent) {
        setLoadingChat(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX

    try {
      // Validate entityType and entityId
      if (!entityType || !entityId) {
        alert(
          "Unable to send message: Missing entity information. Please refresh the page and try again."
        );
        setNewMessage(messageText);
        return;
      }

      // Get user ID - handle both id and documentId formats
      // Priority: documentId (Strapi v4 format) > id > data.id
      let userId = user?.documentId || user?.id || user?.data?.id;
      
      // If userId is a number, ensure it's the correct format
      if (userId && typeof userId === 'number') {
        userId = userId;
      } else if (userId && typeof userId === 'string') {
        // Try to parse string IDs
        const parsed = parseInt(userId);
        if (!isNaN(parsed)) {
          userId = parsed;
        }
      }

      if (!userId) {
        console.error("User object structure:", user);
        alert(
          "Unable to identify user. Please refresh the page and try again.\n\n" +
          "If the problem persists, please contact support."
        );
        setNewMessage(messageText);
        return;
      }
      
      console.log("Sending message with userId:", userId, "user object:", user);

      await chatService.createMessage(
        entityType,
        entityId,
        messageText,
        userId
      );

      // Refresh chat messages silently (without loading state)
      await fetchChatMessages(true); // Pass true to avoid loading state
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", {
        message: error?.message,
        entityType,
        entityId,
        userId: user?.documentId || user?.id || user?.data?.id,
        user: user
      });
      
      // Extract error message from response
      let errorMessage = "Failed to send message";
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Show user-friendly error message with helpful context
      if (errorMessage.includes('Schema relation target mismatch') || errorMessage.includes('admin::user')) {
        alert(
          `Chat message failed: Backend schema cache issue detected.\n\n` +
          `This is a backend configuration issue. Please contact your administrator.\n\n` +
          `Error: ${errorMessage}\n\n` +
          `The backend needs to:\n` +
          `1. Stop Strapi server\n` +
          `2. Delete the .cache folder\n` +
          `3. Restart Strapi`
        );
      } else {
        alert(`Failed to send message: ${errorMessage}`);
      }
      // Restore message text if sending failed
      setNewMessage(messageText);
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message.id);
    setEditMessageText(message.message || message.description || "");
  };

  const handleSaveEdit = async (messageId) => {
    if (!editMessageText.trim()) return;

    try {
      await chatService.updateMessage(messageId, editMessageText);
      setEditingMessageId(null);
      setEditMessageText("");
      fetchChatMessages();
    } catch (error) {
      console.error("Error editing message:", error);
      alert("Failed to edit message");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditMessageText("");
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await chatService.deleteMessage(messageId);
      fetchChatMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message");
    }
  };

  // Format message text with links
  const formatMessageText = (text) => {
    if (!text) return "";

    // Simple URL detection and formatting
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline break-all"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Format date for message grouping
  const formatMessageDate = (date) => {
    if (!date) return "";
    const messageDate = new Date(date);

    if (isToday(messageDate)) {
      return "Today";
    } else if (isYesterday(messageDate)) {
      return "Yesterday";
    } else if (isThisWeek(messageDate)) {
      return format(messageDate, "EEEE"); // Day name
    } else if (isThisYear(messageDate)) {
      return format(messageDate, "MMMM d"); // Month and day
    } else {
      return format(messageDate, "MMMM d, yyyy"); // Full date
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      const dateKey = format(messageDate, "yyyy-MM-dd");

      if (!currentGroup || currentGroup.dateKey !== dateKey) {
        currentGroup = {
          dateKey,
          dateLabel: formatMessageDate(message.createdAt),
          messages: [],
        };
        groups.push(currentGroup);
      }

      currentGroup.messages.push(message);
    });

    return groups;
  };

  // Filter messages by search query
  const filteredChatMessages = chatMessages.filter((message) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const messageText = (
      message.message ||
      message.description ||
      ""
    ).toLowerCase();
    const userName = `${message.createdBy?.firstName || ""} ${
      message.createdBy?.lastName || ""
    }`.toLowerCase();
    return messageText.includes(query) || userName.includes(query);
  });

  const groupedMessages = groupMessagesByDate(filteredChatMessages);

  return (
    <div className="flex flex-col h-[600px]">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2"
      >
        {loadingChat ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <span className="ml-2 text-sm text-gray-600">
              Loading messages...
            </span>
          </div>
        ) : filteredChatMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600">
              {searchQuery ? "No messages found" : "No messages yet"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {searchQuery
                ? "Try adjusting your search"
                : "Start a conversation by sending a message"}
            </p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.dateKey} className="space-y-3">
              {/* Date Separator */}
              <div className="flex items-center justify-center my-3">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="px-3 text-xs font-medium text-gray-500 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
                  {group.dateLabel}
                </span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Messages in this date group */}
              {group.messages.map((message, index) => {
                const isCurrentUser = message.createdBy?.id === user?.id;
                const prevMessage =
                  index > 0 ? group.messages[index - 1] : null;
                const showAvatar =
                  !prevMessage ||
                  prevMessage.createdBy?.id !== message.createdBy?.id ||
                  new Date(message.createdAt) -
                    new Date(prevMessage.createdAt) >
                    300000; // 5 minutes
                const isEditing = editingMessageId === message.id;

                return (
                  <div
                    key={message.id}
                    className={`group flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-2 max-w-[75%] ${
                        isCurrentUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      {showAvatar ? (
                        <Avatar
                          fallback={(
                            message.createdBy?.firstName?.[0] || "U"
                          ).toUpperCase()}
                          size="sm"
                          className="flex-shrink-0 border border-gray-200"
                        />
                      ) : (
                        <div className="w-8 flex-shrink-0"></div>
                      )}

                      {/* Message Content */}
                      <div className="flex-1">
                        {/* Message Header (only show if avatar is shown) */}
                        {showAvatar && !isCurrentUser && (
                          <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-xs font-medium text-gray-600">
                              {message.createdBy
                                ? `${message.createdBy.firstName} ${message.createdBy.lastName}`
                                : "Unknown"}
                            </span>
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`relative group/message ${
                            isCurrentUser
                              ? "flex justify-end"
                              : "flex justify-start"
                          }`}
                        >
                          <div
                            className={`px-3 py-2 rounded-lg ${
                              isCurrentUser
                                ? "bg-orange-500 text-white"
                                : "bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-900"
                            }`}
                          >
                            {isEditing ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editMessageText}
                                  onChange={(e) =>
                                    setEditMessageText(e.target.value)
                                  }
                                  className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  rows={2}
                                  autoFocus
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleCancelEdit()}
                                    className="text-xs px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleSaveEdit(message.id)
                                    }
                                    className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-2">
                                <p className="text-sm whitespace-pre-wrap break-words flex-1">
                                  {formatMessageText(
                                    message.message || message.description
                                  )}
                                </p>
                                {isCurrentUser && (
                                  <div className="relative message-menu-container">
                                    <button
                                      onClick={() =>
                                        setShowMessageMenu(
                                          showMessageMenu === message.id
                                            ? null
                                            : message.id
                                        )
                                      }
                                      className="opacity-0 group-hover/message:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded"
                                    >
                                      <MoreVertical className="w-3 h-3" />
                                    </button>
                                    {showMessageMenu === message.id && (
                                      <div className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[120px]">
                                        <button
                                          onClick={() => {
                                            handleEditMessage(message);
                                            setShowMessageMenu(null);
                                          }}
                                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                          <Edit className="w-3 h-3" />
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleDeleteMessage(
                                              message.id
                                            );
                                            setShowMessageMenu(null);
                                          }}
                                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Message Timestamp */}
                        <div
                          className={`flex items-center gap-2 mt-1 px-1 text-xs text-gray-400 ${
                            isCurrentUser
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <span>
                            {message.createdAt
                              ? format(
                                  new Date(message.createdAt),
                                  "h:mm a"
                                )
                              : "Just now"}
                          </span>
                          {message.isEdited && (
                            <span className="text-gray-400 italic">
                              (edited)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (newMessage.trim()) {
                    handleSendMessage();
                  }
                }
              }}
              placeholder="Type a message..."
              className="w-full px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              rows={2}
            />
          </div>
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-md px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;

