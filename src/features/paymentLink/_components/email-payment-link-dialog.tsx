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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink);
  };

  const handleSendEmail = () => {
    // This is a placeholder function that will be implemented later
    SendEmail(email, paymentLink);
    onClose();
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
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" /> Copiar
            </Button>
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
