"use client";

import { Badge } from "@/components/ui/badge";
import { SortableTableHead } from "@/components/ui/sortable-table-head";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createSortHandler,
  formatCurrency,
  getStatusColor,
  translateStatus,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { SettlementsList } from "../server/settlements";

export default function SettlementHistorylist({
  Settlements,
}: {
  Settlements: SettlementsList;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSort = createSortHandler(
    searchParams,
    router,
    "/portal/settlements/history"
  );

  console.log(Settlements);
  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                columnId="payment_date"
                name="Data de liquidação"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="batch_amount"
                name="Vendas Brutas"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="total_anticipation_amount"
                name="Antecipações Líquidas"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="total_restitution_amount"
                name="Valor Restituído"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="total_settlement_amount"
                name="Valor Liquidado"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="status"
                name="Status"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
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
