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

import { translateStatus } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Merchantlist } from "../server/merchant";

export default function MerchantList({ list }: { list: Merchantlist }) {
  //exportar para excel

  return (
    <div>
      <div className="border rounded-lg mt-2">
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
              <TableHead>Cadastro</TableHead>
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
            {list.merchants.map((merchant) => (
              <TableRow key={merchant.merchantid}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link
                      className="text-primary underline"
                      href="/portal/merchants/[id]"
                      as={`/portal/merchants/${merchant.merchantid}`}
                    >
                      {merchant.name}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      (
                      {merchant.cnpj.slice(0, 11) +
                        "-" +
                        merchant.cnpj.slice(11)}
                      )
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{merchant.addressname}</span>
                    <span className="text-sm text-muted-foreground">
                      ({merchant.state})
                    </span>
                  </div>
                </TableCell>
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
                <TableCell>
                  <Badge
                    variant={
                      merchant.lockCnpAnticipationOrder
                        ? "destructive"
                        : "success"
                    }
                  >
                    {merchant.lockCnpAnticipationOrder ? "Bloqueado" : "Ativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col whitespace-nowrap">
                    <span>
                      {new Date(merchant.dtinsert).toLocaleDateString("pt-BR") +
                        ", " +
                        new Date(merchant.dtinsert).toLocaleTimeString(
                          "pt-BR",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                    </span>

                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {merchant.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{merchant.sales_agent}</TableCell>
                <TableCell>
                  {" "}
                  <Badge variant={merchant.active ? "success" : "destructive"}>
                    {merchant.active ? "Ativo" : "Inativo"}
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
