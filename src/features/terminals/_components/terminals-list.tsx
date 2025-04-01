import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type Terminal = {
  slug: string | null;
  logicalNumber: string | null;
  model: string | null;
  manufacturer: string | null;
};

interface TerminalsListProps {
  terminals: Terminal[];
}

export default function TerminalsList({ terminals }: TerminalsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Terminal</TableHead>
          <TableHead>Número Lógico</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Fabricante</TableHead>
          <TableHead className="w-[100px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {terminals.map((terminal) => (
          <TableRow key={terminal.slug}>
            <TableCell>{terminal.slug}</TableCell>
            <TableCell>{terminal.logicalNumber}</TableCell>
            <TableCell>{terminal.model}</TableCell>
            <TableCell>{terminal.manufacturer}</TableCell>
            <TableCell>
              <Link href={`/portal/terminals/${terminal.slug}`}>
                <Button variant="ghost" size="icon" title="Visualizar detalhes">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
