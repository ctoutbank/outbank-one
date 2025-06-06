"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

import {
  PricingSolicitationSchema,
  schemaPricingSolicitation,
} from "@/features/pricingSolicitation/schema/schema";
import {
  updatePricingSolicitation,
  type PricingSolicitationForm,
} from "@/features/pricingSolicitation/server/pricing-solicitation";
import {
  SelectItem,
  SelectItemSolicitationFee,
  SolicitationFeeProductTypeList,
} from "@/lib/lookuptables/lookuptables";
import { brandList } from "@/lib/lookuptables/lookuptables-transactions";

import { DocumentUploadContent } from "@/features/pricingSolicitation/_components/document-upload-content";
import { UploadIcon } from "lucide-react";
import { PricingSolicitationReadOnlyView } from "./pricing-solicitation-readonly";
import { BusinessInfoSection } from "./sections/business-info-section";
import { DetailsSection } from "./sections/details-section";
import { FeesSection } from "./sections/fees-section";

interface PricingSolicitationFormProps {
  pricingSolicitation?: PricingSolicitationForm | null;
}

export default function PricingSolicitationForm({
  pricingSolicitation,
}: PricingSolicitationFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [solicitationId, setSolicitationId] = useState<number | null>(
    pricingSolicitation?.id || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccessful, setUploadSuccessful] = useState(false);

  const [formStatus, setFormStatus] = useState<
    "SEND_DOCUMENTS" | "PENDING" | null
  >(
    pricingSolicitation?.status === "PENDING"
      ? "PENDING"
      : pricingSolicitation?.status === "SEND_DOCUMENTS"
        ? "SEND_DOCUMENTS"
        : null
  );

  // Simplified function to just open the dialog
  function handleOpenDocumentUpload() {
    setUploadSuccessful(false);
    setOpenUploadDialog(true);
  }

  // Função para lidar com a criação de solicitação durante o upload
  const handleSolicitationCreated = (id: number) => {
    console.log(`Solicitação criada com ID: ${id}`);
    setSolicitationId(id);
    setFormStatus("SEND_DOCUMENTS");
    setUploadSuccessful(true);

    // Atualizar a URL para incluir o ID da solicitação sem navegar
    // Corrigir o caminho para usar o formato correto da aplicação
    window.history.replaceState({}, "", `/portal/pricingSolicitation/${id}`);
  };

  const form = useForm<PricingSolicitationSchema>({
    resolver: zodResolver(schemaPricingSolicitation),
    defaultValues: {
      cnae: pricingSolicitation?.cnae || "",
      mcc: pricingSolicitation?.mcc || "",
      cnpjsQuantity: pricingSolicitation?.cnpjQuantity?.toString() || "",
      ticketAverage: pricingSolicitation?.averageTicket || "",
      tpvMonthly: pricingSolicitation?.monthlyPosFee || "",
      cardPixMdr: pricingSolicitation?.cardPixMdr || "",
      cardPixCeilingFee: pricingSolicitation?.cardPixCeilingFee || "",
      cardPixMinimumCostFee: pricingSolicitation?.cardPixMinimumCostFee || "",
      nonCardPixMdr: pricingSolicitation?.nonCardPixMdr || "",
      nonCardPixCeilingFee: pricingSolicitation?.nonCardPixCeilingFee || "",
      nonCardPixMinimumCostFee:
        pricingSolicitation?.nonCardPixMinimumCostFee || "",
      eventualAnticipationFee:
        pricingSolicitation?.eventualAnticipationFee || "",
      nonCardEventualAnticipationFee:
        pricingSolicitation?.nonCardEventualAnticipationFee || "",
      brands: pricingSolicitation?.brands
        ? pricingSolicitation.brands.map((brand) => ({
            name: brand.name,
            productTypes: brand.productTypes?.map((pt) => ({
              name: pt.name,
              fee: pt.fee?.toString() || "",
              feeAdmin: pt.feeAdmin?.toString() || "",
              feeDock: pt.feeDock?.toString() || "",
              noCardFee: pt.noCardFee?.toString() || "",
              noCardTransactionAnticipationMdr:
                pt.noCardTransactionAnticipationMdr?.toString() || "",
              noCardFeeAdmin: pt.noCardFeeAdmin?.toString() || "",
              noCardFeeDock: pt.noCardFeeDock?.toString() || "",

              transactionFeeStart: pt.transactionFeeStart?.toString() || "",
              transactionFeeEnd: pt.transactionFeeEnd?.toString() || "",
              transactionAnticipationMdr:
                pt.transactionAnticipationMdr?.toString() || "",
            })),
          }))
        : brandList.map((brand: SelectItem) => ({
            name: brand.value,
            productTypes: SolicitationFeeProductTypeList.map(
              (productType: SelectItemSolicitationFee) => ({
                name: productType.value,
                fee: "",
                feeAdmin: "",
                feeDock: "",
                transactionFeeStart: productType.transactionFeeStart || "",
                transactionFeeEnd: productType.transactionFeeEnd || "",

                transactionAnticipationMdr: "",
              })
            ),
          })),
      cnaeInUse: pricingSolicitation?.cnaeInUse || false,
      description: pricingSolicitation?.description || "",
    },
  });

  // Map form data to solicitation structure
  function mapFormDataToSolicitation(data: PricingSolicitationSchema) {
    // Se não houver dados, retorna objeto vazio
    if (!data) return {};

    const mappedData: PricingSolicitationForm = {
      id: solicitationId || 0,
      cnae: data.cnae || "",
      mcc: data.mcc || "",
      cnpjQuantity: data.cnpjsQuantity ? Number(data.cnpjsQuantity) : 0,
      slug: null,
      dtinsert: new Date().toISOString(),
      dtupdate: new Date().toISOString(),
      idCustomers: null,
      monthlyPosFee: data.tpvMonthly || null,
      averageTicket: data.ticketAverage || null,
      description: data.description || null,
      cnaeInUse: data.cnaeInUse ?? null,
      cardPixMdr: data.cardPixMdr || null,
      cardPixCeilingFee: data.cardPixCeilingFee || null,
      cardPixMinimumCostFee: data.cardPixMinimumCostFee || null,
      nonCardPixMdr: data.nonCardPixMdr || null,
      nonCardPixCeilingFee: data.nonCardPixCeilingFee || null,
      nonCardPixMinimumCostFee: data.nonCardPixMinimumCostFee || null,
      compulsoryAnticipationConfig: Number(data.eventualAnticipationFee) || 0,
      eventualAnticipationFee: data.eventualAnticipationFee || null,
      nonCardEventualAnticipationFee:
        data.nonCardEventualAnticipationFee || null,
      cardPixMdrAdmin: null,
      cardPixCeilingFeeAdmin: null,
      cardPixMinimumCostFeeAdmin: null,
      nonCardPixMdrAdmin: null,
      nonCardPixCeilingFeeAdmin: null,
      nonCardPixMinimumCostFeeAdmin: null,
      compulsoryAnticipationConfigAdmin: 0,
      eventualAnticipationFeeAdmin: null,
      nonCardEventualAnticipationFeeAdmin: null,
      cardPixMdrDock: null,
      cardPixCeilingFeeDock: null,
      cardPixMinimumCostFeeDock: null,
      nonCardPixMdrDock: null,
      nonCardPixCeilingFeeDock: null,
      nonCardPixMinimumCostFeeDock: null,
      compulsoryAnticipationConfigDock: 0,
      eventualAnticipationFeeDock: null,
      nonCardEventualAnticipationFeeDock: null,
      status: "SEND_DOCUMENTS", // Definir status padrão para upload
      brands: (data.brands || []).map((brand) => ({
        name: brand.name || "",
        productTypes: (brand.productTypes || []).map((productType) => ({
          name: productType.name || "",
          fee: productType.fee || "",
          feeAdmin: productType.feeAdmin || "",
          feeDock: productType.feeDock || "",
          transactionFeeStart: productType.transactionFeeStart || "",
          transactionFeeEnd: productType.transactionFeeEnd || "",
          noCardFee: productType.noCardFee || "",
          noCardFeeAdmin: productType.noCardFeeAdmin || "",
          noCardFeeDock: productType.noCardFeeDock || "",
          noCardTransactionAnticipationMdr:
            productType.noCardTransactionAnticipationMdr || "",
          transactionAnticipationMdr:
            productType.transactionAnticipationMdr || "",
        })),
      })),
    };

    console.log("Dados do formulário mapeados para upload:", mappedData);
    return mappedData;
  }

  // Create a new solicitation

  // Update an existing solicitation
  async function updateExistingSolicitation(values: PricingSolicitationSchema) {
    const formattedData = mapFormDataToSolicitation(values);

    console.log("Dados formatados para atualização:", {
      ...formattedData,
    });

    try {
      await updatePricingSolicitation(formattedData as PricingSolicitationForm);
      return formattedData as PricingSolicitationForm;
    } catch (error) {
      console.error("Erro na função updatePricingSolicitation:", error);
      throw error;
    }
  }

  // Final submission handler
  async function onSubmit(values: PricingSolicitationSchema) {
    setIsSubmitting(true);
    try {
      if (solicitationId) {
        let newStatus = "PENDING";

        console.log("Valores antes de atualizar:", values);
        console.log("Status:", newStatus);
        console.log("ID da solicitação:", solicitationId);

        // Atualiza a solicitação existente para o novo status
        await updateExistingSolicitation(values);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      let errorMessage = "Erro desconhecido";

      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Stack:", error.stack);
      }

      toast({
        variant: "destructive",
        title: "Erro ao enviar formulário",
      });
    } finally {
      setIsSubmitting(false);
      router.push(`/portal/pricingSolicitation/${solicitationId}`);
    }
  }

  // Handle closing upload dialog
  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);

    // Se uma solicitação foi criada durante o upload e temos um ID
    if (uploadSuccessful && solicitationId) {
      // Navegar para a página correta com o ID da solicitação
      router.push(`/portal/pricingSolicitation/${solicitationId}`);
    }
  };

  if (formStatus === "PENDING") {
    return (
      <div className="space-y-8">
        <div className="bg-amber-50 p-4 rounded-md mb-6">
          <p className="text-amber-800 font-medium">
            Esta solicitação está em análise e não pode ser editada.
          </p>
        </div>
        <PricingSolicitationReadOnlyView data={form.getValues()} />
      </div>
    );
  }
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <div className="">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Business Information Section */}
                <BusinessInfoSection control={form.control} />

                {/* Details Section (conditional) */}
                {form.watch("cnaeInUse") && (
                  <DetailsSection control={form.control} />
                )}

                {/* Fees Section */}
                <FeesSection
                  control={form.control}
                  isNewSolicitation={solicitationId === null}
                  hideFeeAdmin={formStatus == "SEND_DOCUMENTS"}
                />
              </form>
            </Form>
            <div className="flex justify-end items-center gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleOpenDocumentUpload}
                className="flex items-center gap-2"
              >
                <UploadIcon className="h-4 w-4" />
                Importar
              </Button>
              <Button
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                disabled={isSubmitting || !solicitationId}
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Upload Dialog */}
      <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Importar Documentos</DialogTitle>
            <DialogDescription>
              {uploadSuccessful
                ? `Solicitação #${solicitationId} criada com sucesso. Você pode continuar adicionando documentos.`
                : "Selecione os documentos que deseja anexar à solicitação."}
            </DialogDescription>
          </DialogHeader>

          <DocumentUploadContent
            solicitationId={solicitationId}
            pricingSolicitationData={
              !solicitationId
                ? mapFormDataToSolicitation(form.getValues())
                : undefined
            }
            onSolicitationCreated={handleSolicitationCreated}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseUploadDialog}
            >
              Concluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
