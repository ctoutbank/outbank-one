"use client";

import { PercentageInput } from "@/components/percentage-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  saveMerchantPricingAction,
  updatePixConfigAction,
} from "@/features/newTax/_actions/pricing-formActions";
import type { FeeData } from "@/features/newTax/server/fee-db";
import { FeeProductTypeList } from "@/lib/lookuptables/lookuptables";
import { brandList } from "@/lib/lookuptables/lookuptables-transactions";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { toast } from "sonner";

// Interface para os tipos de produtos de pagamento com informações adicionais
interface ExtendedFeeProductType {
  value: string;
  label: string;
  transactionFeeStart: string;
  transactionFeeEnd: string;
  hasInstallments?: boolean;
  installmentRange?: [number, number];
}

// Interface para grupos de pagamento
interface PaymentGroup {
  id: string;
  selectedCards: string[];
  modes: {
    [key: string]: {
      expanded: boolean;
      installments?: {
        [key: string]: {
          presentIntermediation: string;
          notPresentIntermediation: string;
          presentAnticipation: string;
          notPresentAnticipation: string;
          presentTransaction: string;
          notPresentTransaction: string;
        };
      };
      presentIntermediation: string;
      notPresentIntermediation: string;
      presentAnticipation: string;
      notPresentAnticipation: string;
      presentTransaction: string;
      notPresentTransaction: string;
    };
  };
}

interface PaymentConfigFormCompulsoryProps {
  fee: FeeData;
  hideButtons?: boolean;
  feeFieldErrors?: Record<string, string>;
  minValuesMap?: Record<string, any>;
}

type ModeField =
  | "presentIntermediation"
  | "notPresentIntermediation"
  | "presentAnticipation"
  | "notPresentAnticipation"
  | "presentTransaction"
  | "notPresentTransaction";

type ModeId = string;

// Determinar se um modo tem parcelas e qual o intervalo
function getExtendedProductType(
  mode: (typeof FeeProductTypeList)[number]
): ExtendedFeeProductType {
  const isInstallment = mode.value.includes("CREDIT_INSTALLMENTS");

  if (isInstallment) {
    if (mode.value === "CREDIT_INSTALLMENTS_2_TO_6") {
      return {
        ...mode,
        hasInstallments: true,
        installmentRange: [2, 6],
      };
    } else if (mode.value === "CREDIT_INSTALLMENTS_7_TO_12") {
      return {
        ...mode,
        hasInstallments: true,
        installmentRange: [7, 12],
      };
    }
  }

  return {
    ...mode,
    hasInstallments: false,
  };
}

// Função para obter imagem do cartão pelo nome
function getCardImage(cardName: string): string {
  const cardMap: { [key: string]: string } = {
    MASTERCARD: "/mastercard.svg",
    VISA: "/visa.svg",
    ELO: "/elo.svg",
    AMERICAN_EXPRESS: "/american-express.svg",
    HIPERCARD: "/hipercard.svg",
    AMEX: "/american-express.svg",
    CABAL: "/cabal.svg",
  };
  return cardMap[cardName] || "";
}

// Função utilitária para saber se o campo de antecipação deve ser desabilitado
function isAnticipationDisabled(modeValue: string) {
  return (
    modeValue === "DEBIT" ||
    modeValue === "VOUCHER" ||
    modeValue === "PREPAID_CREDIT"
  );
}

// Criar função shouldDisableMainModeInput para desabilitar apenas o campo principal quando expandido
function shouldDisableMainModeInput(
  modeId: string,
  isExpanded: boolean,
  isInstallmentField?: boolean
) {
  if (isInstallmentField) return false;
  return (
    (modeId === "CREDIT_INSTALLMENTS_2_TO_6" ||
      modeId === "CREDIT_INSTALLMENTS_7_TO_12") &&
    isExpanded
  );
}

// Criar objeto de parcelas para um modo
function createInstallmentsObject(mode: ExtendedFeeProductType) {
  if (!mode.installmentRange) return {};

  return Array.from(
    {
      length: mode.installmentRange[1] - mode.installmentRange[0] + 1,
    },
    (_, i) => i + mode.installmentRange![0]
  ).reduce((acc, installment) => {
    acc[installment] = {
      presentIntermediation: "",
      notPresentIntermediation: "",
      presentAnticipation: "",
      notPresentAnticipation: "",
      presentTransaction: "",
      notPresentTransaction: "",
    };
    return acc;
  }, {} as any);
}

// Inicializar um grupo de pagamento
function initializePaymentGroup(groupId: string): PaymentGroup {
  return {
    id: groupId,
    selectedCards: [],
    modes: FeeProductTypeList.reduce((acc, modeBase) => {
      const mode = getExtendedProductType(modeBase);
      acc[mode.value] = {
        expanded: false,
        presentIntermediation: "",
        notPresentIntermediation: "",
        presentAnticipation: "",
        notPresentAnticipation: "",
        presentTransaction: "",
        notPresentTransaction: "",
        ...(mode.hasInstallments && {
          installments: createInstallmentsObject(mode),
        }),
      };
      return acc;
    }, {} as any),
  };
}

export const PaymentConfigFormCompulsory = forwardRef<
  {
    getFormData: () => {
      pixConfig: any;
      groups: PaymentGroup[];
    };
  },
  PaymentConfigFormCompulsoryProps
>(function PaymentConfigFormCompulsory(
  { fee, hideButtons = false, feeFieldErrors = {} },
  ref
) {
  console.log("DADOS RECEBIDOS NO SUBFORMULÁRIO COMPULSORY:", fee);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [groups, setGroups] = useState<PaymentGroup[]>([
    initializePaymentGroup("group-1"),
  ]);

  const [pixConfig, setPixConfig] = useState({
    mdrPresent: fee.cardPixMdr?.replace(" %", "").replace(",", ".") || "",
    mdrNotPresent: fee.nonCardPixMdr?.replace(" %", "").replace(",", ".") || "",
    minCostPresent: fee.cardPixMinimumCostFee?.replace(",", ".") || "",
    minCostNotPresent: fee.nonCardPixMinimumCostFee?.replace(",", ".") || "",
    maxCostPresent: fee.cardPixCeilingFee?.replace(",", ".") || "",
    maxCostNotPresent: fee.nonCardPixCeilingFee?.replace(",", ".") || "",
  });

  // Carregar dados das bandeiras e tipos de produto quando o componente é montado
  useEffect(() => {
    if (fee?.feeBrand && fee.feeBrand.length > 0) {
      // Agrupar as bandeiras por idGroup
      const brandsByGroup = fee.feeBrand.reduce(
        (acc, brand) => {
          if (!acc[brand.idGroup]) {
            acc[brand.idGroup] = [];
          }
          acc[brand.idGroup].push(brand);
          return acc;
        },
        {} as Record<number, typeof fee.feeBrand>
      );

      // Criar um grupo para cada conjunto de bandeiras agrupadas
      const newGroups = Object.entries(brandsByGroup).map(
        ([, brands], index) => {
          const selectedCards = brands.map((brand) => brand.brand);
          const initialModes = FeeProductTypeList.reduce((acc, modeBase) => {
            const mode = getExtendedProductType(modeBase);
            acc[mode.value] = {
              expanded: false,
              presentIntermediation: "",
              notPresentIntermediation: "",
              presentAnticipation: "",
              notPresentAnticipation: "",
              presentTransaction: "",
              notPresentTransaction: "",
              ...(mode.hasInstallments && {
                installments: createInstallmentsObject(mode),
              }),
            };
            return acc;
          }, {} as any);

          // Preencher valores para cada modo de pagamento
          brands.forEach((brand) => {
            if (brand.feeBrandProductType?.length) {
              brand.feeBrandProductType.forEach((pt) => {
                const modeMapping = getModeMapping(pt.producttype);
                if (modeMapping) {
                  const { modeId, installment } = modeMapping;
                  // Buscar feeCredit correspondente
                  const feeCredit = fee.feeCredit?.find(
                    (fc: any) => fc.idFeeBrandProductType === pt.id
                  );
                  const presentAnticipation =
                    feeCredit?.compulsoryAnticipation || "";
                  const notPresentAnticipation =
                    feeCredit?.noCardCompulsoryAnticipation || "";
                  const presentIntermediation =
                    pt.cardTransactionMdr?.toString() || "";
                  const notPresentIntermediation =
                    pt.nonCardTransactionMdr?.toString() || "";
                  // Taxa de Intermediação = transação + antecipação
                  const presentTransaction = (
                    (Number.parseFloat(String(pt.cardTransactionMdr || "0")) ||
                      0) +
                    (Number.parseFloat(
                      String(feeCredit?.compulsoryAnticipation || "0")
                    ) || 0)
                  ).toFixed(2);
                  const notPresentTransaction = (
                    (Number.parseFloat(
                      String(pt.nonCardTransactionMdr || "0")
                    ) || 0) +
                    (Number.parseFloat(
                      String(feeCredit?.noCardCompulsoryAnticipation || "0")
                    ) || 0)
                  ).toFixed(2);
                  if (
                    installment !== undefined &&
                    initialModes[modeId]?.installments?.[installment]
                  ) {
                    // Para parcelamento específico
                    initialModes[modeId].installments[installment] = {
                      presentIntermediation,
                      notPresentIntermediation,
                      presentAnticipation,
                      notPresentAnticipation,
                      presentTransaction,
                      notPresentTransaction,
                    };
                    // Se qualquer campo da parcela estiver preenchido, expandir
                    if (
                      presentIntermediation ||
                      notPresentIntermediation ||
                      presentAnticipation ||
                      notPresentAnticipation ||
                      presentTransaction ||
                      notPresentTransaction
                    ) {
                      initialModes[modeId].expanded = true;
                    }
                  } else if (initialModes[modeId]) {
                    // Para modo sem parcelamento
                    initialModes[modeId].presentIntermediation =
                      presentIntermediation;
                    initialModes[modeId].notPresentIntermediation =
                      notPresentIntermediation;
                    initialModes[modeId].presentAnticipation =
                      presentAnticipation;
                    initialModes[modeId].notPresentAnticipation =
                      notPresentAnticipation;
                    initialModes[modeId].presentTransaction =
                      presentTransaction;
                    initialModes[modeId].notPresentTransaction =
                      notPresentTransaction;
                  }
                }
              });
            }
          });

          return {
            id: `group-${index + 1}`,
            selectedCards,
            modes: initialModes,
          };
        }
      );

      setGroups(newGroups);
    } else {
      setGroups([initializePaymentGroup("group-1")]);
    }

    // Atualizar configuração de PIX
    if (fee) {
      setPixConfig({
        mdrPresent: fee.cardPixMdr?.replace(" %", "").replace(",", ".") || "",
        mdrNotPresent:
          fee.nonCardPixMdr?.replace(" %", "").replace(",", ".") || "",
        minCostPresent: fee.cardPixMinimumCostFee?.replace(",", ".") || "",
        minCostNotPresent:
          fee.nonCardPixMinimumCostFee?.replace(",", ".") || "",
        maxCostPresent: fee.cardPixCeilingFee?.replace(",", ".") || "",
        maxCostNotPresent: fee.nonCardPixCeilingFee?.replace(",", ".") || "",
      });
    }
  }, [fee]);

  // Mapear tipo de produto para ID do modo e parcela
  function getModeMapping(
    producttype: string
  ): { modeId: string; installment?: number } | null {
    if (producttype === "Crédito à Vista") {
      return { modeId: "CREDIT" };
    } else if (producttype.startsWith("Crédito Parcelado (2 a 6")) {
      return { modeId: "CREDIT_INSTALLMENTS_2_TO_6" };
    } else if (producttype.startsWith("Crédito Parcelado (7 a 12")) {
      return { modeId: "CREDIT_INSTALLMENTS_7_TO_12" };
    } else if (/Crédito Parcelado $$(\d+) a \1 vezes$$/.test(producttype)) {
      // Match "Crédito Parcelado (N a N vezes)"
      const match = producttype.match(/Crédito Parcelado $$(\d+) a \1 vezes$$/);
      if (match) {
        const installment = Number.parseInt(match[1], 10);
        if (installment >= 2 && installment <= 6) {
          return { modeId: "CREDIT_INSTALLMENTS_2_TO_6", installment };
        }
        if (installment >= 7 && installment <= 12) {
          return { modeId: "CREDIT_INSTALLMENTS_7_TO_12", installment };
        }
      }
    } else if (producttype === "Débito") {
      return { modeId: "DEBIT" };
    } else if (producttype === "Voucher") {
      return { modeId: "VOUCHER" };
    } else if (producttype === "Pré-Pago") {
      return { modeId: "PREPAID_CREDIT" };
    }
    return null;
  }

  // Expor o método getFormData via ref para o componente pai
  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      pixConfig,
      groups: groups.map((group) => ({
        ...group,
        modes: Object.fromEntries(
          Object.entries(group.modes).map(([modeId, mode]) => {
            if (
              mode.installments &&
              (modeId === "CREDIT_INSTALLMENTS_2_TO_6" ||
                modeId === "CREDIT_INSTALLMENTS_7_TO_12")
            ) {
              if (mode.expanded) {
                // Se expandido, mantém installments
                return [modeId, mode];
              } else {
                // Se não expandido, remove installments
                // Criar um novo objeto com todas as propriedades exceto installments
                return [
                  modeId,
                  {
                    expanded: mode.expanded,
                    presentIntermediation: mode.presentIntermediation,
                    notPresentIntermediation: mode.notPresentIntermediation,
                    presentAnticipation: mode.presentAnticipation,
                    notPresentAnticipation: mode.notPresentAnticipation,
                    presentTransaction: mode.presentTransaction,
                    notPresentTransaction: mode.notPresentTransaction,
                  },
                ];
              }
            }
            return [modeId, mode];
          })
        ),
      })),
    }),
  }));

  // Funções para manipular grupos de pagamento
  function toggleCardSelection(
    groupIndex: number,
    cardId: string,
    checked?: boolean | "indeterminate"
  ) {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const group = newGroups[groupIndex];

      if (checked === undefined || checked === "indeterminate") {
        // Toggle baseado no estado atual
        if (group.selectedCards.includes(cardId)) {
          group.selectedCards = group.selectedCards.filter(
            (id) => id !== cardId
          );
        } else {
          group.selectedCards = [...group.selectedCards, cardId];
        }
      } else {
        // Definir baseado no valor de checked
        if (checked) {
          if (!group.selectedCards.includes(cardId)) {
            group.selectedCards = [...group.selectedCards, cardId];
          }
        } else {
          group.selectedCards = group.selectedCards.filter(
            (id) => id !== cardId
          );
        }
      }

      return newGroups;
    });
  }

  function toggleModeExpansion(groupIndex: number, modeId: string) {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      // Cópia profunda do grupo e do modo para garantir reatividade
      const group = {
        ...newGroups[groupIndex],
        modes: { ...newGroups[groupIndex].modes },
      };
      group.modes[modeId] = {
        ...group.modes[modeId],
        expanded: !group.modes[modeId].expanded,
      };
      newGroups[groupIndex] = group;
      return newGroups;
    });
  }

  function addNewGroup() {
    setGroups((prevGroups) => [
      ...prevGroups,
      initializePaymentGroup(`group-${prevGroups.length + 1}`),
    ]);
  }

  function removeGroup(groupIndex: number) {
    setGroups((prevGroups) =>
      prevGroups.filter((_, index) => index !== groupIndex)
    );
  }

  function handleInputChange(
    groupIndex: number,
    modeId: ModeId,
    field: ModeField,
    value: string,
    installment?: number
  ) {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const group = newGroups[groupIndex];

      if (
        installment !== undefined &&
        group.modes[modeId].installments?.[installment]
      ) {
        group.modes[modeId].installments![installment][field] = value;
      } else {
        group.modes[modeId][field] = value;
      }

      return newGroups;
    });
  }

  function handleSave() {
    setIsPending(true);

    // Log detalhado dos valores antes de salvar
    console.log(
      "[DEBUG] Salvando grupos (compulsory):",
      JSON.stringify(groups, null, 2)
    );

    Promise.all([
      updatePixConfigAction(fee.id, pixConfig),
      saveMerchantPricingAction(fee.id, groups),
    ])
      .then(() => {
        toast.success("Configurações salvas com sucesso");
        router.refresh();
      })
      .catch(() => {
        toast.error("Erro ao salvar configurações");
      })
      .finally(() => {
        setIsPending(false);
      });
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-0">
          {/* Grupos de Pagamento */}
          {groups.map((group, groupIndex) => (
            <Card
              key={group.id}
              className="mb-6 rounded-lg border border-gray-200 shadow-sm"
            >
              <CardContent className="p-0">
                {/* Cabeçalho do grupo com seleção de bandeiras */}
                <div className="p-3 border-b flex items-center justify-between bg-gray-50 rounded-t-lg">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-medium mr-2">Bandeiras:</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="justify-between min-w-[200px]"
                        >
                          {group.selectedCards.length > 0
                            ? `${group.selectedCards.length} bandeira(s) selecionada(s)`
                            : "Selecionar bandeiras"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar bandeira..." />
                          <CommandList>
                            <CommandEmpty>
                              Nenhuma bandeira encontrada.
                            </CommandEmpty>
                            <CommandGroup>
                              {brandList.map((card) => {
                                // Verificar se a bandeira já está selecionada em algum outro grupo
                                const isSelectedInOtherGroup = groups.some(
                                  (g, idx) =>
                                    idx !== groupIndex &&
                                    g.selectedCards.includes(card.value)
                                );

                                if (
                                  isSelectedInOtherGroup &&
                                  !group.selectedCards.includes(card.value)
                                ) {
                                  // Se estiver selecionada em outro grupo, desabilitar
                                  return (
                                    <CommandItem
                                      key={card.value}
                                      disabled
                                      className="opacity-50"
                                    >
                                      <div className="flex items-center">
                                        <img
                                          src={
                                            getCardImage(card.value) ||
                                            "/placeholder.svg"
                                          }
                                          alt={card.label}
                                          className="h-5 w-5 mr-2 grayscale rounded"
                                        />
                                        {card.label}
                                      </div>
                                    </CommandItem>
                                  );
                                }

                                return (
                                  <CommandItem
                                    key={card.value}
                                    value={card.value}
                                    onSelect={() => {
                                      toggleCardSelection(
                                        groupIndex,
                                        card.value,
                                        !group.selectedCards.includes(
                                          card.value
                                        )
                                      );
                                    }}
                                  >
                                    <div className="flex items-center">
                                      <img
                                        src={
                                          getCardImage(card.value) ||
                                          "/placeholder.svg"
                                        }
                                        alt={card.label}
                                        className="h-5 w-5 mr-2 rounded"
                                      />
                                      {card.label}
                                    </div>
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        group.selectedCards.includes(card.value)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {group.selectedCards.map((cardId) => {
                        const card = brandList.find((c) => c.value === cardId);
                        return (
                          <Badge
                            key={cardId}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <img
                              src={getCardImage(cardId) || "/placeholder.svg"}
                              alt={card?.label || cardId}
                              className="h-8 w-8 rounded"
                            />
                            {card?.label || cardId}
                            <button
                              type="button"
                              className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                              onClick={() =>
                                toggleCardSelection(groupIndex, cardId, false)
                              }
                            >
                              ×
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {groupIndex > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeGroup(groupIndex)}
                      >
                        Remover
                      </Button>
                    )}
                    {groupIndex === groups.length - 1 && (
                      <Button variant="outline" size="sm" onClick={addNewGroup}>
                        Novo Grupo
                      </Button>
                    )}
                  </div>
                </div>

                {/* Cabeçalho da tabela de modos */}
                <div className="grid grid-cols-7 border-b">
                  <div className="p-3 font-medium border-r bg-orange-50">
                    Modo
                  </div>
                  <div className="p-3 font-medium text-center border-r bg-orange-50 col-span-3">
                    Cartão Presente
                  </div>
                  <div className="p-3 font-medium text-center bg-orange-50 col-span-3">
                    Cartão Não Presente
                  </div>
                </div>

                <div className="grid grid-cols-7 border-b">
                  <div className="p-3 border-r"></div>
                  <div className="p-3 font-medium text-center border-r">
                    Transação presente (%)
                  </div>
                  <div className="p-3 font-medium text-center border-r">
                    Taxa de Antecipação presente (% a.m.)
                  </div>
                  <div className="p-3 font-medium text-center border-r">
                    Taxa de Intermediação presente (%)
                  </div>
                  <div className="p-3 font-medium text-center border-r">
                    Transação não presente (%)
                  </div>
                  <div className="p-3 font-medium text-center border-r">
                    Taxa de Antecipação não presente (% a.m.)
                  </div>
                  <div className="p-3 font-medium text-center">
                    Taxa de Intermediação não presente (%)
                  </div>
                </div>

                {/* Modos de pagamento */}
                {FeeProductTypeList.map((modeBase) => {
                  const mode = getExtendedProductType(modeBase);
                  return (
                    <div key={`${group.id}-${mode.value}`}>
                      {/* Linha principal do modo */}
                      <div className="grid grid-cols-7 border-b">
                        <div className="p-3 border-r flex items-center justify-between">
                          <span>{mode.label}</span>
                          {mode.hasInstallments && (
                            <button
                              type="button"
                              onClick={() =>
                                toggleModeExpansion(groupIndex, mode.value)
                              }
                              className="focus:outline-none"
                            >
                              {group.modes[mode.value].expanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                        <div className="p-3 border-r flex items-center justify-center">
                          <div className="flex items-center justify-center">
                            <PercentageInput
                              value={
                                group.modes[mode.value].presentIntermediation ||
                                ""
                              }
                              onChange={(value) =>
                                handleInputChange(
                                  groupIndex,
                                  mode.value,
                                  "presentIntermediation",
                                  value
                                )
                              }
                              placeholder="%"
                              className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                              disabled={shouldDisableMainModeInput(
                                mode.value,
                                group.modes[mode.value].expanded
                              )}
                            />
                            {feeFieldErrors?.[
                              `${group.id}-${mode.value}-presentIntermediation`
                            ] && (
                              <span className="ml-2 text-xs text-red-500">
                                mínimo permitido (
                                {(() => {
                                  const err =
                                    feeFieldErrors[
                                      `${group.id}-${mode.value}-presentIntermediation`
                                    ];
                                  const match = err.match(/([\d.,]+)%/);
                                  return match ? match[1] + "%" : "";
                                })()}
                                )
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-3 border-r flex items-center justify-center">
                          <div className="flex items-center justify-center">
                            <PercentageInput
                              value={
                                group.modes[mode.value].presentAnticipation ||
                                ""
                              }
                              onChange={(value) =>
                                handleInputChange(
                                  groupIndex,
                                  mode.value,
                                  "presentAnticipation",
                                  value
                                )
                              }
                              placeholder="% a.m."
                              className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                              disabled={
                                shouldDisableMainModeInput(
                                  mode.value,
                                  group.modes[mode.value].expanded
                                ) || isAnticipationDisabled(mode.value)
                              }
                            />
                            {feeFieldErrors?.[
                              `${group.id}-${mode.value}-presentAnticipation`
                            ] && (
                              <span className="text-xs text-red-500">
                                {
                                  feeFieldErrors[
                                    `${group.id}-${mode.value}-presentAnticipation`
                                  ]
                                }
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-3 border-r flex items-center justify-center">
                          <div className="flex items-center justify-center">
                            <PercentageInput
                              value={(() => {
                                const transPresente = Number.parseFloat(
                                  group.modes[mode.value]
                                    .presentIntermediation || "0"
                                );
                                const antecPresente = Number.parseFloat(
                                  group.modes[mode.value].presentAnticipation ||
                                    "0"
                                );
                                return transPresente + antecPresente > 0
                                  ? (transPresente + antecPresente).toFixed(2)
                                  : "";
                              })()}
                              disabled
                              onChange={() => {}}
                              placeholder="%"
                              className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition opacity-70 cursor-default"
                            />
                            {feeFieldErrors?.[
                              `${group.id}-${mode.value}-presentTransaction`
                            ] && (
                              <span className="ml-2 text-xs text-red-500">
                                mínimo permitido (
                                {(() => {
                                  const err =
                                    feeFieldErrors[
                                      `${group.id}-${mode.value}-presentTransaction`
                                    ];
                                  const match = err.match(/([\d.,]+)%/);
                                  return match ? match[1] + "%" : "";
                                })()}
                                )
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-3 border-r flex items-center justify-center">
                          <div className="flex items-center justify-center">
                            <PercentageInput
                              value={
                                group.modes[mode.value]
                                  .notPresentIntermediation || ""
                              }
                              onChange={(value) =>
                                handleInputChange(
                                  groupIndex,
                                  mode.value,
                                  "notPresentIntermediation",
                                  value
                                )
                              }
                              placeholder="%"
                              className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                              disabled={shouldDisableMainModeInput(
                                mode.value,
                                group.modes[mode.value].expanded
                              )}
                            />
                            {feeFieldErrors?.[
                              `${group.id}-${mode.value}-notPresentIntermediation`
                            ] && (
                              <span className="ml-2 text-xs text-red-500">
                                mínimo permitido (
                                {(() => {
                                  const err =
                                    feeFieldErrors[
                                      `${group.id}-${mode.value}-notPresentIntermediation`
                                    ];
                                  const match = err.match(/([\d.,]+)%/);
                                  return match ? match[1] + "%" : "";
                                })()}
                                )
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-3 border-r flex items-center justify-center">
                          <div className="flex items-center justify-center">
                            <PercentageInput
                              value={
                                group.modes[mode.value]
                                  .notPresentAnticipation || ""
                              }
                              onChange={(value) =>
                                handleInputChange(
                                  groupIndex,
                                  mode.value,
                                  "notPresentAnticipation",
                                  value
                                )
                              }
                              placeholder="% a.m."
                              className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                              disabled={
                                shouldDisableMainModeInput(
                                  mode.value,
                                  group.modes[mode.value].expanded
                                ) || isAnticipationDisabled(mode.value)
                              }
                            />
                            {feeFieldErrors?.[
                              `${group.id}-${mode.value}-notPresentAnticipation`
                            ] && (
                              <span className="text-xs text-red-500">
                                {
                                  feeFieldErrors[
                                    `${group.id}-${mode.value}-notPresentAnticipation`
                                  ]
                                }
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-3 flex items-center justify-center">
                          <PercentageInput
                            value={(() => {
                              const transNaoPresente = Number.parseFloat(
                                group.modes[mode.value]
                                  .notPresentIntermediation || "0"
                              );
                              const antecNaoPresente = Number.parseFloat(
                                group.modes[mode.value]
                                  .notPresentAnticipation || "0"
                              );
                              return transNaoPresente + antecNaoPresente > 0
                                ? (transNaoPresente + antecNaoPresente).toFixed(
                                    2
                                  )
                                : "";
                            })()}
                            disabled
                            onChange={() => {}}
                            placeholder="%"
                            className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition opacity-70 cursor-default"
                          />
                        </div>
                      </div>

                      {/* Linhas de parcelamento se expandido */}
                      {mode.hasInstallments &&
                        group.modes[mode.value].expanded &&
                        mode.installmentRange &&
                        Array.from(
                          {
                            length:
                              mode.installmentRange[1] -
                              mode.installmentRange[0] +
                              1,
                          },
                          (_, i) => i + mode.installmentRange![0]
                        ).map((installment) => (
                          <div
                            key={`${group.id}-${mode.value}-${installment}`}
                            className="grid grid-cols-7 border-b"
                          >
                            <div className="p-3 border-r flex items-center justify-between">{`Crédito Parcelado (${installment} vezes)`}</div>
                            <div className=" p-3 border-r flex items-center justify-center">
                              <PercentageInput
                                value={
                                  group.modes[mode.value].installments?.[
                                    installment
                                  ]?.presentIntermediation || ""
                                }
                                onChange={(value) =>
                                  handleInputChange(
                                    groupIndex,
                                    mode.value,
                                    "presentIntermediation",
                                    value,
                                    installment
                                  )
                                }
                                placeholder="%"
                                className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                              />
                              {feeFieldErrors?.[
                                `${group.id}-${mode.value}-presentIntermediation-${installment}`
                              ] && (
                                <span className="text-xs text-red-500">
                                  {
                                    feeFieldErrors[
                                      `${group.id}-${mode.value}-presentIntermediation-${installment}`
                                    ]
                                  }
                                </span>
                              )}
                            </div>
                            <div className="p-3 border-r flex items-center justify-center">
                              <PercentageInput
                                value={
                                  group.modes[mode.value].installments?.[
                                    installment
                                  ]?.presentAnticipation || ""
                                }
                                onChange={(value) =>
                                  handleInputChange(
                                    groupIndex,
                                    mode.value,
                                    "presentAnticipation",
                                    value,
                                    installment
                                  )
                                }
                                placeholder="% a.m."
                                className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                                disabled={isAnticipationDisabled(mode.value)}
                              />
                              {feeFieldErrors?.[
                                `${group.id}-${mode.value}-presentAnticipation-${installment}`
                              ] && (
                                <span className="text-xs text-red-500">
                                  {
                                    feeFieldErrors[
                                      `${group.id}-${mode.value}-presentAnticipation-${installment}`
                                    ]
                                  }
                                </span>
                              )}
                            </div>
                            <div className="p-3 border-r flex items-center justify-center">
                              <PercentageInput
                                value={(() => {
                                  const transPresente = Number.parseFloat(
                                    group.modes[mode.value].installments?.[
                                      installment
                                    ]?.presentIntermediation || "0"
                                  );
                                  const antecPresente = Number.parseFloat(
                                    group.modes[mode.value].installments?.[
                                      installment
                                    ]?.presentAnticipation || "0"
                                  );
                                  return transPresente + antecPresente > 0
                                    ? (transPresente + antecPresente).toFixed(2)
                                    : "";
                                })()}
                                disabled
                                onChange={() => {}}
                                placeholder="%"
                                className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition opacity-70 cursor-default"
                              />
                            </div>
                            <div className="p-3 border-r flex items-center justify-center">
                              <PercentageInput
                                value={
                                  group.modes[mode.value].installments?.[
                                    installment
                                  ]?.notPresentIntermediation || ""
                                }
                                onChange={(value) =>
                                  handleInputChange(
                                    groupIndex,
                                    mode.value,
                                    "notPresentIntermediation",
                                    value,
                                    installment
                                  )
                                }
                                placeholder="%"
                                className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                              />
                              {feeFieldErrors?.[
                                `${group.id}-${mode.value}-notPresentIntermediation-${installment}`
                              ] && (
                                <span className="text-xs text-red-500">
                                  {
                                    feeFieldErrors[
                                      `${group.id}-${mode.value}-notPresentIntermediation-${installment}`
                                    ]
                                  }
                                </span>
                              )}
                            </div>
                            <div className="p-3 border-r flex items-center justify-center">
                              <PercentageInput
                                value={
                                  group.modes[mode.value].installments?.[
                                    installment
                                  ]?.notPresentAnticipation || ""
                                }
                                onChange={(value) =>
                                  handleInputChange(
                                    groupIndex,
                                    mode.value,
                                    "notPresentAnticipation",
                                    value,
                                    installment
                                  )
                                }
                                placeholder="% a.m."
                                className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                                disabled={isAnticipationDisabled(mode.value)}
                              />
                              {feeFieldErrors?.[
                                `${group.id}-${mode.value}-notPresentAnticipation-${installment}`
                              ] && (
                                <span className="text-xs text-red-500">
                                  {
                                    feeFieldErrors[
                                      `${group.id}-${mode.value}-notPresentAnticipation-${installment}`
                                    ]
                                  }
                                </span>
                              )}
                            </div>
                            <div className="p-3 flex items-center justify-center">
                              <PercentageInput
                                value={(() => {
                                  const transNaoPresente = Number.parseFloat(
                                    group.modes[mode.value].installments?.[
                                      installment
                                    ]?.notPresentIntermediation || "0"
                                  );
                                  const antecNaoPresente = Number.parseFloat(
                                    group.modes[mode.value].installments?.[
                                      installment
                                    ]?.notPresentAnticipation || "0"
                                  );
                                  return transNaoPresente + antecNaoPresente > 0
                                    ? (
                                        transNaoPresente + antecNaoPresente
                                      ).toFixed(2)
                                    : "";
                                })()}
                                disabled
                                onChange={() => {}}
                                placeholder="%"
                                className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition opacity-70 cursor-default"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}

          {!hideButtons && (
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => router.push("/portal/pricing")}
                className="rounded-lg px-6 py-2"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isPending}
                className="rounded-lg px-6 py-2"
              >
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
