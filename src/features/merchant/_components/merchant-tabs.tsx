"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import MerchantFormCompany from "./merchant-form-company";
import MerchantFormcontact from "./merchant-form-contact";
import MerchantFormOperations from "./merchant-form-operation";
import MerchantFormBank from "./merchant-form-bank";
import MerchantFormAuthorizers from "./merchant-form-authorizers";
import Transactionrate from "./merchant-form-tax";
import MerchantFormDocuments from "./merchant-form-documents";
import { CnaeMccDropdown, EstablishmentFormatDropdown, LegalNatureDropdown } from "../server/merchant";
import {
  addresses,
  configurations,
  contacts,
  merchantpixaccount,
} from "../../../../drizzle/schema";
import { ContactSchema } from "../schema/contact-schema";
import { useSearchParams } from "next/navigation";

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
  merchantcorporateName: string;
  merchantdocumentId: string;
  legalPerson: string;
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
  establishmentFormatList: EstablishmentFormatDropdown[];
}

export default function MerchantTabs({
  merchant,
  address,
  Contacts,
  configurations,
  pixaccounts,
  cnaeMccList,
  legalNatures,
  establishmentFormatList,
}: MerchantTabsProps) {
  const [activeTab, setActiveTab] = useState("company");

  const listTabs = [
    "company",
    "contact",
    "operation",
    "bank",
    "authorizers",
    "rate",
    "documents",
  ];
  console.log("activeTab 1", activeTab);
  const searchParams = useSearchParams();
  useEffect(() => {
    console.log("entrou no useEffect");

    const tab = searchParams?.get("tab") || "company";
    setActiveTab(tab);
  }, [searchParams]);
  console.log("activeTab 2", activeTab);
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4 w-full"
    >
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
          merchant={{
            ...merchant,
            number: String(merchant.number),
            revenue: String(merchant.revenue),
            establishmentFormat: merchant.establishmentFormat || "",
          }}
          address={address}
          Cnae={merchant.cnae}
          Mcc={merchant.mcc}
          DDLegalNature={legalNatures}
          DDCnaeMcc={cnaeMccList}
          DDEstablishmentFormat={establishmentFormatList}
          activeTab={
            listTabs[listTabs.findIndex((tab) => tab === activeTab) + 1]
          }
          setActiveTab={setActiveTab}
         
        />
      </TabsContent>

      <TabsContent value="contact">
        <MerchantFormcontact
          Contact={
            Contacts?.contacts || {
              id: Contacts?.contacts?.id || 0,
              number: Contacts?.contacts?.number || null,
              name: Contacts?.contacts?.name || null,
              idMerchant: Contacts?.contacts?.idMerchant || null,
              idAddress: Contacts?.contacts?.idAddress || null,
              mothersName: Contacts?.contacts?.mothersName || null,
              isPartnerContact: Contacts?.contacts?.isPartnerContact || null,
              isPep: Contacts?.contacts?.isPep || null,
              idDocument: Contacts?.contacts?.idDocument || null,
              email: Contacts?.contacts?.email || null,
              areaCode: Contacts?.contacts?.areaCode || null,
              phoneType: Contacts?.contacts?.phoneType || null,
              birthDate: Contacts?.contacts?.birthDate || null,
              slugMerchant: Contacts?.contacts?.slugMerchant || null,
              icNumber: Contacts?.contacts?.icNumber || null,
              icDateIssuance: Contacts?.contacts?.icDateIssuance || null,
              icDispatcher: Contacts?.contacts?.icDispatcher || null,
              icFederativeUnit: Contacts?.contacts?.icFederativeUnit || null,
            }
          }
          Address={
            Contacts?.addresses || {
              id: Contacts?.addresses?.id || 0,
              streetAddress: Contacts?.addresses?.streetAddress || null,
              streetNumber: Contacts?.addresses?.streetNumber || null,
              complement: Contacts?.addresses?.complement || null,
              neighborhood: Contacts?.addresses?.neighborhood || null,
              city: Contacts?.addresses?.city || null,
              state: Contacts?.addresses?.state || null,
              country: Contacts?.addresses?.country || null,
              zipCode: Contacts?.addresses?.zipCode || null,
            }
          }
          idMerchant={merchant.id}
          activeTab={
            listTabs[listTabs.findIndex((tab) => tab === activeTab) + 1]
          }
          setActiveTab={setActiveTab}
        />
      </TabsContent>

      <TabsContent value="operation">
        <MerchantFormOperations
          Configuration={{
            id: configurations?.configurations?.id || 0,
            slug: configurations?.configurations?.slug || null,
            active: configurations?.configurations?.active || null,
            dtinsert: configurations?.configurations?.dtinsert || null,
            dtupdate: configurations?.configurations?.dtupdate || null,
            lockCpAnticipationOrder:
              configurations?.configurations?.lockCpAnticipationOrder || null,
            lockCnpAnticipationOrder:
              configurations?.configurations?.lockCnpAnticipationOrder || null,
            url: configurations?.configurations?.url || null,
          }}
          hasTaf={merchant.hasTef}
          hastop={merchant.hasTop}
          hasPix={merchant.hasPix}
          merhcnatSlug={merchant.slugCategory || ""}
          timerzone={merchant.timezone || ""}
          idMerchant={merchant.id}
          setActiveTab={setActiveTab}
          activeTab={listTabs[listTabs.findIndex((tab) => tab === activeTab) + 1]}
        />
      </TabsContent>

      <TabsContent value="bank">
        <MerchantFormBank
          merchantpixaccount={{
            id: pixaccounts?.pixaccounts?.id || 0,
            slug: pixaccounts?.pixaccounts?.slug || null,
            active: pixaccounts?.pixaccounts?.active || null,
            dtinsert: pixaccounts?.pixaccounts?.dtinsert || null,
            idAccount: pixaccounts?.pixaccounts?.idAccount || null,
            bankAccountType: pixaccounts?.pixaccounts?.bankAccountType || null,
            bankAccountStatus:
              pixaccounts?.pixaccounts?.bankAccountStatus || null,
            onboardingPixStatus:
              pixaccounts?.pixaccounts?.onboardingPixStatus || null,
            message: pixaccounts?.pixaccounts?.message || null,
            dtupdate: pixaccounts?.pixaccounts?.dtupdate || null,
            idMerchant: pixaccounts?.pixaccounts?.idMerchant || null,
            slugMerchant: pixaccounts?.pixaccounts?.slugMerchant || null,
            idRegistration: pixaccounts?.pixaccounts?.idRegistration || null,
            bankNumber: pixaccounts?.pixaccounts?.bankNumber || null,
            bankBranchNumber:
              pixaccounts?.pixaccounts?.bankBranchNumber || null,
            bankBranchDigit: pixaccounts?.pixaccounts?.bankBranchDigit || null,
            bankAccountNumber:
              pixaccounts?.pixaccounts?.bankAccountNumber || null,
            bankAccountDigit:
              pixaccounts?.pixaccounts?.bankAccountDigit || null,
            bankName: pixaccounts?.pixaccounts?.bankName || null,
          }}
          merchantcorporateName={merchant.corporateName || ""}
          merchantdocumentId={merchant.idDocument || ""}
          legalPerson={merchant.legalPerson || ""}
          activeTab={listTabs[listTabs.findIndex((tab) => tab === activeTab) + 1]}
          idMerchant={merchant.id}
          setActiveTab={setActiveTab}
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
  );
}
