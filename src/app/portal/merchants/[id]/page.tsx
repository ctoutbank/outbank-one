import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MerchantFormAuthorizers from "@/features/merchant/_components/merchant-form-authorizers";
import MerchantFormBank from "@/features/merchant/_components/merchant-form-bank";
import MerchantFormCompany from "@/features/merchant/_components/merchant-form-company";
import MerchantFormcontact from "@/features/merchant/_components/merchant-form-contact";
import MerchantFormDocuments from "@/features/merchant/_components/merchant-form-documents";
import MerchantFormOperations from "@/features/merchant/_components/merchant-form-operation";
import Transactionrate from "@/features/merchant/_components/merchant-form-tax";
import MerchantTabs from "@/features/merchant/_components/merchant-tabs";
import { getAddressByContactId } from "@/features/merchant/server/adderres";
import { getConfigurationsByMerchantId } from "@/features/merchant/server/configurations";
import { getContactByMerchantId } from "@/features/merchant/server/contact";
import { getCnaeMccForDropdown, getLegalNaturesForDropdown, getMerchantById } from "@/features/merchant/server/merchant";





export default async function MerchantDetail({
  params,
  
}: {
  params: { id: string };

}) {
  
  

  const cnaeMccList = await getCnaeMccForDropdown()




    const merchant = await getMerchantById(parseInt(params.id));
    console.log("merchant", merchant);
    const legalNatures = await getLegalNaturesForDropdown();
    
   
    console.log("legalNatures", legalNatures);
    const address = await getAddressByContactId(merchant?.contacts?.id || 0);
   const contact = await getContactByMerchantId(merchant?.merchants.id || 0);
   console.log("contact", contact);
   const configurations = await getConfigurationsByMerchantId(merchant?.merchants.id || 0);
 

      return (
        <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Estabelecimentos", url: "/portal/merchants" },
        ]}
      />

      <BaseBody
        title="Estabelecimento"
        subtitle={
          merchant?.merchants.id
            ? "Editar Estabelecimento"
            : "Adicionar Estabelecimento"
        }
      >
       {/* <div className="">
          <Tabs defaultValue="company" className="space-y-4 w-full">
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
              <MerchantFormCompany merchant={{
                id: merchant?.merchants.id ? Number(merchant.merchants.id) : 0,
                name: merchant?.merchants.name || null,
                slug: merchant?.merchants.slug || null,
                active: merchant?.merchants.active || false,
                number: merchant?.merchants.number || null,
                idDocument: merchant?.merchants.idDocument || null,
                corporateName: merchant?.merchants.corporateName || null,
                email: merchant?.merchants.email || null,
                dtinsert: merchant?.merchants.dtinsert ? merchant.merchants.dtinsert : new Date().toISOString(),
                dtupdate: merchant?.merchants.dtupdate ? new Date(merchant.merchants.dtupdate).toISOString() : null,
                idMerchant: merchant?.merchants.idMerchant || "",
                idAddress: merchant?.merchants.idAddress || 0,
                idLegalNature: merchant?.merchants.idLegalNature || 0,
                idSalesAgent: merchant?.merchants.idSalesAgent || 0,
                idConfiguration: merchant?.merchants.idConfiguration || 0,
                areaCode: merchant?.merchants.areaCode || null,
                phoneType: merchant?.merchants.phoneType || null,
                language: merchant?.merchants.language || null,
                timezone: merchant?.merchants.timezone || null,
                slugCustomer: merchant?.merchants.slugCustomer || null,
                riskAnalysisStatus: merchant?.merchants.riskAnalysisStatus || null,
                riskAnalysisStatusJustification: merchant?.merchants.riskAnalysisStatusJustification || null,
                legalPerson: merchant?.merchants.legalPerson || null,
                openingDate: merchant?.merchants.openingDate ? new Date(merchant.merchants.openingDate).toISOString() : null,
                inclusion: merchant?.merchants.inclusion || null,
                openingDays: merchant?.merchants.openingDays || null,
                openingHour: merchant?.merchants.openingHour || null,
                closingHour: merchant?.merchants.closingHour || null,
                municipalRegistration: merchant?.merchants.municipalRegistration || null,
                stateSubcription: merchant?.merchants.stateSubcription || null,
                hasTef: merchant?.merchants.hasTef || false,
                hasPix: merchant?.merchants.hasPix || false,
                hasTop: merchant?.merchants.hasTop || false,
                establishmentFormat: merchant?.merchants.establishmentFormat || null,
                revenue: merchant?.merchants.revenue || null,
                idCategory: merchant?.merchants.idCategory || null,
                slugCategory: merchant?.merchants.slugCategory || null,
                slugLegalNature: merchant?.merchants.slugLegalNature || null,
                slugSalesAgent: merchant?.merchants.slugSalesAgent || "",
                slugConfiguration: merchant?.merchants.slugConfiguration || "",
                cnae: merchant?.categories?.cnae || "",
                mcc: merchant?.categories?.mcc || "",
               
                
              }} address={{
                id: merchant?.addresses?.id || 0,
                streetAddress: merchant?.addresses?.streetAddress || null,
                streetNumber: merchant?.addresses?.streetNumber || null,
                complement: merchant?.addresses?.complement || null,
                neighborhood: merchant?.addresses?.neighborhood || null,
                city: merchant?.addresses?.city || null,
                state: merchant?.addresses?.state || null,
                country: merchant?.addresses?.country || null,
                zipCode: merchant?.addresses?.zipCode || null
              }} Cnae={merchant?.categories?.cnae || ""} Mcc={merchant?.categories?.mcc || ""} DDLegalNature={legalNatures} DDCnaeMcc={cnaeMccList || []}           />
            
            </TabsContent>
            <TabsContent value="contact">
              <MerchantFormcontact Contact={contact?.[0]?.contacts} Address={contact?.[0]?.addresses || {
                id: 0,
                streetAddress: null,
                streetNumber: null,
                complement: null,
                neighborhood: null,
                city: null,
                state: null,
                country: null,
                zipCode: null
              }} />
            
            </TabsContent>
            <TabsContent value="operation">
              <MerchantFormOperations Configuration={merchant?.configurations || {
                id: 0,
                slug: null,
                active: false,
                dtinsert: null,
                dtupdate: null,
                lockCpAnticipationOrder: false,
                lockCnpAnticipationOrder: false,
                url: null,
              }} hasTaf={merchant?.merchants.hasTef || false} hastop={merchant?.merchants.hasTop|| false} hasPix={merchant?.merchants.hasPix || false} merhcnatSlug={merchant?.merchants.slugCategory || ""} timerzone={merchant?.merchants.timezone || ""} />
            </TabsContent>
            <TabsContent value="bank">
              <MerchantFormBank merchantpixaccount={merchant?.pixaccounts || {
                id: 136,
                slug: '',
                active: true,
                dtinsert: '',
                dtupdate: '',
                idRegistration: '',
                idAccount: '',
                bankNumber: '',
                bankBranchNumber: '',
                bankBranchDigit: '',
                bankAccountNumber: '',
                bankAccountDigit: ' ',
                bankAccountType: '',
                bankAccountStatus: '',
                onboardingPixStatus: 'W',
                message: '',
                bankName: '',
                idMerchant: merchant?.merchants.id || 0,
                slugMerchant: ''
              }} merchantcorporateName={merchant?.merchants.corporateName || ""} merchantdocumentId={merchant?.merchants.idDocument || ""} legalPerson={merchant?.merchants.legalPerson || ""} />
            </TabsContent>
            <TabsContent value="authorizers">
              <MerchantFormAuthorizers  />
            </TabsContent>
            <TabsContent value="rate">
              <Transactionrate />
            </TabsContent>
            <TabsContent value="documents">
              <MerchantFormDocuments  />
            </TabsContent>

          </Tabs>
        </div>
        */}
         <MerchantTabs 
          merchant={{
            id: merchant?.merchants?.id || 0,
            name: merchant?.merchants?.name || "",
            slug: merchant?.merchants?.slug || "",
            active: merchant?.merchants?.active || false,
            establishmentFormat: merchant?.merchants?.establishmentFormat || "",
            idCategory: merchant?.merchants?.idCategory || 0,
            slugLegalNature: merchant?.merchants?.slugLegalNature || "",
            slugSalesAgent: merchant?.merchants?.slugSalesAgent || "",
            openingHour: merchant?.merchants?.openingHour || "",
            closingHour: merchant?.merchants?.closingHour || "",
            municipalRegistration: merchant?.merchants?.municipalRegistration || "",
            stateSubcription: merchant?.merchants?.stateSubcription || "",
            idDocument: merchant?.merchants?.idDocument || "",
            legalPerson: merchant?.merchants?.legalPerson || "",
            corporateName: merchant?.merchants?.corporateName || "",
            riskAnalysisStatusJustification: merchant?.merchants?.riskAnalysisStatusJustification || "",
            openingDate: merchant?.merchants?.openingDate || "",
            inclusion: merchant?.merchants?.inclusion || "",
            openingDays: merchant?.merchants?.openingDays || null,
            phoneType: merchant?.merchants?.phoneType || "",
            language: merchant?.merchants?.language || "",
            slugCustomer: merchant?.merchants?.slugCustomer || "",
            riskAnalysisStatus: merchant?.merchants?.riskAnalysisStatus || "",
            idAddress: merchant?.merchants?.idAddress || 0,
            idLegalNature: merchant?.merchants?.idLegalNature || 0,
            idSalesAgent: merchant?.merchants?.idSalesAgent || 0,
            areaCode: merchant?.merchants?.areaCode || "",
            number: merchant?.merchants?.number?String(merchant?.merchants?.number) : "",
            email: merchant?.merchants?.email || "",
            dtinsert: merchant?.merchants?.dtinsert || "",
            dtupdate: merchant?.merchants?.dtupdate || "",
            idMerchant: String(merchant?.merchants?.id),
            idConfiguration: merchant?.configurations?.id || 0,
            hasTef: Boolean(merchant?.merchants?.hasTef || false),
            hasTop: Boolean(merchant?.merchants?.hasTop || false),
            hasPix: Boolean(merchant?.merchants?.hasPix || false),
            revenue: Number(merchant?.merchants.revenue),
            cnae: merchant?.categories?.cnae || "",
            mcc: merchant?.categories?.mcc || "",
            slugConfiguration: merchant?.configurations?.slug || "",
           
            registration: merchant?.merchants?.municipalRegistration || "",
            customer: merchant?.merchants?.slugCustomer || "",
           
           
            
            slugCategory: merchant?.merchants.slugCategory || null,
            timezone: merchant?.merchants.timezone || "",
          }}
          address={{
            id: merchant?.addresses?.id || 0,
            streetAddress: merchant?.addresses?.streetAddress || "",
            streetNumber: merchant?.addresses?.streetNumber || "",
            complement: merchant?.addresses?.complement || "",
            neighborhood: merchant?.addresses?.neighborhood || "",
            city: merchant?.addresses?.city || "",
            state: merchant?.addresses?.state || "",
            country: merchant?.addresses?.country || "",
            zipCode: merchant?.addresses?.zipCode || ""
          }}

          
          cnaeMccList={cnaeMccList}
          legalNatures={legalNatures}

          Contacts={{
            contacts: contact?.[0]?.contacts || [],
            addresses: contact?.[0]?.addresses || {
              id:contact?.[0]?.addresses?.id || 0,
              streetAddress: contact?.[0]?.addresses?.streetAddress || "",
              streetNumber: contact?.[0]?.addresses?.streetNumber || "", 
              complement: contact?.[0]?.addresses?.complement || "",
              neighborhood: contact?.[0]?.addresses?.neighborhood || "",
              city: contact?.[0]?.addresses?.city || "",
              state: contact?.[0]?.addresses?.state || "",
              country: contact?.[0]?.addresses?.country || "",
              zipCode: contact?.[0]?.addresses?.zipCode || ""
            }
          }}
          addresses={{
            id: contact?.[0]?.addresses?.id || 0,
            streetAddress: contact?.[0]?.addresses?.streetAddress || "",
            streetNumber: contact?.[0]?.addresses?.streetNumber || "",
            complement: contact?.[0]?.addresses?.complement || "",
            neighborhood: contact?.[0]?.addresses?.neighborhood || "",
            city: contact?.[0]?.addresses?.city || "",
            state: contact?.[0]?.addresses?.state || "",
            country: contact?.[0]?.addresses?.country || "",
            zipCode: contact?.[0]?.addresses?.zipCode || ""
          }}
          configurations={{
            configurations: {
              id: configurations?.id || 0,
              slug: configurations?.slug || "",
              active: configurations?.active || false,
              dtinsert: configurations?.dtinsert || "",
              dtupdate: configurations?.dtupdate || "",
              lockCpAnticipationOrder: configurations?.lockCpAnticipationOrder || false,
              lockCnpAnticipationOrder: configurations?.lockCnpAnticipationOrder || false,
              url: configurations?.url || ""
            }
          }}
          pixaccounts={{
            pixaccounts: {
              id: merchant?.pixaccounts?.id || 0,
              slug: merchant?.pixaccounts?.slug || "",
              active: merchant?.pixaccounts?.active || false,
              dtinsert: merchant?.pixaccounts?.dtinsert || "",
              dtupdate: merchant?.pixaccounts?.dtupdate || "",
              idRegistration: merchant?.pixaccounts?.idRegistration || "",
              idAccount: merchant?.pixaccounts?.idAccount || "",
              bankNumber: merchant?.pixaccounts?.bankNumber || "",
              bankBranchNumber: merchant?.pixaccounts?.bankBranchNumber || "",
              bankBranchDigit: merchant?.pixaccounts?.bankBranchDigit || "",
              bankAccountNumber: merchant?.pixaccounts?.bankAccountNumber || "",
              bankAccountDigit: merchant?.pixaccounts?.bankAccountDigit || "",
              bankAccountType: merchant?.pixaccounts?.bankAccountType || "",
              bankAccountStatus: merchant?.pixaccounts?.bankAccountStatus || "",
              onboardingPixStatus: merchant?.pixaccounts?.onboardingPixStatus || "",
              message: merchant?.pixaccounts?.message || "",
              bankName: merchant?.pixaccounts?.bankName || "",
              idMerchant: merchant?.pixaccounts?.idMerchant || 0,
              slugMerchant: merchant?.pixaccounts?.slugMerchant || null
            },
            merchantcorporateName: merchant?.merchants?.corporateName || "",
            merchantdocumentId: merchant?.merchants?.idDocument || "",
            legalPerson: merchant?.merchants?.legalPerson || ""
          }}
         
        
        

          


        /> 
        
      </BaseBody>
    </>
  );
}
