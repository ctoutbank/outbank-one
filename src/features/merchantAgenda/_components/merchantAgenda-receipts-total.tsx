import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Wallet } from "lucide-react";

export type MerchantAgendaReceiptsTotalProps = {
  total: number;
  view: "month" | "day";
  status: string;
  isLoading?: boolean;
};

export default function MerchantAgendaReceiptsTotal({
  merchantAgendaReceiptsTotalProps,
}: {
  merchantAgendaReceiptsTotalProps: MerchantAgendaReceiptsTotalProps;
}) {
  const { isLoading } = merchantAgendaReceiptsTotalProps;
  return (
    <Card className="bg-white w-1/4">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-4 w-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-600">
            {merchantAgendaReceiptsTotalProps.view === "month"
              ? "Recebido no mês"
              : "Liquidado do dia"}
          </span>
        </div>
        <Separator className="mb-4" />
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                ["SETTLED", "FULLY_ANTICIPATED"].includes(
                  merchantAgendaReceiptsTotalProps.status
                )
                  ? "bg-green-500"
                  : merchantAgendaReceiptsTotalProps.status === "PROVISIONED"
                    ? "bg-orange-500"
                    : ""
              }`}
            />
            <span className="text-xs font-medium text-zinc-600">
              Valor Total
            </span>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-8">
              <svg
                className="animate-spin h-6 w-6 text-zinc-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          ) : (
            <span className="text-base font-semibold text-zinc-900">
              {formatCurrency(merchantAgendaReceiptsTotalProps.total)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
