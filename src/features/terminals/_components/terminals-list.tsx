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
import { createSortHandler, formatCNPJ } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TerminallsList } from "../serverActions/terminal";

export default function TerminalsList({
  terminals,
}: {
  terminals: TerminallsList;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  // Função para lidar com ordenação usando utilitário
  const handleSort = createSortHandler(
    searchParams,
    router,
    "/portal/terminals"
  );

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                columnId="dtinsert"
                name="Data de Inclusão"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="logicalNumber"
                name="Nº Lógico"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="serialNumber"
                name="Nº Serial"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="merchantName"
                name="Estabelecimento"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="model"
                name="Modelo"
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
            {terminals.terminals.map((terminal) => (
              <TableRow key={terminal.slug}>
                <TableCell>
                  <Link
                    className="text-primary underline"
                    href={`/portal/terminals/${terminal.slug}`}
                  >
                    {terminal.dtinsert
                      ? formatDate(terminal.dtinsert.toString())
                      : null}
                  </Link>
                </TableCell>
                <TableCell>{terminal.logicalNumber}</TableCell>

                <TableCell>{terminal.serialNumber}</TableCell>

                <TableCell>
                  {terminal.merchantName}
                  <div className="text-xs text-gray-500">
                    {terminal.merchantDocumentId
                      ? formatCNPJ(terminal.merchantDocumentId)
                      : terminal.merchantDocumentId}
                  </div>
                </TableCell>
                <TableCell>{terminal.model}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      terminal.status === "ACTIVE"
                        ? "success"
                        : terminal.status === "INACTIVE"
                          ? "destructive"
                          : terminal.status === "MAINTENANCE"
                            ? "pending"
                            : "default"
                    }
                  >
                    {terminal.status === "ACTIVE"
                      ? "Ativo"
                      : terminal.status === "INACTIVE"
                        ? "Inativo"
                        : terminal.status === "MAINTENANCE"
                          ? "Manutenção"
                          : terminal.status || "Desconhecido"}
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
