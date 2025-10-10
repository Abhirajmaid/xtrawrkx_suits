"use client";

import { useState } from "react";
import { CheckCircle, Archive, List, Paperclip, Smile, Send } from "lucide-react";

export default function NotificationDetail({ selectedNotification, comments, onMarkAllRead }) {
  const [newComment, setNewComment] = useState("");
  const [dontSendNotification, setDontSendNotification] = useState(false);

  const handlePostComment = () => {
    if (newComment.trim()) {
      // Handle posting comment
      console.log("Posting comment:", newComment);
      setNewComment("");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (!selectedNotification) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notification selected</h3>
          <p className="text-gray-500">Select a notification from the list to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col min-h-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <button
            onClick={onMarkAllRead}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Notification Content */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        <div className="space-y-6">
          {/* Selected Notification */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {selectedNotification.avatar ? (
                  <img
                    src={selectedNotification.avatar}
                    alt={selectedNotification.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {selectedNotification.initials}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedNotification.name}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDate(selectedNotification.date)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedNotification.action}
                </p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {comment.avatar ? (
                    <img
                      src={comment.avatar}
                      alt={comment.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {comment.initials}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {comment.message}
                  </p>
                  {comment.link && (
                    <a
                      href="#"
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                    >
                      {comment.link}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">JB</span>
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write Comment"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <List className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Smile className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <button
                    onClick={handlePostComment}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={dontSendNotification}
              onChange={(e) => setDontSendNotification(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              Don't send me this kind of notification
            </span>
          </label>
          <button className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
            <Archive className="h-4 w-4" />
            <span>Archive</span>
          </button>
        </div>
      </div>
    </div>
  );
}
