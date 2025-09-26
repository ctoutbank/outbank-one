"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TotalTransactionsByDay } from "@/features/transactions/serverActions/transaction";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatYAxisTick = (value: number) => {
  if (value >= 1000) {
    return `R$${(value / 1000).toFixed(0)}k`;
  }
  return `R$${value}`;
};

export function BarChartCustom({
  transactionsData,
  totalTransactions,
}: {
  transactionsData?: TotalTransactionsByDay[];
  totalTransactions?: { sum: number; count: number };
  viewMode?: string;
  totalMerchants?: number;
  dateRange?: { start: string; end: string };
  canceledTransactions?: number;
}) {
  const chartData = React.useMemo(() => {
    return transactionsData?.map((item) => ({
      date: format(parseISO(item.date), "dd/MM", { locale: ptBR }),
      total: Number(item.total_amount),
    }));
  }, [transactionsData]);

  const totalAmount = totalTransactions?.sum ?? 0;
  const transactionCount = totalTransactions?.count ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral</CardTitle>
        <CardDescription>
          Um resumo das suas transações no período selecionado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-2xl font-bold">
          {formatCurrency(totalAmount)}
        </div>
        <p className="text-xs text-muted-foreground">
          {new Intl.NumberFormat("pt-BR").format(transactionCount)} transações
        </p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxisTick}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--accent))" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [
                  formatCurrency(value),
                  "Total",
                ]}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: "hsl(var(--primary))",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "hsl(var(--primary))",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}