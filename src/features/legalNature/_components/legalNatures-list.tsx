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
import { createSortHandler } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LegalNatureList } from "../server/legalNature-db";

export default function LegalNaturelist({
  LegalNatures,
}: {
  LegalNatures: LegalNatureList;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSort = createSortHandler(
    searchParams,
    router,
    "/portal/legalNatures"
  );

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                columnId="name"
                name="Nome"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="code"
                name="Codigo"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="active"
                name="Ativo"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {LegalNatures.legalNatures.map((legalNature) => (
              <TableRow key={legalNature.id}>
                <TableCell>
                  <Link
                    className="text-primary underline"
                    href="/portal/LegalNatures/[id]"
                    as={`/portal/legalNatures/${legalNature.id}`}
                  >
                    {legalNature.name}
                  </Link>
                </TableCell>
                <TableCell>{legalNature.code}</TableCell>

                <TableCell>
                  <Badge
                    variant={legalNature.active ? "success" : "destructive"}
                  >
                    {legalNature.active ? "ATIVO" : "INATIVO"}
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
