"use client";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Merchantlist } from "@/server/db/merchant";
import router from "next/router";
import Link from "next/link";
import { SearchBar } from "./[id]/search-bar";
import exportToExccelButton from "@/components/export-Excel";

export default function MerchantList({ list }: { list: Merchantlist }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filteredAndSortedMer = useMemo(() => {
    let result = [...list.merchants];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((merchant) => {
        const Name = `${merchant.name ?? ""} ${
          merchant.cnpj ?? ""
        }`.toLowerCase();
        const email = merchant.email?.toLowerCase() ?? "";
        const phoneNumber = merchant.phone_type?.toLowerCase() ?? "";
        return (
          Name.includes(query) ||
          email.includes(query) ||
          phoneNumber.includes(query)
        );
      });
    }
    return result;
  }, [list.merchants, searchQuery]);

  const handleRowClick = (id: bigint) => {
    router.push(`/portal/merchant/"+ ${id}"`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Coluna da Barra de Busca */}
        <div className="max-w-[850px]">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
        </div>

        {/* Coluna dos Botões */}
        <div className="flex justify-end items-center">
          <Button
            variant="outline"
            className="gap-2 mr-2"
            onClick={() => {
              exportToExccelButton(list.merchants);
            }}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button>
            <Link
              href="/portal/merchants/0"
              className="flex gap-2 items-center"
            >
              <Plus className="h-4 w-4" />
              Novo Estabelecimento
            </Link>
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Nome Fantasia
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Localidade
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Status KYC</TableHead>
              <TableHead>Antecipação CP</TableHead>
              <TableHead>Antecipação CNP</TableHead>
              <TableHead>
                Consultor
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Ativo
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedMer.map((merchant, i) => (
              <TableRow key={merchant.id}>
                <TableCell>
                  {merchant.name}
                  <div className="text-sm text-muted-foreground">
                    {merchant.cnpj.slice(0, 11) + "-" + merchant.cnpj.slice(11)}
                  </div>
                </TableCell>
                <TableCell>
                  {merchant.addressname}
                  <div className="text-sm text-muted-foreground">
                    {merchant.state}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      merchant.kic_status === "APPROVED"
                        ? "success"
                        : "destructive"
                    }
                  >
                    {merchant.kic_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      merchant.lockCpAnticipationOrder
                        ? "destructive"
                        : "success"
                    }
                  >
                    {merchant.lockCpAnticipationOrder ? "INACTIVE" : "ACTIVE"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      merchant.lockCnpAnticipationOrder
                        ? "destructive"
                        : "success"
                    }
                  >
                    {merchant.lockCnpAnticipationOrder ? "BLOCKED" : "INATIVO"}
                  </Badge>
                </TableCell>
                <TableCell>{merchant.sales_agent}</TableCell>
                <TableCell>
                  {" "}
                  <Badge variant={merchant.active ? "success" : "destructive"}>
                    {merchant.active ? "INATIVO" : "ATIVO"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link
                    href="/portal/merchants/[id]"
                    as={`/portal/merchants/${merchant.id}`}
                  >
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
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
