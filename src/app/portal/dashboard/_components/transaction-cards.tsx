import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TransactionsDashboardTotals } from "@/features/transactions/serverActions/transaction";
import { CreditCard } from "lucide-react";
import Image from "next/image";
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
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatTransactions = (count: number) => {
    return new Intl.NumberFormat("pt-BR").format(count) + " transações";
  };

  const processDataByType = (type: string) =>
    transactions
      .filter((t) => t.product_type === type)
      .reduce(
        (acc, curr) => ({
          count: acc.count + Number(curr.count),
          totalAmount: acc.totalAmount + Number(curr.total_amount),
        }),
        { count: 0, totalAmount: 0 }
      );

  const debitData = processDataByType("DEBIT");
  const creditData = processDataByType("CREDIT");
  const prepaidDebitData = processDataByType("PREPAID_DEBIT");
  const prepaidCreditData = processDataByType("PREPAID_CREDIT");
  const pixData = processDataByType("PIX");

  const cardsData: CardData[] = [
    {
      id: "debit",
      title: "Débito",
      value: debitData.totalAmount,
      count: debitData.count,
      icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
    },
    {
      id: "credit",
      title: "Crédito",
      value: creditData.totalAmount,
      count: creditData.count,
      icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
    },
    {
      id: "prepaid-debit",
      title: "Débito Pré-pago",
      value: prepaidDebitData.totalAmount,
      count: prepaidDebitData.count,
      icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
    },
    {
      id: "prepaid-credit",
      title: "Crédito Pré-pago",
      value: prepaidCreditData.totalAmount,
      count: prepaidCreditData.count,
      icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
    },
    {
      id: "pix",
      title: "Pix",
      value: pixData.totalAmount,
      count: pixData.count,
      icon: (
        <Image
          src="/pix.png"
          alt="Ícone de PIX"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cardsData.map((card) => (
        <Card key={card.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(card.value)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatTransactions(card.count)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}