"use client";

import { Card, Badge } from "../../../../../../../../../components/ui";
import {
  Users,
  TrendingUp,
  Flame,
  Thermometer,
  Snowflake,
} from "lucide-react";

export default function LeadStatsCard() {
  const leadSegments = [
    {
      segment: "Hot Leads",
      count: 73,
      change: "+12%",
      icon: Flame,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      segment: "Warm Leads",
      count: 45,
      change: "+18%",
      icon: Thermometer,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      segment: "Cold Leads",
      count: 28,
      change: "+5%",
      icon: Snowflake,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  ];

  const leadSources = [
    { source: "Website", count: 45, percentage: 38 },
    { source: "Referral", count: 32, percentage: 27 },
    { source: "Social Media", count: 25, percentage: 21 },
    { source: "Email Campaign", count: 16, percentage: 14 },
  ];

  return (
    <Card title="Total Leads" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-primary/10 rounded-xl">
          <Users className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <p className="text-3xl font-bold text-brand-foreground">146</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500 font-medium">+12%</span>
            <span className="text-sm text-brand-text-light">from last month</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-brand-foreground">Lead Segments</h4>
        <div className="space-y-3">
          {leadSegments.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl border ${segment.bgColor} ${segment.borderColor}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${segment.color}`} />
                  <span className="text-sm font-medium text-brand-foreground">
                    {segment.segment}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-brand-foreground">
                    {segment.count}
                  </span>
                  <Badge variant="success" className="text-xs">
                    {segment.change}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-brand-foreground">Lead Sources</h4>
        <div className="space-y-2">
          {leadSources.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-brand-foreground">{source.source}</span>
              <div className="flex items-center gap-3">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-primary h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-brand-foreground w-8">
                  {source.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}