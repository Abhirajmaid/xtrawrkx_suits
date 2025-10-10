"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  Image as ImageIcon,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const EMOJIS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "😓",
  "🤗",
  "🤔",
  "🤭",
  "🤫",
  "🤥",
  "😶",
  "😐",
  "😑",
  "😬",
  "🙄",
  "😯",
  "😦",
  "😧",
  "😮",
  "😲",
  "🥱",
  "😴",
  "🤤",
  "😪",
  "😵",
  "🤐",
  "🥴",
  "🤢",
  "🤮",
  "🤧",
  "😷",
  "🤒",
  "🤕",
  "🤑",
  "🤠",
  "😈",
  "👿",
  "👹",
  "👺",
  "🤡",
  "💩",
  "👻",
  "💀",
  "☠️",
  "👽",
  "👾",
  "🤖",
  "🎃",
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "😿",
  "😾",
];

export function MessageInput({
  onSendMessage,
  onFileUpload,
  onEmojiSelect,
  placeholder = "Type a message...",
}) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle message input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Show typing indicator
    if (value.trim() && !isTyping) {
      setIsTyping(true);
    } else if (!value.trim() && isTyping) {
      setIsTyping(false);
    }
  };

  // Handle send message
  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage("");
      setAttachments([]);
      setIsTyping(false);
      textareaRef.current?.focus();
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    onFileUpload?.(files);
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  // Handle emoji selection
  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji);
    onEmojiSelect?.(emoji);
    setShowEmojis(false);
    textareaRef.current?.focus();
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-3">
      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg"
          >
            {attachments.map((attachment) => (
              <motion.div
                key={attachment.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center space-x-2 bg-white rounded-lg p-2 border border-gray-200"
              >
                {attachment.preview ? (
                  <img
                    src={attachment.preview}
                    alt={attachment.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <FileText className="h-4 w-4 text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                  className="h-6 w-6 p-0 hover:bg-red-100"
                >
                  <X className="h-3 w-3 text-red-500" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg"
          >
            <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex items-end space-x-2">
        {/* File Upload Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            rows={1}
            style={{
              minHeight: "48px",
              maxHeight: "120px",
              height: "auto",
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />

          {/* Emoji Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojis(!showEmojis)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() && attachments.length === 0}
          className="flex-shrink-0 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
