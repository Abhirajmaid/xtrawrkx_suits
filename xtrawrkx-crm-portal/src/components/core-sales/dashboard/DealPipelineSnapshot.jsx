"use client";

import { Card, Badge } from "../../../components/ui";
import { DollarSign, TrendingUp, Target } from "lucide-react";

export default function DealPipelineSnapshot() {
  const pipelineStages = [
    {
      stage: "Qualification",
      count: 12,
      value: 245000,
      color: "bg-blue-500",
      percentage: 25,
    },
    {
      stage: "Proposal",
      count: 8,
      value: 180000,
      color: "bg-yellow-500",
      percentage: 20,
    },
    {
      stage: "Negotiation",
      count: 5,
      value: 125000,
      color: "bg-orange-500",
      percentage: 15,
    },
    {
      stage: "Closing",
      count: 3,
      value: 85000,
      color: "bg-green-500",
      percentage: 10,
    },
  ];

  const totalValue = pipelineStages.reduce((sum, stage) => sum + stage.value, 0);
  const totalDeals = pipelineStages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <Card title="Pipeline Value" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-primary/10 rounded-xl">
          <DollarSign className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <p className="text-3xl font-bold text-brand-foreground">
            ${(totalValue / 1000).toFixed(0)}K
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500 font-medium">+18%</span>
            <span className="text-sm text-brand-text-light">from last month</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-brand-foreground">
            Pipeline Stages
          </h4>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-text-light" />
            <span className="text-sm text-brand-text-light">
              {totalDeals} deals
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {pipelineStages.map((stage, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${stage.color}`}
                  ></div>
                  <span className="text-sm font-medium text-brand-foreground">
                    {stage.stage}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-brand-foreground">
                    ${(stage.value / 1000).toFixed(0)}K
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {stage.count}
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${stage.color}`}
                  style={{ width: `${stage.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-text-light">Conversion Rate</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-brand-foreground">42%</span>
            <Badge variant="success" className="text-xs">+5%</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}