"use client";

import { useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface Transaction {
  id: string;
  name: string;
  totalGross: number;
  totalNet: number;
  details?: {
    type: string;
    gross: number;
    net: number;
  }[];
}

export function DailyView({ transactions }: { transactions: Transaction[] }) {
  const [openTransaction, setOpenTransaction] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState<string | null>(null);

  return (
    <Card className="divide-y">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="p-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() =>
              setOpenTransaction(
                openTransaction === transaction.id ? null : transaction.id
              )
            }
          >
            <div className="flex items-center gap-2">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openTransaction === transaction.id ? "rotate-180" : ""
                }`}
              />
              <span className="font-medium">{transaction.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-primary">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(transaction.totalNet)}
              </span>
              <Download className="h-4 w-4" />
            </div>
          </div>
          {openTransaction === transaction.id && transaction.details && (
            <div className="mt-2 pl-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modo</TableHead>
                    <TableHead className="text-right">
                      Valor Total Bruto
                    </TableHead>
                    <TableHead className="text-right">
                      Valor Total Líquido
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaction.details.map((detail, index) => (
                    <>
                      <TableRow
                        key={index}
                        className="cursor-pointer"
                        onClick={() =>
                          setOpenDetail(
                            openDetail === detail.type ? null : detail.type
                          )
                        }
                      >
                        <TableCell className="flex items-center gap-2">
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              openDetail === detail.type ? "rotate-180" : ""
                            }`}
                          />
                          {detail.type}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(detail.gross)}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(detail.net)}
                        </TableCell>
                      </TableRow>
                      {openDetail === detail.type && (
                        <TableRow>
                          <TableCell colSpan={3} className="pl-10">
                            Master
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      ))}
    </Card>
  );
}
