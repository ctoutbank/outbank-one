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
  adjustmentADE,
  adjustmentAJT,
  adjustmentReasons,
} from "@/lib/lookuptables/lookuptables-adjustment";
import { createSortHandler, formatCNPJ } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { FinancialAdjustmentsList } from "../server/financialAdjustments";

interface FinancialAdjustmentsListProps {
  adjustments: FinancialAdjustmentsList;
}

export default function FinancialAdjustmentsList({
  adjustments,
}: FinancialAdjustmentsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSort = createSortHandler(
    searchParams,
    router,
    "/portal/financialAdjustment"
  );

  const formatCurrency = (value: string | null) => {
    if (!value) return "R$ 0,00";
    const numValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue);
  };

  const getLabel = (
    value: string,
    options: { value: string; label: string }[]
  ) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : "-";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              columnId="expectedSettlementDate"
              name="Previsao de Liquidação"
              sortable={true}
              onSort={handleSort}
              searchParams={searchParams}
            />
            <SortableTableHead
              columnId="reason"
              name="Razao"
              sortable={true}
              onSort={handleSort}
              searchParams={searchParams}
            />
            <SortableTableHead
              columnId="title"
              name="Título"
              sortable={true}
              onSort={handleSort}
              searchParams={searchParams}
            />
            <SortableTableHead
              columnId="description"
              name="Motivo"
              sortable={true}
              onSort={handleSort}
              searchParams={searchParams}
            />
            <SortableTableHead
              columnId="rrn"
              name="NSU"
              sortable={true}
              onSort={handleSort}
              searchParams={searchParams}
            />
            <SortableTableHead
              columnId="grossValue"
              name="Valor"
              sortable={true}
              onSort={handleSort}
              searchParams={searchParams}
            />
            <SortableTableHead
              columnId="merchants"
              name="Estabelecimento"
              sortable={false}
              onSort={handleSort}
              searchParams={searchParams}
            />
            <SortableTableHead
              columnId="active"
              name="Status"
              sortable={true}
              onSort={handleSort}
              searchParams={searchParams}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {adjustments.financialAdjustments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Nenhum ajuste financeiro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            adjustments.financialAdjustments.map((adjustment) => (
              <TableRow key={adjustment.id}>
                <TableCell>
                  <Link
                    href={`/portal/financialAdjustment/${adjustment.id}`}
                    className="underline"
                  >
                    {adjustment.expectedSettlementDate?.toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell>
                  {adjustment.reason
                    ? getLabel(adjustment.reason, adjustmentReasons)
                    : "-"}
                </TableCell>
                <TableCell>
                  {adjustment.reason === "ADE" && adjustment.title
                    ? getLabel(adjustment.title || "", adjustmentADE)
                    : getLabel(adjustment.title || "", adjustmentAJT)}
                </TableCell>
                <TableCell>{adjustment.description || "-"}</TableCell>
                <TableCell>{adjustment.rrn || "-"}</TableCell>

                <TableCell className="font-mono">
                  {formatCurrency(adjustment.grossValue)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    {adjustment.merchants.map((merchant, index) => (
                      <div key={merchant.id} className="flex flex-col">
                        <span>{merchant.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatCNPJ(merchant.idDocument || "")})
                        </span>
                        {index < adjustment.merchants.length - 1 && (
                          <div className="border-b border-gray-200 my-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={adjustment.active ? "default" : "destructive"}
                  >
                    {adjustment.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
