"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export interface ChartData {
  name: string
  value: number
  fill: string
  icon: React.ReactNode
}

interface ExpenseChartProps {
  data: ChartData[]
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  const chartConfig = data.reduce((acc, item) => {
    acc[item.name] = {
      label: item.name,
      color: item.fill,
      icon: () => item.icon
    }
    return acc
  }, {} as any)

  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0)
  }, [data])

  if (data.length === 0 || totalValue === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
        <p>No expenses to display.</p>
        <p className="text-sm">Add some expenses to see the chart.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel hideIndicator />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="60%"
            strokeWidth={5}
            activeIndex={0}
            activeShape={({ outerRadius = 0, ...props }) => (
              <g>
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={outerRadius}
                  fill={props.fill}
                />
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={outerRadius + 10}
                  fill={props.fill}
                  opacity={0.3}
                />
              </g>
            )}
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  )
}
