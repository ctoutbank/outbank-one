"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, HomeIcon, Wallet } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type {
  MerchantRegionChart,
  MerchantRegistrationChart,
  MerchantRegistrationSummary,
  MerchantTransactionChart,
  MerchantTypeChart,
  TransactionShiftChart,
  TransactionStatusChart,
} from "../server/merchant-dashboard";

// Configuração para o gráfico A - Estabelecimentos cadastrados por período

// Cores para o gráfico B - Transaciona/Não Transaciona
const TRANSACTION_COLORS = ["#4CAF50", "#FF5722"];

// Cores para o gráfico C - Compulsória/Eventual
const TYPE_COLORS = ["#3F84E5", "#FF9800"];

const REGION_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

const SHIFT_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const STATUS_COLORS = ["#00C49F", "#FF8042"];

type MerchantDashboardContentProps = {
  totalMerchants: number;
  activeMerchants: number;
  inactiveMerchants: number;
  pendingKyc: number;
  approvedKyc: number;
  rejectedKyc: number;
  totalCpAnticipation: number;
  totalCnpAnticipation: number;
  // Dados para os gráficos
  registrationData: MerchantRegistrationChart[];
  registrationSummary: MerchantRegistrationSummary;
  transactionData: MerchantTransactionChart[];
  typeData: MerchantTypeChart[];
  regionData: MerchantRegionChart[];
  shiftData: TransactionShiftChart[];
  statusData: TransactionStatusChart[];
};

export function MerchantDashboardContent({
  totalMerchants,
  activeMerchants,
  inactiveMerchants,
  pendingKyc,
  approvedKyc,
  rejectedKyc,
  totalCpAnticipation,
  totalCnpAnticipation,
  registrationSummary,
  transactionData,
  typeData,
  regionData,
  shiftData,
  statusData,
}: MerchantDashboardContentProps) {
  // Função para preparar dados do gráfico, garantindo que sempre tenha dados para renderizar
  const prepareChartData = (data: any[], defaultLabels: string[]) => {
    const hasValidData = data.some((item) => item.value > 0);

    if (!hasValidData && data.length > 0) {
      // Se todos os valores são 0, cria dados equilibrados para manter a visualização
      return defaultLabels.map((label) => ({
        name: label,
        value: 1, // Valor igual para todos para mostrar fatias iguais
      }));
    }

    return data.length > 0
      ? data
      : defaultLabels.map((label) => ({
          name: label,
          value: 1,
        }));
  };

  // Preparar dados dos turnos com fallback
  const shiftChartData = prepareChartData(shiftData, [
    "Manhã",
    "Tarde",
    "Noite",
    "Madrugada",
  ]);
  const hasShiftData = shiftData.some((item) => item.value > 0);

  // Preparar outros dados com fallback
  const transactionChartData = prepareChartData(transactionData, [
    "Transaciona",
    "Não Transaciona",
  ]);
  const hasTransactionData = transactionData.some((item) => item.value > 0);

  const typeChartData = prepareChartData(typeData, ["Compulsória", "Eventual"]);
  const hasTypeData = typeData.some((item) => item.value > 0);

  const regionChartData = prepareChartData(regionData, [
    "Norte",
    "Nordeste",
    "Centro-Oeste",
    "Sudeste",
    "Sul",
  ]);
  const hasRegionData = regionData.some((item) => item.value > 0);

  const statusChartData = prepareChartData(statusData, [
    "Aprovadas",
    "Negadas",
  ]);
  const hasStatusData = statusData.some((item) => item.value > 0);

  // Componente customizado para tooltip que mostra valores reais
  const CustomTooltip = ({ active, payload, hasData }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      if (!hasData) {
        return (
          <div className="bg-white p-2 border rounded shadow-lg">
            <p className="text-xs text-gray-600">Sem dados disponíveis</p>
          </div>
        );
      }
      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <p className="text-xs font-medium">{data.name}</p>
          <p className="text-xs text-gray-600">Quantidade: {data.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="w-full mt-2 mb-2">
        <Card className="w-full  bg-transparent ">
          <CardContent className="p-6">
            {/* Linha Superior - Cards de Dados */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total de Estabelecimentos */}
                <div className="h-[165px] p-4 bg-transparent rounded-lg border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <HomeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Total de Estabelecimentos
                      </span>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-zinc-900">
                        {totalMerchants}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col ">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs text-zinc-600">Ativos</span>
                      </div>
                      <span className="text-xs font-semibold">
                        {activeMerchants}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-xs text-zinc-600">Inativos</span>
                      </div>
                      <span className="text-xs font-semibold">
                        {inactiveMerchants}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status KYC */}
                <div className="h-[165px] p-4 bg-transparent rounded-lg border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Status KYC</span>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-zinc-900">
                        {approvedKyc + pendingKyc + rejectedKyc}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs text-zinc-600">Aprovados</span>
                      </div>
                      <span className="text-xs font-semibold">
                        {approvedKyc}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        <span className="text-xs text-zinc-600">Pendentes</span>
                      </div>
                      <span className="text-xs font-semibold">
                        {pendingKyc}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-xs text-zinc-600">
                          Rejeitados
                        </span>
                      </div>
                      <span className="text-xs font-semibold">
                        {rejectedKyc}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Antecipações */}
                <div className="h-[165px] p-4 bg-transparent rounded-lg border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Antecipações</span>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-zinc-900">
                        {totalCpAnticipation + totalCnpAnticipation}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs text-zinc-600">CP Ativos</span>
                      </div>
                      <span className="text-xs font-semibold">
                        {totalCpAnticipation}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-xs text-zinc-600">
                          CNP Ativos
                        </span>
                      </div>
                      <span className="text-xs font-semibold">
                        {totalCnpAnticipation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estabelecimentos Cadastrados */}
                <div className="h-[165px] p-4 bg-transparent rounded-lg border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <HomeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Estabelecimentos Cadastrados
                      </span>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-zinc-900">
                        {registrationSummary.currentMonth}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Este mês
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 bg-yellow-300 rounded-full" />
                        <span className="text-xs text-gray-600">Anterior</span>
                      </div>
                      <div className="text-xs font-bold">
                        {registrationSummary.previousMonth}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 bg-green-400 rounded-full" />
                        <span className="text-xs text-gray-600">Semana</span>
                      </div>
                      <div className="text-xs font-bold">
                        {registrationSummary.currentWeek}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linha Inferior - Gráficos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Gráfico de Distribuição de Transações */}
                <div className="min-h-[200px] p-4 bg-transparent rounded-lg border">
                  <div className="text-xs font-small mb-2">
                    Transações de Estabelecimentos
                    {!hasTransactionData && (
                      <span className="text-gray-400 ml-1">(Sem dados)</span>
                    )}
                  </div>
                  <div className="h-[120px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={transactionChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius="45%"
                          dataKey="value"
                          label={
                            hasTransactionData
                              ? ({ percent }) =>
                                  `${(percent * 100).toFixed(0)}%`
                              : () => ""
                          }
                        >
                          {transactionChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                TRANSACTION_COLORS[
                                  index % TRANSACTION_COLORS.length
                                ]
                              }
                              opacity={hasTransactionData ? 1 : 0.3}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={
                            <CustomTooltip hasData={hasTransactionData} />
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {transactionChartData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              TRANSACTION_COLORS[
                                index % TRANSACTION_COLORS.length
                              ],
                            opacity: hasTransactionData ? 1 : 0.3,
                          }}
                        />
                        <span
                          className={`text-xs ${hasTransactionData ? "text-gray-600" : "text-gray-400"}`}
                        >
                          {entry.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gráfico de Tipo */}
                <div className="min-h-[200px] p-4 bg-transparent rounded-lg border">
                  <div className="text-xs font-small mb-2">
                    Compulsória/Eventual
                    {!hasTypeData && (
                      <span className="text-gray-400 ml-1">(Sem dados)</span>
                    )}
                  </div>
                  <div className="h-[120px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={typeChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius="45%"
                          dataKey="value"
                          label={
                            hasTypeData
                              ? ({ percent }) =>
                                  `${(percent * 100).toFixed(0)}%`
                              : () => ""
                          }
                        >
                          {typeChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={TYPE_COLORS[index % TYPE_COLORS.length]}
                              opacity={hasTypeData ? 1 : 0.3}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={<CustomTooltip hasData={hasTypeData} />}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {typeChartData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              TYPE_COLORS[index % TYPE_COLORS.length],
                            opacity: hasTypeData ? 1 : 0.3,
                          }}
                        />
                        <span
                          className={`text-xs ${hasTypeData ? "text-gray-600" : "text-gray-400"}`}
                        >
                          {entry.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gráfico de Turnos */}
                <div className="min-h-[200px] p-4 bg-transparent rounded-lg border">
                  <div className="text-xs font-small mb-2">
                    Transações por Turno
                    {!hasShiftData && (
                      <span className="text-gray-400 ml-1">(Sem dados)</span>
                    )}
                  </div>
                  <div className="h-[120px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={shiftChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius="45%"
                          dataKey="value"
                          label={
                            hasShiftData
                              ? ({ percent }) =>
                                  `${(percent * 100).toFixed(0)}%`
                              : () => ""
                          }
                        >
                          {shiftChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={SHIFT_COLORS[index % SHIFT_COLORS.length]}
                              opacity={hasShiftData ? 1 : 0.3}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={<CustomTooltip hasData={hasShiftData} />}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {shiftChartData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              SHIFT_COLORS[index % SHIFT_COLORS.length],
                            opacity: hasShiftData ? 1 : 0.3,
                          }}
                        />
                        <span
                          className={`text-xs ${hasShiftData ? "text-gray-600" : "text-gray-400"}`}
                        >
                          {entry.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gráfico de Regiões */}
                <div className="min-h-[200px] p-4 bg-transparent rounded-lg border">
                  <div className="text-xs font-small mb-2">
                    Estabelecimentos por região
                    {!hasRegionData && (
                      <span className="text-gray-400 ml-1">(Sem dados)</span>
                    )}
                  </div>
                  <div className="h-[120px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={regionChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius="45%"
                          dataKey="value"
                          label={
                            hasRegionData
                              ? ({ percent }) =>
                                  `${(percent * 100).toFixed(0)}%`
                              : () => ""
                          }
                        >
                          {regionChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={REGION_COLORS[index % REGION_COLORS.length]}
                              opacity={hasRegionData ? 1 : 0.3}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={<CustomTooltip hasData={hasRegionData} />}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {regionChartData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              REGION_COLORS[index % REGION_COLORS.length],
                            opacity: hasRegionData ? 1 : 0.3,
                          }}
                        />
                        <span
                          className={`text-xs ${hasRegionData ? "text-gray-600" : "text-gray-400"}`}
                        >
                          {entry.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gráfico de Eficiência */}
                <div className="min-h-[200px] p-4 bg-transparent rounded-lg border">
                  <div className="text-xs font-small mb-2">
                    Eficiência operacional
                    {!hasStatusData && (
                      <span className="text-gray-400 ml-1">(Sem dados)</span>
                    )}
                  </div>
                  <div className="h-[120px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius="45%"
                          dataKey="value"
                          label={
                            hasStatusData
                              ? ({ percent }) =>
                                  `${(percent * 100).toFixed(0)}%`
                              : () => ""
                          }
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                              opacity={hasStatusData ? 1 : 0.3}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={<CustomTooltip hasData={hasStatusData} />}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    <div className="flex items-center gap-1">
                      <div
                        className="h-2 w-2 rounded-full bg-emerald-500"
                        style={{ opacity: hasStatusData ? 1 : 0.3 }}
                      />
                      <span
                        className={`text-xs ${hasStatusData ? "text-gray-600" : "text-gray-400"}`}
                      >
                        Transações Aprovadas
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="h-2 w-2 rounded-full bg-red-500"
                        style={{ opacity: hasStatusData ? 1 : 0.3 }}
                      />
                      <span
                        className={`text-xs ${hasStatusData ? "text-gray-600" : "text-gray-400"}`}
                      >
                        Transações Negadas
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
