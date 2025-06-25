import { getSalesAgentById } from "@/features/salesAgents/server/salesAgent";
import SalesAgentsForm from "../../../../features/salesAgents/_components/salesAgents-form";

import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import {
  getDDCustomers,
  getDDMerchants,
  getDDProfiles,
} from "@/features/salesAgents/server/salesAgent";

export const revalidate = 0;

export default async function SalesAgentsDetail({
  params,
}: {
  params: { id: string };
}) {
  const agent = await getSalesAgentById(parseInt(params.id));
  const merchantsList = await getDDMerchants(agent?.idCustomer || 0);
  const profilesList = await getDDProfiles();
  const customersList = await getDDCustomers();
  

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
            birthDate: agent?.birthDate ? new Date(agent.birthDate) : undefined,
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
