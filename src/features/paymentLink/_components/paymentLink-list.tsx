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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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

function SortableTableHead({
  label,
  field,
  sortBy,
  sortOrder,
}: {
  label: string;
  field: string;
  sortBy: string;
  sortOrder: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSort() {
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(
      searchParams ? searchParams.toString() : undefined
    );
    params.set("sortBy", field);
    params.set("sortOrder", newOrder);
    router.push(`?${params.toString()}`);
  }

  return (
    <th onClick={handleSort} className="cursor-pointer select-none">
      {label}
      {sortBy === field && <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>}
    </th>
  );
}

export default function PaymentLinksList({
  links,
  sortBy = "dtinsert",
  sortOrder = "desc",
}: {
  links: PaymentLinkList;
  sortBy?: string;
  sortOrder?: string;
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

  const handleCopyLink = async (link: string) => {
    try {
      // Verificar se a API do clipboard está disponível
      if (!navigator.clipboard) {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement("textarea");
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success("Link copiado para a área de transferência!");
        return;
      }

      // Usar a API moderna do clipboard
      await navigator.clipboard.writeText(link);
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      toast.error("Erro ao copiar link. Tente novamente.");
    }
  };

  return (
    <div className="w-full rounded-md border">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                label="Data de Inclusão"
                field="dtinsert"
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
              <SortableTableHead
                label="Nº Lógico"
                field="name"
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
              <SortableTableHead
                label="Nº Serial"
                field="serial"
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
              <SortableTableHead
                label="Estabelecimento"
                field="merchantName"
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
              <SortableTableHead
                label="Modelo"
                field="model"
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
              <SortableTableHead
                label="Status"
                field="status"
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
              <TableHead>Link</TableHead>
              <TableHead>Tipo de pagamento</TableHead>
              <TableHead>Valor Total</TableHead>
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
                      onClick={() => handleCopyLink(link.link)}
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
