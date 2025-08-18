"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown } from 'lucide-react'
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function DashboardFilters({
                                             onFilterApply
                                         }: {
    onFilterApply?: () => void
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const defaultDateFrom = "2024-09-01T00:00:00"
    const defaultDateTo = format(new Date(), "yyyy-MM-dd'T'HH:mm")

    const [dateFrom, setDateFrom] = useState(searchParams?.get("dateFrom") || defaultDateFrom)
    const [dateTo, setDateTo] = useState(searchParams?.get("dateTo") || defaultDateTo)
    const [isOpen, setIsOpen] = useState(false)

    const handleApplyFilter = () => {
        // Chama a função para ativar o loading no dashboard
        onFilterApply?.()

        const params = new URLSearchParams()
        if (dateFrom) params.set("dateFrom", dateFrom)
        if (dateTo) params.set("dateTo", dateTo)

        router.push(`/portal/dashboard?${params.toString()}`)
        setIsOpen(false)
    }

    const formatDateRange = () => {
        const from = dateFrom ? format(new Date(dateFrom), "dd/MM/yy") : ""
        const to = dateTo ? format(new Date(dateTo), "dd/MM/yy") : ""
        return `${from} - ${to}`
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white text-white border-white/20 border"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="text-sm">Personalizado...</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <div className="p-4 space-y-4 bg-white rounded-lg shadow-lg min-w-[400px]">
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-700">Período personalizado</h4>
                        <p className="text-xs text-gray-500">Selecione o intervalo de datas para análise</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600">Data inicial</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal text-xs",
                                            !dateFrom && "text-muted-foreground",
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-3 w-3" />
                                        {dateFrom ? format(new Date(dateFrom), "dd/MM/yyyy") : "Selecionar"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateFrom ? new Date(dateFrom) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                const formatted = format(date, "yyyy-MM-dd'T'HH:mm")
                                                setDateFrom(formatted)
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600">Data final</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal text-xs",
                                            !dateTo && "text-muted-foreground",
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-3 w-3" />
                                        {dateTo ? format(new Date(dateTo), "dd/MM/yyyy") : "Selecionar"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateTo ? new Date(dateTo) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                const formatted = format(date, "yyyy-MM-dd'T'HH:mm")
                                                setDateTo(formatted)
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {dateFrom && dateTo && (
                        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-blue-800">Período selecionado</p>
                                    <p className="text-sm text-blue-600">{formatDateRange()}</p>
                                </div>
                                <CalendarIcon className="h-4 w-4 text-blue-500" />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-2 border-t">
                        <Button
                            onClick={handleApplyFilter}
                            size="sm"
                            className="text-xs"
                        >
                            Aplicar filtro
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
