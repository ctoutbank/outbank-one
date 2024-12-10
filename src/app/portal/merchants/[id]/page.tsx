import { Building2, Home, MapPin } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanyForm } from './forms/company-form'
import { AddressForm } from './forms/address-form'
import { getMerchantById } from '@/server/db/merchant';



export default async function MerchantDetail({
  params,
}: { params: { id: string };
}) {

  const merchantdetalil = await getMerchantById(BigInt(params.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
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
        <Tabs defaultValue="company" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="company" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Dados Empresariais/Pessoais</span>
            </TabsTrigger>
            <TabsTrigger value="address" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Endereço</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="company">
            <CompanyForm />
          </TabsContent>
          <TabsContent value="address">
            <AddressForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

