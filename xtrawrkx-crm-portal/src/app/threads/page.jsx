"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, Loader2, Search, X, Building2, UserCheck, Filter } from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import chatService from "../../lib/api/chatService";
import commentService from "../../lib/api/commentService";
import strapiClient from "../../lib/strapiClient";
import ThreadView from "../../components/threads/ThreadView";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

export default function ThreadsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEntity, setFilterEntity] = useState(null); // null = all, 'leadCompany' or 'clientAccount'
  const [groupByEntity, setGroupByEntity] = useState(true);

  useEffect(() => {
    fetchThreads();
  }, []);

  // Handle thread selection from URL query parameter
  useEffect(() => {
    const threadId = searchParams.get("thread");
    if (threadId && threads.length > 0) {
      const thread = threads.find((t) => 
        t.id === threadId || 
        t.originalId === parseInt(threadId) ||
        t.id === `chat-${threadId}` ||
        t.id === `comment-${threadId}`
      );
      if (thread) {
        handleThreadSelect(thread);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, threads]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      
      // Fetch comments for lead companies and client accounts
      const [leadCompanyCommentsResponse, clientAccountCommentsResponse] = await Promise.all([
        commentService.getAllComments({ 
          filters: { commentableType: 'LEAD_COMPANY' },
          populate: ['user', 'replies', 'replies.user', 'parentComment'],
          sort: 'createdAt:desc',
          pageSize: 1000
        }).catch(() => ({ data: [] })),
        commentService.getAllComments({ 
          filters: { commentableType: 'CLIENT_ACCOUNT' },
          populate: ['user', 'replies', 'replies.user', 'parentComment'],
          sort: 'createdAt:desc',
          pageSize: 1000
        }).catch(() => ({ data: [] }))
      ]);

      const leadComments = leadCompanyCommentsResponse?.data || [];
      const clientComments = clientAccountCommentsResponse?.data || [];
      
      // Group comments by entity and get latest activity
      const entityChats = new Map();
      
      // Process lead company comments
      leadComments.forEach((comment) => {
        const commentData = comment.attributes || comment;
        const entityId = commentData.commentableId;
        const key = `leadCompany-${entityId}`;
        
        if (!entityChats.has(key)) {
          entityChats.set(key, {
            entityId,
            entityType: 'leadCompany',
            comments: [],
            latestActivity: null
          });
        }
        
        const chat = entityChats.get(key);
        chat.comments.push(comment);
        
        const commentTime = new Date(commentData.createdAt);
        if (!chat.latestActivity || commentTime > chat.latestActivity) {
          chat.latestActivity = commentTime;
        }
      });
      
      // Process client account comments
      clientComments.forEach((comment) => {
        const commentData = comment.attributes || comment;
        const entityId = commentData.commentableId;
        const key = `clientAccount-${entityId}`;
        
        if (!entityChats.has(key)) {
          entityChats.set(key, {
            entityId,
            entityType: 'clientAccount',
            comments: [],
            latestActivity: null
          });
        }
        
        const chat = entityChats.get(key);
        chat.comments.push(comment);
        
        const commentTime = new Date(commentData.createdAt);
        if (!chat.latestActivity || commentTime > chat.latestActivity) {
          chat.latestActivity = commentTime;
        }
      });

      // Fetch entity names for all entities with chats
      const entityPromises = Array.from(entityChats.keys()).map(async (key) => {
        const chat = entityChats.get(key);
        try {
          if (chat.entityType === 'leadCompany') {
            const leadCompany = await strapiClient.getLeadCompany(chat.entityId).catch(() => null);
            if (leadCompany) {
              chat.entity = leadCompany.data?.attributes || leadCompany;
            }
          } else if (chat.entityType === 'clientAccount') {
            const clientAccount = await strapiClient.getClientAccount(chat.entityId).catch(() => null);
            if (clientAccount) {
              chat.entity = clientAccount.data?.attributes || clientAccount;
            }
          }
        } catch (error) {
          console.error(`Error fetching entity ${chat.entityId}:`, error);
        }
      });
      await Promise.all(entityPromises);
      
      // Transform entity chats into thread format
      const entityThreads = Array.from(entityChats.values())
        .filter(chat => chat.comments.length > 0) // Only entities with comments
        .map((chat) => {
          // Sort comments by date (newest first) to get latest
          const sortedComments = chat.comments.sort((a, b) => {
            const aTime = new Date(a.attributes?.createdAt || a.createdAt);
            const bTime = new Date(b.attributes?.createdAt || b.createdAt);
            return bTime - aTime;
          });
          
          const latestComment = sortedComments[0];
          const latestCommentData = latestComment.attributes || latestComment;
          const latestUser = latestCommentData.user?.data?.attributes || latestCommentData.user;
          
          // Get all participants from all comments
          const participants = new Set();
          chat.comments.forEach(comment => {
            const commentData = comment.attributes || comment;
            const user = commentData.user?.data?.attributes || commentData.user;
            if (user) {
              participants.add(`${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Unknown");
            }
          });
          
          return {
            id: `${chat.entityType}-${chat.entityId}`,
            type: 'entityChat',
            entityType: chat.entityType,
            entityId: chat.entityId,
            entity: chat.entity,
            leadCompany: chat.entityType === 'leadCompany' ? chat.entity : null,
            clientAccount: chat.entityType === 'clientAccount' ? chat.entity : null,
            latestComment: latestCommentData.content,
            latestCommentId: latestComment.id,
            createdAt: latestCommentData.createdAt,
            latestActivity: chat.latestActivity,
            createdBy: latestUser,
            commentsCount: chat.comments.length,
            allComments: chat.comments, // Store all comments for the chat view
            participants: Array.from(participants)
          };
        });

      // Sort by latest activity (most recent first)
      const allThreads = entityThreads.sort(
        (a, b) => new Date(b.latestActivity || b.createdAt) - new Date(a.latestActivity || a.createdAt)
      );

      setThreads(allThreads);
    } catch (error) {
      console.error("Error fetching threads:", error);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  const getCommentParticipants = (commentData, replies) => {
    const participants = new Set();
    
    // Add comment author
    if (commentData.user) {
      const user = commentData.user.data?.attributes || commentData.user;
      if (user) {
        participants.add(`${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Unknown");
      }
    }
    
    // Add reply authors
    replies.forEach((reply) => {
      const replyData = reply.attributes || reply;
      if (replyData.user) {
        const user = replyData.user.data?.attributes || replyData.user;
        if (user) {
          participants.add(`${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Unknown");
        }
      }
    });
    
    return Array.from(participants);
  };

  const getParticipants = (threadData, replies) => {
    const participants = new Set();
    
    // Add thread starter
    if (threadData.createdBy) {
      const creator = threadData.createdBy.data?.attributes || threadData.createdBy;
      if (creator) {
        participants.add(`${creator.firstName || ""} ${creator.lastName || ""}`.trim() || creator.email || "Unknown");
      }
    }
    
    // Add reply authors
    replies.forEach((reply) => {
      const replyData = reply.attributes || reply;
      if (replyData.createdBy) {
        const creator = replyData.createdBy.data?.attributes || replyData.createdBy;
        if (creator) {
          participants.add(`${creator.firstName || ""} ${creator.lastName || ""}`.trim() || creator.email || "Unknown");
        }
      }
    });
    
    return Array.from(participants);
  };

  const handleThreadSelect = async (thread) => {
    try {
      // For entity chats, we already have all comments loaded
      if (thread.type === 'entityChat' && thread.allComments) {
        // Build thread structure from all comments
        // Sort comments chronologically
        const sortedComments = thread.allComments.sort((a, b) => {
          const aTime = new Date(a.attributes?.createdAt || a.createdAt);
          const bTime = new Date(b.attributes?.createdAt || b.createdAt);
          return aTime - bTime;
        });
        
        // Build thread data structure
        const threadData = {
          id: thread.id,
          type: 'entityChat',
          entityType: thread.entityType,
          entityId: thread.entityId,
          attributes: {
            message: thread.latestComment,
            content: thread.latestComment,
            createdAt: thread.createdAt,
            createdBy: thread.createdBy,
            leadCompany: thread.leadCompany,
            clientAccount: thread.clientAccount,
            comments: sortedComments // All comments in chronological order
          },
          allComments: sortedComments
        };
        setSelectedThread(threadData);
      }
    } catch (error) {
      console.error("Error fetching thread details:", error);
    }
  };

  const handleThreadUpdate = () => {
    fetchThreads();
    if (selectedThread) {
      const thread = threads.find(t => t.id === selectedThread.id);
      if (thread) {
        handleThreadSelect(thread);
      }
    }
  };

  // Get unique entities (companies/accounts) from threads
  const entities = useMemo(() => {
    const entityMap = new Map();
    threads.forEach(thread => {
      if (thread.leadCompany && thread.leadCompany.companyName) {
        const key = `leadCompany-${thread.leadCompany.id || thread.leadCompany.companyName}`;
        if (!entityMap.has(key)) {
          entityMap.set(key, {
            id: thread.leadCompany.id,
            name: thread.leadCompany.companyName,
            type: 'leadCompany',
            count: 0
          });
        }
        entityMap.get(key).count++;
      }
      if (thread.clientAccount && thread.clientAccount.companyName) {
        const key = `clientAccount-${thread.clientAccount.id || thread.clientAccount.companyName}`;
        if (!entityMap.has(key)) {
          entityMap.set(key, {
            id: thread.clientAccount.id,
            name: thread.clientAccount.companyName,
            type: 'clientAccount',
            count: 0
          });
        }
        entityMap.get(key).count++;
      }
    });
    return Array.from(entityMap.values()).sort((a, b) => b.count - a.count);
  }, [threads]);

  // Filter threads by search query and entity filter
  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      // Entity filter
      if (filterEntity === 'leadCompany' && !thread.leadCompany) return false;
      if (filterEntity === 'clientAccount' && !thread.clientAccount) return false;
      
      // Search query filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const messageText = (thread.message || thread.content || "").toLowerCase();
      const companyName = (thread.leadCompany?.companyName || thread.clientAccount?.companyName || "").toLowerCase();
      const participants = thread.participants.join(" ").toLowerCase();
      
      return messageText.includes(query) || companyName.includes(query) || participants.includes(query);
    });
  }, [threads, searchQuery, filterEntity]);

  // Group threads by entity if enabled
  const groupedThreads = useMemo(() => {
    if (!groupByEntity) {
      return { ungrouped: filteredThreads };
    }
    
    const groups = {};
    filteredThreads.forEach(thread => {
      const entityKey = thread.leadCompany 
        ? `leadCompany-${thread.leadCompany.id || thread.leadCompany.companyName}`
        : thread.clientAccount 
        ? `clientAccount-${thread.clientAccount.id || thread.clientAccount.companyName}`
        : 'unknown';
      
      if (!groups[entityKey]) {
        groups[entityKey] = {
          entity: thread.leadCompany || thread.clientAccount,
          type: thread.leadCompany ? 'leadCompany' : 'clientAccount',
          threads: []
        };
      }
      groups[entityKey].threads.push(thread);
    });
    
    return groups;
  }, [filteredThreads, groupByEntity]);

  const getThreadContext = (thread) => {
    if (thread.leadCompany && thread.leadCompany.companyName) {
      return thread.leadCompany.companyName;
    }
    if (thread.clientAccount && thread.clientAccount.companyName) {
      return thread.clientAccount.companyName;
    }
    return "Unknown";
  };

  const getEntityType = (thread) => {
    if (thread.leadCompany) return 'leadCompany';
    if (thread.clientAccount) return 'clientAccount';
    return null;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-4 space-y-4 bg-white min-h-screen">
          <PageHeader
            title="Threads"
            subtitle="Conversations with lead companies and client accounts"
            breadcrumb={[{ label: "Threads", href: "/threads" }]}
            showSearch={false}
            showActions={false}
          />
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              <span className="text-gray-600">Loading threads...</span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Threads List Sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Threads</h1>
              <button
                onClick={() => setGroupByEntity(!groupByEntity)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title={groupByEntity ? "Ungroup threads" : "Group by company/account"}
              >
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {/* Filter buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterEntity(null)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filterEntity === null
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterEntity('leadCompany')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  filterEntity === 'leadCompany'
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Building2 className="w-3 h-3" />
                Lead Companies
              </button>
              <button
                onClick={() => setFilterEntity('clientAccount')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  filterEntity === 'clientAccount'
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <UserCheck className="w-3 h-3" />
                Client Accounts
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
            
            {/* Entities summary */}
            {entities.length > 0 && (
              <div className="text-xs text-gray-500">
                {entities.length} {entities.length === 1 ? 'company/account' : 'companies/accounts'} with active threads
              </div>
            )}
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {searchQuery || filterEntity ? "No threads found" : "No threads yet"}
                </p>
                <p className="text-xs text-gray-500">
                  {searchQuery || filterEntity
                    ? "Try adjusting your search or filters"
                    : "Start a conversation by creating a thread"}
                </p>
              </div>
            ) : groupByEntity ? (
              // Grouped view
              <div>
                {Object.entries(groupedThreads).map(([entityKey, group]) => {
                  const entity = group.entity;
                  const entityName = entity?.companyName || "Unknown";
                  const isLeadCompany = group.type === 'leadCompany';
                  
                  return (
                    <div key={entityKey} className="border-b border-gray-200">
                      {/* Entity Header */}
                      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                          {isLeadCompany ? (
                            <Building2 className="w-4 h-4 text-orange-500" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="text-sm font-semibold text-gray-900">{entityName}</span>
                          <span className="text-xs text-gray-500">({group.threads.length} {group.threads.length === 1 ? 'thread' : 'threads'})</span>
                        </div>
                      </div>
                      
                      {/* Threads for this entity */}
                      <div className="divide-y divide-gray-100">
                        {group.threads.map((thread) => {
                          const isSelected = selectedThread?.id === thread.id;
                          const lastReplyTime = thread.lastReply
                            ? formatDistanceToNow(new Date(thread.lastReply.attributes?.createdAt || thread.lastReply.createdAt), { addSuffix: true })
                            : formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true });

                          return (
                            <button
                              key={thread.id}
                              onClick={() => handleThreadSelect(thread)}
                              className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                                isSelected ? "bg-orange-50 border-l-4 border-orange-500" : ""
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                                    {thread.message || thread.content}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{thread.participants.slice(0, 2).join(", ")}</span>
                                    {thread.participants.length > 2 && (
                                      <span>and {thread.participants.length - 2} more</span>
                                    )}
                                    <span>•</span>
                                    <span>{lastReplyTime}</span>
                                    {thread.repliesCount > 0 && (
                                      <>
                                        <span>•</span>
                                        <span>{thread.repliesCount} {thread.repliesCount === 1 ? "reply" : "replies"}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Ungrouped view
              <div className="divide-y divide-gray-100">
                {filteredThreads.map((thread) => {
                  const isSelected = selectedThread?.id === thread.id;
                  const lastReplyTime = thread.lastReply
                    ? formatDistanceToNow(new Date(thread.lastReply.attributes?.createdAt || thread.lastReply.createdAt), { addSuffix: true })
                    : formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true });
                  const entityType = getEntityType(thread);
                  const entityName = getThreadContext(thread);

                  return (
                    <button
                      key={thread.id}
                      onClick={() => handleThreadSelect(thread)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        isSelected ? "bg-orange-50 border-l-4 border-orange-500" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {entityType === 'leadCompany' ? (
                              <Building2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                            ) : entityType === 'clientAccount' ? (
                              <UserCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            ) : null}
                            <span className="text-xs font-semibold text-gray-700">
                              {entityName}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                            {thread.latestComment || thread.message || thread.content}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{thread.participants.slice(0, 2).join(", ")}</span>
                            {thread.participants.length > 2 && (
                              <span>and {thread.participants.length - 2} more</span>
                            )}
                            <span>•</span>
                            <span>{lastReplyTime}</span>
                            {thread.commentsCount > 0 && (
                              <>
                                <span>•</span>
                                <span>{thread.commentsCount} {thread.commentsCount === 1 ? "message" : "messages"}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Thread View */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedThread ? (
            <ThreadView
              thread={selectedThread}
              onThreadUpdate={handleThreadUpdate}
              onBack={() => setSelectedThread(null)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">Select a thread</p>
                <p className="text-sm text-gray-500">
                  Choose a thread from the list to view the conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

