import { Card, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export type MerchantAgendaReceiptsTotalProps = {
  total: number;
  view: "month" | "day";
};

export default function MerchantAgendaReceiptsTotal({
  merchantAgendaReceiptsTotalProps,
}: {
  merchantAgendaReceiptsTotalProps: MerchantAgendaReceiptsTotalProps;
}) {
  return (
    <Card className="w-[31.5%] border-l-8 border-black bg-sidebar p-6">
      <CardTitle className="text-sm text-muted-foreground">
        {merchantAgendaReceiptsTotalProps.view === "month"
          ? "TOTAL RECEBIDO NO MÊS"
          : "TOTAL LIQUIDADO DO DIA"}
      </CardTitle>
      <p className="text-xl font-semibold">
        {formatCurrency(merchantAgendaReceiptsTotalProps.total)}
      </p>
    </Card>
  );
}
