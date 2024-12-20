import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { getLegalNatureById } from "@/server/db/legalNature";
import LegalNatureCard from "./cardform";




export default async function LegalNaturesDetail({
    params,
}: { params: { id: string } }) {
    const legalNature = await getLegalNatureById(parseInt(params.id));
    
    return (
        <>
         <BaseHeader
        breadcrumbItems={[{ title: "Naturezas Jurídicas", url: "/portal/legalNatures" }]}
        />
         <BaseBody
                title="New Naturezas Jurídicas"
                subtitle={`Adicionar ou editar Naturezas Jurídicas`}   >
           
            
            
            <LegalNatureCard legalNature={legalNature} /> 
        
 
       
       </BaseBody>
             
             
        </>
    )
}