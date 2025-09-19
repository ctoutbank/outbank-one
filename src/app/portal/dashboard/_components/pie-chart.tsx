"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { PaymentMethodDistribution } from "@/features/transactions/serverActions/transaction";

interface PaymentMethodPieChartProps {
  data: PaymentMethodDistribution[];
}

const COLORS = {
  'CP': '#10b981',
  'CNP': '#3b82f6',
  'PIX': '#f59e0b',
  'DEBIT': '#8b5cf6',
  'CREDIT': '#ef4444',
};

const getMethodLabel = (methodType: string) => {
  const labels: { [key: string]: string } = {
    'CP': 'Cartão Presente',
    'CNP': 'Cartão Não Presente',
    'PIX': 'PIX',
    'DEBIT': 'Débito',
    'CREDIT': 'Crédito'
  };
  return labels[methodType] || methodType;
};

export function PaymentMethodPieChart({ data }: PaymentMethodPieChartProps) {
  const chartData = data.map(item => ({
    name: getMethodLabel(item.method_type),
    value: Number(item.total_amount),
    percentage: item.percentage,
    count: item.count
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            Valor: {data.value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </p>
          <p className="text-sm text-gray-600">
            Transações: {data.count.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600">
            Percentual: {data.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Distribuição por Meio de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[data[index]?.method_type as keyof typeof COLORS] || '#94a3b8'} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
