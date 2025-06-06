"use client";

import { PercentageInput } from "@/components/percentage-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
        };
      };
      presentIntermediation: string;
      notPresentIntermediation: string;
    };
  };
}

interface PaymentConfigFormProps {
  fee: FeeData;
  hideButtons?: boolean;
}

type ModeField = "presentIntermediation" | "notPresentIntermediation";
type ModeId = string;

export const PaymentConfigFormWithCard = forwardRef<
  {
    getFormData: () => {
      pixConfig: any;
      groups: PaymentGroup[];
    };
  },
  PaymentConfigFormProps
>(function PaymentConfigFormWithCard({ fee, hideButtons = false }, ref) {
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
    anticipationRatePresent: fee.eventualAnticipationFee || "",
    anticipationRateNotPresent: fee.eventualAnticipationFee || "",
  });

  // Inicializar um grupo de pagamento
  function initializePaymentGroup(groupId: string): PaymentGroup {
    return {
      id: groupId,
      selectedCards: [],
      modes: FeeProductTypeList.reduce((acc, mode) => {
        acc[mode.value] = {
          expanded: false,
          presentIntermediation: "",
          notPresentIntermediation: "",
          ...(parseInt(mode.transactionFeeStart) > 0 && {
            installments: createInstallmentsObject(mode),
          }),
        };
        return acc;
      }, {} as any),
    };
  }

  // Criar objeto de parcelas para um modo
  function createInstallmentsObject(mode: any) {
    return Array.from(
      {
        length:
          parseInt(mode.transactionFeeEnd) -
          parseInt(mode.transactionFeeStart) +
          1,
      },
      (_, i) => i + parseInt(mode.transactionFeeStart)
    ).reduce((acc, installment) => {
      acc[installment] = {
        presentIntermediation: "",
        notPresentIntermediation: "",
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
          const initialModes = FeeProductTypeList.reduce((acc, mode) => {
            acc[mode.value] = {
              expanded: false,
              presentIntermediation: "",
              notPresentIntermediation: "",
              ...(parseInt(mode.transactionFeeStart) > 0 && {
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
                    };
                  } else if (initialModes[modeId]) {
                    // Para modo sem parcelamento
                    initialModes[modeId].presentIntermediation =
                      pt.cardTransactionMdr?.toString() || "";
                    initialModes[modeId].notPresentIntermediation =
                      pt.nonCardTransactionMdr?.toString() || "";
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
        anticipationRatePresent: fee.eventualAnticipationFee || "",
        anticipationRateNotPresent: fee.eventualAnticipationFee || "",
      });
    }
  }, [fee]);

  // Mapear tipo de produto para ID do modo e parcela
  function getModeMapping(
    productType: string
  ): { modeId: string; installment?: number } | null {
    if (productType === "Crédito à Vista") {
      return { modeId: "CREDIT" };
    } else if (productType.includes("Crédito Parcelado (2 a 6")) {
      const match = productType.match(/\((\d+)/);
      return {
        modeId: "CREDIT_INSTALLMENTS_2_TO_6",
        installment: match ? parseInt(match[1]) : undefined,
      };
    } else if (productType.includes("Crédito Parcelado (7 a 12")) {
      const match = productType.match(/\((\d+)/);
      return {
        modeId: "CREDIT_INSTALLMENTS_7_TO_12",
        installment: match ? parseInt(match[1]) : undefined,
      };
    } else if (productType === "Débito") {
      return { modeId: "DEBIT" };
    } else if (productType === "Voucher") {
      return { modeId: "VOUCHER" };
    } else if (productType === "Pré-Pago") {
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
    checked?: boolean
  ) {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const group = newGroups[groupIndex];

      if (checked === undefined) {
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

  // Helpers para UI
  const getCardImage = (cardName: string): string => {
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
  };

  const hasInstallments = (modeId: string): boolean => {
    const mode = FeeProductTypeList.find((item) => item.value === modeId);
    return mode ? parseInt(mode.transactionFeeStart) > 0 : false;
  };

  const getInstallmentRange = (modeId: string): [number, number] => {
    const mode = FeeProductTypeList.find((item) => item.value === modeId);
    return mode
      ? [parseInt(mode.transactionFeeStart), parseInt(mode.transactionFeeEnd)]
      : [0, 0];
  };

  const shouldDisableMainModeInput = (
    modeId: string,
    isExpanded: boolean
  ): boolean => {
    return hasInstallments(modeId) && isExpanded;
  };

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
                                  checked === true
                                    ? true
                                    : checked === false
                                      ? false
                                      : undefined
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
                <div className="grid grid-cols-3 border-b">
                  <div className="p-3 font-medium border-r bg-gray-50">
                    Modo
                  </div>
                  <div className="p-3 font-medium text-center border-r bg-gray-50">
                    Taxa de Intermediação (%) - Cartão Presente
                  </div>
                  <div className="p-3 font-medium text-center bg-gray-50">
                    Taxa de Intermediação (%) - Cartão Não Presente
                  </div>
                </div>

                {/* Modos de pagamento */}
                {FeeProductTypeList.map((feeProductType) => (
                  <div key={`${group.id}-${feeProductType.value}`}>
                    {/* Linha principal do modo */}
                    <div className="grid grid-cols-3 border-b">
                      <div className="p-3 border-r flex items-center justify-between">
                        <span>{feeProductType.label}</span>
                        {hasInstallments(feeProductType.value) && (
                          <button
                            type="button"
                            onClick={() =>
                              toggleModeExpansion(
                                groupIndex,
                                feeProductType.value
                              )
                            }
                            className="focus:outline-none"
                          >
                            {group.modes[feeProductType.value].expanded ? (
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
                              group.modes[feeProductType.value]
                                .presentIntermediation || ""
                            }
                            onChange={(value) =>
                              handleInputChange(
                                groupIndex,
                                feeProductType.value,
                                "presentIntermediation",
                                value
                              )
                            }
                            placeholder="%"
                            className="w-16 text-center"
                            disabled={shouldDisableMainModeInput(
                              feeProductType.value,
                              group.modes[feeProductType.value].expanded
                            )}
                          />
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-center">
                        <div className="flex items-center justify-center">
                          <PercentageInput
                            value={
                              group.modes[feeProductType.value]
                                .notPresentIntermediation || ""
                            }
                            onChange={(value) =>
                              handleInputChange(
                                groupIndex,
                                feeProductType.value,
                                "notPresentIntermediation",
                                value
                              )
                            }
                            placeholder="%"
                            className="w-16 text-center"
                            disabled={shouldDisableMainModeInput(
                              feeProductType.value,
                              group.modes[feeProductType.value].expanded
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Linhas de parcelamento se expandido */}
                    {hasInstallments(feeProductType.value) &&
                      group.modes[feeProductType.value].expanded &&
                      (() => {
                        const [start, end] = getInstallmentRange(
                          feeProductType.value
                        );
                        return Array.from(
                          { length: end - start + 1 },
                          (_, i) => i + start
                        ).map((installment) => (
                          <div
                            key={`${group.id}-${feeProductType.value}-${installment}`}
                            className="grid grid-cols-3 border-b bg-gray-50"
                          >
                            <div className="p-3 border-r pl-8">{`Crédito Parcelado (${installment} vezes)`}</div>
                            <div className="p-3 border-r flex items-center justify-center">
                              <PercentageInput
                                value={
                                  group.modes[feeProductType.value]
                                    .installments?.[installment]
                                    ?.presentIntermediation || ""
                                }
                                onChange={(value) =>
                                  handleInputChange(
                                    groupIndex,
                                    feeProductType.value,
                                    "presentIntermediation",
                                    value,
                                    installment
                                  )
                                }
                                placeholder="%"
                                className="w-16 text-center"
                              />
                            </div>
                            <div className="p-3 flex items-center justify-center">
                              <PercentageInput
                                value={
                                  group.modes[feeProductType.value]
                                    .installments?.[installment]
                                    ?.notPresentIntermediation || ""
                                }
                                onChange={(value) =>
                                  handleInputChange(
                                    groupIndex,
                                    feeProductType.value,
                                    "notPresentIntermediation",
                                    value,
                                    installment
                                  )
                                }
                                placeholder="%"
                                className="w-16 text-center"
                              />
                            </div>
                          </div>
                        ));
                      })()}
                  </div>
                ))}
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
