"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FormatDateTime, FormatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export type VouncherDownloadProps = {
  date: Date;
  value: number;
  description: string;
  singleSettlementNumber: string;
  corporateName: string;
  cnpj: string;
  bank: string;
  bankBranchNumber: string;
  accountNumber: string;
};

export default function VoucherDownload({
  vouncherDownloadProps,
}: {
  vouncherDownloadProps: VouncherDownloadProps;
}) {
  const [open, setOpen] = useState(false);

  const handleDownloadPDF = () => {
    const element = document.getElementById("proof");
    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas;
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? "landscape" : "portrait",
          unit: "px",
          format: [imgWidth, imgHeight],
        });
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("comprovante.pdf");
      });
    }
  };

  return (
    <div>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <FileText className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] h-[96%] overflow-auto p-0 py-4">
          <div id="proof">
            <DialogHeader>
              <DialogTitle className="text-center mb-6 text-2xl w-full">
                Baixar Vouncher
              </DialogTitle>
            </DialogHeader>

            <div className="p-8 border-solid border-2 border-black mx-8 mb-4">
              <img
                src="/logo_sistema_outbank.png"
                alt="Banco Prisma Logo"
                className="w-72 mx-auto"
              />
              <Separator className="bg-black mb-4" />
              <div className="space-y-6 ">
                <div>
                  <h2 className="font-semibold text-xl">Prova de Liquidação</h2>
                  <p className="text-sm text-muted-foreground">
                    {FormatDateTime(vouncherDownloadProps.date)}
                  </p>
                </div>
                <Separator className="bg-black " />
                <div>
                  <h3 className="font-semibold mb-2">TRANSAÇÃO</h3>
                  <div className="grid gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor</p>
                      <p>{FormatCurrency(vouncherDownloadProps.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Descrição</p>
                      <p>{vouncherDownloadProps.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Número Único de Liquidação
                      </p>
                      <p>{vouncherDownloadProps.singleSettlementNumber}</p>
                    </div>
                  </div>
                </div>
                <Separator className="bg-black" />
                <div>
                  <h3 className="font-semibold mb-2">CONTA CREDITADA</h3>
                  <div className="grid gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Nome/Razão Social
                      </p>
                      <p>{vouncherDownloadProps.corporateName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CNPJ</p>
                      <p>{vouncherDownloadProps.cnpj}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Banco</p>
                        <p>{vouncherDownloadProps.bank}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ramal</p>
                        <p>{vouncherDownloadProps.bankBranchNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conta</p>
                        <p>{vouncherDownloadProps.accountNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mx-8">
            <Button onClick={handleDownloadPDF}>exportar</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
