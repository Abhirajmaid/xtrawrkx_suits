"use client";

import React, { useState } from "react";
import { Badge } from "../../../../components/ui";
import { formatCurrency } from "../../../../lib/utils/format";
import {
  User,
  Building2,
  Calendar,
  TrendingUp,
  Target,
  IndianRupee,
  Eye,
  Search,
  FileText,
  Handshake,
  CheckCircle2,
  XCircle,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import KanbanBoard from "../../../../components/kanban/KanbanBoard";

// Local utility function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Deal Card Component with expandable fields
function DealCard({ deal, snapshot, onItemClick }) {
  const [showAllFields, setShowAllFields] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-orange-500";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusBadgeColor = (stage) => {
    const stageLower = stage?.toLowerCase();
    if (stageLower === "won" || stageLower === "closed_won") {
      return "bg-green-100 text-green-600";
    }
    if (stageLower === "lost" || stageLower === "closed_lost") {
      return "bg-red-100 text-red-600";
    }
    if (stageLower === "negotiation") {
      return "bg-purple-100 text-purple-600";
    }
    if (stageLower === "proposal") {
      return "bg-blue-100 text-blue-600";
    }
    return "bg-yellow-100 text-yellow-600";
  };

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-4 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-move ${getPriorityColor(
        deal.priority
      )} ${snapshot?.isDragging ? "shadow-2xl rotate-2 opacity-90" : ""}`}
      onClick={() => {
        if (!snapshot?.isDragging) {
          onItemClick?.(deal);
        }
      }}
    >
      {/* Deal Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate text-sm mb-1">
            {deal.name || "Untitled Deal"}
          </h4>
          <p className="text-xs text-gray-600 truncate">
            {deal.leadCompany?.companyName ||
              deal.clientAccount?.companyName ||
              deal.company ||
              "No Company"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAllFields(!showAllFields);
            }}
            className="w-8 h-8 bg-white/80 backdrop-blur-sm border border-white/40 rounded-lg flex items-center justify-center hover:bg-white/90 transition-all duration-200"
          >
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                showAllFields ? "rotate-180" : ""
              }`}
            />
          </button>
          <div className="w-10 h-10 bg-orange-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
            <DollarSign className="w-5 h-5 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Deal Value */}
      <div className="mb-3">
        <p className="text-2xl font-black text-gray-800">
          {formatCurrency(deal.value || 0, { notation: "compact" })}
        </p>
        <div className="mt-1 flex items-center text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full mr-2 bg-orange-500"></span>
          Deal value
        </div>
      </div>

      {/* Deal Details */}
      <div className="space-y-2 mb-3">
        {/* Always visible fields */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Owner:</span>
          <span className="font-medium text-gray-900 truncate ml-2">
            {deal.assignedTo?.firstName || deal.assignedTo?.lastName
              ? `${deal.assignedTo.firstName || ""} ${
                  deal.assignedTo.lastName || ""
                }`.trim()
              : deal.assignedTo?.username || "Unassigned"}
          </span>
        </div>

        {deal.priority && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Priority:</span>
            <span
              className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityBadgeColor(
                deal.priority
              )}`}
            >
              {deal.priority}
            </span>
          </div>
        )}

        {(deal.closeDate || deal.expectedCloseDate) && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Close Date:</span>
            <span className="font-medium text-gray-900">
              {formatDate(deal.closeDate || deal.expectedCloseDate)}
            </span>
          </div>
        )}

        {/* Additional fields shown when expanded */}
        {showAllFields && (
          <>
            {deal.probability !== undefined && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Probability:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {deal.probability}%
                  </span>
                  <div className="w-12 bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-orange-500 h-1 rounded-full"
                      style={{ width: `${deal.probability}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {deal.createdAt && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(deal.createdAt)}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stage Badge */}
      <div className="flex justify-end">
        <span
          className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadgeColor(
            deal.stage
          )}`}
        >
          {deal.stage?.replace("_", " ") || "Discovery"}
        </span>
      </div>
    </div>
  );
}

export default function DealsBoardView({ columns, onDragEnd, onItemClick }) {
  // Render individual deal card
  const renderDealCard = (deal, provided, snapshot) => {
    return (
      <DealCard deal={deal} snapshot={snapshot} onItemClick={onItemClick} />
    );
  };

  // Render column headers (simplified)
  const renderColumnHeader = (columnId, cardsCount) => {
    const columnConfig = {
      discovery: {
        title: "Discovery",
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-400",
        shadow: "shadow-blue-200",
      },
      proposal: {
        title: "Proposal",
        bg: "bg-purple-100",
        text: "text-purple-800",
        border: "border-purple-400",
        shadow: "shadow-purple-200",
      },
      negotiation: {
        title: "Negotiation",
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-400",
        shadow: "shadow-orange-200",
      },
      "closed-won": {
        title: "Closed Won",
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-400",
        shadow: "shadow-green-200",
      },
      "closed-lost": {
        title: "Closed Lost",
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-400",
        shadow: "shadow-red-200",
      },
    };

    const config = columnConfig[columnId] || {
      title: columnId,
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-400",
      shadow: "shadow-gray-200",
    };

    return (
      <div
        className={`rounded-lg p-3 mb-4 border-l-4 ${config.bg} ${config.text} ${config.border} ${config.shadow} shadow-md`}
      >
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${config.text} text-sm`}>
            {config.title}
          </h3>
          <span className="bg-white text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
            {cardsCount}
          </span>
        </div>
      </div>
    );
  };

  // Handle missing data
  if (!columns || Object.keys(columns).length === 0) {
    return (
      <div className="mt-4">
        <div className="text-center py-12 text-gray-500">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium">No deals available</p>
          <p className="text-xs mt-1">Create a new deal to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Kanban Board */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <KanbanBoard
          columns={columns}
          onDragEnd={onDragEnd}
          renderCard={renderDealCard}
          renderColumnHeader={renderColumnHeader}
          className="min-w-[1600px]"
        />
      </div>
    </div>
  );
}
