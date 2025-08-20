"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart with an active bar"

const chartData = [
  { browser: "BTC", visitors: 67250, fill: "var(--color-chrome)" },
  { browser: "ETH", visitors: 3450, fill: "var(--color-safari)" },
  { browser: "BNB", visitors: 590, fill: "var(--color-firefox)" },
  { browser: "SOL", visitors: 160, fill: "var(--color-edge)" },
  { browser: "ADA", visitors: 0.48, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: { label: "Price (USD)" },
  BTC: { label: "Bitcoin", color: "var(--chart-1)" },
  ETH: { label: "Ethereum", color: "var(--chart-2)" },
  BNB: { label: "BNB", color: "var(--chart-3)" },
  SOL: { label: "Solana", color: "var(--chart-4)" },
  ADA: { label: "Cardano", color: "var(--chart-5)" },
} satisfies ChartConfig

export function ChartBarActive() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Most Expensive Cryptocurrencies</CardTitle>
        <CardDescription>Prices in USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="browser"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                String(chartConfig[value as keyof typeof chartConfig]?.label ?? value)
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="visitors"
              strokeWidth={2}
              radius={8}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              activeBar={({ ...props }) =>
                activeIndex === props.index ? (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                  />
                ) : (
                  <Rectangle {...props} />
                )
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing top cryptocurrencies by price
        </div>
      </CardFooter>
    </Card>
  )
}
