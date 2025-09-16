"use client";

export default function ChatMessage({ 
  user,
  avatar,
  text,
  time,
  isOwnMessage = false,
  className = "" 
}) {
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={`flex gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'} ${className}`}>
      {/* Avatar - only show for others */}
      {!isOwnMessage && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={user}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-semibold">
              {user.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-first' : ''}`}>
        {/* User Name - only show for others */}
        {!isOwnMessage && (
          <span className="text-xs text-gray-500 mb-1 block">{user}</span>
        )}
        
        {/* Message Bubble */}
        <div className={`rounded-2xl px-4 py-2 ${
          isOwnMessage 
            ? 'bg-blue-600 text-white rounded-br-md' 
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}>
          <p className="text-sm leading-relaxed">{text}</p>
        </div>
        
        {/* Timestamp */}
        <p className={`text-xs mt-1 ${
          isOwnMessage ? 'text-gray-500 text-right' : 'text-gray-400'
        }`}>
          {formatTime(time)}
        </p>
      </div>

      {/* Current User Avatar - only show for own messages */}
      {isOwnMessage && (
        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={user}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-semibold">
              {user.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
