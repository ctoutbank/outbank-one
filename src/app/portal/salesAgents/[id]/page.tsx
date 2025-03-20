import { getSalesAgentById } from "@/features/salesAgents/server/salesAgent";
import SalesAgentsForm from "../../../../features/salesAgents/_components/salesAgents-form";

import BaseHeader from "@/components/layout/base-header";
import BaseBody from "@/components/layout/base-body";


export const revalidate = 0;

export default async function SalesAgentsDetail({
    params,
}: { params: { id: string } }) {
    const agent = await getSalesAgentById(parseInt(params.id));
    
    console.log("Dados do agente carregados:", JSON.stringify(agent, null, 2));
    
    return (
        <>
         <BaseHeader
        breadcrumbItems={[{ title: "Consultores", url: "/portal/salesAgents" }]}
        />
         <BaseBody
                title="Consultor"
                subtitle={agent?.id ? "Editar Consultor" : "Adicionar Consultor"}     >
           
           
            
            <SalesAgentsForm salesAgent={{
                id: agent?.id,
                firstName: agent?.firstName || "",
                lastName: agent?.lastName || "",
                email: agent?.email || "",
                active: agent?.active ?? true,
                dtinsert: agent?.dtinsert
                    ? new Date(agent.dtinsert)
                    : new Date(),
                dtupdate: agent?.dtupdate
                    ? new Date(agent.dtupdate)
                    : new Date(),
                documentId: agent?.documentId || "",
                slugCustomer: agent?.slugCustomer || "",
                idAddress: agent?.idAddress || undefined,
                cpf: agent?.cpf || "",
                phone: agent?.phone || "",
                birthDate: agent?.birthDate ? new Date(agent.birthDate) : undefined,
            }} />
      

      
       </BaseBody>
            
            
        </>
    )
}