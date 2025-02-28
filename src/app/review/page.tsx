"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

// Test data for habit completions comparing current and previous week
const testData = [
  { date: "Mon", currentWeek: 3, previousWeek: 4 },
  { date: "Tue", currentWeek: 5, previousWeek: 3 },
  { date: "Wed", currentWeek: 4, previousWeek: 5 },
  { date: "Thu", currentWeek: 7, previousWeek: 4 },
  { date: "Fri", currentWeek: 6, previousWeek: 6 },
  { date: "Sat", currentWeek: 8, previousWeek: 5 },
  { date: "Sun", currentWeek: 5, previousWeek: 4 },
];

const chartConfig = {
  currentWeek: {
    label: "Current Week",
    color: "hsl(var(--chart-1))",
  },
  previousWeek: {
    label: "Previous Week",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function ReviewPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Habit Completion Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart data={testData}>
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} width={35} />
              <ChartTooltip />
              <Area
                type="monotone"
                dataKey="previousWeek"
                fillOpacity={0.2}
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="currentWeek"
                fillOpacity={0.2}
                stackId="2"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
