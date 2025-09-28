import React, { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Lock,
  Save,
  MoreHorizontal,
} from "lucide-react";

const PrivateNotepad = () => {
  const [noteText, setNoteText] = useState("Write down anything here...");
  const [isSaved, setIsSaved] = useState(true);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    bulletList: false,
    numberedList: false,
  });

  const handleTextChange = (e) => {
    setNoteText(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    // Simulate save action
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Reset after 2 seconds
  };

  const handleFormatToggle = (format) => {
    setActiveFormats((prev) => ({
      ...prev,
      [format]: !prev[format],
    }));
  };

  const formatButtons = [
    { key: "bold", icon: Bold, label: "Bold" },
    { key: "italic", icon: Italic, label: "Italic" },
    { key: "underline", icon: Underline, label: "Underline" },
    { key: "strikethrough", icon: Strikethrough, label: "Strikethrough" },
    { key: "bulletList", icon: List, label: "Bullet List" },
    { key: "numberedList", icon: ListOrdered, label: "Numbered List" },
  ];

  const getCharacterCount = () => {
    return noteText.length;
  };

  const getWordCount = () => {
    return noteText.trim() ? noteText.trim().split(/\s+/).length : 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Private Notepad</h3>
            <p className="text-sm text-gray-500 mt-1">
              Your personal workspace
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isSaved
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              title="Save notes"
            >
              <Save className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 flex flex-col">
          {/* Enhanced Textarea */}
          <div className="flex-1 relative">
            <textarea
              value={noteText}
              onChange={handleTextChange}
              placeholder="Start typing your thoughts, ideas, or notes..."
              className="w-full h-full p-4 border-0 resize-none focus:outline-none text-base text-gray-700 placeholder-gray-400 bg-gray-50 rounded-xl transition-colors focus:bg-white focus:shadow-sm"
              style={{ minHeight: "200px" }}
            />
          </div>

          {/* Enhanced Formatting Toolbar */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {formatButtons.slice(0, 4).map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => handleFormatToggle(key)}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                      activeFormats[key]
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-500"
                    }`}
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                {formatButtons.slice(4).map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => handleFormatToggle(key)}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                      activeFormats[key]
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-500"
                    }`}
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>

              {/* Word and Character Count */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{getWordCount()} words</span>
                <span>{getCharacterCount()} characters</span>
                <div className="flex items-center space-x-1">
                  <Lock className="h-3 w-3" />
                  <span>Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateNotepad;
