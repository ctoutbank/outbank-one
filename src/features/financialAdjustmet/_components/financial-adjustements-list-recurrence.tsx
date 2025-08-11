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
  adjustmentADE,
  adjustmentAJT,
  adjustmentReasons,
  adjustmentRecurrence,
} from "@/lib/lookuptables/lookuptables-adjustment";
import { formatCNPJ } from "@/lib/utils";
import Link from "next/link";
import type { FinancialAdjustmentsList } from "../server/financialAdjustments";

interface FinancialAdjustmentsListRecurrenceProps {
  adjustments: FinancialAdjustmentsList;
}

export default function FinancialAdjustmentsListRecurrence({
  adjustments,
}: FinancialAdjustmentsListRecurrenceProps) {
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
            <TableHead>Razao</TableHead>
            <TableHead>Título</TableHead>

            <TableHead>Motivo</TableHead>
            <TableHead>Previsao de Liquidação</TableHead>

            <TableHead>Recorrência</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Estabelecimento</TableHead>
            <TableHead>Status</TableHead>
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
                <TableCell className="font-medium underline">
                  <Link href={`/portal/financialAdjustment/${adjustment.id}`}>
                    {adjustment.reason
                      ? getLabel(adjustment.reason, adjustmentReasons)
                      : "-"}
                  </Link>
                </TableCell>
                <TableCell>
                  {adjustment.reason === "ADE" && adjustment.title
                    ? getLabel(adjustment.title || "", adjustmentADE)
                    : getLabel(adjustment.title || "", adjustmentAJT)}
                </TableCell>

                <TableCell>{adjustment.description || "-"}</TableCell>
                <TableCell>
                  {adjustment.startDate?.toLocaleDateString()}
                </TableCell>

                <TableCell>
                  {adjustment.recurrence
                    ? getLabel(adjustment.recurrence, adjustmentRecurrence)
                    : "-"}
                </TableCell>

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
