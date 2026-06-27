"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function StatsChart({ data }: { data: { title: string; clicks: number }[] }) {
  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="title" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickMargin={10}
              allowDecimals={false}
            />
            <ChartTooltip 
              cursor={{ fill: '#f1f5f9' }}
              content={<ChartTooltipContent />} 
            />
            <Bar 
              dataKey="clicks" 
              fill="var(--color-clicks)" 
              radius={[4, 4, 0, 0]} 
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
