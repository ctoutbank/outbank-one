"use client";

import {
  updateMerchantPriceFormAction,
  updateMultipleTransactionPricesFormAction,
} from "@/features/merchant/_actions/merchant-price-formActions";
import { type FeeData } from "@/features/newTax/server/fee-db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createMerchantPriceFromFeeAction } from "../_actions/create-merchant-price-action";
import {
  merchantPriceSchema,
  type MerchantPriceSchema,
} from "../schema/merchant-price-schema";
import FeeSelectionView from "./fee-selection-view";
import TaxManagementView from "./tax-management-view";
import type { OrganizedFeeGroup, TransactionUpdate } from "./tax-types";

interface Merchantprice {
  id: number;
  name: string;
  active: boolean;
  dtinsert: string;
  dtupdate: string;
  tableType: string;
  slugMerchant: string;
  compulsoryAnticipationConfig: number;
  anticipationType: string;
  eventualAnticipationFee: number;
  cardPixMdr: number;
  cardPixCeilingFee: number;
  cardPixMinimumCostFee: number;
  nonCardPixMdr: number;
  nonCardPixCeilingFee: number;
  nonCardPixMinimumCostFee: number;
  merchantpricegroup: Array<{
    id: number;
    name: string;
    active: boolean;
    dtinsert: string;
    dtupdate: string;
    listMerchantTransactionPrice: Array<{
      id: number;
      slug: string;
      active: boolean;
      dtinsert: string;
      dtupdate: string;
      idMerchantPriceGroup: number;
      installmentTransactionFeeStart: number;
      installmentTransactionFeeEnd: number;
      cardTransactionMdr: number;
      cardTransactionFee: number;
      nonCardTransactionFee: number;
      nonCardTransactionMdr: number;
      producttype: string;
    }>;
  }>;
}

interface MerchantpriceList {
  merchantprice: Merchantprice[];
  permissions: string[];
  idMerchantPrice: number;
  merchantId?: number;
  availableFees?: FeeData[];
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function MerchantFormTax2({
  merchantprice,
  idMerchantPrice,
  permissions,
  merchantId,
  availableFees = [],
  activeTab,
  setActiveTab,
}: MerchantpriceList) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("todas");
  const [feeData, setFeeData] = useState<OrganizedFeeGroup[]>([]);

  // Estados para seleção de fee
  const [selectedFeeId, setSelectedFeeId] = useState<string>("");
  const [selectedFee, setSelectedFee] = useState<FeeData | null>(null);
  const [isCreatingMerchantPrice, setIsCreatingMerchantPrice] = useState(false);
  const showFeeSelection = !idMerchantPrice || idMerchantPrice === 0;

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams || "");

  const refreshPage = (id: number) => {
    if (activeTab && setActiveTab) {
      params.set("tab", activeTab);
      setActiveTab(activeTab);
      //add new objects in searchParams
      router.push(`/portal/merchants/${id}?${params.toString()}`);
    }
  };

  // Configuração do formulário
  const form = useForm<MerchantPriceSchema>({
    resolver: zodResolver(merchantPriceSchema),
    defaultValues: {
      id: idMerchantPrice || undefined,
      name: merchantprice?.[0]?.name || "",
      active: merchantprice?.[0]?.active ?? true,
      tableType: merchantprice?.[0]?.tableType || "",
      anticipationType: merchantprice?.[0]?.anticipationType || "",
      eventualAnticipationFee: merchantprice?.[0]?.eventualAnticipationFee || 0,
      cardPixMdr: merchantprice?.[0]?.cardPixMdr || 0,
      cardPixCeilingFee: merchantprice?.[0]?.cardPixCeilingFee || 0,
      cardPixMinimumCostFee: merchantprice?.[0]?.cardPixMinimumCostFee || 0,
      nonCardPixMdr: merchantprice?.[0]?.nonCardPixMdr || 0,
      nonCardPixCeilingFee: merchantprice?.[0]?.nonCardPixCeilingFee || 0,
      nonCardPixMinimumCostFee:
        merchantprice?.[0]?.nonCardPixMinimumCostFee || 0,
    },
  });

  const [pixFees, setPixFees] = useState({
    mdr: merchantprice?.[0]?.cardPixMdr || 0,
    custoMinimo: merchantprice?.[0]?.cardPixMinimumCostFee || 0,
    custoMaximo: merchantprice?.[0]?.cardPixCeilingFee || 0,
    antecipacao: merchantprice?.[0]?.eventualAnticipationFee || 0,
  });

  const [pixFeesOnline, setPixFeesOnline] = useState({
    mdr: merchantprice?.[0]?.nonCardPixMdr || 0,
    custoMinimo: merchantprice?.[0]?.nonCardPixMinimumCostFee || 0,
    custoMaximo: merchantprice?.[0]?.nonCardPixCeilingFee || 0,
    antecipacao: merchantprice?.[0]?.eventualAnticipationFee || 0,
  });

  const handlePixFeeChange = (
    field: keyof typeof pixFees,
    value: string,
    type: "pos" | "online" = "pos"
  ) => {
    const numericValue = parseFloat(value) || 0;
    if (type === "pos") {
      setPixFees({ ...pixFees, [field]: numericValue });
    } else {
      setPixFeesOnline({ ...pixFeesOnline, [field]: numericValue });
    }
  };

  // Função para organizar transações (movida para fora do useEffect para reutilização)
  // TODO: Melhorar tipagem quando estrutura de dados for padronizada
  const organizeTransactions = (
    group: any // Temporário: diferentes fontes de dados têm estruturas ligeiramente diferentes
  ): OrganizedFeeGroup => {
    const transactions = group.listMerchantTransactionPrice || [];
    return {
      id: group.id,
      name: group.name,
      active: group.active,
      dtinsert: group.dtinsert,
      dtupdate: group.dtupdate,
      idMerchantPrice: group.idMerchantPrice || 0,
      transactions: {
        credit: {
          vista: transactions.find(
            (tx: any) =>
              tx.producttype === "CREDIT" &&
              tx.installmentTransactionFeeStart === 1 &&
              tx.installmentTransactionFeeEnd === 1
          ),
          parcela2_6: transactions.find(
            (tx: any) =>
              tx.producttype === "CREDIT" &&
              tx.installmentTransactionFeeStart === 2 &&
              tx.installmentTransactionFeeEnd === 6
          ),
          parcela7_12: transactions.find(
            (tx: any) =>
              tx.producttype === "CREDIT" &&
              tx.installmentTransactionFeeStart === 7 &&
              tx.installmentTransactionFeeEnd === 12
          ),
        },
        debit: transactions.find((tx: any) => tx.producttype === "DEBIT"),
        prepaid: transactions.find((tx: any) => tx.producttype === "PREPAID"),
      },
    };
  };

  // Função de submit do formulário
  const onSubmit = async (data: MerchantPriceSchema) => {
    try {
      console.log("Dados do formulário:", data);
      console.log("FeeData atual:", feeData);
      console.log("PixFees atual:", pixFees);

      // Preparar updates para transaction prices
      const transactionUpdates: TransactionUpdate[] = [];

      // Atualizar merchant price incluindo os campos PIX
      const merchantPriceData = {
        ...data,
        cardPixMdr: pixFees.mdr,
        cardPixCeilingFee: pixFees.custoMaximo,
        cardPixMinimumCostFee: pixFees.custoMinimo,
        nonCardPixMdr: pixFeesOnline.mdr,
        nonCardPixCeilingFee: pixFeesOnline.custoMaximo,
        nonCardPixMinimumCostFee: pixFeesOnline.custoMinimo,
        eventualAnticipationFee: pixFees.antecipacao, // Usando o valor do POS para antecipação
      };

      console.log("Dados do merchant price para atualizar:", merchantPriceData);

      await updateMerchantPriceFormAction(merchantPriceData);

      feeData.forEach((group) => {
        console.log("Processando grupo:", group);

        // Crédito à vista
        if (group.transactions.credit.vista?.id) {
          transactionUpdates.push({
            id: group.transactions.credit.vista.id,
            data: {
              cardTransactionMdr:
                group.transactions.credit.vista.mdr ||
                group.transactions.credit.vista.cardTransactionMdr,
              nonCardTransactionMdr:
                group.transactions.credit.vista.nonCardTransactionMdr,
            },
          });
        }

        // Crédito 2-6x
        if (group.transactions.credit.parcela2_6?.id) {
          transactionUpdates.push({
            id: group.transactions.credit.parcela2_6.id,
            data: {
              cardTransactionMdr:
                group.transactions.credit.parcela2_6.mdr ||
                group.transactions.credit.parcela2_6.cardTransactionMdr,
              nonCardTransactionMdr:
                group.transactions.credit.parcela2_6.nonCardTransactionMdr,
            },
          });
        }

        // Crédito 7-12x
        if (group.transactions.credit.parcela7_12?.id) {
          transactionUpdates.push({
            id: group.transactions.credit.parcela7_12.id,
            data: {
              cardTransactionMdr:
                group.transactions.credit.parcela7_12.mdr ||
                group.transactions.credit.parcela7_12.cardTransactionMdr,
              nonCardTransactionMdr:
                group.transactions.credit.parcela7_12.nonCardTransactionMdr,
            },
          });
        }

        // Débito
        if (group.transactions.debit?.id) {
          transactionUpdates.push({
            id: group.transactions.debit.id,
            data: {
              cardTransactionMdr:
                group.transactions.debit.mdr ||
                group.transactions.debit.cardTransactionMdr,
              nonCardTransactionMdr:
                group.transactions.debit.nonCardTransactionMdr,
            },
          });
        }

        // Pré-pago
        if (group.transactions.prepaid?.id) {
          transactionUpdates.push({
            id: group.transactions.prepaid.id,
            data: {
              cardTransactionMdr:
                group.transactions.prepaid.mdr ||
                group.transactions.prepaid.cardTransactionMdr,
              nonCardTransactionMdr:
                group.transactions.prepaid.nonCardTransactionMdr,
            },
          });
        }
      });

      console.log("Transaction updates preparados:", transactionUpdates);

      // Executar updates de transaction prices
      if (transactionUpdates.length > 0) {
        await updateMultipleTransactionPricesFormAction(transactionUpdates);
      }

      toast.success("Taxas atualizadas com sucesso!");
      setIsEditing(false);

      // Recarregar dados
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar taxas:", error);
      toast.error("Erro ao atualizar taxas");
    }
  };

  // Função para buscar dados da fee selecionada
  const handleFeeSelection = async (feeId: string) => {
    setSelectedFeeId(feeId);
    const fee = availableFees.find((f) => f.id === feeId);
    if (fee) {
      setSelectedFee(fee);
    }
  };

  // Função para criar merchantPrice a partir da fee selecionada
  const handleCreateMerchantPrice = async () => {
    if (!selectedFee || !merchantId) {
      toast.error("Fee ou merchant não selecionado");
      return;
    }

    try {
      setIsCreatingMerchantPrice(true);

      const result = await createMerchantPriceFromFeeAction({
        feeId: selectedFee.id,
        merchantId: merchantId,
      });

      if (result.success) {
        toast.success("Taxa atribuída ao estabelecimento com sucesso!");

        // 🎯 PASSO FINAL: Buscar TODOS os dados do banco local e enviar para API
        /* try {
         

          // GET: Buscar dados completos do merchant do banco local
         
          const merchantAPIData =
            await buscarMerchantCompletoRealParaAPI(merchantId);
          console.log("merchantAPIData", merchantAPIData);
          if (!merchantAPIData) {
            throw new Error(
              "Merchant não encontrado ou dados incompletos no banco local"
            );
          }

          console.log("✅ Dados completos obtidos do banco local:", {
            merchantData: !!merchantAPIData.name,
            addressData: !!merchantAPIData.address,
            contactsData: merchantAPIData.contacts?.length || 0,
            bankAccountData: !!merchantAPIData.merchantBankAccount,
            merchantPriceData: !!merchantAPIData.merchantPrice,
            priceGroupsData:
              merchantAPIData.merchantPrice?.listMerchantPriceGroup?.length ||
              0,
          });

          // POST: Enviar todos os dados para API
          console.log("📤 Enviando dados completos para API...");
          const apiResponse = await InsertMerchant1(merchantAPIData);
          console.log("✅ Resposta da API:", apiResponse);

          if (apiResponse && apiResponse.slug) {
            toast.success(
              `🎉 Estabelecimento cadastrado com sucesso na API! Slug: ${apiResponse.slug}`
            );
          } else {
            toast.success(
              "Taxa atribuída com sucesso! No entanto, não foi possível obter confirmação da API."
            );
          }
        } catch (apiError) {
          console.error(
            "❌ Erro ao enviar merchant completo para API:",
            apiError
          );
          toast.error(
            "Taxa atribuída com sucesso, mas houve um erro ao enviar para API. Verifique o console para mais detalhes."
          );
          
        }
*/
        // Avançar para a próxima aba (documents)
        if (activeTab && setActiveTab && merchantId) {
          refreshPage(merchantId);
        } else {
          // Fallback: recarregar a página se não tiver props de navegação
          window.location.reload();
        }
      } else {
        toast.error("Erro ao atribuir taxa ao estabelecimento");
      }
    } catch (error) {
      console.error("Erro ao criar merchantPrice:", error);
      toast.error("Erro ao atribuir taxa ao estabelecimento");
    } finally {
      setIsCreatingMerchantPrice(false);
    }
  };

  useEffect(() => {
    console.log("Todos merchantprices:", merchantprice);

    if (merchantprice) {
      // Processar dados para a aba "todas"
      const groupsToShow = merchantprice.reduce((acc: any[], mp) => {
        const groups = mp.merchantpricegroup || [];
        return [...acc, ...groups];
      }, []);

      // Remover duplicatas baseadas no nome da bandeira
      const uniqueGroups = Array.from(
        new Map(groupsToShow.map((group) => [group.name, group])).values()
      );

      // Organizar dados para cada aba
      const organizedAllData = uniqueGroups.map(organizeTransactions);

      setFeeData(organizedAllData);
    }
  }, [merchantprice]);

  // Se não há merchantPriceId, mostrar seleção de fee
  if (showFeeSelection) {
    return (
      <FeeSelectionView
        availableFees={availableFees}
        selectedFeeId={selectedFeeId}
        selectedFee={selectedFee}
        isCreatingMerchantPrice={isCreatingMerchantPrice}
        onFeeSelection={handleFeeSelection}
        onCreateMerchantPrice={handleCreateMerchantPrice}
        onCancel={() => {
          setSelectedFeeId("");
          setSelectedFee(null);
        }}
      />
    );
  }

  return (
    <TaxManagementView
      feeData={feeData}
      pixFees={pixFees}
      pixFeesOnline={pixFeesOnline}
      selectedTab={selectedTab}
      isEditing={isEditing}
      permissions={permissions}
      onTabChange={setSelectedTab}
      onStartEditing={() => setIsEditing(true)}
      onCancelEditing={() => setIsEditing(false)}
      onSubmit={form.handleSubmit(onSubmit)}
      onFeeDataChange={setFeeData}
      onPixFeeChange={handlePixFeeChange}
    />
  );
}
