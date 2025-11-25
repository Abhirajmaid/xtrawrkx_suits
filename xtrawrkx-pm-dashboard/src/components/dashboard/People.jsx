import React from "react";
import { ChevronDown, Plus } from "lucide-react";

const People = ({ data }) => {
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <p className="text-gray-900 font-semibold text-base mb-2">
        There&apos;s no people in your workspace
      </p>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        Start inviting your co-workers now!
      </p>
    </div>
  );

  const getAvatarColor = (index) => {
    const colors = [
      "bg-orange-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-teal-500",
      "bg-purple-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl flex flex-col h-full">
      <div className="px-6 py-5 border-b border-white/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              People ({data.length})
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Team members and collaborators
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <span>Frequent Collaborators</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Plus className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {data.map((person, index) => (
              <div
                key={person.id}
                className="bg-white rounded-xl p-4 flex flex-col items-center text-center space-y-3 group cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 border border-gray-100"
              >
                <div
                  className={`w-12 h-12 ${getAvatarColor(index)} rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}
                >
                  <span className="text-white text-sm font-bold">
                    {person.avatar}
                  </span>
                </div>
                <div className="w-full">
                  <h4 className="font-semibold text-gray-900 text-base truncate">
                    {person.name}
                  </h4>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {person.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default People;
