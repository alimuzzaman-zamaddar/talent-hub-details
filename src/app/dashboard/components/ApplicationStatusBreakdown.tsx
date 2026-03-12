"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function ApplicationStatusBreakdown({ statistics }: any) {
  const breakdown = statistics?.application_status_breakdown;

  const chartData = [
    {
      name: "Submitted",
      value: breakdown?.submitted_applications?.count || 0,
      percent: breakdown?.submitted_applications?.percentage || 0,
      color: "#1D4ED8",
    },
    {
      name: "Shortlisted",
      value: breakdown?.shortlisted_applications?.count || 0,
      percent: breakdown?.shortlisted_applications?.percentage || 0,
      color: "#4F6FE8",
    },
    {
      name: "Rejected",
      value: breakdown?.rejected_applications?.count || 0,
      percent: breakdown?.rejected_applications?.percentage || 0,
      color: "#93A6F3",
    },
  ];

  const totalApplications = breakdown?.total_applications || 0;

  return (
    <div className="w-full rounded-2xl border border-[#DFE1E7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-sans font-semibold text-[#0E2B8B]">
        Application Status Breakdown
      </h3>

      <div className="relative mt-6 h-55 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={2}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-semibold text-gray-900">
            {totalApplications}
          </p>
          <p className="text-sm text-gray-500">Applications</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {chartData.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-sm font-medium text-gray-700">
                  {item.name} ({item.value})
                </p>
              </div>
              <p className="text-sm text-gray-700">{item.percent}%</p>
            </div>

            {index !== chartData.length - 1 && (
              <div className="mt-4 h-px bg-[#DFE1E7]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
