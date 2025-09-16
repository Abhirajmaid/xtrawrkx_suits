"use client";

import { useState } from "react";
import { Button, Avatar } from "@/components/ui";

export default function ProjectComments({ comments }) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Placeholder for comment submission
      console.log('New comment:', newComment);
      setNewComment("");
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="flex items-start space-x-3 mb-4">
        <Avatar className="w-8 h-8 bg-blue-500 text-white text-sm">
          {comment.user.charAt(0).toUpperCase()}
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">{comment.user}</span>
            <span className="text-sm text-gray-500">{comment.time}</span>
          </div>
          <p className="text-gray-700 mb-2">{comment.text}</p>
          {!isReply && (
            <button
              onClick={() => handleReply(comment.id)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reply
            </button>
          )}
        </div>
      </div>

      {/* Render Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Comments & Feedback</h2>
      </div>
      <div className="p-6">

      {/* Comments List */}
      <div className="space-y-6 mb-6">
        {comments.map(comment => renderComment(comment))}
      </div>

      {/* New Comment Form */}
      <div className="border-t pt-6">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <label htmlFor="new-comment" className="block text-sm font-medium text-gray-700 mb-2">
              Add a comment
            </label>
            <textarea
              id="new-comment"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts or ask a question..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit"
              disabled={!newComment.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
            >
              Post Comment
            </Button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
