"use client";

import { useState } from "react";
import { Card, Badge, Button, Avatar } from "../../../../../../../../../components/ui";
import {
  Plus,
  MoreHorizontal,
  DollarSign,
  Calendar,
  User,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  X
} from "lucide-react";
import KanbanBoard from "../../kanban/KanbanBoard";

// Custom Deal Card Component
function DealCard({ item, onClick, draggableProps = {} }) {
  const deal = item;

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

  return (
    <div
      className={`p-4 rounded-lg border-l-4 cursor-move hover:shadow-md transition-shadow ${getPriorityColor(deal.priority)}`}
      {...draggableProps}
      onClick={() => onClick?.(deal)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-brand-foreground text-sm">{deal.name}</h4>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>

      <p className="text-xs text-brand-text-light mb-3">{deal.company}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-brand-text-light" />
            <span className="text-sm font-medium">${(deal.value / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-brand-text-light" />
            <span className="text-sm">{deal.probability}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-brand-text-light" />
            <span className={`text-xs ${getDaysToCloseColor(deal.daysToClose)}`}>
              {deal.daysToClose < 0 ? `${Math.abs(deal.daysToClose)} days ago` :
               deal.daysToClose === 0 ? 'Today' :
               `${deal.daysToClose} days`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon(deal.status)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Avatar
            name={deal.owner}
            size="sm"
            className="bg-brand-primary/10 text-brand-primary"
          />
          <span className="text-xs text-brand-text-light">{deal.owner}</span>
        </div>

        <div className="text-xs text-brand-text-light">
          Last activity: {deal.lastActivity}
        </div>
      </div>
    </div>
  );
}

export default function PipelineBoard() {
  const [stages, setStages] = useState([
    {
      id: 1,
      name: "Qualification",
      deals: [
        {
          id: 1,
          name: "Enterprise Software License",
          company: "Tech Corp",
          value: 85000,
          probability: 25,
          closeDate: "2024-12-15",
          owner: "Alex Johnson",
          status: "active",
          priority: "high",
          daysToClose: 36,
          lastActivity: "2 days ago"
        },
        {
          id: 2,
          name: "API Integration Package",
          company: "StartupXYZ",
          value: 25000,
          probability: 40,
          closeDate: "2025-01-15",
          owner: "Mike Chen",
          status: "active",
          priority: "medium",
          daysToClose: 67,
          lastActivity: "1 week ago"
        }
      ]
    },
    {
      id: 2,
      name: "Needs Analysis",
      deals: [
        {
          id: 3,
          name: "Implementation Services",
          company: "Design Studio",
          value: 35000,
          probability: 60,
          closeDate: "2024-12-30",
          owner: "Sarah Wilson",
          status: "active",
          priority: "medium",
          daysToClose: 51,
          lastActivity: "3 days ago"
        }
      ]
    },
    {
      id: 3,
      name: "Proposal",
      deals: [
        {
          id: 4,
          name: "Training Workshop",
          company: "Marketing Solutions",
          value: 8000,
          probability: 80,
          closeDate: "2024-11-30",
          owner: "Lisa Wong",
          status: "active",
          priority: "low",
          daysToClose: 21,
          lastActivity: "1 day ago"
        }
      ]
    },
    {
      id: 4,
      name: "Negotiation",
      deals: [
        {
          id: 5,
          name: "Support Contract",
          company: "Global Systems",
          value: 15000,
          probability: 90,
          closeDate: "2024-11-20",
          owner: "Alex Johnson",
          status: "active",
          priority: "high",
          daysToClose: 11,
          lastActivity: "4 hours ago"
        }
      ]
    },
    {
      id: 5,
      name: "Closed Won",
      deals: [
        {
          id: 6,
          name: "Basic License",
          company: "SmallBiz Inc",
          value: 5000,
          probability: 100,
          closeDate: "2024-10-15",
          owner: "Tom Wilson",
          status: "won",
          priority: "low",
          daysToClose: -25,
          lastActivity: "1 month ago"
        }
      ]
    }
  ]);


  const handleItemDrop = (draggedItem, destinationColumnId, destinationIndex, sourceColumnId, sourceIndex) => {
    // Update the deal's stage
    const updatedStages = stages.map(stage => {
      if (stage.id.toString() === sourceColumnId) {
        return {
          ...stage,
          deals: stage.deals.filter(deal => deal.id.toString() !== draggedItem.id.toString())
        };
      }
      if (stage.id.toString() === destinationColumnId) {
        const newDeals = [...stage.deals];
        newDeals.splice(destinationIndex, 0, { ...draggedItem, stage: stage.name });
        return {
          ...stage,
          deals: newDeals
        };
      }
      return stage;
    });

    setStages(updatedStages);
  };

  const handleItemClick = (item) => {
    console.log('Deal clicked:', item);
  };

  const calculateStageValue = (deals) => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const calculateStageProbability = (deals) => {
    if (deals.length === 0) return 0;
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const weightedProbability = deals.reduce((sum, deal) => sum + (deal.value * deal.probability), 0);
    return Math.round(weightedProbability / totalValue);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand-foreground">Sales Pipeline</h2>
          <p className="text-brand-text-light">Drag and drop deals between stages</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-brand-text-light">Total Pipeline</p>
              <p className="text-lg font-semibold text-brand-foreground">
                ${stages.reduce((sum, stage) => sum + calculateStageValue(stage.deals), 0) / 1000}K
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-brand-text-light">Won This Month</p>
              <p className="text-lg font-semibold text-brand-foreground">
                ${stages.find(s => s.name === "Closed Won")?.deals.reduce((sum, deal) => sum + deal.value, 0) / 1000 || 0}K
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-brand-text-light">At Risk</p>
              <p className="text-lg font-semibold text-brand-foreground">
                {stages.reduce((count, stage) => 
                  count + stage.deals.filter(deal => deal.daysToClose <= 7 && deal.daysToClose > 0).length, 0
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-brand-text-light">Avg. Probability</p>
              <p className="text-lg font-semibold text-brand-foreground">
                {Math.round(stages.reduce((sum, stage) => sum + calculateStageProbability(stage.deals), 0) / stages.length)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pipeline Board */}
      <KanbanBoard
        initialColumns={stages.map(stage => ({
          id: stage.id.toString(),
          title: stage.name,
          items: stage.deals.map(deal => ({
            ...deal,
            id: deal.id.toString(),
            title: deal.name,
            description: deal.company,
          })),
          color: '#3b82f6'
        }))}
        onItemDrop={handleItemDrop}
        onItemClick={handleItemClick}
        cardComponent={DealCard}
        showColumnStats={true}
        className="gap-6"
      />
    </div>
  );
}
