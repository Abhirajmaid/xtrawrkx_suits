"use client";

import { useState } from "react";
import { Card, Badge, Button, Avatar } from "../../../../../../../../../components/ui";
import {
  MoreHorizontal,
  DollarSign,
  Calendar,
  User,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  X,
  Edit,
  Eye,
  Phone,
  Mail,
  MessageSquare
} from "lucide-react";

export default function DealCard({ deal, onEdit, onView, onDelete, onMove }) {
  const [showActions, setShowActions] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'won':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'lost':
        return <X className="w-4 h-4 text-red-500" />;
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDaysToCloseColor = (days) => {
    if (days < 0) return 'text-green-600';
    if (days <= 7) return 'text-red-600';
    if (days <= 30) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-green-600 bg-green-50';
    if (probability >= 60) return 'text-orange-600 bg-orange-50';
    if (probability >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatDaysToClose = (days) => {
    if (days < 0) return `${Math.abs(days)} days ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  const isAtRisk = deal.daysToClose <= 7 && deal.daysToClose > 0;
  const isOverdue = deal.daysToClose < 0;

  return (
    <div className="relative">
      <Card className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all duration-200 ${getPriorityColor(deal.priority)}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-brand-foreground text-sm truncate">{deal.name}</h4>
            <p className="text-xs text-brand-text-light truncate">{deal.company}</p>
          </div>
          <div className="flex items-center gap-1">
            {isAtRisk && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Deal Info */}
        <div className="space-y-2">
          {/* Value and Probability */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-brand-text-light" />
              <span className="text-sm font-semibold text-brand-foreground">
                ${(deal.value / 1000).toFixed(0)}K
              </span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(deal.probability)}`}>
              {deal.probability}%
            </div>
          </div>

          {/* Close Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-brand-text-light" />
              <span className="text-xs text-brand-text-light">
                {deal.closeDate}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {getStatusIcon(deal.status)}
            </div>
          </div>

          {/* Days to Close */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-text-light" />
              <span className={`text-xs font-medium ${getDaysToCloseColor(deal.daysToClose)}`}>
                {formatDaysToClose(deal.daysToClose)}
              </span>
            </div>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
          </div>

          {/* Owner */}
          <div className="flex items-center gap-2">
            <Avatar
              name={deal.owner}
              size="sm"
              className="bg-brand-primary/10 text-brand-primary"
            />
            <span className="text-xs text-brand-text-light">{deal.owner}</span>
          </div>

          {/* Last Activity */}
          <div className="text-xs text-brand-text-light">
            Last activity: {deal.lastActivity}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
                deal.probability >= 80 ? 'bg-green-500' :
                deal.probability >= 60 ? 'bg-yellow-500' :
                deal.probability >= 40 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${deal.probability}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 mt-3 pt-2 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(deal);
            }}
            className="flex-1"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(deal);
            }}
            className="flex-1"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Handle call action
            }}
            className="flex-1"
          >
            <Phone className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Handle email action
            }}
            className="flex-1"
          >
            <Mail className="w-3 h-3" />
          </Button>
        </div>
      </Card>

      {/* Actions Dropdown */}
      {showActions && (
        <div className="absolute top-12 right-2 z-10 bg-white border border-brand-border rounded-lg shadow-lg py-1 min-w-[160px]">
          <button
            className="w-full px-3 py-2 text-left text-sm text-brand-foreground hover:bg-gray-50 flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(deal);
              setShowActions(false);
            }}
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button
            className="w-full px-3 py-2 text-left text-sm text-brand-foreground hover:bg-gray-50 flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(deal);
              setShowActions(false);
            }}
          >
            <Edit className="w-4 h-4" />
            Edit Deal
          </button>
          <button
            className="w-full px-3 py-2 text-left text-sm text-brand-foreground hover:bg-gray-50 flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              // Handle duplicate action
              setShowActions(false);
            }}
          >
            <MessageSquare className="w-4 h-4" />
            Duplicate
          </button>
          <div className="border-t border-gray-200 my-1" />
          <button
            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(deal);
              setShowActions(false);
            }}
          >
            <X className="w-4 h-4" />
            Delete Deal
          </button>
        </div>
      )}

      {/* Click outside to close actions */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
}
