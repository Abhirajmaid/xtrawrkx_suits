"use client";

import { useState, useEffect } from "react";
import { Card, Avatar, Badge } from "../ui";
import { formatCurrency } from "../../lib/utils/format";
import {
  Trophy,
  TrendingUp,
  Target,
  Award,
  Star,
  Users,
  DollarSign,
  Calendar,
  ArrowUpRight,
  Crown,
} from "lucide-react";

export default function TopPerformersWidget() {
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    // Simulate fetching performance data
    setTimeout(() => {
      setPerformers(generateMockPerformers());
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const generateMockPerformers = () => {
    const salesReps = [
      {
        id: 1,
        name: 'Alex Johnson',
        avatar: 'AJ',
        role: 'Senior Sales Manager',
        revenue: 285000,
        deals: 12,
        conversionRate: 85,
        target: 300000,
        rank: 1,
        trend: 'up',
        trendValue: 15,
        badge: 'top-performer'
      },
      {
        id: 2,
        name: 'Sarah Wilson',
        avatar: 'SW',
        role: 'Sales Executive',
        revenue: 245000,
        deals: 18,
        conversionRate: 78,
        target: 250000,
        rank: 2,
        trend: 'up',
        trendValue: 12,
        badge: 'rising-star'
      },
      {
        id: 3,
        name: 'Mike Chen',
        avatar: 'MC',
        role: 'Account Manager',
        revenue: 198000,
        deals: 15,
        conversionRate: 72,
        target: 200000,
        rank: 3,
        trend: 'up',
        trendValue: 8,
        badge: 'consistent'
      },
      {
        id: 4,
        name: 'Lisa Wong',
        avatar: 'LW',
        role: 'Sales Representative',
        revenue: 167000,
        deals: 22,
        conversionRate: 65,
        target: 180000,
        rank: 4,
        trend: 'down',
        trendValue: -3,
        badge: 'high-volume'
      },
      {
        id: 5,
        name: 'Tom Wilson',
        avatar: 'TW',
        role: 'Junior Sales Rep',
        revenue: 125000,
        deals: 14,
        conversionRate: 58,
        target: 150000,
        rank: 5,
        trend: 'up',
        trendValue: 25,
        badge: 'newcomer'
      }
    ];

    return salesReps;
  };

  const getBadgeConfig = (badge) => {
    const configs = {
      'top-performer': {
        icon: Crown,
        color: 'text-yellow-600 bg-yellow-100',
        label: 'Top Performer'
      },
      'rising-star': {
        icon: Star,
        color: 'text-purple-600 bg-purple-100',
        label: 'Rising Star'
      },
      'consistent': {
        icon: Target,
        color: 'text-blue-600 bg-blue-100',
        label: 'Consistent'
      },
      'high-volume': {
        icon: TrendingUp,
        color: 'text-green-600 bg-green-100',
        label: 'High Volume'
      },
      'newcomer': {
        icon: Award,
        color: 'text-orange-600 bg-orange-100',
        label: 'Newcomer'
      }
    };

    return configs[badge] || configs['consistent'];
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Award className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <Card className="p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Top Performers</h2>
          <p className="text-sm text-gray-600">Sales team leaderboard</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <Trophy className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Performers List */}
      <div className="space-y-4">
        {performers.map((performer) => {
          const badgeConfig = getBadgeConfig(performer.badge);
          const BadgeIcon = badgeConfig.icon;
          const progressPercentage = (performer.revenue / performer.target) * 100;

          return (
            <div key={performer.id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
              {/* Rank */}
              <div className="flex-shrink-0 w-8 flex justify-center">
                {getRankIcon(performer.rank)}
              </div>

              {/* Avatar */}
              <Avatar
                name={performer.name}
                size="md"
                className="flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {performer.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${badgeConfig.color}`}>
                      <BadgeIcon className="w-3 h-3 mr-1" />
                      {badgeConfig.label}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">{performer.role}</p>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Revenue</span>
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(performer.revenue)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Deals</span>
                    <div className="font-semibold text-gray-900">
                      {performer.deals}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Win Rate</span>
                    <div className="font-semibold text-gray-900">
                      {performer.conversionRate}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      Target Progress
                    </span>
                    <span className="text-xs font-medium text-gray-900">
                      {progressPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        progressPercentage >= 100
                          ? 'bg-green-500'
                          : progressPercentage >= 80
                          ? 'bg-blue-500'
                          : progressPercentage >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Trend */}
              <div className="flex-shrink-0">
                <div className={`flex items-center gap-1 ${
                  performer.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <ArrowUpRight className={`w-4 h-4 ${
                    performer.trend === 'down' ? 'rotate-90' : ''
                  }`} />
                  <span className="text-sm font-medium">
                    {Math.abs(performer.trendValue)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(performers.reduce((sum, p) => sum + p.revenue, 0))}
            </div>
            <div className="text-xs text-gray-500">Total Revenue</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {performers.reduce((sum, p) => sum + p.deals, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Deals</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(performers.reduce((sum, p) => sum + p.conversionRate, 0) / performers.length)}%
            </div>
            <div className="text-xs text-gray-500">Avg Win Rate</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
