"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import MerchantFormAuthorizers from "./merchant-form-authorizers";
import MerchantFormBank from "./merchant-form-bank";
import MerchantFormCompany from "./merchant-form-company";
import MerchantFormcontact from "./merchant-form-contact";
import MerchantFormOperations from "./merchant-form-operation";

import { useSearchParams } from "next/navigation";

import MerchantFormDocuments from "./merchant-form-documents";
import MerchantFormTax2 from "./merchant-form-tax2";
import { MerchantTabsProps } from "@/features/merchant/server/types";


export default function MerchantTabs({
  merchant,
  address,
  Contacts,
  configurations,
  pixaccounts,
  cnaeMccList,
  legalNatures,
  establishmentFormatList,
  DDAccountType,
  DDBank,

  merchantPriceGroupProps,
  permissions,
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
        {permissions?.includes("Configurar dados Bancários") && (
          <TabsTrigger value="bank">Dados Bancários</TabsTrigger>
        )}
        <TabsTrigger value="authorizers">Autorizados</TabsTrigger>
        {permissions?.includes("Configurar Taxas do EC") && (
          <TabsTrigger value="rate">Taxas de Transação</TabsTrigger>
        )}
        {permissions?.includes("Inserir documentos EC") && (
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="company">
        <MerchantFormCompany
          merchant={{
            ...merchant,
            number: String(merchant.number),
            revenue: String(merchant.revenue),
            idMerchantPrice: merchant.idMerchantPrice || null,
            establishmentFormat: merchant.establishmentFormat || "",
            idCustomer: merchant.idCustomer || null,
            dtdelete: "",
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
          permissions={permissions}
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
          permissions={permissions}
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
            anticipationRiskFactorCnp: configurations?.configurations
              ?.anticipationRiskFactorCnp
              ? Number(
                  configurations?.configurations?.anticipationRiskFactorCnp
                )
              : null,
            waitingPeriodCnp: configurations?.configurations?.waitingPeriodCnp
              ? Number(configurations?.configurations?.waitingPeriodCnp)
              : null,
            anticipationRiskFactorCp: configurations?.configurations
              ?.anticipationRiskFactorCp
              ? Number(configurations?.configurations?.anticipationRiskFactorCp)
              : null,
            waitingPeriodCp: configurations?.configurations?.waitingPeriodCp
              ? Number(configurations?.configurations?.waitingPeriodCp)
              : null,
          }}
          hasTaf={merchant.hasTef}
          hastop={merchant.hasTop}
          hasPix={merchant.hasPix}
          merhcnatSlug={merchant.slugCategory || ""}
          timezone={merchant.timezone || ""}
          idMerchant={merchant.id}
          setActiveTab={setActiveTab}
          activeTab={
            listTabs[listTabs.findIndex((tab) => tab === activeTab) + 1]
          }
          permissions={permissions}
          idConfiguration={merchant.idConfiguration || undefined}
        />
      </TabsContent>
      {permissions?.includes("Configurar dados Bancários") && (
        <TabsContent value="bank">
          <MerchantFormBank
            merchantpixaccount={{
              id: pixaccounts?.pixaccounts?.id || 0,
              slug: pixaccounts?.pixaccounts?.slug || null,
              active: pixaccounts?.pixaccounts?.active || null,
              dtinsert: pixaccounts?.pixaccounts?.dtinsert || null,
              idAccount: pixaccounts?.pixaccounts?.idAccount || null,
              bankAccountType:
                pixaccounts?.pixaccounts?.bankAccountType || null,
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
              bankBranchDigit:
                pixaccounts?.pixaccounts?.bankBranchDigit || null,
              bankAccountNumber:
                pixaccounts?.pixaccounts?.bankAccountNumber || null,
              bankAccountDigit:
                pixaccounts?.pixaccounts?.bankAccountDigit || null,
              bankName: pixaccounts?.pixaccounts?.bankName || null,
            }}
            merchantcorporateName={merchant.corporateName || ""}
            merchantdocumentId={merchant.idDocument || ""}
            legalPerson={merchant.legalPerson || ""}
            activeTab={
              listTabs[listTabs.findIndex((tab) => tab === activeTab) + 1]
            }
            idMerchant={merchant.id}
            setActiveTab={setActiveTab}
            DDAccountType={DDAccountType}
            DDBank={DDBank}
            permissions={permissions}
          />
        </TabsContent>
      )}

      <TabsContent value="authorizers">
        <MerchantFormAuthorizers />
      </TabsContent>
      {permissions?.includes("Configurar Taxas do EC") && (
        <TabsContent value="rate">
          <MerchantFormTax2
            merchantprice={[
              {
                id: merchantPriceGroupProps?.merchantPrice?.id || 0,
                name: merchantPriceGroupProps?.merchantPrice?.name || "",
                active: merchantPriceGroupProps?.merchantPrice?.active || false,
                dtinsert:
                  merchantPriceGroupProps?.merchantPrice?.dtinsert || "",
                dtupdate:
                  merchantPriceGroupProps?.merchantPrice?.dtupdate || "",
                tableType:
                  merchantPriceGroupProps?.merchantPrice?.tableType || "",
                slugMerchant:
                  merchantPriceGroupProps?.merchantPrice?.slugMerchant || "",
                compulsoryAnticipationConfig:
                  merchantPriceGroupProps?.merchantPrice
                    ?.compulsoryAnticipationConfig || 0,
                anticipationType:
                  merchantPriceGroupProps?.merchantPrice?.anticipationType ||
                  "",
                eventualAnticipationFee:
                  merchantPriceGroupProps?.merchantPrice
                    ?.eventualAnticipationFee || 0,
                cardPixMdr:
                  merchantPriceGroupProps?.merchantPrice?.cardPixMdr || 0,
                cardPixCeilingFee:
                  merchantPriceGroupProps?.merchantPrice?.cardPixCeilingFee ||
                  0,
                cardPixMinimumCostFee:
                  merchantPriceGroupProps?.merchantPrice
                    ?.cardPixMinimumCostFee || 0,
                nonCardPixMdr:
                  merchantPriceGroupProps?.merchantPrice?.nonCardPixMdr || 0,
                nonCardPixCeilingFee:
                  merchantPriceGroupProps?.merchantPrice
                    ?.nonCardPixCeilingFee || 0,
                nonCardPixMinimumCostFee:
                  merchantPriceGroupProps?.merchantPrice
                    ?.nonCardPixMinimumCostFee || 0,
                merchantpricegroup:
                  merchantPriceGroupProps?.merchantpricegroup || [],
              },
            ]}
            idMerchantPrice={merchant.idMerchantPrice || 0}
            permissions={permissions}
          />
        </TabsContent>
      )}
      {permissions?.includes("Inserir documentos EC") && (
        <TabsContent value="documents">
          <MerchantFormDocuments
            merchantId={merchant.id.toString()}
            permissions={permissions}
          />
        </TabsContent>
      )}
    </Tabs>
  );
}
