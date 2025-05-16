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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatCNPJ, translateStatus } from "@/lib/utils";
import { ChevronDown, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Merchantlist } from "../server/merchant";

export default function MerchantList({ list }: { list: Merchantlist }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleSoftDelete = async (merchantId: number | bigint) => {
    try {
      setIsDeleting(Number(merchantId));
      const response = await fetch(`/api/merchants/soft-delete/${merchantId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Merchant desativado com sucesso");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao desativar merchant");
      }
    } catch (error) {
      console.error("Erro ao desativar merchant:", error);
      toast.error("Ocorreu um erro ao desativar o merchant");
    } finally {
      setIsDeleting(null);
    }
  };

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
              <TableHead>Ações</TableHead>
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
                      ({formatCNPJ(merchant.cnpj)})
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
                  <Badge variant={merchant.active ? "success" : "destructive"}>
                    {merchant.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {merchant.active && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Desativar Merchant
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja desativar o merchant{" "}
                            {merchant.name}? Essa ação irá desativar o merchant
                            tanto no sistema quanto na API da Dock.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleSoftDelete(merchant.merchantid)
                            }
                            disabled={isDeleting === merchant.merchantid}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting === merchant.merchantid
                              ? "Desativando..."
                              : "Desativar"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
