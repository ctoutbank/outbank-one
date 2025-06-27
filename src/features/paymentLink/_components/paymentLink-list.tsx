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
import { formatCurrency, formatDate, translateCardType } from "@/lib/utils";
import { Copy, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import type { PaymentLinkList } from "../server/paymentLink";
import { EmailPaymentLinkDialog } from "./email-payment-link-dialog";

const getStatusColor = (status: string) => {
  const statusColors = {
    EXPIRED: "bg-gray-500",
    PENDING: "bg-yellow-500",
    PAID: "bg-emerald-500",
    CANCELLED: "bg-red-500",
  };
  return statusColors[status as keyof typeof statusColors] || "bg-gray-500";
};

const translateStatus = (status: string) => {
  const statusMap = {
    EXPIRED: "Expirado",
    PENDING: "Pendente",
    PAID: "Pago",
    CANCELLED: "Cancelado",
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

export default function PaymentLinksList({
  links,
}: {
  links: PaymentLinkList;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleOpenEmailDialog = (link: string) => {
    setSelectedLink(link);
    setIsEmailDialogOpen(true);
  };
  return (
    <div className="w-full rounded-md border">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data de Criação</TableHead>
              <TableHead>ID Link</TableHead>
              <TableHead>Expira em</TableHead>
              <TableHead>Nome do EC</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Tipo de pagamento</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Opções</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.linksObject.map((link) => (
              <TableRow key={link.id}>
                <TableCell>
                  <a href={`/portal/paymentLink/${link.id}`}>
                    {formatDate(new Date(link.dtinsert))}
                  </a>
                </TableCell>
                <TableCell>{link.name}</TableCell>
                <TableCell>{formatDate(new Date(link.expiresAt))}</TableCell>
                <TableCell>{link.merchantName?.toUpperCase()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[200px]">{link.link}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-muted"
                      onClick={() => navigator.clipboard.writeText(link.link)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{translateCardType(link.paymentType)}</TableCell>
                <TableCell>
                  {formatCurrency(Number(link.totalAmount))}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(
                      link.status
                    )} text-white px-2 py-1 rounded-md`}
                  >
                    {translateStatus(link.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-muted"
                    onClick={() => handleOpenEmailDialog(link.link)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <EmailPaymentLinkDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        paymentLink={selectedLink}
      />
    </div>
  );
}
