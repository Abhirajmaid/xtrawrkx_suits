import React, { useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Lock } from 'lucide-react';

const PrivateNotepad = () => {
  const [noteText, setNoteText] = useState('');
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    bulletList: false,
    numberedList: false
  });

  const handleFormatToggle = (format) => {
    setActiveFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const formatButtons = [
    { key: 'bold', icon: Bold, label: 'Bold' },
    { key: 'italic', icon: Italic, label: 'Italic' },
    { key: 'underline', icon: Underline, label: 'Underline' },
    { key: 'strikethrough', icon: Strikethrough, label: 'Strikethrough' },
    { key: 'bulletList', icon: List, label: 'Bullet List' },
    { key: 'numberedList', icon: ListOrdered, label: 'Numbered List' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Private Notepad</h3>
          <Lock className="h-4 w-4 text-gray-500" />
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write down anything here..."
            className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 bg-gray-50"
          />
          
          {/* Formatting Toolbar */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-1">
              {formatButtons.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => handleFormatToggle(key)}
                  className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
                    activeFormats[key] ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
                  }`}
                  title={label}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateNotepad;
