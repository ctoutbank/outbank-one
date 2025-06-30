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

import { ChevronDown } from "lucide-react";
import Link from "next/link";

// Tipo para os dados de EDIS
type EdisFile = {
  id: number;
  name: string;
  type: string;
  status: string;
  date: string;
  size: string;
};

type EdisListType = {
  data: EdisFile[];
  totalCount: number;
  active_count: number;
  inactive_count: number;
  pending_count: number;
  processed_count: number;
  error_count: number;
};

export default function EdisList({ list }: { list: EdisListType }) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Processado":
        return "success";
      case "Pendente":
        return "pending";
      case "Erro":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Nome do Arquivo
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Tipo
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Status
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Data
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Tamanho
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data.map((file) => (
              <TableRow key={file.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link
                      className="text-primary underline"
                      href="/portal/edis/[id]"
                      as={`/portal/edis/${file.id}`}
                    >
                      {file.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={file.type === "Remessa" ? "outline" : "secondary"}
                  >
                    {file.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(file.status)}>
                    {file.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(file.date).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>
                  <Link
                    href={`/portal/edis/${file.id}`}
                    className="text-primary text-sm"
                  >
                    Detalhes
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
