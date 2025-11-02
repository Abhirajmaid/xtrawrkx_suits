"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui";
import SimpleLineChart from "../charts/SimpleLineChart";
import SimpleBarChart from "../charts/SimpleBarChart";
import dealService from "../../lib/api/dealService";
import { formatCurrency } from "../../lib/utils/format";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function SalesAnalyticsWidget() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    monthlyRevenue: [],
    dealsByStage: [],
    conversionRate: 0,
    avgDealSize: 0,
    salesVelocity: 0,
    trends: {
      revenue: { value: 0, change: 0, isPositive: true },
      deals: { value: 0, change: 0, isPositive: true },
      conversion: { value: 0, change: 0, isPositive: true }
    }
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch deals data
      const dealsResponse = await dealService.getAll({
        populate: ["leadCompany", "clientAccount"],
        pagination: { pageSize: 1000 }
      });
      
      const deals = dealsResponse.data || [];
      
      // Generate monthly revenue data (last 6 months) from real deals
      const monthlyRevenue = generateMonthlyRevenue(deals);
      
      // Group deals by stage from real data
      const dealsByStage = generateDealsByStage(deals);
      
      // Calculate metrics
      const metrics = calculateMetrics(deals);
      
      setAnalyticsData({
        monthlyRevenue,
        dealsByStage,
        ...metrics
      });
      
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyRevenue = (deals) => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Calculate revenue for this month from closed won deals
      const monthDeals = deals.filter(deal => {
        const dealData = deal.attributes || deal;
        if (!dealData.expectedCloseDate && !dealData.closedDate && !dealData.updatedAt) return false;
        
        // Try different date fields
        const dealDate = dealData.closedDate 
          ? new Date(dealData.closedDate)
          : dealData.expectedCloseDate 
            ? new Date(dealData.expectedCloseDate)
            : new Date(dealData.updatedAt);
            
        return dealDate.getMonth() === date.getMonth() && 
               dealDate.getFullYear() === date.getFullYear() &&
               dealData.stage === 'CLOSED_WON';
      });
      
      const revenue = monthDeals.reduce((sum, deal) => {
        const dealData = deal.attributes || deal;
        return sum + (parseFloat(dealData.value) || 0);
      }, 0);
      
      months.push({
        label: monthName,
        value: revenue
      });
    }
    
    return months;
  };

  const generateDealsByStage = (deals) => {
    const stages = {
      'DISCOVERY': { label: 'Discovery', color: '#F97316', count: 0 },
      'PROPOSAL': { label: 'Proposal', color: '#F97316', count: 0 },
      'NEGOTIATION': { label: 'Negotiation', color: '#F97316', count: 0 },
      'CLOSED_WON': { label: 'Won', color: '#F97316', count: 0 },
      'CLOSED_LOST': { label: 'Lost', color: '#F97316', count: 0 }
    };

    deals.forEach(deal => {
      const dealData = deal.attributes || deal;
      const stage = dealData.stage || 'DISCOVERY';
      if (stages[stage]) {
        stages[stage].count++;
      }
    });

    return Object.entries(stages).map(([key, stage]) => ({
      label: stage.label,
      value: stage.count,
      color: stage.color
    }));
  };

  const calculateMetrics = (deals) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Current month deals
    const currentMonthDeals = deals.filter(deal => {
      const dealDate = new Date(deal.createdAt || deal.attributes?.createdAt);
      return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear;
    });
    
    // Last month deals
    const lastMonthDeals = deals.filter(deal => {
      const dealDate = new Date(deal.createdAt || deal.attributes?.createdAt);
      return dealDate.getMonth() === lastMonth && dealDate.getFullYear() === lastMonthYear;
    });
    
    // Current month metrics
    const currentMonthWon = currentMonthDeals.filter(deal => {
      const dealData = deal.attributes || deal;
      return dealData.stage === 'CLOSED_WON';
    });
    const currentMonthRevenue = currentMonthWon.reduce((sum, deal) => {
      const dealData = deal.attributes || deal;
      return sum + (parseFloat(dealData.value) || 0);
    }, 0);
    const currentMonthDealCount = currentMonthDeals.length;
    const currentMonthConversion = currentMonthDeals.length > 0 
      ? (currentMonthWon.length / currentMonthDeals.length) * 100 
      : 0;
    
    // Last month metrics
    const lastMonthWon = lastMonthDeals.filter(deal => {
      const dealData = deal.attributes || deal;
      return dealData.stage === 'CLOSED_WON';
    });
    const lastMonthRevenue = lastMonthWon.reduce((sum, deal) => {
      const dealData = deal.attributes || deal;
      return sum + (parseFloat(dealData.value) || 0);
    }, 0);
    const lastMonthDealCount = lastMonthDeals.length;
    const lastMonthConversion = lastMonthDeals.length > 0
      ? (lastMonthWon.length / lastMonthDeals.length) * 100
      : 0;
    
    // Calculate trends
    const revenueChange = lastMonthRevenue > 0 
      ? Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : currentMonthRevenue > 0 ? 100 : 0;
    
    const dealsChange = lastMonthDealCount > 0
      ? Math.round(((currentMonthDealCount - lastMonthDealCount) / lastMonthDealCount) * 100)
      : currentMonthDealCount > 0 ? 100 : 0;
    
    const conversionChange = lastMonthConversion > 0
      ? Math.round(((currentMonthConversion - lastMonthConversion) / lastMonthConversion) * 100)
      : currentMonthConversion > 0 ? 100 : 0;
    
    // Overall metrics
    const totalDeals = deals.length;
    const wonDeals = deals.filter(deal => {
      const dealData = deal.attributes || deal;
      return dealData.stage === 'CLOSED_WON';
    }).length;
    const totalValue = deals.reduce((sum, deal) => {
      const dealData = deal.attributes || deal;
      return sum + (parseFloat(dealData.value) || 0);
    }, 0);
    
    const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;
    const avgDealSize = wonDeals > 0 ? totalValue / wonDeals : 0;
    const salesVelocity = wonDeals * avgDealSize / 30; // Per day

    const trends = {
      revenue: { 
        value: currentMonthRevenue || totalValue, 
        change: Math.abs(revenueChange),
        isPositive: revenueChange >= 0
      },
      deals: { 
        value: currentMonthDealCount || totalDeals, 
        change: Math.abs(dealsChange),
        isPositive: dealsChange >= 0
      },
      conversion: { 
        value: currentMonthConversion || conversionRate, 
        change: Math.abs(conversionChange),
        isPositive: conversionChange >= 0
      }
    };

    return {
      conversionRate,
      avgDealSize,
      salesVelocity,
      trends
    };
  };

  if (loading) {
    return (
      <Card className="p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Sales Analytics</h2>
          <p className="text-sm text-gray-600">Performance insights and trends</p>
        </div>
        <BarChart3 className="w-6 h-6 text-gray-400" />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Revenue Trend */}
        <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1 font-medium">
                Revenue
              </p>
              <p className="text-3xl font-black text-gray-800">
                {formatCurrency(analyticsData.trends.revenue.value)}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full mr-2 ${analyticsData.trends.revenue.isPositive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {analyticsData.trends.revenue.isPositive ? (
                  <ArrowUpRight className="w-3 h-3 mr-1 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-1 text-red-600" />
                )}
                {Math.abs(analyticsData.trends.revenue.change)}% this month
              </div>
            </div>
            <div className="w-16 h-16 bg-orange-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1 font-medium">
                Conversion
              </p>
              <p className="text-3xl font-black text-gray-800">
                {analyticsData.conversionRate.toFixed(1)}%
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full mr-2 ${analyticsData.trends.conversion.isPositive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {analyticsData.trends.conversion.isPositive ? (
                  <ArrowUpRight className="w-3 h-3 mr-1 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-1 text-red-600" />
                )}
                {Math.abs(analyticsData.trends.conversion.change)}% win rate
              </div>
            </div>
            <div className="w-16 h-16 bg-orange-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Sales Velocity */}
        <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1 font-medium">
                Velocity
              </p>
              <p className="text-3xl font-black text-gray-800">
                {formatCurrency(analyticsData.salesVelocity)}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full mr-2 bg-orange-500"></span>
                Per day average
              </div>
            </div>
            <div className="w-16 h-16 bg-orange-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg">
            <SimpleLineChart
              data={analyticsData.monthlyRevenue}
              width={350}
              height={200}
              color="#F97316"
              className="mx-auto"
            />
          </div>
        </div>

        {/* Deals by Stage */}
        <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deals by Stage</h3>
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg">
            <SimpleBarChart
              data={analyticsData.dealsByStage}
              width={350}
              height={200}
              className="mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1 font-medium">Average Deal Size</p>
              <p className="text-3xl font-black text-gray-800">
                {formatCurrency(analyticsData.avgDealSize)}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full mr-2 bg-orange-500"></span>
                Per deal average
              </div>
            </div>
            <div className="w-16 h-16 bg-orange-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1 font-medium">Total Pipeline Value</p>
              <p className="text-3xl font-black text-gray-800">
                {formatCurrency(analyticsData.trends.revenue.value)}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full mr-2 bg-orange-500"></span>
                Current pipeline
              </div>
            </div>
            <div className="w-16 h-16 bg-orange-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
