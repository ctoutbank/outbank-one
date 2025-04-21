"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FileCheck, HomeIcon, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  MerchantRegistrationChart,
  MerchantRegistrationSummary,
  MerchantTransactionChart,
  MerchantTypeChart,
} from "../server/merchant-dashboard";

// Configuração para o gráfico A - Estabelecimentos cadastrados por período
const registrationChartConfig: ChartConfig = {
  count: {
    label: "Estabelecimentos cadastrados",
    color: "hsl(var(--chart-1))",
  },
};

// Cores para o gráfico B - Transaciona/Não Transaciona
const TRANSACTION_COLORS = ["#4CAF50", "#FF5722"];

// Cores para o gráfico C - Compulsória/Eventual
const TYPE_COLORS = ["#3F84E5", "#FF9800"];

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
  registrationData,
  registrationSummary,
  transactionData,
  typeData,
}: MerchantDashboardContentProps) {
  return (
    <div className="space-y-4">
      {/* Primeira linha: três gráficos lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gráfico A - Estabelecimentos Cadastrados + Histórico */}
        <Card className="bg-white border h-[190px]">
          <CardHeader className="p-1 pb-0">
            <CardTitle className="text-sm font-medium">
              Estabelecimentos Cadastrados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="flex flex-col space-y-1">
              <div className="grid grid-cols-2 gap-x-5 gap-y-1">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-xs text-gray-600">Mês atual</span>
                  </div>
                  <div className="ml-4 text-lg font-bold">
                    {registrationSummary.currentMonth}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-yellow-300 rounded-full" />
                    <span className="text-xs text-gray-600">Mês passado</span>
                  </div>
                  <div className="ml-4 text-lg font-bold">
                    {registrationSummary.previousMonth}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-400 rounded-full" />
                    <span className="text-xs text-gray-600">Essa semana</span>
                  </div>
                  <div className="ml-4 text-lg font-bold">
                    {registrationSummary.currentWeek}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-yellow-400 rounded-full" />
                    <span className="text-xs text-gray-600">Hoje</span>
                  </div>
                  <div className="ml-4 text-lg font-bold">
                    {registrationSummary.today}
                  </div>
                </div>
              </div>

              {/* Gráfico de histórico em tamanho reduzido */}
              <div className="h-[80px] mt-1">
                <ChartContainer
                  config={registrationChartConfig}
                  className="h-full"
                >
                  <AreaChart
                    data={registrationData}
                    margin={{ top: 3, right: 3, left: 0, bottom: 3 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                        }).format(date);
                      }}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString("pt-BR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            });
                          }}
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorCount)"
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico B - Transaciona/Não Transaciona */}
        <Card className="bg-white border h-[190px]">
          <CardHeader className="p-1 pb-0">
            <CardTitle className="text-sm font-medium">
              Transações de Estabelecimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 flex justify-center items-center h-[165px]">
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {transactionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          TRANSACTION_COLORS[index % TRANSACTION_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}`, "Quantidade"]}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    fontSize={10}
                    iconSize={9}
                    wrapperStyle={{ paddingTop: "5px" }}
                    formatter={(value) => {
                      return (
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#666",
                            paddingLeft: "2px",
                          }}
                        >
                          {value}
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico C - Compulsória/Eventual */}
        <Card className="bg-white border h-[190px]">
          <CardHeader className="p-1 pb-0">
            <CardTitle className="text-sm font-medium">
              Compulsória/Eventual
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 flex justify-center items-center h-[165px]">
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {typeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={TYPE_COLORS[index % TYPE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}`, "Quantidade"]}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    fontSize={10}
                    iconSize={9}
                    wrapperStyle={{ paddingTop: "5px" }}
                    formatter={(value) => {
                      return (
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#666",
                            paddingLeft: "2px",
                          }}
                        >
                          {value}
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha: cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Merchants Card */}
        <Card className="bg-white border">
          <CardContent className="p-3">
            <div className="flex items-start">
              <div className="mr-3">
                <HomeIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-700">
                  Total de Estabelecimentos
                </h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl font-bold">{totalMerchants}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-gray-600">Ativos</span>
                    </div>
                    <span className="text-base font-semibold block mt-1">
                      {activeMerchants}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="text-xs text-gray-600">Inativos</span>
                    </div>
                    <span className="text-base font-semibold block mt-1">
                      {inactiveMerchants}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Status Card */}
        <Card className="bg-white border">
          <CardContent className="p-3">
            <div className="flex items-start">
              <div className="mr-3">
                <FileCheck className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-700">Status KYC</h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl font-bold">
                    {approvedKyc + pendingKyc + rejectedKyc}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-gray-600">Aprovados</span>
                    </div>
                    <span className="text-base font-semibold block mt-1">
                      {approvedKyc}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-xs text-gray-600">Pendentes</span>
                    </div>
                    <span className="text-base font-semibold block mt-1">
                      {pendingKyc}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="text-xs text-gray-600">Rejeitados</span>
                    </div>
                    <span className="text-base font-semibold block mt-1">
                      {rejectedKyc}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anticipation Card */}
        <Card className="bg-white border">
          <CardContent className="p-3">
            <div className="flex items-start">
              <div className="mr-3">
                <Wallet className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-700">Antecipações</h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl font-bold">
                    {totalCpAnticipation + totalCnpAnticipation}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-gray-600">CP Ativos</span>
                    </div>
                    <span className="text-base font-semibold block mt-1">
                      {totalCpAnticipation}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-gray-600">CNP Ativos</span>
                    </div>
                    <span className="text-base font-semibold block mt-1">
                      {totalCnpAnticipation}
                    </span>
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
