"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ApplicationsChart({ monthlyChart }: any) {
  const chartData =
    monthlyChart?.labels?.map((label: string, index: number) => ({
      month: label,
      value: monthlyChart?.data[index],
    })) || [];

  const total =
    monthlyChart?.data?.reduce((acc: number, val: number) => acc + val, 0) || 0;

  return (
    <div className="w-full rounded-2xl border border-[#DFE1E7] bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-base font-sans font-semibold text-[#0E2B8B]">
          Applications Submitted
        </h3>

        <div className="flex items-end gap-3">
          <p className="text-3xl font-bold text-gray-900">{total}</p>
        </div>
      </div>

      <div className="mt-6 h-82 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid
              strokeDasharray="4 6"
              vertical
              horizontal={false}
              stroke="#DFE1E7"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              dy={15}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              width={32}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#0E2B8B"
              strokeWidth={2}
              fill="rgba(14, 43, 139, 0.08)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
