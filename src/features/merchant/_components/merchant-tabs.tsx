"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import MerchantFormCompany from "./merchant-form-company"
import MerchantFormcontact from "./merchant-form-contact"
import MerchantFormOperations from "./merchant-form-operation"
import MerchantFormBank from "./merchant-form-bank"
import MerchantFormAuthorizers from "./merchant-form-authorizers"
import Transactionrate from "./merchant-form-tax"
import MerchantFormDocuments from "./merchant-form-documents"
import { CnaeMccDropdown, LegalNatureDropdown } from "../server/merchant"
import { addresses, configurations, contacts, merchantpixaccount } from "../../../../drizzle/schema"
import { ContactSchema } from "../schema/contact-schema"
import { useSearchParams } from "next/navigation"

interface MerchantData {
  id: number;
  slug: string | null;
  active: boolean;
  dtinsert: string;
  dtupdate: string | null;
  idMerchant: string | null;
  name: string | null;
  idDocument: string | null;
  corporateName: string | null;
  email: string | null;
  areaCode: string | null;
  number: string | null;
  phoneType: string | null;
  language: string | null;
  timezone: string | null;
  slugCustomer: string | null;
  riskAnalysisStatus: string | null;
  riskAnalysisStatusJustification: string | null;
  legalPerson: string | null;
  openingDate: string | null;
  inclusion: string | null;
  openingDays: string | null;
  openingHour: string | null;
  closingHour: string | null;
  municipalRegistration: string | null;
  stateSubcription: string | null;
  hasTef: boolean;
  hasPix: boolean;
  hasTop: boolean;
  establishmentFormat: string | null;
  revenue: number | null;
  idCategory: number | null;
  slugCategory: string | null;
  idLegalNature: number | null;
  slugLegalNature: string | null;
  idSalesAgent: number | null;
  slugSalesAgent: string | null;
  idConfiguration: number | null;
  slugConfiguration: string | null;
  idAddress: number | null;
  cnae: string;
  mcc: string;
  customer: string | null;
  registration: string | null;
  
  

}
interface AddressData {
  id: number;
  streetAddress: string | null;
  streetNumber: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
}
interface ContactData {
  contacts: typeof contacts.$inferSelect;
  addresses: typeof addresses.$inferSelect;

}
interface ConfigurationData {
  configurations: typeof configurations.$inferSelect;
}

interface PixAccountData {
  pixaccounts: typeof merchantpixaccount.$inferSelect;
  merchantcorporateName:string,merchantdocumentId:string,legalPerson:string

}

  


interface MerchantTabsProps {
  merchant: MerchantData;
  address: AddressData;
  Contacts: ContactData;
  addresses: AddressData;
 
  pixaccounts: PixAccountData;
  configurations: ConfigurationData;
  
  cnaeMccList: CnaeMccDropdown[];
  legalNatures: LegalNatureDropdown[];
 
  
}



export default function MerchantTabs({ 
  merchant, 
  address, 
  Contacts ,
  configurations,
  pixaccounts,
  cnaeMccList, 
  legalNatures, 
  

}: MerchantTabsProps) {

  const [activeTab, setActiveTab] = useState("company")

  const listTabs = ["company","contact","operation","bank","authorizers","rate","documents"]

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get('tab') || 'company';
    setActiveTab(tab);
  }, []);




  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 w-full">
      <TabsList>
        <TabsTrigger value="company">Dados da Empresa</TabsTrigger>
        <TabsTrigger value="contact">Dados do Responsável</TabsTrigger>
        <TabsTrigger value="operation">Dados de Operação</TabsTrigger>
        <TabsTrigger value="bank">Dados Bancários</TabsTrigger>
        <TabsTrigger value="authorizers">Autorizados</TabsTrigger>
        <TabsTrigger value="rate">Taxas de Transação</TabsTrigger>
        <TabsTrigger value="documents">Documentos</TabsTrigger>
      </TabsList>

      <TabsContent value="company">
        <MerchantFormCompany 
          merchant={{...merchant, number: String(merchant.number), revenue: String(merchant.revenue)}}
          address={address}
          Cnae={merchant.cnae}
          Mcc={merchant.mcc}
          DDLegalNature={legalNatures}
          DDCnaeMcc={cnaeMccList}
          activeTab={listTabs[listTabs.findIndex(tab => tab === activeTab)+1]}
          
          
        />
      </TabsContent>

      <TabsContent value="contact">
        <MerchantFormcontact 
          Contact={Contacts?.contacts || {
            id: 0,
            number: null,
            name: null,
            idMerchant: null,
            idAddress: null,
            mothersName: null,
            isPartnerContact: null,
            isPep: null,
            idDocument: null,
            email: null,
            areaCode: null,
            phoneType: null,
            birthDate: null,
            slugMerchant: null,
            icNumber: null,
            icDateIssuance: null,
            icDispatcher: null,
            icFederativeUnit: null
          }}
          Address={Contacts?.addresses || {
            id: 0,
            streetAddress: null,
            streetNumber: null,
            complement: null,
            neighborhood: null,
            city: null,
            state: null,
            country: null,
            zipCode: null
          }}
          onAdvance={() => setActiveTab("operation")}
        />
      </TabsContent>

     


      <TabsContent value="operation">
        <MerchantFormOperations 
          Configuration={{
            id: 0,
            slug: null,
            active: null, 
            dtinsert: null,
            dtupdate: null,
            lockCpAnticipationOrder: null,
            lockCnpAnticipationOrder: null,
            url: null
          }}
          hasTaf={merchant.hasTef}
          hastop={merchant.hasTop}
          hasPix={merchant.hasPix}
          merhcnatSlug={merchant.slugCategory || ""}
          timerzone={merchant.timezone || ""}
          
        />
      </TabsContent>
       

      <TabsContent value="bank">
        <MerchantFormBank 
          merchantpixaccount={{
            id:  0,
            slug:  null,
            active: null,
            dtinsert: null,
            idAccount: null,
            bankAccountType: null,
            bankAccountStatus: null,
            onboardingPixStatus: null,
            message: null,
            dtupdate: null,
            idMerchant: null,
            slugMerchant: null,
            idRegistration: null,
            bankNumber: null,
            bankBranchNumber: null,
            bankBranchDigit: null,
            bankAccountNumber: null,
            bankAccountDigit: null,
            bankName: null
          }}
          merchantcorporateName={merchant.corporateName || ""}
          merchantdocumentId={merchant.idDocument || ""}
          legalPerson={merchant.legalPerson || ""}
          
        />
     

      </TabsContent>
       

      <TabsContent value="authorizers">
        <MerchantFormAuthorizers />
      </TabsContent>

      <TabsContent value="rate">
        <Transactionrate />
      </TabsContent>

      <TabsContent value="documents">
        <MerchantFormDocuments />
      </TabsContent>
    </Tabs>
  )
}