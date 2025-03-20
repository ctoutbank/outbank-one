"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { FileCheck, HomeIcon, Wallet } from "lucide-react"
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
  YAxis
} from "recharts"
import { MerchantRegistrationChart, MerchantRegistrationSummary, MerchantTransactionChart, MerchantTypeChart } from "../server/merchant-dashboard"

// Configuração para o gráfico A - Estabelecimentos cadastrados por período
const registrationChartConfig: ChartConfig = {
  count: {
    label: "Estabelecimentos cadastrados",
    color: "hsl(var(--chart-1))"
  }
}

// Cores para o gráfico B - Transaciona/Não Transaciona
const TRANSACTION_COLORS = ["#4CAF50", "#FF5722"]

// Cores para o gráfico C - Compulsória/Eventual
const TYPE_COLORS = ["#3F84E5", "#FF9800"]

type MerchantDashboardContentProps = {
  totalMerchants: number
  activeMerchants: number
  inactiveMerchants: number
  pendingKyc: number
  approvedKyc: number
  rejectedKyc: number
  totalCpAnticipation: number
  totalCnpAnticipation: number
  // Dados para os gráficos
  registrationData: MerchantRegistrationChart[]
  registrationSummary: MerchantRegistrationSummary
  transactionData: MerchantTransactionChart[]
  typeData: MerchantTypeChart[]
}

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
    <div className="w-full mt-4 mb-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Merchants Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">Total de Estabelecimentos</span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900">{totalMerchants}</span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">Ativos</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{activeMerchants}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-zinc-600">Inativos</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{inactiveMerchants}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Status Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">Status KYC</span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900">{approvedKyc + pendingKyc + rejectedKyc}</span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">Aprovados</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{approvedKyc}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-medium text-zinc-600">Pendentes</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{pendingKyc}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-zinc-600">Rejeitados</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{rejectedKyc}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anticipation Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">Antecipações</span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900">{totalCpAnticipation + totalCnpAnticipation}</span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">CP Ativos</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{totalCpAnticipation}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">CNP Ativos</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{totalCnpAnticipation}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Os três gráficos lado a lado em uma única linha */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Gráfico A - Estabelecimentos Cadastrados + Histórico */}
        <Card className="bg-white">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium">Estabelecimentos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex flex-col h-full">
              {/* Sumário de cadastros em tamanho reduzido */}
              <div className="grid grid-cols-2 gap-1 mb-2 text-xs">
                <div className="flex items-center">
                  <div className="h-3 w-1 bg-blue-500 rounded-full mr-1.5" />
                  <div>
                    <div className="text-muted-foreground">Mês atual</div>
                    <div className="text-base font-bold">{registrationSummary.currentMonth}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-1 bg-yellow-300 rounded-full mr-1.5" />
                  <div>
                    <div className="text-muted-foreground">Mês passado</div>
                    <div className="text-base font-bold">{registrationSummary.previousMonth}</div>
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  <div className="h-3 w-1 bg-green-400 rounded-full mr-1.5" />
                  <div>
                    <div className="text-muted-foreground">Essa semana</div>
                    <div className="text-base font-bold">{registrationSummary.currentWeek}</div>
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  <div className="h-3 w-1 bg-yellow-400 rounded-full mr-1.5" />
                  <div>
                    <div className="text-muted-foreground">Hoje</div>
                    <div className="text-base font-bold">{registrationSummary.today}</div>
                  </div>
                </div>
              </div>
              
              {/* Gráfico de histórico em tamanho reduzido */}
              <div className="h-[180px] mt-auto">
                <ChartContainer config={registrationChartConfig} className="h-full">
                  <AreaChart
                    data={registrationData}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return new Intl.DateTimeFormat('pt-BR', { 
                          day: '2-digit' 
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
                              year: "numeric"
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
        <Card className="bg-white">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium">Transações de Estabelecimentos</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-[230px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({  percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {transactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={TRANSACTION_COLORS[index % TRANSACTION_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}`, 'Quantidade']}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                    fontSize={10}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico C - Compulsória/Eventual */}
        <Card className="bg-white">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium">Compulsória/Eventual</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-[230px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({  percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}`, 'Quantidade']}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    fontSize={10}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

