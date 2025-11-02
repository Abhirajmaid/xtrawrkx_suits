import React from "react";
import { Card, Avatar, Badge } from "../../../../components/ui";
import { User, Star, Phone, Mail, Calendar, DollarSign } from "lucide-react";
// import { formatDate } from '@xtrawrkx/utils';
import KanbanBoard from "../../../../components/kanban/KanbanBoard";

export default function LeadsBoardView({
  updatedColumns,
  formatNumber = (value) => value?.toLocaleString() || "0",
  onItemDrop,
  onItemClick,
}) {
  // Transform data to match KanbanBoard expected format
  const transformedData = {};

  if (updatedColumns && Array.isArray(updatedColumns)) {
    updatedColumns.forEach((column) => {
      transformedData[column.id] = (column.leads || []).map((lead, index) => ({
        ...lead,
        id: lead.id ? lead.id.toString() : `${column.id}-${index}`, // Ensure unique, stable IDs
      }));
    });
  }

  // Handle drag end - update lead status
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Find the dragged lead
    const sourceCards = transformedData[source.droppableId];
    const draggedLead = sourceCards.find(
      (lead) => lead.id.toString() === draggableId
    );

    if (draggedLead && onItemDrop) {
      onItemDrop(
        draggedLead,
        destination.droppableId,
        destination.index,
        source.droppableId,
        source.index
      );
    }
  };

  // Render individual lead card
  const renderLeadCard = (lead) => (
    <Card
      className="p-3 cursor-move bg-white border border-gray-200 hover:shadow-md transition-all"
      onClick={() => onItemClick?.(lead)}
    >
      {/* Header with Avatar and Name */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          alt={lead?.name || "Unknown"}
          fallback={(lead?.name?.charAt(0) || "?").toUpperCase()}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate">
            {lead?.name || "Unknown"}
          </h4>
          <p className="text-xs text-gray-500 truncate">
            {lead?.company || "N/A"}
          </p>
        </div>
      </div>

      {/* Value and Score */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-900">
          ${lead?.value ? formatNumber(lead.value) : "0"}
        </span>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs text-gray-600">{lead?.score || "0"}</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="truncate">{lead?.phone || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="truncate">{lead?.email || "N/A"}</span>
        </div>
      </div>

      {/* Date and Source */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span className="whitespace-nowrap">
            {formatDate(lead?.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          <span className="truncate">{lead?.source || "N/A"}</span>
        </div>
      </div>
    </Card>
  );

  // Render column headers
  const renderColumnHeader = (columnId, cardsCount) => {
    const columnConfig = {
      new: { title: "New", color: "border-blue-500", bg: "bg-blue-50" },
      contacted: {
        title: "Contacted",
        color: "border-yellow-500",
        bg: "bg-yellow-50",
      },
      qualified: {
        title: "Qualified",
        color: "border-green-500",
        bg: "bg-green-50",
      },
      lost: { title: "Lost", color: "border-red-500", bg: "bg-red-50" },
    };

    const config = columnConfig[columnId] || {
      title: columnId,
      color: "border-gray-500",
      bg: "bg-gray-50",
    };

    return (
      <div
        className={`${config.bg} rounded-lg p-4 mb-4 border-l-4 ${config.color}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm">
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
  if (!updatedColumns || !Array.isArray(updatedColumns)) {
    return (
      <div className="mt-4">
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm">No board data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <KanbanBoard
        columns={transformedData}
        onDragEnd={handleDragEnd}
        renderCard={renderLeadCard}
        renderColumnHeader={renderColumnHeader}
        className="min-w-[1600px]"
      />
    </div>
  );
}
