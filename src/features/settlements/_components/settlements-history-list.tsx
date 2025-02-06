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
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  translateStatus,
} from "@/lib/utils";
import { SettlementsList } from "../server/settlements";

export default function SettlementHistorylist({
  Settlements,
}: {
  Settlements: SettlementsList;
}) {
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
              <TableRow>
                <TableCell>
                  <a
                    href={`/portal/settlements?settlementSlug=${settlements.slug}`}
                  >
                    {formatDate(
                      new Date(settlements.payment_date) || new Date()
                    )}
                  </a>
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(settlements.batch_amount))}
                </TableCell>
                <TableCell>
                  {formatCurrency(
                    Number(settlements.total_anticipation_amount)
                  )}
                </TableCell>

                <TableCell>
                  {formatCurrency(Number(settlements.total_restitution_amount))}
                </TableCell>

                <TableCell>
                  {formatCurrency(Number(settlements.total_settlement_amount))}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(settlements.status || "")}>
                    {translateStatus(settlements.status || "")}
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
