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
    <div>
      <div className="flex flex-wrap gap-3">
        {/* Gráfico A - Estabelecimentos Cadastrados + Histórico */}
        <Card className="bg-white border min-w-[220px] w-[calc(100%/6-12px)]">
          <CardHeader className="p-1 pb-0">
            <CardTitle className="text-sm font-medium mt-1 ml-1">
              Estabelecimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-1 px-2">
            <div className="flex flex-col space-y-1">
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                <div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-xs text-gray-600">Mês</span>
                  </div>
                  <div className="ml-3 text-sm font-bold">
                    {registrationSummary.currentMonth}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-yellow-300 rounded-full" />
                    <span className="text-xs text-gray-600">Anterior</span>
                  </div>
                  <div className="ml-3 text-sm font-bold">
                    {registrationSummary.previousMonth}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-green-400 rounded-full" />
                    <span className="text-xs text-gray-600">Semana</span>
                  </div>
                  <div className="ml-3 text-sm font-bold">
                    {registrationSummary.currentWeek}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-yellow-400 rounded-full" />
                    <span className="text-xs text-gray-600">Hoje</span>
                  </div>
                  <div className="ml-3 text-sm font-bold">
                    {registrationSummary.today}
                  </div>
                </div>
              </div>

              {/* Gráfico de histórico em tamanho reduzido */}
              <div className="h-[65px] mt-1">
                <ChartContainer
                  config={registrationChartConfig}
                  className="h-full"
                >
                  <AreaChart
                    data={registrationData}
                    margin={{ top: 2, right: 2, left: 0, bottom: 2 }}
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
                      tick={{ fontSize: 9 }}
                    />
                    <YAxis tick={{ fontSize: 9 }} />
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
        <Card className="bg-white border min-w-[220px] w-[calc(100%/6-12px)]">
          <CardHeader className="p-1 pb-0">
            <CardTitle className="text-sm font-medium mt-1 ml-1">
              Transações
            </CardTitle>
          </CardHeader>
          <CardContent className="p-1 px-2 flex justify-center items-center h-[135px]">
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionData}
                    cx="50%"
                    cy="55%"
                    labelLine={false}
                    outerRadius={35}
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
                    fontSize={9}
                    iconSize={8}
                    wrapperStyle={{ paddingTop: "1px" }}
                    formatter={(value) => {
                      return (
                        <span
                          style={{
                            fontSize: "10px",
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
        <Card className="bg-white border min-w-[220px] w-[calc(100%/6-12px)]">
          <CardHeader className="p-1 pb-0">
            <CardTitle className="text-sm font-medium mt-1 ml-1">
              Compulsória
            </CardTitle>
          </CardHeader>
          <CardContent className="p-1 px-2 flex justify-center items-center h-[125px]">
            <div className="h-[110px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={35}
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
                    fontSize={9}
                    iconSize={8}
                    wrapperStyle={{ paddingTop: "1px" }}
                    formatter={(value) => {
                      return (
                        <span
                          style={{
                            fontSize: "10px",
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

        {/* Total Merchants Card */}
        <Card className="bg-white border min-w-[220px] w-[calc(100%/6-12px)]">
          <CardContent className="p-2">
            <div className="flex items-start">
              <div className="mr-2">
                <HomeIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-xs text-gray-700 mt-1">
                  Total Estabelecimentos
                </h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-xl font-bold">{totalMerchants}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-gray-600">Ativos</span>
                    </div>
                    <span className="text-sm font-semibold block mt-1">
                      {activeMerchants}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="text-xs text-gray-600">Inativos</span>
                    </div>
                    <span className="text-sm font-semibold block mt-1">
                      {inactiveMerchants}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Status Card */}
        <Card className="bg-white border min-w-[220px] w-[calc(100%/6-12px)]">
          <CardContent className="p-2">
            <div className="flex items-start">
              <div className="mr-2">
                <FileCheck className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-xs text-gray-700 mt-1">
                  Status KYC
                </h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-xl font-bold">
                    {approvedKyc + pendingKyc + rejectedKyc}
                  </span>
                </div>
                <div className="flex flex-col mt-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-gray-600">Aprovados</span>
                    </div>
                    <span className="text-xs font-semibold">{approvedKyc}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-xs text-gray-600">Pendentes</span>
                    </div>
                    <span className="text-xs font-semibold">{pendingKyc}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="text-xs text-gray-600">Rejeitados</span>
                    </div>
                    <span className="text-xs font-semibold">{rejectedKyc}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anticipation Card */}
        <Card className="bg-white border min-w-[220px] w-[calc(100%/6-12px)]">
          <CardContent className="p-2">
            <div className="flex items-start">
              <div className="mr-2">
                <Wallet className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-xs text-gray-700 mt-1">
                  Antecipações
                </h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-xl font-bold">
                    {totalCpAnticipation + totalCnpAnticipation}
                  </span>
                </div>
                <div className="flex flex-col mt-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-gray-600">CP Ativos</span>
                    </div>
                    <span className="text-xs font-semibold">
                      {totalCpAnticipation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-gray-600">CNP Ativos</span>
                    </div>
                    <span className="text-xs font-semibold">
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
