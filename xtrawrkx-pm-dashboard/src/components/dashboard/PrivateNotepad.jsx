import React, { useState, useEffect, useRef } from "react";
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

const PrivateNotepad = ({ userId }) => {
  const textareaRef = useRef(null);
  const [noteText, setNoteText] = useState("");
  const [isSaved, setIsSaved] = useState(true);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  // Get storage key for this user's notepad
  const getStorageKey = () => {
    return `xtrawrkx-private-notepad-${userId || 'default'}`;
  };

  // Load saved notes from localStorage on mount
  useEffect(() => {
    const storageKey = getStorageKey();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setNoteText(saved);
      setIsSaved(true);
    } else {
      setNoteText("");
    }
  }, [userId]);

  // Save selection when textarea focus changes
  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart);
      setSelectionEnd(textareaRef.current.selectionEnd);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setNoteText(newText);
    setIsSaved(false);
    handleSelectionChange();
    
    // Auto-save to localStorage after a short delay
    if (window.notepadSaveTimeout) {
      clearTimeout(window.notepadSaveTimeout);
    }
    window.notepadSaveTimeout = setTimeout(() => {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, newText);
      setIsSaved(true);
      // Show saved indicator for 2 seconds
      setTimeout(() => setIsSaved(false), 2000);
    }, 1000); // Auto-save after 1 second of no typing
  };

  const handleSave = () => {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, noteText);
    setIsSaved(true);
    // Show saved indicator for 2 seconds
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Apply formatting to selected text
  const applyFormatting = (formatType) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = noteText.substring(start, end);
    
    // Handle list formatting (requires selection)
    if (formatType === 'bulletList' || formatType === 'numberedList') {
      if (start === end) {
        // No selection, insert at cursor position
        const lines = selectedText.split('\n');
        let formattedText = '';
        if (formatType === 'bulletList') {
          formattedText = '• ';
        } else {
          formattedText = '1. ';
        }
        const newText = noteText.substring(0, start) + formattedText + noteText.substring(end);
        setNoteText(newText);
        setIsSaved(false);
        
        // Position cursor after the marker
        setTimeout(() => {
          if (textareaRef.current) {
            const cursorPos = start + formattedText.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(cursorPos, cursorPos);
          }
        }, 0);
        
        // Auto-save
        const storageKey = getStorageKey();
        localStorage.setItem(storageKey, newText);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        return;
      }
      
      // Has selection - format the selected lines
      const lines = selectedText.split('\n');
      let formattedText = '';
      
      if (formatType === 'bulletList') {
        formattedText = lines.map(line => line.trim() ? `• ${line.trim()}` : line).join('\n');
      } else {
        // numberedList
        const nonEmptyLines = lines.filter(line => line.trim());
        formattedText = lines.map(line => {
          if (!line.trim()) return line;
          const index = nonEmptyLines.indexOf(line.trim());
          return `${index + 1}. ${line.trim()}`;
        }).join('\n');
      }
      
      const newText = noteText.substring(0, start) + formattedText + noteText.substring(end);
      setNoteText(newText);
      setIsSaved(false);
      
      // Restore selection after state update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(start, start + formattedText.length);
        }
      }, 0);
      
      // Auto-save
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, newText);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      return;
    }
    
    // Handle text formatting (bold, italic, underline, strikethrough)
    if (start === end) {
      // No selection for text formatting, just insert markers at cursor
      let markers = '';
      switch (formatType) {
        case 'bold': markers = '****'; break;
        case 'italic': markers = '**'; break;
        case 'underline': markers = '__'; break;
        case 'strikethrough': markers = '~~'; break;
        default: return;
      }
      const newText = noteText.substring(0, start) + markers + noteText.substring(end);
      setNoteText(newText);
      setIsSaved(false);
      
      // Position cursor in middle of markers
      setTimeout(() => {
        if (textareaRef.current) {
          const cursorPos = start + (markers.length / 2);
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(cursorPos, cursorPos);
        }
      }, 0);
      
      // Auto-save
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, newText);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      return;
    }

    // Has selection - apply formatting to selected text
    let formattedText = selectedText;
    let newStart = start;
    let newEnd = end;

    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      default:
        return;
    }

    const newText = noteText.substring(0, start) + formattedText + noteText.substring(end);
    newEnd = start + formattedText.length;

    setNoteText(newText);
    setIsSaved(false);
    
    // Restore selection after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newStart, newEnd);
      }
    }, 0);

    // Auto-save
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, newText);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
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

  const hasSelection = selectionStart !== selectionEnd;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl flex flex-col h-full">
      <div className="px-6 py-5 border-b border-white/30">
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
              ref={textareaRef}
              value={noteText}
              onChange={handleTextChange}
              onSelect={handleSelectionChange}
              onClick={handleSelectionChange}
              onKeyUp={handleSelectionChange}
              placeholder={noteText ? "" : "Write down anything here..."}
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
                    onClick={() => applyFormatting(key)}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                      hasSelection
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
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
                    onClick={() => applyFormatting(key)}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                      hasSelection
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
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
