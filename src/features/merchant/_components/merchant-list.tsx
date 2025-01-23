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
import exportExcel from "@/lib/export-xlsx";

import { ChevronDown, Download, MoreVertical, Plus } from "lucide-react";
import Link from "next/link";
import { Merchantlist } from "../server/merchant";


export default function MerchantList({ list }: { list: Merchantlist }) {
  

  const onGetExporMerchants = async () => {
    // Check if the action result contains data and if it's an array
    if (list.merchants && Array.isArray(list.merchants)) {
      const dataToExport = list.merchants.map((merchant: any) => ({
        Nome: merchant.name,
        CNPJ: merchant.cnpj,
        Email: merchant.email,
        Telefone: merchant.phone_type,
        Status: merchant.kic_status,
      }));
      // Create Excel workbook and worksheet
      exportExcel("Estabelecimentos", "Estabelecimentos", dataToExport);
    }
  };

  return (
    <div>
     

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
            {list.merchants.map((merchant, i) => (
              <TableRow key={merchant.merchantid}>
                <TableCell><Link
                    className="text-primary underline"
                    href="/portal/merchants/[id]"
                    as={`/portal/merchants/${merchant.merchantid}`}
                  >
                  {merchant.name}
                  <div className="text-sm text-muted-foreground">
                    {merchant.cnpj.slice(0, 11) + "-" + merchant.cnpj.slice(11)}
                  </div>
                  </Link>
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
                      : merchant.kic_status === "PENDING"
                      ? "pending"
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
                    {merchant.active ? "ATIVO" : "INATIVO"}
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
