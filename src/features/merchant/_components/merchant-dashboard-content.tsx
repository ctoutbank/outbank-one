"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, HomeIcon, Wallet,} from "lucide-react"
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import type {
  MerchantRegionChart,
  MerchantRegistrationChart,
  MerchantRegistrationSummary,
  MerchantTransactionChart,
  MerchantTypeChart,
  TransactionShiftChart,
  TransactionStatusChart,
} from "../server/merchant-dashboard"

// Configuração para o gráfico A - Estabelecimentos cadastrados por período

// Cores para o gráfico B - Transaciona/Não Transaciona
const TRANSACTION_COLORS = ["#4CAF50", "#FF5722"]

// Cores para o gráfico C - Compulsória/Eventual
const TYPE_COLORS = ["#3F84E5", "#FF9800"]

const REGION_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"]

const SHIFT_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const STATUS_COLORS = ["#00C49F", "#FF8042"]


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
  regionData: MerchantRegionChart[]
  shiftData: TransactionShiftChart[]
  statusData: TransactionStatusChart[]
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
                                           registrationSummary,
                                           transactionData,
                                           typeData,
                                           regionData,
                                           shiftData,
                                           statusData,
                                         }: MerchantDashboardContentProps) {


  return (
      <div className="w-full">
          <div className="w-full mt-2 mb-2">
              <Card className="w-full border-l-8 border-black bg-sidebar">
                  <CardHeader>
                      <CardTitle className="text-xl font-bold">Visão geral</CardTitle>
                      <p className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                          })}
                      </p>
                  </CardHeader>

                  <CardContent className="p-3">
                      <div className="space-y-3">
                          {/* Linha Superior - Cards de Dados */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {/* Total de Estabelecimentos */}
                              <div className="h-[180px] p-4 bg-background rounded-lg border">
                                  <div className="flex items-center gap-2 mb-3">
                                      <HomeIcon className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium">Total de Estabelecimentos</span>
                                  </div>
                                  <div className="text-center mb-4">
                                      <div className="text-2xl font-bold text-zinc-900">{totalMerchants}</div>
                                  </div>
                                  <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                              <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                              <span className="text-xs text-zinc-600">Ativos</span>
                                          </div>
                                          <span className="text-sm font-semibold">{activeMerchants}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                              <div className="h-2 w-2 rounded-full bg-red-500" />
                                              <span className="text-xs text-zinc-600">Inativos</span>
                                          </div>
                                          <span className="text-sm font-semibold">{inactiveMerchants}</span>
                                      </div>
                                  </div>
                              </div>

                              {/* Status KYC */}
                              <div className="h-[180px] p-4 bg-background rounded-lg border">
                                  <div className="flex items-center gap-2 mb-3">
                                      <FileCheck className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium">Status KYC</span>
                                  </div>
                                  <div className="text-center mb-4">
                                      <div className="text-2xl font-bold text-zinc-900">{approvedKyc + pendingKyc + rejectedKyc}</div>
                                  </div>
                                  <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                              <div className="h-2 w-2 rounded-full bg-green-500" />
                                              <span className="text-xs text-zinc-600">Aprovados</span>
                                          </div>
                                          <span className="text-sm font-semibold">{approvedKyc}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                              <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                              <span className="text-xs text-zinc-600">Pendentes</span>
                                          </div>
                                          <span className="text-sm font-semibold">{pendingKyc}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                              <div className="h-2 w-2 rounded-full bg-red-500" />
                                              <span className="text-xs text-zinc-600">Rejeitados</span>
                                          </div>
                                          <span className="text-sm font-semibold">{rejectedKyc}</span>
                                      </div>
                                  </div>
                              </div>

                              {/* Antecipações */}
                              <div className="h-[180px] p-4 bg-background rounded-lg border">
                                  <div className="flex items-center gap-2 mb-3">
                                      <Wallet className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium">Antecipações</span>
                                  </div>
                                  <div className="text-center mb-4">
                                      <div className="text-2xl font-bold text-zinc-900">{totalCpAnticipation + totalCnpAnticipation}</div>
                                  </div>
                                  <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                              <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                              <span className="text-xs text-zinc-600">CP Ativos</span>
                                          </div>
                                          <span className="text-sm font-semibold">{totalCpAnticipation}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                                              <span className="text-xs text-zinc-600">CNP Ativos</span>
                                          </div>
                                          <span className="text-sm font-semibold">{totalCnpAnticipation}</span>
                                      </div>
                                  </div>
                              </div>

                              {/* Estabelecimentos Cadastrados */}
                              <div className="h-[180px] p-4 bg-background rounded-lg border">
                                  <div className="flex items-center gap-2 mb-3">
                                      <HomeIcon className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium">Estabelecimentos Cadastrados</span>
                                  </div>
                                  <div className="text-center mb-4">
                                      <div className="text-2xl font-bold text-zinc-900">{registrationSummary.currentMonth}</div>
                                      <div className="text-xs text-muted-foreground">Este mês</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                      <div className="text-center">
                                          <div className="flex items-center justify-center gap-1 mb-1">
                                              <div className="h-2 w-2 bg-yellow-300 rounded-full" />
                                              <span className="text-xs text-gray-600">Anterior</span>
                                          </div>
                                          <div className="text-sm font-bold">{registrationSummary.previousMonth}</div>
                                      </div>
                                      <div className="text-center">
                                          <div className="flex items-center justify-center gap-1 mb-1">
                                              <div className="h-2 w-2 bg-green-400 rounded-full" />
                                              <span className="text-xs text-gray-600">Semana</span>
                                          </div>
                                          <div className="text-sm font-bold">{registrationSummary.currentWeek}</div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* Linha Inferior - Gráficos */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                              {/* Gráfico de Distribuição de Transações */}
                              <div className="min-h-[200px] p-4 bg-background rounded-lg border">
                                  <div className="text-xs font-small mb-2">Transações de Estabelecimentos</div>
                                  <div className="h-[120px] flex items-center justify-center">
                                      <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                              <Pie
                                                  data={transactionData}
                                                  cx="50%"
                                                  cy="50%"
                                                  labelLine={false}
                                                  outerRadius="45%"
                                                  dataKey="value"
                                                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                              >
                                                  {transactionData.map((entry, index) => (
                                                      <Cell key={`cell-${index}`} fill={TRANSACTION_COLORS[index % TRANSACTION_COLORS.length]} />
                                                  ))}
                                              </Pie>
                                              <Tooltip formatter={(value: number) => [`${value}`, "Quantidade"]} />
                                          </PieChart>
                                      </ResponsiveContainer>
                                  </div>
                                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                                      {transactionData.map((entry, index) => (
                                          <div key={entry.name} className="flex items-center gap-1">
                                              <div
                                                  className="h-2 w-2 rounded-full"
                                                  style={{ backgroundColor: TRANSACTION_COLORS[index % TRANSACTION_COLORS.length] }}
                                              />
                                              <span className="text-xs text-gray-600">{entry.name}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              {/* Gráfico de Tipo */}
                              <div className="min-h-[200px] p-4 bg-background rounded-lg border">
                                  <div className="text-xs font-small mb-2">Compulsória/Eventual</div>
                                  <div className="h-[120px] flex items-center justify-center">
                                      <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                              <Pie
                                                  data={typeData}
                                                  cx="50%"
                                                  cy="50%"
                                                  labelLine={false}
                                                  outerRadius="45%"
                                                  dataKey="value"
                                                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                              >
                                                  {typeData.map((entry, index) => (
                                                      <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                                                  ))}
                                              </Pie>
                                              <Tooltip formatter={(value: number) => [`${value}`, "Quantidade"]} />
                                          </PieChart>
                                      </ResponsiveContainer>
                                  </div>
                                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                                      {typeData.map((entry, index) => (
                                          <div key={entry.name} className="flex items-center gap-1">
                                              <div
                                                  className="h-2 w-2 rounded-full"
                                                  style={{ backgroundColor: TYPE_COLORS[index % TYPE_COLORS.length] }}
                                              />
                                              <span className="text-xs text-gray-600">{entry.name}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              {/* Gráfico de Turnos */}
                              <div className="min-h-[200px] p-4 bg-background rounded-lg border">
                                  <div className="text-xs font-small mb-2">Transações por Turno</div>
                                  <div className="h-[120px] flex items-center justify-center">
                                      <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                              <Pie
                                                  data={shiftData}
                                                  cx="50%"
                                                  cy="50%"
                                                  labelLine={false}
                                                  outerRadius="45%"
                                                  dataKey="value"
                                                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                              >
                                                  {shiftData.map((entry, index) => (
                                                      <Cell key={`cell-${index}`} fill={SHIFT_COLORS[index % SHIFT_COLORS.length]} />
                                                  ))}
                                              </Pie>
                                              <Tooltip formatter={(value: number) => [`${value}`, "Quantidade"]} />
                                          </PieChart>
                                      </ResponsiveContainer>
                                  </div>
                                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                                      {shiftData.map((entry, index) => (
                                          <div key={entry.name} className="flex items-center gap-1">
                                              <div
                                                  className="h-2 w-2 rounded-full"
                                                  style={{ backgroundColor: SHIFT_COLORS[index % SHIFT_COLORS.length] }}
                                              />
                                              <span className="text-xs text-gray-600">{entry.name}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              {/* Gráfico de Regiões */}
                              <div className="min-h-[200px] p-4 bg-background rounded-lg border">
                                  <div className="text-xs font-small mb-2">Estabelecimentos por região</div>
                                  <div className="h-[120px] flex items-center justify-center">
                                      <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                              <Pie
                                                  data={regionData}
                                                  cx="50%"
                                                  cy="50%"
                                                  labelLine={false}
                                                  outerRadius="45%"
                                                  dataKey="value"
                                                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                              >
                                                  {regionData.map((entry, index) => (
                                                      <Cell key={`cell-${index}`} fill={REGION_COLORS[index % REGION_COLORS.length]} />
                                                  ))}
                                              </Pie>
                                              <Tooltip formatter={(value: number) => [`${value}`, "Quantidade"]} />
                                          </PieChart>
                                      </ResponsiveContainer>
                                  </div>
                                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                                      {regionData.map((entry, index) => (
                                          <div key={entry.name} className="flex items-center gap-1">
                                              <div
                                                  className="h-2 w-2 rounded-full"
                                                  style={{ backgroundColor: REGION_COLORS[index % REGION_COLORS.length] }}
                                              />
                                              <span className="text-xs text-gray-600">{entry.name}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              {/* Gráfico de Eficiência */}
                              <div className="min-h-[200px] p-4 bg-background rounded-lg border">
                                  <div className="text-xs font-small mb-2">Eficiência operacional</div>
                                  <div className="h-[120px] flex items-center justify-center">
                                      <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                              <Pie
                                                  data={statusData}
                                                  cx="50%"
                                                  cy="50%"
                                                  labelLine={false}
                                                  outerRadius="45%"
                                                  dataKey="value"
                                                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                              >
                                                  {statusData.map((entry, index) => (
                                                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                                                  ))}

                                              </Pie>
                                              <Tooltip formatter={(value: number) => [`${value}`, "Quantidade"]} />
                                          </PieChart>
                                      </ResponsiveContainer>
                                  </div>
                                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                                      <div className="flex items-center gap-1">
                                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                          <span className="text-xs text-gray-600">Transações Aprovadas</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                          <div className="h-2 w-2 rounded-full bg-red-500" />
                                          <span className="text-xs text-gray-600">Transações Negadas</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
  )
}
