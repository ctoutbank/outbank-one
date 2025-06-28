import { Card, CardContent } from "@/components/ui/card";
import type { TransactionsDashboardTotals } from "@/features/transactions/serverActions/transaction";
import { CreditCard } from "lucide-react";
import type React from "react";

interface TransactionSummaryCardsProps {
  transactions: TransactionsDashboardTotals[];
}

interface CardData {
  id: string;
  title: string;
  value: number;
  count: number;
  icon: React.ReactNode;
}

export function TransactionSummaryCards({
  transactions,
}: TransactionSummaryCardsProps) {
  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para formatar número de transações
  const formatTransactions = (count: number) => {
    return new Intl.NumberFormat("pt-BR").format(count) + " transações";
  };

  // Processar dados de Débito
  const debitData = transactions
    .filter((t) => t.product_type === "DEBIT")
    .reduce(
      (acc, curr) => ({
        count: acc.count + Number(curr.count),
        totalAmount: acc.totalAmount + Number(curr.total_amount),
      }),
      { count: 0, totalAmount: 0 }
    );

  // Processar dados de Crédito
  const creditData = transactions
    .filter((t) => t.product_type === "CREDIT")
    .reduce(
      (acc, curr) => ({
        count: acc.count + Number(curr.count),
        totalAmount: acc.totalAmount + Number(curr.total_amount),
      }),
      { count: 0, totalAmount: 0 }
    );

  // Processar dados de Débito Pré-pago
  const prepaidDebitData = transactions
    .filter((t) => t.product_type === "PREPAID_DEBIT")
    .reduce(
      (acc, curr) => ({
        count: acc.count + Number(curr.count),
        totalAmount: acc.totalAmount + Number(curr.total_amount),
      }),
      { count: 0, totalAmount: 0 }
    );

  // Processar dados de Crédito Pré-pago
  const prepaidCreditData = transactions
    .filter((t) => t.product_type === "PREPAID_CREDIT")
    .reduce(
      (acc, curr) => ({
        count: acc.count + Number(curr.count),
        totalAmount: acc.totalAmount + Number(curr.total_amount),
      }),
      { count: 0, totalAmount: 0 }
    );

  // Processar dados de PIX (assumindo que existe um tipo PIX)
  const pixData = transactions
    .filter((t) => t.product_type === "PIX")
    .reduce(
      (acc, curr) => ({
        count: acc.count + Number(curr.count),
        totalAmount: acc.totalAmount + Number(curr.total_amount),
      }),
      { count: 0, totalAmount: 0 }
    );

  // Criar array de cards
  const cardsData: CardData[] = [
    {
      id: "debit",
      title: "Débito",
      value: debitData.totalAmount,
      count: debitData.count,
      icon: <CreditCard className="h-6 w-6 text-black" />,
    },
    {
      id: "credit",
      title: "Crédito",
      value: creditData.totalAmount,
      count: creditData.count,
      icon: <CreditCard className="h-6 w-6 text-black" />,
    },
    {
      id: "prepaid-debit",
      title: "Débito Pré-pago",
      value: prepaidDebitData.totalAmount,
      count: prepaidDebitData.count,
      icon: <CreditCard className="h-6 w-6 text-black" />,
    },
    {
      id: "prepaid-credit",
      title: "Crédito Pré-pago",
      value: prepaidCreditData.totalAmount,
      count: prepaidCreditData.count,
      icon: <CreditCard className="h-6 w-6 text-black" />,
    },
    {
      id: "pix",
      title: "Pix",
      value: pixData.totalAmount,
      count: pixData.count,
      icon: <img src="/pix.png" alt="Ícone de PIX" className="h-6 w-6" />,
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cardsData.map((card) => (
          <Card
            key={card.id}
            className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex flex-col space-y-3">
                {/* Ícone */}
                <div className="flex justify-start">{card.icon}</div>

                {/* Título */}
                <div className="text-sm font-medium text-gray-600">
                  {card.title}
                </div>

                {/* Valor */}
                <div className="text-sm font-bold text-gray-900">
                  {formatCurrency(card.value)}
                </div>

                {/* Número de transações */}
                <div className="text-xs text-gray-500">
                  {formatTransactions(card.count)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
