import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PricingSolicitationForm from "@/features/pricingSolicitation/_components/pricing-solicitation-form";
import { PricingSolicitationView } from "@/features/pricingSolicitation/_components/pricing-solicitation-view";
import { getPricingSolicitationById } from "@/features/pricingSolicitation/server/pricing-solicitation";

export const revalidate = 0;

export default async function PricingSolicitationDetail({
  params,
}: {
  params: { id: string };
}) {
  const pricingSolicitationById = await getPricingSolicitationById(
    parseInt(params.id)
  );

  // Determine if we should show the form or read-only view
  const isReadOnly = pricingSolicitationById?.status === "PENDING";
  const pageSubtitle = pricingSolicitationById
    ? isReadOnly
      ? "Visualizar Solicitação de Taxas"
      : "Editar Solicitação de Taxas"
    : "Adicionar Solicitação de Taxas";

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Solicitação de Taxas", url: "/portal/pricingSolicitation" },
        ]}
      />
      <BaseBody title="Solicitação de Taxas" subtitle={pageSubtitle}>
        {isReadOnly && pricingSolicitationById ? (
          <PricingSolicitationView
            pricingSolicitation={pricingSolicitationById}
          />
        ) : (
          <PricingSolicitationForm
            pricingSolicitation={pricingSolicitationById}
          />
        )}
      </BaseBody>
    </>
  );
}
