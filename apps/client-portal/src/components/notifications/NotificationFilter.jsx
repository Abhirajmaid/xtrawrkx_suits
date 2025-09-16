"use client";

export default function NotificationFilter({ 
  selectedFilter, 
  onChange,
  className = "" 
}) {
  const filters = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "files", label: "Files" },
    { id: "comments", label: "Comments" },
    { id: "milestones", label: "Milestones" },
    { id: "messages", label: "Messages" },
  ];

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${selectedFilter === filter.id
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
