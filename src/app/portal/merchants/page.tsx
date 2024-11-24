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
import { getMerchants } from "@/server/integrations/dock-merchants";

export default async function Merchants() {
  const merchants = await getMerchants();
  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Merchants", url: "/portal/merchants" }]}
      />
      <BaseBody
        title="Estabelecimentos"
        subtitle={`visualização de todos os estabelecimentos`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchants.map((merchant) => (
              <TableRow key={merchant.slug}>
                <TableCell>{merchant.name}</TableCell>
                <TableCell>{merchant.slug}</TableCell>
                <TableCell>{merchant.active ? "Ativo" : "Inativo"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </BaseBody>
    </>
  );
}
