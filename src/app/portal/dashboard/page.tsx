import BaseBody from "@/components/layout/base-body"
import BaseHeader from "@/components/layout/base-header"
import {
    getCancelledTransactions,
    getRawTransactionsByDate,
    getTotalMerchants,
    getTotalTransactions,
    getTotalTransactionsByMonth,
    getTransactionsGroupedReport,
    normalizeDateRange,
} from "@/features/transactions/serverActions/transaction"
import { format } from "date-fns"
import { Suspense } from "react"
import { BarChartCustom } from "./_components/barChart"
import {TransactionSummaryCards} from "@/app/portal/dashboard/_components/transaction-cards";

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SalesDashboard({
                                                 searchParams,
                                             }: {
    searchParams: { dateFrom?: string; dateTo?: string }
}) {
    // Valores padrão caso não sejam fornecidos
    const defaultDateFrom = "2024-09-01T00:00:00"
    const defaultDateTo = format(new Date(), "yyyy-MM-dd'T'HH:mm")

    const dateFrom = searchParams.dateFrom || defaultDateFrom
    const dateTo = searchParams.dateTo || defaultDateTo

    const dateRange = await normalizeDateRange(dateFrom, dateTo)

    // Para o período anterior, vamos calcular um intervalo equivalente no passado
    const fromDate = new Date(dateFrom)
    const toDate = new Date(dateTo)
    const diffInMs = toDate.getTime() - fromDate.getTime()

    const previousFromDate = new Date(fromDate.getTime() - diffInMs)
    const previousToDate = new Date(fromDate.getTime())

    const previousDateRange = await normalizeDateRange(previousFromDate.toISOString(), previousToDate.toISOString())

    const totalTransactions = await getTotalTransactions(dateRange.start, dateRange.end)

    const totalTransactionsByDay = await getRawTransactionsByDate(dateRange.start, dateRange.end)

    const canceledTransactions = await getCancelledTransactions(dateRange.start, dateRange.end)

    const totalTransactionsPreviousPeriod = await getTotalTransactions(previousDateRange.start, previousDateRange.end)

    console.log(totalTransactionsPreviousPeriod)

    const transactions = await getTransactionsGroupedReport(dateRange.start, dateRange.end)

    const totalTransactionsByMonth = await getTotalTransactionsByMonth(dateRange.start, dateRange.end, "custom")

    const totalMerchants = await getTotalMerchants()

    return (
        <>
            <BaseHeader breadcrumbItems={[{ title: "Dashboard", url: "/portal/dashboard" }]} />
            <BaseBody title="Dashboard" subtitle="Visão geral das vendas">
                <Suspense fallback={<div>Carregando...</div>}>
                    <BarChartCustom
                        chartData={totalTransactionsByMonth}
                        transactionsData={totalTransactionsByDay}
                        viewMode="custom"
                        totalTransactions={totalTransactions[0]}
                        totalMerchants={totalMerchants[0]?.total || 0}
                        dateRange={{ start: dateRange.start, end: dateRange.end }}
                        canceledTransactions={canceledTransactions.length}
                    />

                    <div className="mt-8">
                        <TransactionSummaryCards transactions={transactions} />
                    </div>
                </Suspense>
            </BaseBody>
        </>
    )
}
