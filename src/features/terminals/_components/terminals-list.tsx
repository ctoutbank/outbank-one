import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCNPJ } from "@/lib/utils";
import { ChevronDown, Eye } from "lucide-react";
import Link from "next/link";
import { TerminallsList } from "../serverActions/terminal";

export default function TerminalsList({
  terminals,
}: {
  terminals: TerminallsList;
}) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };
  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Data de Inclusão
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Nº Lógico
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Nº Serial
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Estabelecimento
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Modelo
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
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

                <TableCell>
                  <Link href={`/portal/terminals/${terminal.slug}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Visualizar detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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
