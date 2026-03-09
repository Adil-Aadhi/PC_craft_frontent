import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  ComposedChart,
  Legend
} from "recharts";

import { useState } from "react";
import React from "react";
import { TrendingUp, Download } from "lucide-react";

function RevenueChart({ revenueData }) {

  const data = revenueData || [];

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  const avgGrowth =
    data.length > 1
      ? (
          ((data[data.length - 1].revenue - data[0].revenue) /
            data[0].revenue) *
          100
        ).toFixed(1)
      : 0;

  const bestMonth =
    data.length > 0
      ? data.reduce((max, item) =>
          item.revenue > max.revenue ? item : max
        )
      : null;

  const averageRevenue =
    data.length > 0 ? Math.floor(totalRevenue / data.length) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>

          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>

              <span className="text-gray-600">{entry.name}:</span>

              <span className="font-semibold">
                ₹{entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Revenue Overview
          </h2>

          <div className="flex items-center gap-3 mt-1">

            <p className="text-sm text-gray-500">
              Total:
              <span className="font-semibold text-gray-800">
                {" "}
                ₹{totalRevenue.toLocaleString()}
              </span>
            </p>

            {data.length > 1 && (
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                <span>{avgGrowth}% growth</span>
              </div>
            )}

          </div>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Download size={18} className="text-gray-500" />
        </button>

      </div>

      {/* Chart */}

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <ComposedChart data={data}>

            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="none"
              fill="url(#colorRevenue)"
            />

            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 6, fill: "#4f46e5", strokeWidth: 2, stroke: "white" }}
              activeDot={{
                r: 8,
                fill: "#4f46e5",
                strokeWidth: 2,
                stroke: "white"
              }}
            />

          </ComposedChart>

        </ResponsiveContainer>

      </div>

      {/* Stats Footer */}

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Best Month</p>
          <p className="font-semibold text-gray-800">
            {bestMonth?.month || "-"}
          </p>
          <p className="text-xs text-gray-500">
            ₹{bestMonth?.revenue?.toLocaleString() || 0}
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Average</p>
          <p className="font-semibold text-gray-800">
            ₹{averageRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">per period</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Growth</p>
          <p className="font-semibold text-green-600">
            {data.length > 1 ? `+${avgGrowth}%` : "0%"}
          </p>
          <p className="text-xs text-gray-500">overall</p>
        </div>

      </div>

    </div>
  );
}
export default React.memo(RevenueChart);