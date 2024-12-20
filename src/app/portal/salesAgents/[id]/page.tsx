import { getSalesAgentById } from "@/server/db/salesAgent";
import SalesAgentsForm from "./form";
import SalesAgentCard from "./cardform";
import BaseHeader from "@/components/layout/base-header";
import BaseBody from "@/components/layout/base-body";


export default async function SalesAgentsDetail({
    params,
}: { params: { id: string } }) {
    const agent = await getSalesAgentById(parseInt(params.id));
    
    return (
        <>
         <BaseHeader
        breadcrumbItems={[{ title: "Consultores", url: "/portal/salesAgents" }]}
        />
         <BaseBody
                title="Consultores"
                subtitle={`visualização de todos os Consultores`}   >
           
           
           <SalesAgentCard salesAgent={agent} /> 
      

      
       </BaseBody>
            
            
        </>
    )
}