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
  // Aqui, estamos determinando se a solicitação deve ser exibida em modo somente leitura (read-only) ou editável.
  // A variável isReadOnly será verdadeira apenas se o status da solicitação for "PENDING", ou seja, quando ela está em análise e não pode ser editada.
  const isReadOnly =
    pricingSolicitationById?.status === "PENDING" ||
    pricingSolicitationById?.status === "REVIEWED";

  // Em seguida, definimos o subtítulo da página de acordo com o contexto:
  // - Se existe uma solicitação (pricingSolicitationById):
  //    - Se está em modo somente leitura, mostramos "Visualizar Solicitação de Taxas"
  //    - Caso contrário, mostramos "Editar Solicitação de Taxas"
  // - Se não existe uma solicitação (novo cadastro), mostramos "Adicionar Solicitação de Taxas"
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
