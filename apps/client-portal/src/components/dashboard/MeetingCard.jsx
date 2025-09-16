"use client";

import { Calendar, Clock, Video, ExternalLink } from "lucide-react";

export default function MeetingCard({ 
  meetingTitle,
  time,
  link,
  attendees = [],
  onClick,
  onJoinClick,
  className = "" 
}) {
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleJoinClick = (e) => {
    e.stopPropagation();
    if (onJoinClick) {
      onJoinClick(link);
    } else if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl border border-neutral-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-neutral-900 mb-1 group-hover:text-blue-600 transition-colors">
            {meetingTitle}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{formatTime(time)}</span>
          </div>
        </div>
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Video className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* Attendees */}
      {attendees.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex -space-x-2">
            {attendees.slice(0, 3).map((attendee, index) => (
              <div
                key={index}
                className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                title={attendee}
              >
                {attendee.charAt(0).toUpperCase()}
              </div>
            ))}
            {attendees.length > 3 && (
              <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-600 text-xs font-semibold border-2 border-white">
                +{attendees.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {attendees.length} attendee{attendees.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Join Button */}
      <button
        onClick={handleJoinClick}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Video className="w-4 h-4" />
        Join Meeting
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
}
