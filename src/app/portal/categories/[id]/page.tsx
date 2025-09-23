import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import Categoriesform from "@/features/categories/_components/categories-form";
import { getCategoryById } from "@/features/categories/server/category";

export const revalidate = 300;

export default async function CategoryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const category = await getCategoryById(parseInt(resolvedParams.id));

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "CNAE", url: "/portal/categories" }]}
      />
      <BaseBody
        title="CNAE"
        subtitle={category?.id ? "Editar CNAE" : "Adicionar CNAE"}
      >
        <Categoriesform
          categories={{
            id: category?.id,
            name: category?.name || "",

            slug: category?.slug || "",
            active: category?.active ?? true,
            dtinsert: category?.dtinsert
              ? new Date(category.dtinsert)
              : new Date(),
            dtupdate: category?.dtupdate
              ? new Date(category.dtupdate)
              : new Date(),
            mcc: category?.mcc || "",
            cnae: category?.cnae || "",
            anticipation_risk_factor_cp:
              category?.anticipationRiskFactorCp?.toString() || "",
            anticipation_risk_factor_cnp:
              category?.anticipationRiskFactorCnp?.toString() || "",
            waiting_period_cp: category?.waitingPeriodCp?.toString() || "",
            waiting_period_cnp: category?.waitingPeriodCnp?.toString() || "",
            idSolicitationFee: category?.idSolicitationFee?.toString() || undefined,
          }}
        />
      </BaseBody>
    </>
  );
}
