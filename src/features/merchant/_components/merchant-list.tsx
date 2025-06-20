"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatCNPJ, translateStatus } from "@/lib/utils";
import { ChevronDown, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Merchantlist } from "../server/merchant";

export default function MerchantList({ list }: { list: Merchantlist }) {
  console.log(list);
  const columns = [
    {
      id: "nomeFantasia",
      name: "Nome Fantasia",
      defaultVisible: true,
      alwaysVisible: true,
    },
    {
      id: "localidade",
      name: "Localidade",
      defaultVisible: true,
      alwaysVisible: false,
    },
    {
      id: "statusKyc",
      name: "Status KYC",
      defaultVisible: false,
      alwaysVisible: false,
    },
    {
      id: "phone",
      name: "Telefone",
      defaultVisible: false,
      alwaysVisible: false,
    },
    {
      id: "email",
      name: "Email",
      defaultVisible: false,
      alwaysVisible: false,
    },
    {
      id: "antCp",
      name: "Ant.CP",
      defaultVisible: false,
      alwaysVisible: false,
    },
    {
      id: "antCnp",
      name: "Ant.CNP",
      defaultVisible: false,
      alwaysVisible: false,
    },
    {
      id: "cadastro",
      name: "Cadastro",
      defaultVisible: true,
      alwaysVisible: false,
    },
    {
      id: "consultor",
      name: "Consultor",
      defaultVisible: true,
      alwaysVisible: false,
    },
    { id: "ativo", name: "Ativo", defaultVisible: true, alwaysVisible: false },
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
                  <TableHead key={column.id}>
                    {column.name}
                    {(column.id === "nomeFantasia" ||
                      column.id === "localidade" ||
                      column.id === "ativo") && (
                      <ChevronDown className="ml-2 h-4 w-4 inline" />
                    )}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.merchants.map((merchant) => (
              <TableRow key={merchant.merchantid}>
                {visibleColumns.includes("nomeFantasia") && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        className="text-primary underline"
                        href="/portal/merchants/[id]"
                        as={`/portal/merchants/${merchant.merchantid}`}
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
                {visibleColumns.includes("cadastro") && (
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
