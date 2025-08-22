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
import { SalesAgentsList } from "@/features/salesAgents/server/salesAgent";
import { createSortHandler } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SalesAgentlist({
  SalesAgents,
}: {
  SalesAgents?: SalesAgentsList;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Função para lidar com ordenação usando utilitário
  const handleSort = createSortHandler(
    searchParams,
    router,
    "/portal/salesAgents"
  );

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                columnId="firstName"
                name="Nome"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="email"
                name="Email"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="documentId"
                name="Registro"
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
            {SalesAgents?.salesAgents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <Link
                    className="text-primary underline"
                    href={"/portal/salesAgents/" + agent.id}
                  >
                    {agent.firstName} {agent.lastName}
                  </Link>
                </TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>{agent.documentId}</TableCell>

                <TableCell>
                  {" "}
                  <Badge variant={agent.active ? "success" : "destructive"}>
                    {agent.active ? "Ativo" : "Inativo"}
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
