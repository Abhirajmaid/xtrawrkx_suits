"use client";

import React, { useState } from "react";
import { KanbanBoard, KanbanCard } from "./index";
// import { useDragDropBoard } from "../../lib/dragdrop"; // Removed - using react-beautiful-dnd now
import { formatCurrency, formatDate } from "../../lib/utils";
import { Plus, Filter, Search, BarChart3 } from "lucide-react";

// Custom Deal Card Component
function DealCard({ item, columnId, itemIndex, isDragging, onDragStart, onDragEnd, onClick }) {


  const getProbabilityColor = (probability) => {
    if (probability >= 80) return "text-green-600";
    if (probability >= 60) return "text-yellow-600";
    if (probability >= 40) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onClick?.(item)}
      className={`bg-white rounded-lg border border-gray-200 p-4 cursor-move hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : 'hover:border-brand-primary/50'
      }`}
    >
      {/* Deal Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate mb-1">
            {item.name}
          </h4>
          <p className="text-sm text-gray-600 truncate">
            {item.company}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(item.value)}
          </div>
          <div className={`text-sm font-medium ${getProbabilityColor(item.probability)}`}>
            {item.probability}%
          </div>
        </div>
      </div>

      {/* Deal Details */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Owner:</span>
          <span className="font-medium text-gray-900">{item.owner}</span>
        </div>
        
        {item.closeDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Close Date:</span>
            <span className="font-medium text-gray-900">
              {formatDate(item.closeDate, 'en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              item.probability >= 80
                ? "bg-green-500"
                : item.probability >= 60
                ? "bg-yellow-500"
                : item.probability >= 40
                ? "bg-orange-500"
                : "bg-red-500"
            }`}
            style={{ width: `${item.probability}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {item.tags && item.tags.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            {tag}
          </span>
        ))}
        {item.tags && item.tags.length > 2 && (
          <span className="text-xs text-gray-400">
            +{item.tags.length - 2}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DealsPipeline() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Mock initial data
  const initialColumns = [
    {
      id: "prospecting",
      title: "Prospecting",
      color: "#fef3c7",
      items: [
        {
          id: "d1",
          name: "Enterprise CRM Implementation",
          company: "TechCorp Inc.",
          value: 75000,
          probability: 25,
          owner: "John Smith",
          closeDate: "2024-02-15",
          tags: ["enterprise", "crm"],
        },
        {
          id: "d2",
          name: "Marketing Automation Setup",
          company: "StartupXYZ",
          value: 25000,
          probability: 40,
          owner: "Jane Doe",
          closeDate: "2024-01-30",
          tags: ["marketing", "automation"],
        },
      ],
    },
    {
      id: "qualification",
      title: "Qualification",
      color: "#dbeafe",
      items: [
        {
          id: "d3",
          name: "Q1 Support Package",
          company: "Global Solutions",
          value: 15000,
          probability: 60,
          owner: "Mike Johnson",
          closeDate: "2024-01-20",
          tags: ["support", "quarterly"],
        },
      ],
    },
    {
      id: "proposal",
      title: "Proposal",
      color: "#e0e7ff",
      items: [
        {
          id: "d4",
          name: "Advanced Analytics Dashboard",
          company: "InnovateLab",
          value: 40000,
          probability: 75,
          owner: "Sarah Wilson",
          closeDate: "2024-02-01",
          tags: ["analytics", "dashboard"],
        },
      ],
    },
    {
      id: "negotiation",
      title: "Negotiation",
      color: "#f3e8ff",
      items: [
        {
          id: "d5",
          name: "E-commerce Platform",
          company: "GrowthCo",
          value: 60000,
          probability: 85,
          owner: "John Smith",
          closeDate: "2024-01-25",
          tags: ["ecommerce", "platform"],
        },
      ],
    },
    {
      id: "closed-won",
      title: "Closed Won",
      color: "#d1fae5",
      items: [
        {
          id: "d6",
          name: "Website Redesign",
          company: "ClientABC",
          value: 30000,
          probability: 100,
          owner: "Jane Doe",
          closeDate: "2024-01-15",
          tags: ["website", "design"],
        },
      ],
    },
  ];

  const handleItemDrop = (item, sourceColumnId, targetColumnId, newIndex) => {
    console.log("Deal moved:", {
      item: item.name,
      from: sourceColumnId,
      to: targetColumnId,
      index: newIndex,
    });
    
    // Here you would typically make an API call to update the deal stage
    // Example:
    // fetch(`/api/deals/${item.id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ stage: targetColumnId })
    // });
  };

  const handleDealClick = (deal, columnId) => {
    console.log("Deal clicked:", deal.name, "in column:", columnId);
    // Navigate to deal detail page
    // router.push(`/sales/deals/${deal.id}`);
  };

  const handleAddDeal = (column) => {
    console.log("Add deal to column:", column.title);
    // Open add deal modal or navigate to create deal page
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        <KanbanBoard
          initialColumns={initialColumns}
          onItemDrop={handleItemDrop}
          onItemClick={handleDealClick}
          onColumnClick={handleAddDeal}
          cardComponent={DealCard}
          showColumnStats={true}
          className="min-h-[600px]"
        />
      </div>
    </div>
  );
}
