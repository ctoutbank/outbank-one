import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyyForm } from "@/features/merchant/_components/merchant-form";
import { getMerchantById } from "@/features/merchant/server/merchant";
import { Building2, Home } from 'lucide-react';





export default async function MerchantDetail({
  params,
}: { params: { id: string };
}) {

  const merchantdetalil = await getMerchantById(BigInt(params.id));

  return (
    <>
    <BaseHeader
        breadcrumbItems={[{ title: "Estabelecimentos", url: "/portal/salesAgents" }]}
        />
  
        <BaseBody       
                        title="Estabelecimento"
                        subtitle={merchantdetalil?.id ? "Editar Estabelecimento" : "Adicionar Estabelecimento"}     >
    <div className="">
     
     

     
      <Tabs defaultValue="company" className="space-y-4 w-full">
        
        <TabsContent value="company">
         <CompanyyForm/>
        </TabsContent>
       
       
       
      </Tabs>
      </div>
    
    </BaseBody>
    </>
  )
}

