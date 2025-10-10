"use client";

import { Card, Badge, Button } from "@xtrawrkx/ui";
import {
  Clock,
  DollarSign,
  User,
  Calendar,
  ArrowRight,
  AlertCircle
} from "lucide-react";

export default function ClosingSoonCard() {
  const closingDeals = [
    {
      id: 1,
      name: "Tech Corp Enterprise License",
      value: 85000,
      closeDate: "Today",
      probability: 90,
      owner: "Alex Johnson",
      company: "Tech Corp",
      status: "urgent",
      daysLeft: 0,
    },
    {
      id: 2,
      name: "Design Studio Project Management",
      value: 45000,
      closeDate: "Tomorrow",
      probability: 75,
      owner: "Sarah Wilson",
      company: "Design Studio",
      status: "high",
      daysLeft: 1,
    },
    {
      id: 3,
      name: "Marketing Agency CRM Setup",
      value: 32000,
      closeDate: "This Week",
      probability: 60,
      owner: "Mike Chen",
      company: "Marketing Pro",
      status: "medium",
      daysLeft: 5,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'urgent') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return <Clock className="w-4 h-4 text-brand-text-light" />;
  };

  const totalValue = closingDeals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <Card title="Closing Soon" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-primary/10 rounded-xl">
          <Calendar className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <p className="text-3xl font-bold text-brand-foreground">
            ${(totalValue / 1000).toFixed(0)}K
          </p>
          <p className="text-sm text-brand-text-light">
            {closingDeals.length} deals this week
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-brand-foreground">
            Deals Requiring Attention
          </h4>
          <Button variant="ghost" size="sm" className="text-xs">
            View All
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {closingDeals.map((deal) => (
            <div
              key={deal.id}
              className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${getStatusColor(deal.status)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(deal.status)}
                    <h5 className="font-semibold text-sm text-brand-foreground truncate">
                      {deal.name}
                    </h5>
                  </div>
                  <p className="text-xs text-brand-text-light">
                    {deal.company}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-foreground">
                    ${(deal.value / 1000).toFixed(0)}K
                  </p>
                  <Badge
                    variant={deal.probability >= 80 ? "success" : deal.probability >= 60 ? "warning" : "secondary"}
                    className="text-xs"
                  >
                    {deal.probability}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-brand-text-light" />
                  <span className="text-brand-text-light">{deal.owner}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-brand-text-light" />
                  <span className={`font-medium ${
                    deal.daysLeft === 0 ? 'text-red-600' :
                    deal.daysLeft <= 2 ? 'text-orange-600' :
                    'text-brand-text-light'
                  }`}>
                    {deal.closeDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-text-light">Active Deals</span>
          <span className="text-lg font-bold text-brand-foreground">16</span>
        </div>
      </div>
    </Card>
  );
}