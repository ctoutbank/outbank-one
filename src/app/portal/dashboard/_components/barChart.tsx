"use client";
import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Loader2 } from 'lucide-react';
import type {
  GetTotalTransactionsByMonthResult,
  TotalTransactionsByDay,
} from "@/features/transactions/serverActions/transaction";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import DashboardFilters from "./dashboard-filters";
import { useSearchParams } from "next/navigation";

const chartConfig = {
  bruto: {
    label: "Vendas",
    color: "#10b981",
  },
  lucro: {
    label: "Lucro",
    color: "#10B981",
  },
  transacionado: {
    label: "Transacionado",
    color: "#9CA3AF",
  },
};

interface DailyData {
  date: string;
  month: string;
  bruto: number;
  lucro: number;
  transacionado: number;
}

const CustomDot = (props: any) => {
  const { cx, cy, fill } = props;
  return <circle cx={cx} cy={cy} r={2} fill={fill} stroke={fill} strokeWidth={1} />;
};

const formatYAxisLabel = (value: number) => {
  return `R$${value}k`;
};

export function BarChartCustom({
  transactionsData,
  totalTransactions,
  totalMerchants,
  canceledTransactions,
}: {
  chartData?: GetTotalTransactionsByMonthResult[];
  transactionsData?: TotalTransactionsByDay[];
  viewMode?: string;
  totalTransactions?: any;
  totalMerchants?: number;
  dateRange?: { start: string; end: string };
  canceledTransactions?: number;
}) {
  const [hoveredData, setHoveredData] = React.useState<DailyData | null>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Detecta mudanças nos parâmetros e remove o loading
  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800); // Simula o tempo de carregamento

      return () => clearTimeout(timer);
    }
  }, [searchParams, isLoading]);

  // Função para ativar o loading quando filtro for aplicado
  const handleFilterApply = () => {
    setIsLoading(true);
  };

  const lineChartData = [
    { month: 'Jan', lucro: 4.2, transacionado: 8.5 },
    { month: 'Fev', lucro: 4.8, transacionado: 9.2 },
    { month: 'Mar', lucro: 4.5, transacionado: 9.8 },
    { month: 'Abr', lucro: 3.8, transacionado: 8.9 },
    { month: 'Mai', lucro: 5.2, transacionado: 10.5 },
    { month: 'Jun', lucro: 4.1, transacionado: 9.1 },
    { month: 'Jul', lucro: 5.8, transacionado: 11.2 },
    { month: 'Ago', lucro: 4.9, transacionado: 10.1 },
    { month: 'Set', lucro: 6.2, transacionado: 12.8 },
    { month: 'Out', lucro: 5.5, transacionado: 11.9 },
    { month: 'Nov', lucro: 6.8, transacionado: 13.2 },
    { month: 'Dez', lucro: 5.9, transacionado: 12.1 }
  ];

  const handleMouseMove = (data: any, event: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      setHoveredData(data.activePayload[0].payload);
      const mouseX = event?.nativeEvent?.clientX || 0;
      const mouseY = event?.nativeEvent?.clientY || 0;
      setMousePosition({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  const CustomTooltip = () => {
    if (!hoveredData) return null;
    return (
      <div
        className="fixed bg-white rounded shadow-md border p-2 max-w-full overflow-hidden z-50 pointer-events-none text-xs"
        style={{
          left: mousePosition.x + 10,
          top: mousePosition.y + 10,
        }}
      >
        <div className="space-y-1">
          <div className="font-medium text-gray-800 text-xs border-b pb-1">
            {hoveredData.date}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transacionado:</span>
            <span className="font-medium text-gray-600">
              R${(hoveredData.transacionado * 1000).toLocaleString("pt-BR")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Lucro:</span>
            <span className="font-medium text-green-600">
              R${(hoveredData.lucro * 1000).toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
            <span className="text-xs text-gray-600">Carregando...</span>
          </div>
        </div>
      )}

      {/* Header com valor total e filtros */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            R$ 24.172.838,40
          </div>
          <div className="text-sm text-gray-500">
            Total de Vendas
          </div>
        </div>
        <div className="flex gap-3">
          <select className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todos os Períodos</option>
          </select>
          <select className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todas as Formas</option>
          </select>
        </div>
      </div>

      {/* Gráfico de linha */}
      <div style={{ height: '320px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineChartData}
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          >
            <XAxis 
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              dy={10}
            />
            <YAxis 
              domain={[0, 15]}
              ticks={[0, 3, 6, 9, 12, 15]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              tickFormatter={formatYAxisLabel}
              dx={-10}
            />
            
            {/* Linha tracejada cinza (Transacionado) */}
            <Line
              type="monotone"
              dataKey="transacionado"
              stroke="#9CA3AF"
              strokeWidth={2}
              strokeDasharray="5,5"
              dot={<CustomDot />}
              activeDot={{ r: 4, fill: '#9CA3AF', stroke: '#9CA3AF' }}
            />
            
            {/* Linha sólida verde (Lucro) */}
            <Line
              type="monotone"
              dataKey="lucro"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 4, fill: '#10B981', stroke: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda customizada */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Lucro</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span className="text-sm text-gray-600">Transacionado</span>
        </div>
      </div>

    </div>
  );
}
