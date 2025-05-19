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

import { DocumentUploadContent } from "./document-upload-content";
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
  const [formStatus, setFormStatus] = useState<
    "DRAFT" | "SEND_DOCUMENTS" | "PENDING"
  >(pricingSolicitation?.status === "PENDING" ? "PENDING" : "DRAFT");

  const form = useForm<PricingSolicitationSchema>({
    resolver: zodResolver(schemaPricingSolicitation),
    defaultValues: {
      cnae: pricingSolicitation?.cnae || "",
      mcc: pricingSolicitation?.mcc || "",
      cnpjsQuantity: pricingSolicitation?.cnpjQuantity?.toString() || "",
      ticketAverage: pricingSolicitation?.averageTicket || "",
      tpvMonthly: pricingSolicitation?.monthlyPosFee || "",
      brands: pricingSolicitation?.brands
        ? pricingSolicitation.brands.map((brand) => ({
            name: brand.name,
            productTypes: brand.productTypes?.map((pt) => ({
              name: pt.name,
              fee: pt.fee?.toString() || "",
              feeAdmin: pt.feeAdmin?.toString() || "",
              feeDock: pt.feeDock?.toString() || "",
              transactionFeeStart: pt.transactionFeeStart?.toString() || "",
              transactionFeeEnd: pt.transactionFeeEnd?.toString() || "",
              pixMinimumCostFee: pt.pixMinimumCostFee?.toString() || "",
              pixCeilingFee: pt.pixCeilingFee?.toString() || "",
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
                pixMinimumCostFee: "",
                pixCeilingFee: "",
                transactionAnticipationMdr: "",
              })
            ),
          })),
      cnaeInUse: pricingSolicitation?.cnaeInUse || false,
      description: pricingSolicitation?.description || "",
    },
  });

  // Format data for API
  function formatForAPI(data: any): PricingSolicitationForm {
    return {
      ...data,
      brands: data.brands.map((brand: any) => ({
        name: brand.name,
        productTypes: brand.productTypes.map((pt: any) => ({
          name: pt.name,
          fee: Number(pt.fee) || 0,
          feeAdmin: Number(pt.feeAdmin) || 0,
          feeDock: Number(pt.feeDock) || 0,
          transactionFeeStart: Number(pt.transactionFeeStart) || 0,
          transactionFeeEnd: Number(pt.transactionFeeEnd) || 0,
          pixMinimumCostFee: Number(pt.pixMinimumCostFee) || 0,
          pixCeilingFee: Number(pt.pixCeilingFee) || 0,
          transactionAnticipationMdr:
            Number(pt.transactionAnticipationMdr) || 0,
        })),
      })),
    } as PricingSolicitationForm;
  }

  // Map form data to solicitation structure
  function mapFormDataToSolicitation(data: PricingSolicitationSchema) {
    return {
      cnae: data.cnae || null,
      mcc: data.mcc || null,
      cnpjQuantity: data.cnpjsQuantity ? Number(data.cnpjsQuantity) : null,
      slug: null,
      dtinsert: new Date().toISOString(),
      dtupdate: new Date().toISOString(),
      idCustomers: null,
      monthlyPosFee: data.tpvMonthly || null,
      averageTicket: data.ticketAverage || null,
      description: data.description || null,
      cnaeInUse: data.cnaeInUse ?? null,
      brands: (data.brands || []).map((brand) => ({
        name: brand.name,
        productTypes: (brand.productTypes || []).map((productType) => ({
          name: productType.name,
          fee: productType.fee || "",
          feeAdmin: productType.feeAdmin || "",
          feeDock: productType.feeDock || "",
          transactionFeeStart: productType.transactionFeeStart || "",
          transactionFeeEnd: productType.transactionFeeEnd || "",
          pixMinimumCostFee: productType.pixMinimumCostFee || "",
          pixCeilingFee: productType.pixCeilingFee || "",
          transactionAnticipationMdr:
            productType.transactionAnticipationMdr || "",
        })),
      })),
    };
  }

  // Create a new solicitation
  async function createPricingSolicitation(
    values: PricingSolicitationSchema,
    status: string
  ) {
    const formattedData = formatForAPI(mapFormDataToSolicitation(values));
    const result = await insertPricingSolicitation({
      ...formattedData,
      status: status,
      id: 0,
    });

    return result;
  }

  // Update an existing solicitation
  async function updateExistingSolicitation(
    values: PricingSolicitationSchema,
    id: number,
    status: string
  ) {
    const formattedData = formatForAPI(mapFormDataToSolicitation(values));
    await updatePricingSolicitation({
      ...formattedData,
      id: id,
      status: status,
    });

    return id;
  }

  // Simplified function to just open the dialog
  function handleOpenDocumentUpload() {
    setOpenUploadDialog(true);
  }

  // Final submission handler
  async function onSubmit(values: PricingSolicitationSchema) {
    setIsSubmitting(true);
    try {
      if (solicitationId) {
        // Update existing solicitation to PENDING status
        await updateExistingSolicitation(values, solicitationId, "PENDING");
        setFormStatus("PENDING");
        router.push(`/pricing-solicitation/${solicitationId}`);
      } else {
        // Create new solicitation with PENDING status
        const result = await createPricingSolicitation(values, "PENDING");

        if (result && typeof result.id === "number") {
          setSolicitationId(result.id);
          setFormStatus("PENDING");
          router.push(`/pricing-solicitation/${result.id}`);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle closing upload dialog
  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
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
                />
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
              Selecione os documentos que deseja anexar à solicitação.
            </DialogDescription>
          </DialogHeader>

          <DocumentUploadContent solicitationId={solicitationId} />

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
