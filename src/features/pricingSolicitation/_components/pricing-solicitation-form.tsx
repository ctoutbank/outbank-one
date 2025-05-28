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

import {
  PricingSolicitationSchema,
  schemaPricingSolicitation,
} from "@/features/pricingSolicitation/schema/schema";
import {
  insertPricingSolicitation,
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
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [solicitationId, setSolicitationId] = useState<number | null>(
    pricingSolicitation?.id || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccessful, setUploadSuccessful] = useState(false);

  const [formStatus, setFormStatus] = useState<
    "DRAFT" | "SEND_DOCUMENTS" | "PENDING" | "SEND_SOLICITATION"
  >(
    pricingSolicitation?.status === "PENDING"
      ? "PENDING"
      : pricingSolicitation?.status === "SEND_SOLICITATION"
        ? "SEND_SOLICITATION"
        : "DRAFT"
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
    setFormStatus("SEND_SOLICITATION");
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

  function formatDataSolicitation(data: any): PricingSolicitationForm {
    console.log("Dados antes da formatação:", data);

    const formattedData = {
      ...data,
      cnae: data.cnae || null,
      mcc: data.mcc || null,
      cnpjQuantity: data.cnpjQuantity ? Number(data.cnpjQuantity) : null,
      monthlyPosFee: data.monthlyPosFee || null,
      averageTicket: data.averageTicket || null,
      description: data.description || null,
      cnaeInUse: data.cnaeInUse ?? null,
      slug: data.slug || null,
      dtinsert: data.dtinsert || new Date().toISOString(),
      dtupdate: new Date().toISOString(),
      idCustomers: data.idCustomers || null,
      cardPixMdr: Number(data.cardPixMdr) || 0,
      cardPixCeilingFee: Number(data.cardPixCeilingFee) || 0,
      cardPixMinimumCostFee: Number(data.cardPixMinimumCostFee) || 0,
      nonCardPixMdr: Number(data.nonCardPixMdr) || 0,
      nonCardPixCeilingFee: Number(data.nonCardPixCeilingFee) || 0,
      nonCardPixMinimumCostFee: Number(data.nonCardPixMinimumCostFee) || 0,
      eventualAnticipationFee: Number(data.eventualAnticipationFee) || 0,
      nonCardEventualAnticipationFee:
        Number(data.nonCardEventualAnticipationFee) || 0,
      status: data.status || "PENDING",
      brands: (data.brands || []).map((brand: any) => ({
        name: brand.name,
        productTypes: (brand.productTypes || []).map((pt: any) => {
          console.log(
            `Formatando ${brand.name} - ${pt.name}: fee=${pt.fee}, noCardFee=${pt.noCardFee}`
          );

          return {
            name: pt.name,
            fee: Number(pt.fee) || 0,
            feeAdmin: Number(pt.feeAdmin) || 0,
            feeDock: Number(pt.feeDock) || 0,
            noCardFee: Number(pt.noCardFee) || 0,
            noCardFeeAdmin: Number(pt.noCardFeeAdmin) || 0,
            noCardFeeDock: Number(pt.noCardFeeDock) || 0,
            noCardTransactionAnticipationMdr:
              Number(pt.noCardTransactionAnticipationMdr) || 0,
            transactionFeeStart: Number(pt.transactionFeeStart) || 0,
            transactionFeeEnd: Number(pt.transactionFeeEnd) || 0,
            pixMinimumCostFee: Number(pt.pixMinimumCostFee) || 0,
            pixCeilingFee: Number(pt.pixCeilingFee) || 0,
            transactionAnticipationMdr:
              Number(pt.transactionAnticipationMdr) || 0,
          };
        }),
      })),
    } as PricingSolicitationForm;

    console.log("Dados após formatação:", formattedData);
    return formattedData;
  }

  // Map form data to solicitation structure
  function mapFormDataToSolicitation(data: PricingSolicitationSchema) {
    // Se não houver dados, retorna objeto vazio
    if (!data) return {};

    const mappedData: PricingSolicitationForm = {
      id: 0,
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
      compulsoryAnticipationConfig:
        Number(data.eventualAnticipationFee) || null,
      eventualAnticipationFee: data.eventualAnticipationFee || null,
      nonCardEventualAnticipationFee:
        data.nonCardEventualAnticipationFee || null,
      cardPixMdrAdmin: "0",
      cardPixCeilingFeeAdmin: "0",
      cardPixMinimumCostFeeAdmin: "0",
      nonCardPixMdrAdmin: "0",
      nonCardPixCeilingFeeAdmin: "0",
      nonCardPixMinimumCostFeeAdmin: "0",
      compulsoryAnticipationConfigAdmin: 0,
      eventualAnticipationFeeAdmin: "0",
      nonCardEventualAnticipationFeeAdmin: "0",
      cardPixMdrDock: "0",
      cardPixCeilingFeeDock: "0",
      cardPixMinimumCostFeeDock: "0",
      nonCardPixMdrDock: "0",
      nonCardPixCeilingFeeDock: "0",
      nonCardPixMinimumCostFeeDock: "0",
      compulsoryAnticipationConfigDock: 0,
      eventualAnticipationFeeDock: "0",
      nonCardEventualAnticipationFeeDock: "0",
      status: "SEND_SOLICITATION", // Definir status padrão para upload
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
  async function createPricingSolicitation(
    values: PricingSolicitationSchema,
    status: string
  ) {
    const formattedData = formatDataSolicitation(
      mapFormDataToSolicitation(values)
    );
    const result = await insertPricingSolicitation({
      ...formattedData,
      status: status,
    });

    return result;
  }

  // Update an existing solicitation
  async function updateExistingSolicitation(
    values: PricingSolicitationSchema,
    id: number,
    status: string
  ) {
    const formattedData = formatDataSolicitation(
      mapFormDataToSolicitation(values)
    );
    console.log("Dados formatados para atualização:", {
      ...formattedData,
      id,
      status,
    });

    try {
      await updatePricingSolicitation({
        ...formattedData,
        id: id,
        status: status,
      });
      return id;
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

        // Se o status for SEND_SOLICITATION e existir solicitation_fee.id,
        // atualiza todas as tabelas e muda o status para PENDING
        if (formStatus === "SEND_SOLICITATION" && solicitationId) {
          newStatus = "PENDING";
        }

        console.log("Valores antes de atualizar:", values);
        console.log("Status:", newStatus);
        console.log("ID da solicitação:", solicitationId);

        // Atualiza a solicitação existente para o novo status
        await updateExistingSolicitation(values, solicitationId, newStatus);
        setFormStatus(newStatus as any);
        router.push(`/portal/pricingSolicitation/${solicitationId}`);
      } else {
        // Create new solicitation with PENDING status
        const result = await createPricingSolicitation(values, "PENDING");

        if (result && typeof result.id === "number") {
          setSolicitationId(result.id);
          setFormStatus("PENDING");
          router.push(`/portal/pricingSolicitation/${result.id}`);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      let errorMessage = "Erro desconhecido";

      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Stack:", error.stack);
      }

      alert(`Erro ao enviar formulário: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
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

  // If form is in PENDING status, show read-only view
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

  return (
    <div>
      <div className="">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
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
                  hideFeeAdmin={formStatus === "SEND_SOLICITATION"}
                />

                <div className="flex justify-end items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOpenDocumentUpload}
                    className="flex items-center gap-2"
                  >
                    <UploadIcon className="h-4 w-4" />
                    Importar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar"}
                  </Button>
                </div>
              </form>
            </Form>
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
            formData={
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
