"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { clsx } from "clsx";

export function BarChart({
  data = [],
  bars = [], // Array of { dataKey, color, name }
  height = 300,
  className,
  showGrid = true,
  showLegend = true,
  stacked = false,
  ...props
}) {
  const defaultColors = ["#FDE047", "#1F2937", "#9CA3AF"];

  // Safety checks
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div
        className={clsx("w-full flex items-center justify-center", className)}
        style={{ height }}
      >
        <div className="text-gray-500 text-sm">No data available</div>
      </div>
    );
  }

  if (!bars || !Array.isArray(bars) || bars.length === 0) {
    return (
      <div
        className={clsx("w-full flex items-center justify-center", className)}
        style={{ height }}
      >
        <div className="text-gray-500 text-sm">
          No chart configuration available
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height={height} minHeight={200}>
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
          <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: "12px" }} />
          <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
          />
          {showLegend && <Legend />}
          {bars &&
            bars.length > 0 &&
            bars.map((bar, index) => {
              // Ensure we have valid data
              if (!bar || !bar.dataKey) return null;

              const fallbackColor =
                defaultColors && defaultColors.length > 0
                  ? defaultColors[index % defaultColors.length]
                  : "#3B82F6"; // Blue fallback

              return (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  fill={bar.color || fallbackColor}
                  name={bar.name || bar.dataKey}
                  stackId={stacked ? "stack" : undefined}
                  radius={[8, 8, 0, 0]}
                />
              );
            })}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;
