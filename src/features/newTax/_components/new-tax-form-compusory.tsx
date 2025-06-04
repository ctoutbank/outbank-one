"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  saveMerchantPricingAction,
  updatePixConfigAction,
} from "@/features/newTax/_actions/pricing-formActions";
import type { FeeData } from "@/features/newTax/server/fee-db";
import { FeeProductTypeList } from "@/lib/lookuptables/lookuptables";
import { brandList } from "@/lib/lookuptables/lookuptables-transactions";
import { ChevronDown, ChevronUp } from "lucide-react";
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

export const PaymentConfigFormCompulsory = forwardRef<
  {
    getFormData: () => {
      pixConfig: any;
      groups: PaymentGroup[];
    };
  },
  PaymentConfigFormCompulsoryProps
>(function PaymentConfigFormCompulsory({ fee, hideButtons = false }, ref) {
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

          // Inicializar modos de pagamento vazios
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

                  if (
                    installment !== undefined &&
                    initialModes[modeId]?.installments?.[installment]
                  ) {
                    // Para parcelamento específico
                    initialModes[modeId].installments[installment] = {
                      presentIntermediation:
                        pt.cardTransactionMdr?.toString() || "",
                      notPresentIntermediation:
                        pt.nonCardTransactionMdr?.toString() || "",
                      presentTransaction:
                        pt.cardTransactionFee?.toString() || "",
                      notPresentTransaction:
                        pt.nonCardTransactionFee?.toString() || "",
                      presentAnticipation: "0",
                      notPresentAnticipation: "0",
                    };
                  } else if (initialModes[modeId]) {
                    // Para modo sem parcelamento
                    initialModes[modeId].presentIntermediation =
                      pt.cardTransactionMdr?.toString() || "";
                    initialModes[modeId].notPresentIntermediation =
                      pt.nonCardTransactionMdr?.toString() || "";
                    initialModes[modeId].presentTransaction =
                      pt.cardTransactionFee?.toString() || "";
                    initialModes[modeId].notPresentTransaction =
                      pt.nonCardTransactionFee?.toString() || "";
                    initialModes[modeId].presentAnticipation = "0";
                    initialModes[modeId].notPresentAnticipation = "0";
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

      if (newGroups.length > 0) {
        setGroups(newGroups);
      }
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
    } else if (producttype.includes("Crédito Parcelado (2 a 6")) {
      const match = producttype.match(/\((\d+)/);
      return {
        modeId: "CREDIT_INSTALLMENTS_2_TO_6",
        installment: match ? parseInt(match[1]) : undefined,
      };
    } else if (producttype.includes("Crédito Parcelado (7 a 12")) {
      const match = producttype.match(/\((\d+)/);
      return {
        modeId: "CREDIT_INSTALLMENTS_7_TO_12",
        installment: match ? parseInt(match[1]) : undefined,
      };
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
      groups,
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
      newGroups[groupIndex].modes[modeId].expanded =
        !newGroups[groupIndex].modes[modeId].expanded;
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
      <Card>
        <CardContent className="p-0">
          {/* Grupos de Pagamento */}
          {groups.map((group, groupIndex) => (
            <Card key={group.id} className="mb-6">
              <CardContent className="p-0">
                {/* Cabeçalho do grupo com seleção de bandeiras */}
                <div className="p-3 border-b flex items-center justify-between bg-gray-50">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Bandeiras:</span>
                    <div className="flex gap-2">
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
                          // Se estiver selecionada em outro grupo e não neste, mostrar desabilitada
                          return (
                            <div
                              key={card.value}
                              className="flex items-center opacity-50"
                            >
                              <Checkbox
                                id={`${group.id}-${card.value}`}
                                checked={false}
                                disabled={true}
                                className="mr-1"
                              />
                              <label
                                htmlFor={`${group.id}-${card.value}`}
                                className="flex items-center cursor-not-allowed"
                              >
                                <img
                                  src={getCardImage(card.value)}
                                  alt={card.label}
                                  className="h-5 w-5 mr-1 grayscale"
                                />
                                {card.label}
                              </label>
                            </div>
                          );
                        }

                        // Caso contrário, mostrar normalmente
                        return (
                          <div key={card.value} className="flex items-center">
                            <Checkbox
                              id={`${group.id}-${card.value}`}
                              checked={group.selectedCards.includes(card.value)}
                              onCheckedChange={(checked) => {
                                toggleCardSelection(
                                  groupIndex,
                                  card.value,
                                  checked
                                );
                              }}
                              className="mr-1"
                            />
                            <label
                              htmlFor={`${group.id}-${card.value}`}
                              className="flex items-center cursor-pointer"
                            >
                              <img
                                src={getCardImage(card.value)}
                                alt={card.label}
                                className="h-5 w-5 mr-1"
                              />
                              {card.label}
                            </label>
                          </div>
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
                    Taxa de Intermediação (%)
                  </div>
                  <div className="p-3 font-medium text-center border-r">
                    Taxa de Antecipação (% a.m.)
                  </div>
                  <div className="p-3 font-medium text-center border-r">
                    Transação (%)
                  </div>
                  <div className="p-3 font-medium text-center border-r">
                    Taxa de Intermediação (%)
                  </div>
                  <div className="p-3 font-medium text-center border-r">
                    Taxa de Antecipação (% a.m.)
                  </div>
                  <div className="p-3 font-medium text-center">
                    Transação (%)
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
                          <Input
                            type="text"
                            className="w-16 text-right"
                            value={
                              group.modes[mode.value].presentIntermediation
                            }
                            onChange={(e) =>
                              handleInputChange(
                                groupIndex,
                                mode.value,
                                "presentIntermediation",
                                e.target.value
                              )
                            }
                          />
                          <span className="ml-1">%</span>
                        </div>
                        <div className="p-3 border-r flex items-center justify-center">
                          <Input
                            type="text"
                            className="w-16 text-right"
                            value={group.modes[mode.value].presentAnticipation}
                            onChange={(e) =>
                              handleInputChange(
                                groupIndex,
                                mode.value,
                                "presentAnticipation",
                                e.target.value
                              )
                            }
                          />
                          <span className="ml-1">% a.m.</span>
                        </div>
                        <div className="p-3 border-r flex items-center justify-center">
                          <Input
                            type="text"
                            className="w-16 text-right"
                            value={group.modes[mode.value].presentTransaction}
                            onChange={(e) =>
                              handleInputChange(
                                groupIndex,
                                mode.value,
                                "presentTransaction",
                                e.target.value
                              )
                            }
                          />
                          <span className="ml-1">%</span>
                        </div>
                        <div className="p-3 border-r flex items-center justify-center">
                          <Input
                            type="text"
                            className="w-16 text-right"
                            value={
                              group.modes[mode.value].notPresentIntermediation
                            }
                            onChange={(e) =>
                              handleInputChange(
                                groupIndex,
                                mode.value,
                                "notPresentIntermediation",
                                e.target.value
                              )
                            }
                          />
                          <span className="ml-1">%</span>
                        </div>
                        <div className="p-3 border-r flex items-center justify-center">
                          <Input
                            type="text"
                            className="w-16 text-right"
                            value={
                              group.modes[mode.value].notPresentAnticipation
                            }
                            onChange={(e) =>
                              handleInputChange(
                                groupIndex,
                                mode.value,
                                "notPresentAnticipation",
                                e.target.value
                              )
                            }
                          />
                          <span className="ml-1">% a.m.</span>
                        </div>
                        <div className="p-3 flex items-center justify-center">
                          <Input
                            type="text"
                            className="w-16 text-right"
                            value={
                              group.modes[mode.value].notPresentTransaction
                            }
                            onChange={(e) =>
                              handleInputChange(
                                groupIndex,
                                mode.value,
                                "notPresentTransaction",
                                e.target.value
                              )
                            }
                          />
                          <span className="ml-1">%</span>
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
                            className="grid grid-cols-7 border-b bg-orange-50"
                          >
                            <div className="p-3 border-r pl-8">{`Crédito Parcelado (${installment} vezes)`}</div>
                            <div className="p-3 border-r flex items-center justify-center">
                              <Input
                                type="text"
                                className="w-16 text-right"
                                value={
                                  group.modes[mode.value].installments?.[
                                    installment
                                  ]?.presentIntermediation || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    groupIndex,
                                    mode.value,
                                    "presentIntermediation",
                                    e.target.value,
                                    installment
                                  )
                                }
                              />
                              <span className="ml-1">%</span>
                            </div>
                            <div className="p-3 border-r flex items-center justify-center">
                              <Input
                                type="text"
                                className="w-16 text-right"
                                value={
                                  group.modes[mode.value].installments?.[
                                    installment
                                  ]?.presentAnticipation || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    groupIndex,
                                    mode.value,
                                    "presentAnticipation",
                                    e.target.value,
                                    installment
                                  )
                                }
                              />
                              <span className="ml-1">% a.m.</span>
                            </div>
                            <div className="p-3 border-r flex items-center justify-center">
                              <Input
                                type="text"
                                className="w-16 text-right"
                                value={
                                  group.modes[mode.value].installments?.[
                                    installment
                                  ]?.presentTransaction || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    groupIndex,
                                    mode.value,
                                    "presentTransaction",
                                    e.target.value,
                                    installment
                                  )
                                }
                              />
                              <span className="ml-1">%</span>
                            </div>
                            <div className="p-3 border-r flex items-center justify-center">
                              <Input
                                type="text"
                                className="w-16 text-right"
                                value={
                                  group.modes[mode.value].installments?.[
                                    installment
                                  ]?.notPresentIntermediation || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    groupIndex,
                                    mode.value,
                                    "notPresentIntermediation",
                                    e.target.value,
                                    installment
                                  )
                                }
                              />
                              <span className="ml-1">%</span>
                            </div>
                            <div className="p-3 border-r flex items-center justify-center">
                              <Input
                                type="text"
                                className="w-16 text-right"
                                value={
                                  group.modes[mode.value].installments?.[
                                    installment
                                  ]?.notPresentAnticipation || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    groupIndex,
                                    mode.value,
                                    "notPresentAnticipation",
                                    e.target.value,
                                    installment
                                  )
                                }
                              />
                              <span className="ml-1">% a.m.</span>
                            </div>
                            <div className="p-3 flex items-center justify-center">
                              <Input
                                type="text"
                                className="w-16 text-right"
                                value={
                                  group.modes[mode.value].installments?.[
                                    installment
                                  ]?.notPresentTransaction || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    groupIndex,
                                    mode.value,
                                    "notPresentTransaction",
                                    e.target.value,
                                    installment
                                  )
                                }
                              />
                              <span className="ml-1">%</span>
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
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
