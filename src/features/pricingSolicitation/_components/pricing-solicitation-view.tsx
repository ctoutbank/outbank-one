"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  approveAction,
  rejectAction,
  updateToSendDocumentsAction,
} from "@/features/pricingSolicitation/actions/pricing-solicitation-actions";
import type {
  PricingSolicitationForm,
  ProductType,
} from "@/features/pricingSolicitation/server/pricing-solicitation";
import { SolicitationFeeProductTypeList } from "@/lib/lookuptables/lookuptables";
import { brandList } from "@/lib/lookuptables/lookuptables-transactions";
import { DownloadIcon, FileIcon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const getCardImage = (cardName: string): string => {
  const cardMap: { [key: string]: string } = {
    MASTERCARD: "/mastercard.svg",
    VISA: "/visa.svg",
    ELO: "/elo.svg",
    AMERICAN_EXPRESS: "/american-express.svg",
    HIPERCARD: "/hipercard.svg",
    AMEX: "/american-express.svg",
    CABAL: "/cabal.svg",
  };
  return cardMap[cardName] || "";
};

export function PricingSolicitationView({
  pricingSolicitation,
}: {
  pricingSolicitation: PricingSolicitationForm;
}) {
  // Adicionar um form vazio para fornecer o contexto necessário
  const form = useForm();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [documentDownloaded, setDocumentDownloaded] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!pricingSolicitation) {
    return <div>Nenhuma solicitação encontrada</div>;
  }

  // Log para debug
  console.log(
    "PricingSolicitation data:",
    JSON.stringify(pricingSolicitation, null, 2)
  );

  // Map brands from solicitation to display format
  const brandsMap = new Map();
  pricingSolicitation.brands?.forEach((brand) => {
    brandsMap.set(brand.name, brand);
  });

  // Organize fees by brand and product type
  const feesData = brandList.map((brandItem) => {
    const brand = brandsMap.get(brandItem.value) || {
      name: brandItem.value,
      productTypes: [],
    };

    const productTypeMap = new Map();
    brand.productTypes?.forEach((pt: ProductType) => {
      productTypeMap.set(pt.name, pt);
    });

    return {
      brand: brandItem,
      productTypes: SolicitationFeeProductTypeList.map((ptItem) => {
        return (
          productTypeMap.get(ptItem.value) || {
            name: ptItem.value,
            fee: "-",
          }
        );
      }),
    };
  });

  // Correção para acessar os campos corretamente
  // Obtém os valores dos campos da API, que podem vir com diferentes formatos de nome
  const data = pricingSolicitation as any;
  const cnpjQuantity = data.cnpj_quantity || pricingSolicitation.cnpjQuantity;
  const averageTicket =
    data.average_ticket || pricingSolicitation.averageTicket;
  const monthlyPosFee =
    data.monthly_pos_fee || pricingSolicitation.monthlyPosFee;
  const cnaeInUse = data.cnae_in_use || pricingSolicitation.cnaeInUse;

  // Obter os campos de PIX considerando os diferentes formatos
  const cardPixMdr = data.card_pix_mdr || pricingSolicitation.cardPixMdr;
  const cardPixCeilingFee =
    data.card_pix_ceiling_fee || pricingSolicitation.cardPixCeilingFee;
  const cardPixMinimumCostFee =
    data.card_pix_minimum_cost_fee || pricingSolicitation.cardPixMinimumCostFee;
  const eventualAnticipationFee =
    data.eventualAnticipationFee || data.eventual_anticipation_fee;

  // PIX sem cartão
  const nonCardPixMdr =
    data.non_card_pix_mdr || pricingSolicitation.nonCardPixMdr;
  const nonCardPixCeilingFee =
    data.non_card_pix_ceiling_fee || pricingSolicitation.nonCardPixCeilingFee;
  const nonCardPixMinimumCostFee =
    data.non_card_pix_minimum_cost_fee ||
    pricingSolicitation.nonCardPixMinimumCostFee;
  const nonCardEventualAnticipationFee =
    data.nonCardEventualAnticipationFee ||
    data.non_card_eventual_anticipation_fee;

  // Função para download do aditivo
  const downloadAditivo = () => {
    window.open("/AditivoAcquiring.pdf");
    setDocumentDownloaded(true);
  };

  // Função para abrir o diálogo de upload
  const handleOpenUploadDialog = () => {
    setShowUploadDialog(true);
  };

  // Função para processar o upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // Função para enviar o arquivo e atualizar o status
  const handleUploadSubmit = async () => {
    if (!uploadedFile || !pricingSolicitation.id) return;

    setIsSubmitting(true);
    try {
      // Simular upload do arquivo - em uma implementação real, você enviaria para o servidor
      // const formData = new FormData();
      // formData.append('file', uploadedFile);
      // formData.append('solicitationId', pricingSolicitation.id.toString());
      // await fetch('/api/upload', { method: 'POST', body: formData });

      // Atualizar status para SEND_DOCUMENTS
      const result = await updateToSendDocumentsAction(pricingSolicitation.id);

      if (result.success) {
        setShowUploadDialog(false);
        alert(
          "Aditivo enviado com sucesso! Status atualizado para 'Aguardando documentos'."
        );
        router.refresh();
      } else {
        alert("Erro ao atualizar status: " + result.error);
      }
    } catch (error) {
      console.error("Erro ao enviar aditivo:", error);
      alert("Erro ao processar o envio do aditivo");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para aprovar solicitação
  const handleApprove = async () => {
    if (!pricingSolicitation.id) return;

    setIsSubmitting(true);
    try {
      const result = await approveAction(pricingSolicitation.id);
      if (result.success) {
        alert("Solicitação aprovada com sucesso!");
        router.refresh();
      } else {
        alert("Erro ao aprovar: " + result.error);
      }
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      alert("Erro ao processar a aprovação");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para abrir o diálogo de rejeição
  const handleOpenRejectDialog = () => {
    setShowRejectDialog(true);
  };

  // Função para rejeitar solicitação
  const handleReject = async () => {
    if (!pricingSolicitation.id) return;

    setIsSubmitting(true);
    try {
      const result = await rejectAction(pricingSolicitation.id, rejectReason);
      if (result.success) {
        setShowRejectDialog(false);
        alert("Solicitação rejeitada com sucesso!");
        router.refresh();
      } else {
        alert("Erro ao rejeitar: " + result.error);
      }
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
      alert("Erro ao processar a rejeição");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="space-y-2">
              <FormLabel>CNAE</FormLabel>
              <div className="p-2 border rounded-md bg-gray-50">
                {pricingSolicitation.cnae || "-"}
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <FormLabel>MCC</FormLabel>
              <div className="p-2 border rounded-md bg-gray-50">
                {pricingSolicitation.mcc || "-"}
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <FormLabel>Quantidade de CNPJs</FormLabel>
              <div className="p-2 border rounded-md bg-gray-50">
                {cnpjQuantity || "-"}
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <FormLabel>Ticket Médio</FormLabel>
              <div className="p-2 border rounded-md bg-gray-50">
                {averageTicket || "-"}
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <FormLabel>TPV Mensal</FormLabel>
              <div className="p-2 border rounded-md bg-gray-50">
                {monthlyPosFee || "-"}
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
              <div className="h-4 w-4 rounded border flex items-center justify-center">
                {cnaeInUse && <span className="h-2 w-2 bg-black rounded-sm" />}
              </div>
              <div className="space-y-1 leading-none">
                <FormLabel>CNAE em uso?</FormLabel>
              </div>
            </div>
          </div>
        </div>

        {cnaeInUse && pricingSolicitation.description && (
          <div className="mb-6">
            <div className="space-y-2">
              <FormLabel>Descrição</FormLabel>
              <div className="p-2 border rounded-md bg-gray-50 min-h-[100px]">
                {pricingSolicitation.description}
              </div>
            </div>
          </div>
        )}

        {/* Brand Table */}
        <div className="w-full overflow-x-auto">
          <h3 className="text-lg font-medium mt-8">Taxas Transações Pos</h3>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 bg-white">
                  Bandeiras
                </TableHead>
                {SolicitationFeeProductTypeList.map((type, index) => (
                  <TableHead
                    key={`${type.value}-${index}`}
                    className="text-center min-w-[100px]"
                  >
                    {type.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {feesData.map((item) => (
                <TableRow key={item.brand.value}>
                  <TableCell className="font-medium sticky left-0 z-10 bg-white">
                    <div className="flex items-center gap-2">
                      {getCardImage(item.brand.value) && (
                        <img
                          src={getCardImage(item.brand.value)}
                          alt={item.brand.label}
                          width={40}
                          height={24}
                          className="object-contain"
                        />
                      )}
                      {item.brand.label}
                    </div>
                  </TableCell>
                  {item.productTypes.map((productType, typeIndex) => (
                    <TableCell
                      key={`${item.brand.value}-${productType.name}-${typeIndex}`}
                      className="p-1 text-center"
                    >
                      <div
                        className={`rounded-full py-1 px-3 inline-block w-[70px] text-center ${
                          typeIndex % 2 === 0 ? "bg-blue-100" : "bg-amber-100"
                        }`}
                      >
                        {productType.fee || "-"}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* PIX Fees Section - if available */}
          <div className="mt-12 mb-6">
            <h3 className="text-lg font-medium mb-4">Taxas PIX</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h4 className="font-medium mb-2">MDR</h4>
                <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                  {cardPixMdr || "-"}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Custo Mínimo</h4>
                <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                  {cardPixMinimumCostFee ? `R$ ${cardPixMinimumCostFee}` : "-"}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Custo Máximo</h4>
                <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                  {cardPixCeilingFee ? `R$ ${cardPixCeilingFee}` : "-"}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Antecipação</h4>
                <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                  {eventualAnticipationFee
                    ? `${eventualAnticipationFee}%`
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Online Transactions Table */}
          <div className="mt-12 mb-6">
            <h3 className="text-lg font-medium mb-4">
              Taxas Transações Online
            </h3>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 z-10 bg-white">
                    Bandeiras
                  </TableHead>
                  {SolicitationFeeProductTypeList.map((type, index) => (
                    <TableHead
                      key={`${type.value}-online-${index}`}
                      className="text-center min-w-[100px]"
                    >
                      {type.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {feesData.map((item) => (
                  <TableRow key={`online-${item.brand.value}`}>
                    <TableCell className="font-medium sticky left-0 z-10 bg-white">
                      <div className="flex items-center gap-2">
                        {getCardImage(item.brand.value) && (
                          <img
                            src={getCardImage(item.brand.value)}
                            alt={item.brand.label}
                            width={40}
                            height={24}
                            className="object-contain"
                          />
                        )}
                        {item.brand.label}
                      </div>
                    </TableCell>
                    {item.productTypes.map((productType, typeIndex) => (
                      <TableCell
                        key={`${item.brand.value}-${productType.name}-online-${typeIndex}`}
                        className="p-1 text-center"
                      >
                        <div
                          className={`rounded-full py-1 px-3 inline-block w-[70px] text-center ${
                            typeIndex % 2 === 0 ? "bg-blue-100" : "bg-amber-100"
                          }`}
                        >
                          {productType.noCardFee || "-"}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Non-Card PIX Fees Section */}
          <div className="mt-12 mb-6">
            <h3 className="text-lg font-medium mb-4">Taxas PIX </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h4 className="font-medium mb-2">MDR</h4>
                <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                  {nonCardPixMdr || "-"}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Custo Mínimo</h4>
                <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                  {nonCardPixMinimumCostFee
                    ? `R$ ${nonCardPixMinimumCostFee}`
                    : "-"}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Custo Máximo</h4>
                <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                  {nonCardPixCeilingFee ? `R$ ${nonCardPixCeilingFee}` : "-"}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Antecipação</h4>
                <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                  {nonCardEventualAnticipationFee
                    ? `${nonCardEventualAnticipationFee}%`
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-8">
          <div className="p-4 rounded-md bg-amber-50">
            <p className="text-amber-800 font-medium">
              Status:{" "}
              {pricingSolicitation.status === "PENDING"
                ? "Em análise"
                : pricingSolicitation.status === "SEND_DOCUMENTS" ||
                    pricingSolicitation.status === "REVIEWED"
                  ? "Aguardando documentos"
                  : pricingSolicitation.status === "APPROVED"
                    ? "Aprovado"
                    : pricingSolicitation.status === "CANCELED"
                      ? "Rejeitado"
                      : pricingSolicitation.status}
            </p>
            <p className="text-amber-700 text-sm mt-1">
              {pricingSolicitation.status === "PENDING"
                ? "Esta solicitação está em análise."
                : pricingSolicitation.status === "REVIEWED"
                  ? "Faça o download do aditivo, assine-o e envie-o para prosseguir."
                  : pricingSolicitation.status === "SEND_DOCUMENTS"
                    ? "Aditivo recebido. A solicitação pode ser aprovada."
                    : ""}
            </p>
          </div>
        </div>

        {/* Botões de ação conforme o status */}
        {pricingSolicitation.id && (
          <div className="flex justify-end gap-4 mt-6">
            {/* Botão de Recusar - disponível para PENDING e SEND_DOCUMENTS */}
            {(pricingSolicitation.status === "REVIEWED" ||
              pricingSolicitation.status === "SEND_DOCUMENTS") && (
              <Button
                variant="outline"
                onClick={handleOpenRejectDialog}
                disabled={isSubmitting}
                className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
              >
                Recusar
              </Button>
            )}

            {/* Quando REVIEWED, mostrar botão de download e envio de aditivo */}
            {pricingSolicitation.status === "REVIEWED" && (
              <>
                <Button
                  variant="link"
                  onClick={downloadAditivo}
                  type="button"
                  className="flex items-center p-0 h-auto text-gray-700 hover:text-gray-900"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download Aditivo
                </Button>
                <Button
                  onClick={handleOpenUploadDialog}
                  disabled={!documentDownloaded || isSubmitting}
                  className="flex items-center gap-2"
                >
                  <UploadIcon className="w-4 h-4" />
                  {isSubmitting ? "Enviando..." : "Enviar Aditivo Assinado"}
                </Button>
              </>
            )}

            {/* Quando SEND_DOCUMENTS, mostrar botão de aceitar */}
            {pricingSolicitation.status === "SEND_DOCUMENTS" && (
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Processando..." : "Aceitar"}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal de Upload de Aditivo */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Aditivo Assinado</DialogTitle>
            <DialogDescription>
              Faça o upload do aditivo devidamente assinado para prosseguir com
              a solicitação.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="aditivo">Aditivo Assinado</Label>
              <Input
                id="aditivo"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
            </div>
            {uploadedFile && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <FileIcon className="h-5 w-5 text-blue-500" />
                <span className="text-sm">{uploadedFile.name}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUploadSubmit}
              disabled={!uploadedFile || isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Aditivo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Rejeição */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Rejeição</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição desta solicitação de taxas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Informe o motivo da rejeição"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleReject}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Processando..." : "Rejeitar Solicitação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
