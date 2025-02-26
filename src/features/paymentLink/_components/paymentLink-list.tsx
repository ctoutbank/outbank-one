"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Copy, Info, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { PaymentLinkList } from "../server/paymentLink";

const getStatusColor = (status: string) => {
  const statusColors = {
    EXPIRED: "bg-gray-500",
    PENDING: "bg-yellow-500",
    PAID: "bg-emerald-500",
  };
  return statusColors[status as keyof typeof statusColors] || "bg-gray-500";
};

const translateStatus = (status: string) => {
  const statusMap = {
    EXPIRED: "Expirado",
    PENDING: "Pendente",
    PAID: "Pago",
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

export default function PaymentLinksList({
  links,
}: {
  links: PaymentLinkList;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ScrollArea className="w-full rounded-md border">
      <div className="min-w-[1040px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-black w-[12%]">
                Data de Criação
              </TableHead>
              <TableHead className="font-semibold text-black w-[12%]">
                Identificador do link
              </TableHead>
              <TableHead className="font-semibold text-black w-[12%]">
                Link expirará em
              </TableHead>
              <TableHead className="font-semibold text-black w-[12%]">
                Nome do EC
              </TableHead>
              <TableHead className="font-semibold text-black w-[20%]">
                Link
              </TableHead>
              <TableHead className="font-semibold text-black w-[10%]">
                Tipo de pagamento
              </TableHead>
              <TableHead className="font-semibold text-black w-[10%] text-right">
                Valor Total
              </TableHead>
              <TableHead className="font-semibold text-black w-[7%] text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-black w-[5%]">
                Opções
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.linksObject.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(new Date(link.dtinsert))}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {link.name}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(new Date(link.expiresAt))}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {link.merchantName}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[200px]">{link.link}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {link.paymentType}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground text-right">
                  {formatCurrency(Number(link.totalAmount))}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={`${getStatusColor(link.status)} text-white`}
                  >
                    {translateStatus(link.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}
