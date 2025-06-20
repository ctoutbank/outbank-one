import { getUserEmail } from "@/app/utils/send-email-adtivo";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PricingSolicitationForm from "@/features/pricingSolicitation/_components/pricing-solicitation-form";
import { PricingSolicitationView } from "@/features/pricingSolicitation/_components/pricing-solicitation-view";
import { getPricingSolicitationById } from "@/features/pricingSolicitation/server/pricing-solicitation";
import { PricingSolicitationStatus } from "@/lib/lookuptables/lookuptables";

export const revalidate = 0;

export default async function PricingSolicitationDetail({
  params,
}: {
  params: { id: string };
}) {
  const pricingSolicitationById = await getPricingSolicitationById(
    parseInt(params.id)
  );
  console.log(pricingSolicitationById);
  // Determine if we should show the form or read-only view
  // Aqui, estamos determinando se a solicitação deve ser exibida em modo somente leitura (read-only) ou editável.
  // A variável isReadOnly será verdadeira apenas se o status da solicitação for "PENDING", ou seja, quando ela está em análise e não pode ser editada.
  const isReadOnly =
    pricingSolicitationById?.status === "PENDING" ||
    pricingSolicitationById?.status === "REVIEWED" ||
    pricingSolicitationById?.status === "APPROVED" ||
    pricingSolicitationById?.status === "COMPLETED";

  const userEmail = await getUserEmail();

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
      <div className="relative ">
        <BaseBody title="Solicitação de Taxas" subtitle={pageSubtitle}>
          {isReadOnly && pricingSolicitationById ? (
            <div>
              <div className="absolute top-10 right-10">
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="default"
                      className={`${
                        PricingSolicitationStatus.find(
                          (status) =>
                            status.value === pricingSolicitationById.status
                        )?.color
                      } text-sm`}
                    >
                      {
                        PricingSolicitationStatus.find(
                          (status) =>
                            status.value === pricingSolicitationById.status
                        )?.label
                      }
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {pricingSolicitationById.status == "PENDING"
                        ? "Solicitação em análise"
                        : pricingSolicitationById.status == "REVIEWED"
                          ? "Solicitação revisada pelo Outbank, aprove ou rejeite abaixo"
                          : pricingSolicitationById.status == "APPROVED"
                            ? "Solicitação aprovada"
                            : pricingSolicitationById.status == "COMPLETED"
                              ? "Solicitação concluída"
                              : ""}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <PricingSolicitationView
                pricingSolicitation={pricingSolicitationById}
                userEmail={userEmail}
              />
            </div>
          ) : (
            <PricingSolicitationForm
              pricingSolicitation={pricingSolicitationById}
            />
          )}
        </BaseBody>
      </div>
    </>
  );
}
