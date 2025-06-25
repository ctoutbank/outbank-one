"use client"

import { eachDayOfInterval, format, parseISO } from "date-fns"
import * as React from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import type { GetTotalTransactionsByMonthResult } from "@/features/transactions/serverActions/transaction"
import { formatCurrency } from "@/lib/utils"
import DashboardFilters from "./dashboard-filters"

const chartConfig = {
    bruto: {
        label: "Vendas",
        color: "#10b981",
    },
    lucro: {
        label: "Lucro",
        color: "#1875e0",
    },
}

interface DailyData {
    date: string
    bruto: number
    lucro: number
    count: number
}

export function BarChartCustom({
                                   transactionsData,
                                   totalTransactions,
                                   totalMerchants,
                                   dateRange,
                                   canceledTransactions,
                               }: {
    chartData?: GetTotalTransactionsByMonthResult[]
    transactionsData?: any[]
    viewMode?: string
    totalTransactions?: any
    totalMerchants?: number
    dateRange?: { start: string; end: string }
    canceledTransactions?: number
}) {
    const [hoveredData, setHoveredData] = React.useState<any>(null)
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
    const cardRef = React.useRef<HTMLDivElement>(null)


    // Processamento diário (mantido igual)
    const dailyData = React.useMemo(() => {
        if (!dateRange || !transactionsData) return []

        const startDate = parseISO(dateRange.start)
        const endDate = parseISO(dateRange.end)
        const allDays = eachDayOfInterval({ start: startDate, end: endDate })

        const dailyMap = new Map<string, DailyData>()

        allDays.forEach((day) => {
            const dateKey = format(day, "yyyy-MM-dd")
            dailyMap.set(dateKey, {
                date: dateKey,
                bruto: 0,
                lucro: 0,
                count: 0,
            })
        })

        transactionsData.forEach((transaction) => {
            if (transaction.dt_insert) {
                try {
                    const dateKey = format(new Date(transaction.dt_insert), "yyyy-MM-dd")
                    const existing = dailyMap.get(dateKey)

                    const amount = Number(transaction.total_amount || 0)
                    const lucro = Number(transaction.profit || transaction.lucro || amount * 0.1)

                    if (existing) {
                        existing.bruto += amount
                        existing.lucro += lucro
                        existing.count += 1
                    }
                } catch (error) {
                    console.error("Erro ao processar transaction:", transaction.dt_insert, error)
                }
            }
        })

        return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date))
    }, [transactionsData, dateRange])

    const handleMouseMove = (data: any, event: any) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            setHoveredData(data.activePayload[0].payload)
    
            const mouseX = event?.nativeEvent?.clientX || 0
            const mouseY = event?.nativeEvent?.clientY || 0
    
            setMousePosition({ x: mouseX, y: mouseY })
        }
    }

    const handleMouseLeave = () => {
        setHoveredData(null)
    }

    const CustomTooltip = () => {
        if (!hoveredData) return null
    
        return (
            <div
                className="fixed bg-white rounded shadow-md border p-2 min-w-[160px] z-50 pointer-events-none text-xs"
                style={{
                    left: mousePosition.x + 10,
                    top: mousePosition.y + 10,
                }}
            >
                <div className="space-y-1">
                    <div className="font-medium text-gray-800 text-xs border-b pb-1">
                        {new Date(hoveredData.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                        })}
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Vendas:</span>
                        <span className="font-medium text-green-600">
                            {hoveredData.bruto?.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Lucro:</span>
                        <span className="font-medium text-blue-600">
                            {hoveredData.lucro?.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <Card ref={cardRef} className=" w-full border-0 bg-[#05336A] text-white overflow-hidden flex flex-col items-stretch space-y-0 border-b p-0">

            <CardHeader className="relative z-10 pb-1 px-3 py-2">
                <div className="flex flex-col sm:flex-row lg:flex-row sm:items-start lg:tems-start sm:justify-between lg:justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm font-medium text-blue-100">Total de Vendas</CardTitle>
                        <div className="text-xl sm:text-2xl font-bold break-words mt-1">
                            {formatCurrency(totalTransactions?.sum || 0)}
                        </div>
                    </div>
                    <div className="flex-shrink-0 scale-75 origin-top-right">
                        <DashboardFilters />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative z-10 pt-1 px-3 pb-3">
                <div className="h-16 sm:h-20 mb-3 relative w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={dailyData}
                                margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={false} />
                                <YAxis hide />

                                <Line
                                    type="monotone"
                                    dataKey="bruto"
                                    stroke={chartConfig.bruto.color}
                                    strokeWidth={1.5}
                                    dot={false}
                                    activeDot={{ r: 3, fill: chartConfig.bruto.color, stroke: "#fff", strokeWidth: 1 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="lucro"
                                    stroke={chartConfig.lucro.color}
                                    strokeWidth={1.5}
                                    dot={false}
                                    activeDot={{ r: 3, fill: chartConfig.lucro.color, stroke: "#fff", strokeWidth: 1 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <div className="space-y-0.5 min-w-0">
                        <p className="text-blue-200 text-xs">Lucro</p>
                        <p className="text-sm font-semibold break-words">
                            {formatCurrency(totalTransactions?.revenue || 0)}
                        </p>
                    </div>
                    <div className="space-y-0.5 min-w-0">
                        <p className="text-blue-200 text-xs">Transações</p>
                        <p className="text-sm font-semibold">{(totalTransactions?.count || 0).toLocaleString("pt-BR")}</p>
                    </div>
                    <div className="space-y-0.5 min-w-0">
                        <p className="text-blue-200 text-xs">Canceladas</p>
                        <p className="text-sm font-semibold">{canceledTransactions}</p>
                    </div>
                    <div className="space-y-0.5 min-w-0">
                        <p className="text-blue-200 text-xs">EC Cadastrados</p>
                        <p className="text-sm font-semibold">{totalMerchants || 0}</p>
                    </div>
                </div>
            </CardContent>

            {hoveredData && <CustomTooltip />}
        </Card>
    )
}
