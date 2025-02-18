"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatCurrencyWithoutSymbol,
  formatDateMonthPT,
  toUpperCaseFirst
} from "@/lib/utils";
import html2canvas from "html2canvas";
import { FileText } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";

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

  const handleDownloadPDF = async () => {
    const element = document.getElementById("proof");
    if (element) {
      try {
        // Renderiza o HTML em um canvas
        const canvas = await html2canvas(element, { backgroundColor: null });

        // Converte o canvas para uma imagem PNG
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Cria um novo documento PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([imgWidth, imgHeight]);

        // Adiciona a imagem ao PDF
        const pngImage = await pdfDoc.embedPng(imgData);
        page.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: imgWidth,
          height: imgHeight,
        });

        // Salva o PDF como um Blob
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });

        // Gera um link para download do PDF
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "comprovante.pdf";
        link.click();
      } catch (error) {
        console.error("Erro ao gerar o PDF:", error);
      }
    }
  };

  return (
    <div>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <FileText className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 border-0 overflow-auto max-h-[90%]">
          <div id="proof">
            <div className="bg-black text-white py-4">
              <DialogHeader>
                <DialogTitle className="text-center text-sm font-semibold">
                  BAIXAR VOUNCHER
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="p-6">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold mb-4">BANCO PRISMA</h1>
                <div className="border-b border-dashed border-black" />
              </div>

              <div>
                <div>
                  <h2 className="font-bold text-lg">Prova de Liquidação</h2>
                  <p className="text-sm text-gray-600">
                    {formatDateMonthPT(vouncherDownloadProps.date)}
                  </p>
                  <div className="border-b border-dashed border-black mt-4" />
                </div>

                <div>
                  <h3 className="font-bold text-lg mb- mt-4">Transação</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-bold text-center">Valor</p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-sm"> R$ </p>
                        <p className="text-4xl font-bold text-center">
                          {formatCurrencyWithoutSymbol(
                            vouncherDownloadProps.value
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Descrição</p>
                      <p className="font-medium">
                        {toUpperCaseFirst(vouncherDownloadProps.description)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Número único de liquidação
                      </p>
                      <p className="font-semibold">
                        {vouncherDownloadProps.singleSettlementNumber}
                      </p>
                    </div>
                  </div>
                  <div className="border-b border-dashed border-black mt-4" />
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4 mt-4">
                    Conta Creditada
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Nome</p>
                      <p className="font-medium">
                        {toUpperCaseFirst(vouncherDownloadProps.corporateName)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">CNPJ</p>
                      <p className="font-medium">
                        {vouncherDownloadProps.cnpj}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Banco</p>
                        <p className="font-medium">
                          {vouncherDownloadProps.bank}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Ramal</p>
                        <p className="font-medium">
                          {vouncherDownloadProps.bankBranchNumber}
                        </p>
                      </div>
                    </div>
                    <div className="pb-4">
                      <p className="text-sm text-gray-600 mb-2">Conta</p>
                      <p className="font-medium">
                        {vouncherDownloadProps.accountNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-4 bg-white border-t">
            <Button onClick={handleDownloadPDF} variant="default">
              Exportar PDF
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
