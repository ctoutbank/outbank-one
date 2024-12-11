import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMerchantById } from '@/server/db/merchant';
import { Building2, Home } from 'lucide-react';
import { CompanyyForm } from './merchant-form';




export default async function MerchantDetail({
  params,
}: { params: { id: string };
}) {

  const merchantdetalil = await getMerchantById(BigInt(params.id));

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto p-4 w-full">
      {/* Breadcrumb */}
      
      <nav className="flex items-center space-x-2 mb-6 text-sm">
        <Home className="w-4 h-4" />
        <span>/</span>
        <Building2 className="w-4 h-4" />
        <span>Estabelecimentos</span>
        <span>/</span>
        <span>Cadastrar</span>
      </nav>

      {/* Title */}
      <div className="flex items-center space-x-2 mb-6">
        <Building2 className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Cadastro de Estabelecimento</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="company" className="space-y-4 w-full">
        
        <TabsContent value="company">
         <CompanyyForm/>
        </TabsContent>
       
       
       
      </Tabs>
      </div>
    </div>
  )
}

