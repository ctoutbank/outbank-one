"use client";
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

import type { TotalTransactionsByDay } from "@/features/transactions/serverActions/transaction";

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
}) {
  const chartData = React.useMemo(() => {
    return transactionsData?.map((item) => ({
      date: format(parseISO(item.date), "dd/MM", { locale: ptBR }),
      total: Number(item.total_amount),
    }));
  }, [transactionsData]);

  const totalAmount = totalTransactions?.sum ?? 0;

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {formatCurrency(totalAmount)}
          </div>
          <div className="text-sm text-muted-foreground">
            Total de Vendas no Período
          </div>
        </div>
      </div>

      <div style={{ height: "320px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={formatYAxisTick}
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--accent))", radius: 4 }}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [formatCurrency(value), "Total"]}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}