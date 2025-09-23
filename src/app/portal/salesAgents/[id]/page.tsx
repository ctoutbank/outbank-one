import { getSalesAgentById } from "@/features/salesAgents/server/salesAgent";
import SalesAgentsForm from "../../../../features/salesAgents/_components/salesAgents-form";

import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { SalesAgentsNotFoundToast } from "@/features/salesAgents/_components/salesAgents-not-found-toast";
import {
  getDDCustomers,
  getDDMerchants,
  getDDProfiles,
} from "@/features/salesAgents/server/salesAgent";

export const revalidate = 300;

export default async function SalesAgentsDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  // Validar se o ID é um número válido (permitindo 0 para criação)
  const id = parseInt(resolvedParams.id);
  if (isNaN(id) || id < 0) {
    return <SalesAgentsNotFoundToast />;
  }

  const agent = await getSalesAgentById(id);
  const merchantsList = await getDDMerchants(agent?.idCustomer || 0);
  const profilesList = await getDDProfiles();
  const customersList = await getDDCustomers();

  if (!agent) {
    return <SalesAgentsNotFoundToast />;
  }

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Consultores", url: "/portal/salesAgents" }]}
      />
      <BaseBody
        title="Consultor"
        subtitle={agent?.id ? "Editar Consultor" : "Adicionar Consultor"}
      >
        <SalesAgentsForm
          salesAgent={{
            id: agent?.id,
            firstName: agent?.firstName || "",
            lastName: agent?.lastName || "",
            email: agent?.email || "",
            cpf: agent?.cpf || "",
            phone: agent?.phone || "",
            birthDate: agent?.birthDate
              ? new Date(agent.birthDate)
              : new Date(),
            idProfile: agent?.idProfile?.toString() || undefined,
            idCustomer: agent?.idCustomer?.toString() || undefined,
            active: agent?.active ?? true,
            address: {
              zipCode: agent?.zipCode || "",
              streetAddress: agent?.streetAddress || "",
              streetNumber: agent?.streetNumber || "",
              complement: agent?.complement || "",
              neighborhood: agent?.neighborhood || "",
              city: agent?.city || "",
              state: agent?.state || "",
              country: agent?.country || "Brasil",
            },
            selectedMerchants: agent?.selectedMerchants || [],
          }}
          profiles={profilesList}
          customers={customersList}
          merchantsList={merchantsList}
        />
      </BaseBody>
    </>
  );
}
