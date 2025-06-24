"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import MerchantFormAuthorizers from "./merchant-form-authorizers";
import MerchantFormCompany from "./merchant-form-company";
import MerchantFormcontact from "./merchant-form-contact";
import MerchantFormOperations from "./merchant-form-operation";

import { useSearchParams } from "next/navigation";

import MerchantFormBankAccount from "@/features/merchant/_components/merchant-form-bank-account";
import { MerchantTabsProps } from "@/features/merchant/server/types";
import MerchantFormDocuments from "./merchant-form-documents";
import MerchantFormTax2 from "./merchant-form-tax2";

export default function MerchantTabs({
  merchant,
  address,
  Contacts,
  configurations,
  cnaeMccList,
  merchantBankAccount,
  merchantPixAccount,

  legalNatures,
  establishmentFormatList,
  DDAccountType,
  DDBank,

  merchantPriceGroupProps,
  permissions,
  isCreating = false,
}: MerchantTabsProps) {
  const [activeTab, setActiveTab] = useState("company");
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set());

  const listTabs = [
    "company",
    "contact",
    "operation",
    "bank",
    "authorizers",
    "rate",
    "documents",
  ];

  // Define quais tabs estão disponíveis com base na lógica de negócio
  const getAvailableTabs = () => {
    const tabs = [
      "company",
      "contact",
      "operation",
      ...(permissions?.includes("Configurar dados Bancários") ? ["bank"] : []),
      "authorizers",
      ...(permissions?.includes("Configurar Taxas do EC") ? ["rate"] : []),
      ...(permissions?.includes("Inserir documentos EC") ? ["documents"] : []),
    ];
    return tabs;
  };

  const availableTabs = getAvailableTabs();

  // Verifica se uma tab pode ser acessada
  const isTabAccessible = (tabValue: string) => {
    if (!isCreating) return true; // No modo de edição, todas as tabs são acessíveis

    const tabIndex = availableTabs.indexOf(tabValue);
    if (tabIndex === 0) return true; // Primeira tab sempre acessível

    // Tab só é acessível se a anterior foi completada
    const previousTab = availableTabs[tabIndex - 1];
    return completedTabs.has(previousTab);
  };

  // Marca uma tab como completada
  const markTabAsCompleted = (tabValue: string) => {
    if (isCreating) {
      setCompletedTabs((prev) => new Set([...Array.from(prev), tabValue]));
    }
  };

  // Custom handler para mudança de tab que respeita as regras de acesso
  const handleTabChange = (tabValue: string) => {
    if (isTabAccessible(tabValue)) {
      setActiveTab(tabValue);
    }
  };

  console.log("activeTab 1", activeTab);
  const searchParams = useSearchParams();
  useEffect(() => {
    console.log("entrou no useEffect");

    const tab = searchParams?.get("tab") || "company";
    // Só permite mudar para a tab se ela for acessível
    if (isTabAccessible(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams, completedTabs, isCreating]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="space-y-4 w-full"
    >
      <TabsList>
        <TabsTrigger
          value="company"
          disabled={!isTabAccessible("company")}
          className={
            !isTabAccessible("company") ? "opacity-50 cursor-not-allowed" : ""
          }
        >
          Dados da Empresa
        </TabsTrigger>
        <TabsTrigger
          value="contact"
          disabled={!isTabAccessible("contact")}
          className={
            !isTabAccessible("contact") ? "opacity-50 cursor-not-allowed" : ""
          }
        >
          Dados do Responsável
        </TabsTrigger>
        <TabsTrigger
          value="operation"
          disabled={!isTabAccessible("operation")}
          className={
            !isTabAccessible("operation") ? "opacity-50 cursor-not-allowed" : ""
          }
        >
          Dados de Operação
        </TabsTrigger>
        {permissions?.includes("Configurar dados Bancários") && (
          <TabsTrigger
            value="bank"
            disabled={!isTabAccessible("bank")}
            className={
              !isTabAccessible("bank") ? "opacity-50 cursor-not-allowed" : ""
            }
          >
            Dados Bancários
          </TabsTrigger>
        )}
        <TabsTrigger
          value="authorizers"
          disabled={!isTabAccessible("authorizers")}
          className={
            !isTabAccessible("authorizers")
              ? "opacity-50 cursor-not-allowed"
              : ""
          }
        >
          Autorizados
        </TabsTrigger>
        {permissions?.includes("Configurar Taxas do EC") && (
          <TabsTrigger
            value="rate"
            disabled={!isTabAccessible("rate")}
            className={
              !isTabAccessible("rate") ? "opacity-50 cursor-not-allowed" : ""
            }
          >
            Taxas de Transação
          </TabsTrigger>
        )}
        {permissions?.includes("Inserir documentos EC") && (
          <TabsTrigger
            value="documents"
            disabled={!isTabAccessible("documents")}
            className={
              !isTabAccessible("documents")
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
          >
            Documentos
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="company">
        <MerchantFormCompany
          merchant={{
            ...merchant,
            number: String(merchant.number),
            revenue: String(merchant.revenue),
            idMerchantPrice: merchant.idMerchantPrice || null,
            idMerchantBankAccount: merchant.idMerchantBankAccount || null,
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
          setActiveTab={(tab: string) => {
            markTabAsCompleted("company");
            setActiveTab(tab);
          }}
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
          setActiveTab={(tab: string) => {
            markTabAsCompleted("contact");
            setActiveTab(tab);
          }}
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
          setActiveTab={(tab: string) => {
            markTabAsCompleted("operation");
            setActiveTab(tab);
          }}
          activeTab={
            listTabs[listTabs.findIndex((tab) => tab === activeTab) + 1]
          }
          permissions={permissions}
          idConfiguration={merchant.idConfiguration || undefined}
        />
      </TabsContent>
      {permissions?.includes("Configurar dados Bancários") && (
        <TabsContent value="bank">
          <MerchantFormBankAccount
            merchantBankAccount={{
              id: merchantBankAccount?.merchantBankAccount?.id || 0,
              documentId:
                merchantBankAccount?.merchantBankAccount?.documentId || "",
              corporateName:
                merchantBankAccount?.merchantBankAccount?.corporateName || "",
              legalPerson:
                merchantBankAccount?.merchantBankAccount?.legalPerson ||
                "JURIDICAL",
              bankBranchNumber:
                merchantBankAccount?.merchantBankAccount?.bankBranchNumber ||
                "",
              bankBranchCheckDigit:
                merchantBankAccount?.merchantBankAccount
                  ?.bankBranchCheckDigit || "",
              accountNumber:
                merchantBankAccount?.merchantBankAccount?.accountNumber || "",
              accountNumberCheckDigit:
                merchantBankAccount?.merchantBankAccount
                  ?.accountNumberCheckDigit || "",
              accountType:
                merchantBankAccount?.merchantBankAccount?.accountType || "",
              compeCode:
                merchantBankAccount?.merchantBankAccount?.compeCode || "",
              dtinsert:
                merchantBankAccount?.merchantBankAccount?.dtinsert || "",
              dtupdate:
                merchantBankAccount?.merchantBankAccount?.dtupdate || "",
              active: merchantBankAccount?.merchantBankAccount?.active || null,
              slug: merchantBankAccount?.merchantBankAccount?.slug || null,
            }}
            DDBank={DDBank}
            idMerchant={merchant.id}
            setActiveTab={(tab: string) => {
              markTabAsCompleted("bank");
              setActiveTab(tab);
            }}
            activeTab={
              listTabs[listTabs.findIndex((tab) => tab === activeTab) + 1]
            }
            accountTypeDD={DDAccountType}
            permissions={permissions}
            merchantcorporateName={merchant.corporateName || ""}
            merchantdocumentId={merchant.idDocument || ""}
            hasPix={merchant.hasPix || false}
            merchantpixaccount={merchantPixAccount?.pixaccounts}
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
