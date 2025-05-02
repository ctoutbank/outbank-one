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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency, getStatusColor, translateStatus } from "@/lib/utils";
import { SettlementsList } from "../server/settlements";

export default function SettlementHistorylist({
  Settlements,
}: {
  Settlements: SettlementsList;
}) {
  console.log(Settlements);
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
            {Settlements.settlements.map((settlements, index) => (
              <TableRow key={index}>
                <TableCell>
                  <a
                    href={`/portal/settlements?settlementSlug=${settlements.slug}`}
                    className="underline"
                  >
                    {settlements.payment_date}
                  </a>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          {formatCurrency(
                            Number(settlements.batch_amount) +
                              Number(settlements.total_adjustment_amount || 0)
                          )}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Valor Base:{" "}
                          {formatCurrency(Number(settlements.batch_amount))}
                        </p>
                        <p>
                          Ajustes:{" "}
                          {formatCurrency(
                            Number(settlements.total_adjustment_amount || 0)
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
