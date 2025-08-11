"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortableTableHead } from "@/components/ui/sortable-table-head";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  createSortHandler,
  formatCNPJ,
  getSortIconInfo,
  translateStatus,
} from "@/lib/utils";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Merchantlist } from "../server/merchant";

export default function MerchantList({ list }: { list: Merchantlist }) {
  console.log(list);

  console.log(list.merchants[0].idConfiguration);
  console.log(list.merchants[0].idmerchantbankaccount);
  console.log(list.merchants[0].idcontact);
  console.log(list.merchants[0].idmerchantpixaccount);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Função para determinar a URL baseada nas condições
  const getMerchantUrl = (merchant: any) => {
    // Se não tiver merchantid, manda com /0
    if (!merchant.merchantid) {
      return "/portal/merchants/0";
    }

    const baseUrl = `/portal/merchants/${merchant.merchantid}`;

    // Se existir merchantId mas não tiver idcontact
    if (!merchant.idcontact) {
      return `${baseUrl}?tab=contact`;
    }

    // Se existir merchant.idcontact mas não tiver idConfiguration
    if (!merchant.idConfiguration) {
      return `${baseUrl}?tab=operation`;
    }

    // Se existir merchant.idConfiguration mas não tiver idmerchantbankaccount OU idmerchantpixaccount
    if (!merchant.idmerchantbankaccount || !merchant.idmerchantpixaccount) {
      return `${baseUrl}?tab=bank`;
    }

    if (
      (merchant.idmerchantbankaccount || merchant.idmerchantpixaccount) &&
      !merchant.idmerchantprice
    ) {
      return `${baseUrl}?tab=rate`;
    }

    // Se existir merchant.idmerchantbankaccount E idmerchantpixaccount
    return `${baseUrl}?tab=authorizers`;
  };

  // Função para lidar com ordenação usando utilitário
  const handleSort = createSortHandler(
    searchParams,
    router,
    "/portal/merchants"
  );

  // Função para obter ícone de ordenação usando utilitário
  const getSortIcon = (columnId: string) => {
    const iconInfo = getSortIconInfo(columnId, searchParams);

    if (iconInfo.icon === "up") {
      return <ChevronUp className={iconInfo.className} />;
    } else if (iconInfo.icon === "down") {
      return <ChevronDown className={iconInfo.className} />;
    } else {
      return <ChevronDown className={iconInfo.className} />;
    }
  };

  const columns = [
    {
      id: "name",
      name: "Nome Fantasia",
      defaultVisible: true,
      alwaysVisible: true,
      sortable: true,
    },
    {
      id: "localidade",
      name: "Localidade",
      defaultVisible: true,
      alwaysVisible: false,
      sortable: false,
    },
    {
      id: "statusKyc",
      name: "Status KYC",
      defaultVisible: false,
      alwaysVisible: false,
      sortable: false,
    },
    {
      id: "phone",
      name: "Telefone",
      defaultVisible: false,
      alwaysVisible: false,
      sortable: false,
    },
    {
      id: "email",
      name: "Email",
      defaultVisible: false,
      alwaysVisible: false,
      sortable: false,
    },
    {
      id: "antCp",
      name: "Ant. CP",
      defaultVisible: false,
      alwaysVisible: false,
      sortable: false,
    },
    {
      id: "antCnp",
      name: "Ant. CNP",
      defaultVisible: false,
      alwaysVisible: false,
      sortable: false,
    },
    {
      id: "dtinsert",
      name: "Cadastro",
      defaultVisible: true,
      alwaysVisible: false,
      sortable: true,
    },
    {
      id: "consultor",
      name: "Consultor",
      defaultVisible: false,
      alwaysVisible: false,
      sortable: false,
    },
    {
      id: "ativo",
      name: "Ativo",
      defaultVisible: true,
      alwaysVisible: false,
      sortable: false,
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    columns.filter((column) => column.defaultVisible).map((column) => column.id)
  );

  const toggleColumn = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (column?.alwaysVisible) return; // Não permite ocultar colunas sempre visíveis

    if (visibleColumns.includes(columnId)) {
      setVisibleColumns(visibleColumns.filter((id) => id !== columnId));
    } else {
      setVisibleColumns([...visibleColumns, columnId]);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={visibleColumns.includes(column.id)}
                onCheckedChange={() => toggleColumn(column.id)}
                disabled={column.alwaysVisible}
              >
                {column.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border rounded-lg mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter((column) => visibleColumns.includes(column.id))
                .map((column) => (
                  <SortableTableHead
                    key={column.id}
                    columnId={column.id}
                    name={column.name}
                    sortable={column.sortable}
                    onSort={handleSort}
                    getSortIcon={getSortIcon}
                  />
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.merchants.map((merchant) => (
              <TableRow key={merchant.merchantid}>
                {visibleColumns.includes("name") && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        className="text-primary underline"
                        href="/portal/merchants/[id]"
                        as={getMerchantUrl(merchant)}
                      >
                        {merchant.name.toUpperCase()}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        ({formatCNPJ(merchant.cnpj)})
                      </span>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes("localidade") && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{merchant.addressname}</span>
                      <span className="text-sm text-muted-foreground">
                        ({merchant.state})
                      </span>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes("statusKyc") && (
                  <TableCell>
                    <Badge
                      variant={
                        merchant.kic_status === "APPROVED"
                          ? "success"
                          : merchant.kic_status === "PENDING"
                            ? "pending"
                            : "destructive"
                      }
                    >
                      {translateStatus(merchant.kic_status)}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.includes("phone") && (
                  <TableCell className="text-muted-foreground">
                    {merchant.areaCode && merchant.number
                      ? `(${merchant.areaCode}) ${merchant.number}`
                      : "-"}
                  </TableCell>
                )}
                {visibleColumns.includes("email") && (
                  <TableCell className="text-muted-foreground">
                    <span className="truncate max-w-[200px] block">
                      {merchant.email || "-"}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes("antCp") && (
                  <TableCell>
                    <Badge
                      variant={
                        merchant.lockCpAnticipationOrder
                          ? "destructive"
                          : "success"
                      }
                    >
                      {merchant.lockCpAnticipationOrder ? "Inativo" : "Ativo"}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.includes("antCnp") && (
                  <TableCell>
                    <Badge
                      variant={
                        merchant.lockCnpAnticipationOrder
                          ? "destructive"
                          : "success"
                      }
                    >
                      {merchant.lockCnpAnticipationOrder
                        ? "Bloqueado"
                        : "Ativo"}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.includes("dtinsert") && (
                  <TableCell>
                    <div className="flex flex-col whitespace-nowrap">
                      <span>
                        {new Date(merchant.dtinsert).toLocaleDateString(
                          "pt-BR"
                        ) +
                          ", " +
                          new Date(merchant.dtinsert).toLocaleTimeString(
                            "pt-BR",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                      </span>

                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {merchant.Inclusion}
                      </span>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes("consultor") && (
                  <TableCell>{merchant.sales_agent}</TableCell>
                )}
                {visibleColumns.includes("ativo") && (
                  <TableCell>
                    <Badge
                      variant={merchant.active ? "success" : "destructive"}
                    >
                      {merchant.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
