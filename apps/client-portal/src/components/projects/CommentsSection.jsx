"use client";

import { useState } from "react";
import { 
  MessageCircle, 
  Reply, 
  MoreVertical, 
  Send,
  Smile,
  Paperclip
} from "lucide-react";

export default function CommentsSection({ 
  comments = [],
  onAddComment,
  onReplyToComment,
  className = "" 
}) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor((now - dateObj) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (onAddComment) {
      onAddComment({
        text: newComment,
        timestamp: new Date().toISOString(),
      });
    }
    setNewComment("");
  };

  const handleSubmitReply = (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (onReplyToComment) {
      onReplyToComment(parentId, {
        text: replyText,
        timestamp: new Date().toISOString(),
      });
    }
    setReplyText("");
    setReplyingTo(null);
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'ml-8 mt-3' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-semibold">
            {comment.user.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-neutral-900 text-sm">{comment.user}</span>
              <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
            </div>
            <p className="text-sm text-gray-700">{comment.text}</p>
          </div>
          
          {/* Reply Button */}
          {!isReply && (
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Reply className="w-3 h-3" />
                Reply
              </button>
              <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                <MoreVertical className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {/* Reply Form */}
          {replyingTo === comment.id && (
            <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply, index) => (
                <CommentItem key={index} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-xl border border-neutral-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">Comments & Discussion</h3>
      
      {/* Comments List */}
      <div className="space-y-6 mb-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No comments yet</p>
            <p className="text-sm text-gray-400 mt-1">Start the conversation</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <CommentItem key={index} comment={comment} />
          ))
        )}
      </div>
      
      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="border-t border-gray-200 pt-6">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">U</span>
          </div>
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
