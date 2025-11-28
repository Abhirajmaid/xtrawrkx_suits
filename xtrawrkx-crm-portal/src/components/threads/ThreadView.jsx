"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Send,
  Edit,
  Trash2,
  MoreVertical,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  Code,
  List,
  ListOrdered,
  Quote,
  FileCode,
  Smile,
  AtSign,
  Paperclip,
  Video,
  Monitor,
  Check,
  Eye,
  PartyPopper,
  Bookmark,
} from "lucide-react";
import { Avatar, Button } from "../ui";
import { useAuth } from "../../contexts/AuthContext";
import chatService from "../../lib/api/chatService";
import commentService from "../../lib/api/commentService";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

export default function ThreadView({ thread, onThreadUpdate, onBack }) {
  const { user } = useAuth();
  const [replyText, setReplyText] = useState("");
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  const [alsoSendToChannel, setAlsoSendToChannel] = useState(false);
  const messagesEndRef = useRef(null);
  const replyInputRef = useRef(null);

  const threadData = thread.attributes || thread;
  const isEntityChat = thread.type === 'entityChat';
  
  // For entity chats, use all comments directly
  let allMessages = [];
  
  if (isEntityChat && thread.allComments) {
    // Transform all comments into message format
    allMessages = thread.allComments.map(comment => {
      const commentData = comment.attributes || comment;
      const user = commentData.user?.data?.attributes || commentData.user;
      
      return {
        id: comment.id || commentData.id,
        attributes: {
          message: commentData.content,
          content: commentData.content,
          createdAt: commentData.createdAt,
          createdBy: user,
          isEdited: false
        }
      };
    }).sort(
      (a, b) =>
        new Date(a.attributes?.createdAt || a.createdAt) -
        new Date(b.attributes?.createdAt || b.createdAt)
    );
  } else {
    // Legacy format for other thread types
    const isCommentThread = thread.type === 'comment';
    const replies = threadData.replies?.data || threadData.replies || [];
    
    // Transform replies to unified format
    const transformedReplies = replies.map(reply => {
      const replyData = reply.attributes || reply;
      if (isCommentThread) {
        // Comment reply format
        return {
          id: reply.id || replyData.id,
          attributes: {
            message: replyData.content,
            content: replyData.content,
            createdAt: replyData.createdAt,
            createdBy: replyData.user?.data || replyData.user,
            isEdited: false
          }
        };
      } else {
        // Chat message reply format
        return reply;
      }
    });
    
    // Create root message
    const rootMessage = {
      id: thread.id,
      attributes: {
        message: threadData.message || threadData.content,
        content: threadData.content || threadData.message,
        createdAt: threadData.createdAt,
        createdBy: threadData.createdBy?.data || threadData.createdBy,
        isEdited: false
      }
    };
    
    allMessages = [rootMessage, ...transformedReplies].sort(
      (a, b) =>
        new Date(a.attributes?.createdAt || a.createdAt) -
        new Date(b.attributes?.createdAt || b.createdAt)
    );
  }

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    const messageText = replyText.trim();
    setReplyText("");

    try {
      const userId = user?.documentId || user?.id || user?.data?.id;
      if (!userId) {
        alert("Unable to identify user. Please refresh the page.");
        return;
      }

      if (isEntityChat) {
        // Reply to entity chat (create new comment)
        const entityType = thread.entityType === 'leadCompany' ? 'LEAD_COMPANY' : 'CLIENT_ACCOUNT';
        const entityId = thread.entityId;
        
        if (entityType === 'LEAD_COMPANY') {
          await commentService.createLeadCompanyComment(entityId, messageText, userId);
        } else {
          await commentService.createClientAccountComment(entityId, messageText, userId);
        }
      } else if (thread.type === 'comment') {
        // Reply to comment thread
        const rootCommentId = thread.originalId || thread.id?.replace('comment-', '');
        await commentService.replyToComment(rootCommentId, messageText, userId);
      } else {
        // Reply to chat thread (legacy)
        const entityType = threadData.leadCompany ? "leadCompany" : threadData.clientAccount ? "clientAccount" : null;
        const entityId = threadData.leadCompany?.data?.id || threadData.clientAccount?.data?.id || 
                         threadData.leadCompany?.id || threadData.clientAccount?.id;
        await chatService.replyToThread(thread.originalId || thread.id?.replace('chat-', ''), messageText, userId, entityType, entityId);
      }
      
      // Refresh thread
      if (onThreadUpdate) {
        onThreadUpdate();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
      setReplyText(messageText);
    }
  };

  const handleEditMessage = (message) => {
    const messageData = message.attributes || message;
    setEditingMessageId(message.id);
    setEditMessageText(messageData.message || messageData.content || "");
  };

  const handleSaveEdit = async (messageId) => {
    if (!editMessageText.trim()) return;

    try {
      if (isEntityChat || thread.type === 'comment') {
        await commentService.updateComment(messageId, { content: editMessageText });
      } else {
        await chatService.updateMessage(messageId, editMessageText);
      }
      setEditingMessageId(null);
      setEditMessageText("");
      if (onThreadUpdate) {
        onThreadUpdate();
      }
    } catch (error) {
      console.error("Error editing message:", error);
      alert("Failed to edit message");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      if (isEntityChat || thread.type === 'comment') {
        await commentService.deleteComment(messageId);
      } else {
        await chatService.deleteMessage(messageId);
      }
      if (onThreadUpdate) {
        onThreadUpdate();
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message");
    }
  };

  const formatMessageText = (text) => {
    if (!text) return "";

    // URL detection
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
            className="text-blue-500 hover:text-blue-600 underline break-all"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const formatMessageDate = (date) => {
    if (!date) return "";
    const messageDate = new Date(date);

    if (isToday(messageDate)) {
      return "Today";
    } else if (isYesterday(messageDate)) {
      return "Yesterday";
    } else {
      return format(messageDate, "MMMM d, yyyy");
    }
  };

  const getThreadContext = () => {
    if (threadData.leadCompany) {
      const leadCompany = threadData.leadCompany.data?.attributes || threadData.leadCompany;
      return `# ${leadCompany.companyName || "Lead Company"}`;
    }
    if (threadData.clientAccount) {
      const clientAccount = threadData.clientAccount.data?.attributes || threadData.clientAccount;
      return `# ${clientAccount.companyName || "Client Account"}`;
    }
    return "Unknown";
  };

  const getParticipants = () => {
    const participants = new Set();
    
    allMessages.forEach((message) => {
      const messageData = message.attributes || message;
      if (messageData.createdBy) {
        const creator = messageData.createdBy.data?.attributes || messageData.createdBy;
        if (creator) {
          const name = `${creator.firstName || ""} ${creator.lastName || ""}`.trim() || creator.email || "Unknown";
          participants.add(name);
        }
      }
    });
    
    return Array.from(participants);
  };

  const participants = getParticipants();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {getThreadContext()}
            </h2>
            <p className="text-sm text-gray-500">
              {participants.join(" and ")}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {allMessages.map((message, index) => {
          const messageData = message.attributes || message;
          const creator = messageData.createdBy?.data?.attributes || messageData.createdBy;
          const isCurrentUser = creator?.id === user?.id || creator?.documentId === user?.documentId;
          const isEditing = editingMessageId === message.id;
          const prevMessage = index > 0 ? allMessages[index - 1] : null;
          const prevMessageData = prevMessage?.attributes || prevMessage;
          const showAvatar =
            !prevMessage ||
            (prevMessageData.createdBy?.data?.id || prevMessageData.createdBy?.id) !==
              (messageData.createdBy?.data?.id || messageData.createdBy?.id) ||
            new Date(messageData.createdAt) - new Date(prevMessageData.createdAt) > 300000;

          return (
            <div key={message.id} className="flex gap-3 group">
              {showAvatar ? (
                <Avatar
                  fallback={(
                    (creator?.firstName?.[0] || creator?.email?.[0] || "U")
                  ).toUpperCase()}
                  size="sm"
                  className="flex-shrink-0"
                />
              ) : (
                <div className="w-8 flex-shrink-0"></div>
              )}

              <div className="flex-1 min-w-0">
                {showAvatar && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {creator
                        ? `${creator.firstName || ""} ${creator.lastName || ""}`.trim() || creator.email
                        : "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(messageData.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                )}

                <div className="relative group/message">
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editMessageText}
                        onChange={(e) => setEditMessageText(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingMessageId(null);
                            setEditMessageText("");
                          }}
                          className="text-xs px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(message.id)}
                          className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap break-words flex-1">
                        {formatMessageText(messageData.message || messageData.content)}
                      </p>
                      {isCurrentUser && (
                        <div className="relative message-menu-container opacity-0 group-hover/message:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              setShowMessageMenu(
                                showMessageMenu === message.id ? null : message.id
                              )
                            }
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
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
                                  handleDeleteMessage(message.id);
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

                  {messageData.isEdited && (
                    <span className="text-xs text-gray-400 italic mt-1 block">
                      (edited)
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Box */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {/* Formatting Toolbar */}
        {showFormattingToolbar && (
          <div className="mb-2 flex items-center gap-1 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Bold">
              <Bold className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Italic">
              <Italic className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Underline">
              <Underline className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Strikethrough">
              <Strikethrough className="w-4 h-4 text-gray-600" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Link">
              <LinkIcon className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Code block">
              <Code className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Bullet list">
              <List className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Numbered list">
              <ListOrdered className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Quote">
              <Quote className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Code snippet">
              <FileCode className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}

        {/* Reply Input */}
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={replyInputRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (replyText.trim()) {
                      handleSendReply();
                    }
                  }
                }}
                onFocus={() => setShowFormattingToolbar(true)}
                placeholder="Reply..."
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows={2}
              />
            </div>
            <Button
              size="sm"
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={alsoSendToChannel}
                onChange={(e) => setAlsoSendToChannel(e.target.checked)}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span>Also send to {getThreadContext()}</span>
            </label>

            <div className="flex items-center gap-1">
              <button className="p-1.5 hover:bg-gray-100 rounded" title="Add">
                <span className="text-gray-500 text-sm">+</span>
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded" title="Text formatting">
                <span className="text-gray-500 text-sm">Aa</span>
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded" title="Emoji">
                <Smile className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded" title="Mention">
                <AtSign className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded" title="Attachment">
                <Paperclip className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded" title="Video call">
                <Video className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded" title="Screen share">
                <Monitor className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

