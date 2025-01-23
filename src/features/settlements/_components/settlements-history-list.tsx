"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormatCurrency, FormatDate } from "@/lib/utils";
import { SettlementsList } from "../server/settlements";

export default function SettlementHistorylist({
  Settlements,
}: {
  Settlements: SettlementsList;
}) {
  function getStatusColor(status: string): string {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "PROCESSING":
        return "bg-yellow-300 text-black hover:bg-yellow-400";
      case "REQUESTED":
        return "bg-yellow-300 text-black hover:bg-yellow-400";
      case "FAILED":
        return "bg-red-500 text-white hover:bg-red-600";
      case "SETTLED":
        return "bg-green-500 text-white hover:bg-green-600";
      case "PRE_APPROVED":
        return "bg-blue-400 text-white hover:bg-blue-500";
      case "APPROVED":
        return "bg-blue-700 text-white hover:bg-blue-800";
      default:
        return "bg-gray-400 text-white hover:bg-gray-500";
    }
  }

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data de liquidação</TableHead>
              <TableHead>Montante bruto das vendas</TableHead>
              <TableHead>Montante líquido das antecipações</TableHead>
              <TableHead>Montante da restituição</TableHead>
              <TableHead>Montante da liquidação</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Settlements.settlements.map((settlements) => (
              <TableRow key={settlements.id}>
                <TableCell>
                  <a
                    href={`/portal/settlements?settlementSlug=${settlements.slug}`}
                  >
                    {FormatDate(settlements.payment_date || new Date())}
                  </a>
                </TableCell>
                <TableCell>
                  {FormatCurrency(settlements.batch_amount || 0)}
                </TableCell>
                <TableCell>
                  {FormatCurrency(settlements.total_anticipation_amount || 0)}
                </TableCell>

                <TableCell>
                  {FormatCurrency(settlements.total_restituition_amount || 0)}
                </TableCell>

                <TableCell>
                  {FormatCurrency(settlements.total_settlement_amount || 0)}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(settlements.status || "")}>
                    {settlements.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
