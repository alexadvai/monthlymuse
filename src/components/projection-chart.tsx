"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"

interface ProjectionChartProps {
  data: {
    month: number
    projectedBalance: number
  }[]
}

const chartConfig = {
  projectedBalance: {
    label: "Projected Balance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ProjectionChart({ data }: ProjectionChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    month: new Date(2024, item.month - 1, 1).toLocaleString('default', { month: 'short' })
  }));

  return (
    <div className="w-full h-60">
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={formattedData}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent 
              labelFormatter={(label, payload) => {
                return payload?.[0]?.payload?.month
              }}
              formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))}
            />} 
          />
          <Line
            dataKey="projectedBalance"
            type="monotone"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={true}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
