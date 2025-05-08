"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GetTotalTransactionsByMonthResult } from "@/features/transactions/serverActions/transaction";

const chartConfig = {
  count: {
    label: "Total de Transações",
  },
  bruto: {
    label: "Bruto",
    color: "hsl(var(--chart-1))",
  },
  lucro: {
    label: "Lucro",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export function BarChartCustom({
  chartData,
  viewMode,
}: {
  chartData?: GetTotalTransactionsByMonthResult[];
  viewMode?: string;
}) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("bruto");

  const isHourlyView = viewMode === "today" || viewMode === "yesterday";
  const isWeeklyView = viewMode === "week";
  const isMonthlyView = viewMode === "month";

  const total = React.useMemo(
    () => ({
      bruto: chartData?.reduce((acc, curr) => acc + curr.bruto, 0),
      lucro: chartData?.reduce((acc, curr) => acc + curr.lucro, 0),
    }),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Gráfico de Barras</CardTitle>
          <CardDescription>
            {isHourlyView
              ? "Mostrando o total de transações por hora"
              : isWeeklyView
              ? "Mostrando o total de transações por dia da semana"
              : isMonthlyView
              ? "Mostrando o total de transações por  mês"
              : "Mostrando o total de transações por ano"}
          </CardDescription>
        </div>
        <div className="flex">
          {["bruto", "lucro"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label + " (R$)"}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total]?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={
                isHourlyView
                  ? "hour"
                  : isWeeklyView
                  ? "dayOfWeek"
                  : isMonthlyView
                  ? "dayOfMonth"
                  : "date"
              }
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                if (isHourlyView) {
                  return `${value}:00`;
                }
                if (isWeeklyView) {
                  return DAYS_OF_WEEK[value];
                }
                if (isMonthlyView) {
                  return value;
                }
                const date = new Date(value);
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  year: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="sum"
                  labelFormatter={(value) => {
                    if (isHourlyView) {
                      return `${value}:00`;
                    }
                    if (isWeeklyView) {
                      return DAYS_OF_WEEK[value];
                    }
                    if (isMonthlyView) {
                      return `Dia ${value}`;
                    }
                    return new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />

            {activeChart === "lucro" ? (
              <Bar dataKey="count" fill="hsl(var(--chart-3))" />
            ) : (
              <Bar dataKey="lucro" fill="hsl(var(--chart-3))" />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
