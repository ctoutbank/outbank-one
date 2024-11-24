import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTerminals } from "@/server/integrations/dock/dock-terminals";

export default async function TerminalsPage() {
  const terminals = await getTerminals();
  return (
    <>
      <BaseHeader breadcrumbItems={[]} />
      <BaseBody title="Terminais" subtitle="visualização de todos os terminais">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Número Lógico</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Fabricante</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {terminals.map((terminal) => (
              <TableRow key={terminal.slug}>
                <TableCell>{terminal.slug}</TableCell>
                <TableCell>{terminal.logicalNumber}</TableCell>
                <TableCell>{terminal.model}</TableCell>
                <TableCell>{terminal.manufacturer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </BaseBody>
    </>
  );
}
