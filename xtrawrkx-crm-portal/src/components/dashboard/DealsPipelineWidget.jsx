"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Badge } from "../ui";
import KanbanBoard from "../kanban/KanbanBoard";
import dealService from "../../lib/api/dealService";
import { formatCurrency } from "../../lib/utils/format";
import {
  DollarSign,
  TrendingUp,
  Eye,
  Plus,
  ArrowRight,
  User,
  Calendar,
  ChevronDown,
} from "lucide-react";

export default function DealsPipelineWidget() {
  const router = useRouter();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await dealService.getAll({
        populate: ["leadCompany", "clientAccount", "contact", "assignedTo"],
        sort: ["createdAt:desc"],
        pagination: { pageSize: 20 }, // Limit for dashboard
      });

      setDeals(response.data || []);
    } catch (error) {
      console.error("Error fetching deals for dashboard:", error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  // Group deals by stage for Kanban view
  const groupDealsByStage = () => {
    const stages = {
      discovery: [],
      proposal: [],
      negotiation: [],
      "closed-won": [],
    };

    deals.forEach((deal) => {
      const stageKey =
        deal.stage?.toLowerCase().replace("_", "-") || "discovery";
      if (stages[stageKey]) {
        stages[stageKey].push(deal);
      }
    });

    return stages;
  };

  // Handle drag and drop
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const draggedDeal = deals.find(
      (deal) => deal.id.toString() === draggableId
    );
    if (!draggedDeal) return;

    const stageMap = {
      discovery: "DISCOVERY",
      proposal: "PROPOSAL",
      negotiation: "NEGOTIATION",
      "closed-won": "CLOSED_WON",
    };

    const newStage = stageMap[destination.droppableId];
    if (!newStage || draggedDeal.stage === newStage) return;

    try {
      await dealService.update(draggedDeal.id, { stage: newStage });

      setDeals((prevDeals) =>
        prevDeals.map((deal) =>
          deal.id === draggedDeal.id ? { ...deal, stage: newStage } : deal
        )
      );
    } catch (error) {
      console.error("Error updating deal stage:", error);
    }
  };

  // Render deal card for dashboard
  const renderDealCard = (deal) => {
    const [showAllFields, setShowAllFields] = useState(false);

    const getPriorityColor = (priority) => {
      switch (priority?.toLowerCase()) {
        case "high":
          return "border-l-red-500 bg-red-50";
        case "medium":
          return "border-l-yellow-500 bg-yellow-50";
        case "low":
          return "border-l-green-500 bg-green-50";
        default:
          return "border-l-orange-500 bg-orange-50";
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
      switch (stage?.toLowerCase()) {
        case "closed_won":
        case "closed-won":
          return "bg-green-100 text-green-600";
        case "closed_lost":
        case "closed-lost":
          return "bg-red-100 text-red-600";
        case "negotiation":
          return "bg-purple-100 text-purple-600";
        case "proposal":
          return "bg-blue-100 text-blue-600";
        case "discovery":
        default:
          return "bg-yellow-100 text-yellow-600";
      }
    };

    return (
      <div
        className={`rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-4 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-move ${getPriorityColor(
          deal.priority
        )}`}
        onClick={() => router.push(`/sales/deals/${deal.id}`)}
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
              {deal.assignedTo?.username || "Unassigned"}
            </span>
          </div>

          {deal.priority && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Priority:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(
                  deal.priority
                )}`}
              >
                {deal.priority}
              </span>
            </div>
          )}

          {deal.expectedCloseDate && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Close Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(deal.expectedCloseDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          {/* Additional fields shown when expanded */}
          {showAllFields && (
            <>
              {deal.createdAt && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(deal.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}

              {deal.updatedAt && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(deal.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}

              {deal.source && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Source:</span>
                  <span className="font-medium text-gray-900 truncate ml-2">
                    {deal.source}
                  </span>
                </div>
              )}

              {deal.description && (
                <div className="text-xs">
                  <span className="text-gray-600">Description:</span>
                  <p className="font-medium text-gray-900 mt-1 text-wrap">
                    {deal.description.length > 100
                      ? `${deal.description.substring(0, 100)}...`
                      : deal.description}
                  </p>
                </div>
              )}

              {deal.probability && (
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

              {deal.tags && deal.tags.length > 0 && (
                <div className="text-xs">
                  <span className="text-gray-600">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {deal.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {deal.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        +{deal.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {deal.nextAction && (
                <div className="text-xs">
                  <span className="text-gray-600">Next Action:</span>
                  <p className="font-medium text-gray-900 mt-1">
                    {deal.nextAction}
                  </p>
                </div>
              )}

              {deal.lostReason && (
                <div className="text-xs">
                  <span className="text-gray-600">Lost Reason:</span>
                  <p className="font-medium text-red-600 mt-1">
                    {deal.lostReason}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Stage Badge */}
        <div className="flex justify-end">
          <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
            {deal.stage?.replace("_", " ") || "Discovery"}
          </span>
        </div>
      </div>
    );
  };

  // Render column header
  const renderColumnHeader = (columnId, cardsCount) => {
    const columnConfig = {
      discovery: {
        title: "Discovery",
        color: "border-yellow-500",
        bg: "bg-yellow-50",
        icon: "🔍",
      },
      proposal: {
        title: "Proposal",
        color: "border-blue-500",
        bg: "bg-blue-50",
        icon: "📋",
      },
      negotiation: {
        title: "Negotiation",
        color: "border-purple-500",
        bg: "bg-purple-50",
        icon: "🤝",
      },
      "closed-won": {
        title: "Closed Won",
        color: "border-green-500",
        bg: "bg-green-50",
        icon: "✅",
      },
    };

    const config = columnConfig[columnId] || {
      title: columnId,
      color: "border-gray-500",
      bg: "bg-gray-50",
      icon: "📁",
    };

    return (
      <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-4 mb-4 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
              <span className="text-lg">{config.icon}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {config.title}
              </h3>
              <p className="text-xs text-gray-500">Pipeline stage</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-gray-800">{cardsCount}</p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span className="w-2 h-2 rounded-full mr-2 bg-orange-500"></span>
              Deals
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Calculate pipeline stats
  const pipelineStats = {
    totalValue: deals.reduce((sum, deal) => sum + (deal.value || 0), 0),
    totalDeals: deals.length,
    wonDeals: deals.filter((deal) => deal.stage === "CLOSED_WON").length,
    avgProbability:
      deals.length > 0
        ? Math.round(
            deals.reduce((sum, deal) => sum + (deal.probability || 0), 0) /
              deals.length
          )
        : 0,
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Deals Pipeline
          </h2>
          <p className="text-sm text-gray-600">
            Drag and drop deals to update their stage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/sales/deals?view=kanban")}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white/80 backdrop-blur-sm border border-white/40 text-gray-700 rounded-xl hover:bg-white/90 transition-all duration-300 shadow-lg"
          >
            <Eye className="w-4 h-4" />
            View All
          </button>
          <button
            onClick={() => router.push("/sales/deals/new")}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Deal
          </button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1 font-medium">
                Total Pipeline
              </p>
              <p className="text-3xl font-black text-gray-800">
                {formatCurrency(pipelineStats.totalValue, {
                  notation: "compact",
                })}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full mr-2 bg-orange-500"></span>
                Pipeline value
              </div>
            </div>
            <div className="w-16 h-16 bg-orange-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1 font-medium">
                Active Deals
              </p>
              <p className="text-3xl font-black text-gray-800">
                {pipelineStats.totalDeals}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full mr-2 bg-orange-500"></span>
                Total deals
              </div>
            </div>
            <div className="w-16 h-16 bg-orange-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1 font-medium">
                Won Deals
              </p>
              <p className="text-3xl font-black text-gray-800">
                {pipelineStats.wonDeals}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full mr-2 bg-orange-500"></span>
                Closed won
              </div>
            </div>
            <div className="w-16 h-16 bg-orange-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
              <User className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <KanbanBoard
            columns={groupDealsByStage()}
            onDragEnd={handleDragEnd}
            renderCard={renderDealCard}
            renderColumnHeader={renderColumnHeader}
            className="gap-4"
          />
        </div>
      </div>

      {/* View All Link */}
      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/sales/deals?view=kanban")}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          View Full Pipeline
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}
