import { List, Grid3X3 } from 'lucide-react';

export default function LeadsTabs({ 
  tabItems, 
  activeTab, 
  setActiveTab, 
  activeView, 
  setActiveView 
}) {
  return (
    <div className="flex items-center justify-between">
      {/* Custom Tab Navigation */}
      <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabItems.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
              activeTab === tab.key
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-200 text-gray-600"
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>
      
      {/* View Toggle Buttons */}
      <div className="flex items-center bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveView("list")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeView === "list"
              ? "bg-white text-blue-600 shadow-sm border border-blue-200"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <List className="w-4 h-4" />
          List View
        </button>
        <button
          onClick={() => setActiveView("board")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeView === "board"
              ? "bg-white text-blue-600 shadow-sm border border-blue-200"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
          Board View
        </button>
      </div>
    </div>
  );
}
