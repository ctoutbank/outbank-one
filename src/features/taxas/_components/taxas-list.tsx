"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TaxaList } from "../server/taxa";
import { formatCurrency } from "@/lib/utils";
import { Eye, ArrowUpDown } from "lucide-react";

interface TaxasListProps {
  Taxas: TaxaList;
  sortField: string;
  sortOrder: "asc" | "desc";
}

export default function Taxaslist({
  Taxas,
  sortField,
  sortOrder,
}: TaxasListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSort = (field: string) => {
    const newSortOrder =
      field === sortField && sortOrder === "asc" ? "desc" : "asc";

    const params = new URLSearchParams(searchParams.toString());
    params.set("sortField", field);
    params.set("sortOrder", newSortOrder);

    router.push(`${pathname}?${params.toString()}`);
  };

  const getSortIcon = (field: string) => {
    if (field !== sortField) return null;
    return (
      <ArrowUpDown
        className={`ml-2 h-4 w-4 ${
          sortOrder === "asc" ? "transform rotate-180" : ""
        }`}
      />
    );
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("id")}
            >
              ID {getSortIcon("id")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("nome")}
            >
              Nome {getSortIcon("nome")}
            </TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Taxas.taxas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nenhuma taxa encontrada
              </TableCell>
            </TableRow>
          ) : (
            Taxas.taxas.map((taxa) => (
              <TableRow key={taxa.id}>
                <TableCell>{taxa.id}</TableCell>
                <TableCell>{taxa.nome}</TableCell>
                <TableCell>{taxa.tipo}</TableCell>
                <TableCell>{formatCurrency(Number(taxa.valor))}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      taxa.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {taxa.active ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/portal/taxas/${taxa.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
