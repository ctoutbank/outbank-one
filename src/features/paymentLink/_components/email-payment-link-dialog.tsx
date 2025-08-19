"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { SendEmail } from "@/server/integrations/resend-email/resend-email";
import {toast} from "sonner";

interface EmailPaymentLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentLink: string;
}

export function EmailPaymentLinkDialog({
  isOpen,
  onClose,
  paymentLink,
}: EmailPaymentLinkDialogProps) {
  const [email, setEmail] = useState("");


  const handleSendEmail = () => {
    // This is a placeholder function that will be implemented later
    SendEmail(email, paymentLink);
    onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Link da Venda</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="link" className="flex items-center">
              Link da Venda Rápida: <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="link"
                value={paymentLink}
                readOnly
                className="col-span-3"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="truncate max-w-[200px]"></span>
              <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-muted"
                  onClick={() => handleCopyLink(paymentLink)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="flex items-center">
              E-mail: <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite o email do destinatário"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSendEmail}>
            Enviar e-mail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
