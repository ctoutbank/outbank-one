import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import FinancialAdjustmentForm from "@/features/financialAdjustmet/_components/financial-adjustment-form";
import { FinancialAdjustmentSchema } from "@/features/financialAdjustmet/schema/schema";
import {
  getAllMerchants,
  getFinancialAdjustmentById,
  getMerchantsForFinancialAdjustment,
} from "@/features/financialAdjustmet/server/financialAdjustments";
import { notFound } from "next/navigation";

export const revalidate = 0;

interface FinancialAdjustmentDetailPageProps {
  params: {
    id: string;
  };
}

export default async function FinancialAdjustmentDetailPage({
  params,
}: FinancialAdjustmentDetailPageProps) {
  const id = parseInt(params.id);
  const isNew = id === 0;

  let adjustment: FinancialAdjustmentSchema = {
    title: "",
    reason: "",
    grossValue: "",
    type: "",
    active: true,
    merchants: [],
  };

  if (!isNew) {
    const adjustmentData = await getFinancialAdjustmentById(id);
    if (!adjustmentData) {
      notFound();
    }

    // Buscar merchants associados ao ajuste financeiro
    const associatedMerchants = await getMerchantsForFinancialAdjustment(id);

    adjustment = {
      id: adjustmentData.id,
      externalId: adjustmentData.externalId || undefined,
      slug: adjustmentData.slug || undefined,
      active: adjustmentData.active || true,
      expectedSettlementDate: adjustmentData.expectedSettlementDate
        ? adjustmentData.expectedSettlementDate.toISOString()
        : undefined,
      reason: adjustmentData.reason || "",
      title: adjustmentData.title || "",
      description: adjustmentData.description || undefined,
      rrn: adjustmentData.rrn || undefined,
      grossValue: adjustmentData.grossValue || "",
      recurrence: adjustmentData.recurrence || undefined,
      type: adjustmentData.type || "",
      startDate: adjustmentData.startDate
        ? adjustmentData.startDate.toISOString()
        : undefined,
      endDate: adjustmentData.endDate || undefined,
      merchants: associatedMerchants.map((merchant) => merchant.id) || [],
    };
  }

  // Buscar todos os merchants disponíveis
  const allMerchants = await getAllMerchants();

  const breadcrumbItems = [
    { title: "Ajustes Financeiros", url: "/portal/financialAdjustment" },
    {
      title: isNew ? "Novo Ajuste" : adjustment.title || "Ajuste",
      url: `/portal/financialAdjustment/${id}`,
    },
  ];

  return (
    <>
      <BaseHeader breadcrumbItems={breadcrumbItems} />

      <BaseBody
        title={isNew ? "Novo Ajuste Financeiro" : "Editar Ajuste Financeiro"}
        subtitle={
          isNew
            ? "Criar um novo ajuste financeiro"
            : `Editando: ${adjustment.title}`
        }
      >
        <FinancialAdjustmentForm
          adjustment={adjustment}
          merchants={allMerchants}
          isNew={isNew}
        />
      </BaseBody>
    </>
  );
}
