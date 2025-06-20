import type React from "react"
import { CreditCard, Banknote } from "lucide-react"
import type { TransactionsGroupedReport } from "@/features/transactions/serverActions/transaction"
import { Card, CardContent } from "@/components/ui/card"

interface TransactionSummaryCardsProps {
    transactions: TransactionsGroupedReport[]
}

interface CardData {
    id: string
    title: string
    value: number
    count: number
    icon: React.ReactNode
}

export function TransactionSummaryCards({ transactions }: TransactionSummaryCardsProps) {
    // Função para formatar valores monetários
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    // Função para formatar número de transações
    const formatTransactions = (count: number) => {
        return new Intl.NumberFormat("pt-BR").format(count) + " transações"
    }

    // Processar dados de Débito
    const debitData = transactions
        .filter(
            (t) =>
                t.product_type === "DEBIT" && (t.transaction_status === "AUTHORIZED" || t.transaction_status === "PENDING"),
        )
        .reduce(
            (acc, curr) => ({
                count: acc.count + Number(curr.count),
                totalAmount: acc.totalAmount + Number(curr.total_amount),
            }),
            { count: 0, totalAmount: 0 },
        )

    // Processar dados de Crédito
    const creditData = transactions
        .filter(
            (t) =>
                t.product_type === "CREDIT" && (t.transaction_status === "AUTHORIZED" || t.transaction_status === "PENDING"),
        )
        .reduce(
            (acc, curr) => ({
                count: acc.count + Number(curr.count),
                totalAmount: acc.totalAmount + Number(curr.total_amount),
            }),
            { count: 0, totalAmount: 0 },
        )

    // Processar dados de Débito Pré-pago
    const prepaidDebitData = transactions
        .filter(
            (t) =>
                t.product_type === "PREPAID_DEBIT" &&
                (t.transaction_status === "AUTHORIZED" || t.transaction_status === "PENDING"),
        )
        .reduce(
            (acc, curr) => ({
                count: acc.count + Number(curr.count),
                totalAmount: acc.totalAmount + Number(curr.total_amount),
            }),
            { count: 0, totalAmount: 0 },
        )

    // Processar dados de Crédito Pré-pago
    const prepaidCreditData = transactions
        .filter(
            (t) =>
                t.product_type === "PREPAID_CREDIT" &&
                (t.transaction_status === "AUTHORIZED" || t.transaction_status === "PENDING"),
        )
        .reduce(
            (acc, curr) => ({
                count: acc.count + Number(curr.count),
                totalAmount: acc.totalAmount + Number(curr.total_amount),
            }),
            { count: 0, totalAmount: 0 },
        )

    // Processar dados de PIX (assumindo que existe um tipo PIX)
    const pixData = transactions
        .filter(
            (t) => t.product_type === "PIX" && (t.transaction_status === "AUTHORIZED" || t.transaction_status === "PENDING"),
        )
        .reduce(
            (acc, curr) => ({
                count: acc.count + Number(curr.count),
                totalAmount: acc.totalAmount + Number(curr.total_amount),
            }),
            { count: 0, totalAmount: 0 },
        )

    // Criar array de cards
    const cardsData: CardData[] = [
        {
            id: "debit",
            title: "Débito",
            value: debitData.totalAmount,
            count: debitData.count,
            icon: <CreditCard className="h-6 w-6 text-gray-600" />,
        },
        {
            id: "credit",
            title: "Crédito",
            value: creditData.totalAmount,
            count: creditData.count,
            icon: <CreditCard className="h-6 w-6 text-gray-600" />,
        },
        {
            id: "prepaid-debit",
            title: "Débito Pré-pago",
            value: prepaidDebitData.totalAmount,
            count: prepaidDebitData.count,
            icon: <CreditCard className="h-6 w-6 text-gray-600" />,
        },
        {
            id: "prepaid-credit",
            title: "Crédito Pré-pago",
            value: prepaidCreditData.totalAmount,
            count: prepaidCreditData.count,
            icon: <CreditCard className="h-6 w-6 text-gray-600" />,
        },
        {
            id: "pix",
            title: "PIX",
            value: pixData.totalAmount,
            count: pixData.count,
            icon: <Banknote className="h-6 w-6 text-gray-600" />,
        },
    ]

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {cardsData.map((card) => (
                    <Card key={card.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex flex-col space-y-3">
                                {/* Ícone */}
                                <div className="flex justify-start">{card.icon}</div>

                                {/* Título */}
                                <div className="text-sm font-medium text-gray-600">{card.title}</div>

                                {/* Valor */}
                                <div className="text-sm font-bold text-gray-900">{formatCurrency(card.value)}</div>

                                {/* Número de transações */}
                                <div className="text-xs text-gray-500">{formatTransactions(card.count)}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
