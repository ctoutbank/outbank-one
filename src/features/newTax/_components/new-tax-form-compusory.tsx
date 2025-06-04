"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  forwardRef,
  useImperativeHandle,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";

// Interface estendida que adiciona as propriedades necessárias
interface ExtendedFeeProductType {
  value: string;
  label: string;
  transactionFeeStart: string;
  transactionFeeEnd: string;
  hasInstallments?: boolean;
  installmentRange?: [number, number];
}

// Função auxiliar para determinar se um modo tem parcelas e qual o intervalo
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

type ModeId = string; // Se quiser, pode restringir para os ids válidos

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
  const [isPending, startTransition] = useTransition();
  const [groups, setGroups] = useState<PaymentGroup[]>([
    {
      id: "group-1",
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
            installments: Array.from(
              {
                length:
                  mode.installmentRange![1] - mode.installmentRange![0] + 1,
              },
              (_, i) => i + mode.installmentRange![0]
            ).reduce((iAcc, installment) => {
              iAcc[installment] = {
                presentIntermediation: "",
                notPresentIntermediation: "",
                presentAnticipation: "",
                notPresentAnticipation: "",
                presentTransaction: "",
                notPresentTransaction: "",
              };
              return iAcc;
            }, {} as any),
          }),
        };
        return acc;
      }, {} as any),
    },
  ]);

  const [pixConfig, setPixConfig] = useState({
    mdrPresent: fee.cardPixMdr?.replace(" %", "").replace(",", ".") || "",
    mdrNotPresent: fee.nonCardPixMdr?.replace(" %", "").replace(",", ".") || "",
    minCostPresent: fee.cardPixMinimumCostFee?.replace(",", ".") || "",
    minCostNotPresent: fee.nonCardPixMinimumCostFee?.replace(",", ".") || "",
    maxCostPresent: fee.cardPixMinimumCostFee?.replace(",", ".") || "",
    maxCostNotPresent: fee.nonCardPixMinimumCostFee?.replace(",", ".") || "",
  });

  // Expor o método getFormData via ref para o componente pai
  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      pixConfig,
      groups,
    }),
  }));

  function toggleCardSelection(
    groupIndex: number,
    cardId: string,
    checked?: boolean | "indeterminate"
  ) {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const group = newGroups[groupIndex];

      if (checked === undefined || checked === "indeterminate") {
        // Comportamento antigo, baseado no estado atual
        if (group.selectedCards.includes(cardId)) {
          group.selectedCards = group.selectedCards.filter(
            (id) => id !== cardId
          );
        } else {
          group.selectedCards = [...group.selectedCards, cardId];
        }
      } else {
        // Novo comportamento, baseado no valor de checked
        if (checked) {
          // Adicionar se não estiver na lista
          if (!group.selectedCards.includes(cardId)) {
            group.selectedCards = [...group.selectedCards, cardId];
          }
        } else {
          // Remover se estiver na lista
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
      {
        id: `group-${prevGroups.length + 1}`,
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
              installments: Array.from(
                {
                  length:
                    mode.installmentRange![1] - mode.installmentRange![0] + 1,
                },
                (_, i) => i + mode.installmentRange![0]
              ).reduce((iAcc, installment) => {
                iAcc[installment] = {
                  presentIntermediation: "",
                  notPresentIntermediation: "",
                  presentAnticipation: "",
                  notPresentAnticipation: "",
                  presentTransaction: "",
                  notPresentTransaction: "",
                };
                return iAcc;
              }, {} as any),
            }),
          };
          return acc;
        }, {} as any),
      },
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
        (group.modes[modeId].installments![installment] as any)[field] = value;
      } else {
        (group.modes[modeId] as any)[field] = value;
      }
      return newGroups;
    });
  }

  function handlePixInputChange(field: keyof typeof pixConfig, value: string) {
    setPixConfig((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await updatePixConfigAction(fee.id, pixConfig);
        await saveMerchantPricingAction(fee.id, groups);
        toast.success("Configurações salvas com sucesso");
        router.refresh();
      } catch {
        toast.error("Erro ao salvar configurações");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <ChevronDown className="h-5 w-5 mr-2" />
            <div>
              <CardTitle className="text-lg">{fee.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Código da tabela: {fee.id}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-medium mb-4 text-orange-600">
            Pedido de Antecipação: Compulsória
          </div>

          {/* PIX Section */}
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="grid grid-cols-3 border-b">
                <div className="p-3 font-medium border-r bg-orange-50">PIX</div>
                <div className="p-3 font-medium text-center border-r bg-orange-50">
                  Cartão Presente
                </div>
                <div className="p-3 font-medium text-center bg-orange-50">
                  Cartão Não Presente
                </div>
              </div>

              <div className="grid grid-cols-3 border-b">
                <div className="p-3 border-r">MDR (%)</div>
                <div className="p-3 border-r flex items-center justify-center">
                  <Input
                    type="text"
                    className="w-16 text-right"
                    value={pixConfig.mdrPresent}
                    onChange={(e) =>
                      handlePixInputChange("mdrPresent", e.target.value)
                    }
                  />
                  <span className="ml-1">%</span>
                </div>
                <div className="p-3 flex items-center justify-center">
                  <Input
                    type="text"
                    className="w-16 text-right"
                    value={pixConfig.mdrNotPresent}
                    onChange={(e) =>
                      handlePixInputChange("mdrNotPresent", e.target.value)
                    }
                  />
                  <span className="ml-1">%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b">
                <div className="p-3 border-r">Custo mínimo</div>
                <div className="p-3 border-r flex items-center justify-center">
                  <span className="mr-1">R$</span>
                  <Input
                    type="text"
                    className="w-16 text-right"
                    value={pixConfig.minCostPresent}
                    onChange={(e) =>
                      handlePixInputChange("minCostPresent", e.target.value)
                    }
                  />
                </div>
                <div className="p-3 flex items-center justify-center">
                  <span className="mr-1">R$</span>
                  <Input
                    type="text"
                    className="w-16 text-right"
                    value={pixConfig.minCostNotPresent}
                    onChange={(e) =>
                      handlePixInputChange("minCostNotPresent", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3">
                <div className="p-3 border-r">Custo máximo</div>
                <div className="p-3 border-r flex items-center justify-center">
                  <span className="mr-1">R$</span>
                  <Input
                    type="text"
                    className="w-16 text-right"
                    value={pixConfig.maxCostPresent}
                    onChange={(e) =>
                      handlePixInputChange("maxCostPresent", e.target.value)
                    }
                  />
                </div>
                <div className="p-3 flex items-center justify-center">
                  <span className="mr-1">R$</span>
                  <Input
                    type="text"
                    className="w-16 text-right"
                    value={pixConfig.maxCostNotPresent}
                    onChange={(e) =>
                      handlePixInputChange("maxCostNotPresent", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Groups */}
          {groups.map((group, groupIndex) => (
            <Card key={group.id} className="mb-6">
              <CardContent className="p-0">
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
                                if (checked === true) {
                                  // Adicionar o cartão
                                  toggleCardSelection(
                                    groupIndex,
                                    card.value,
                                    true
                                  );
                                } else if (checked === false) {
                                  // Remover o cartão
                                  toggleCardSelection(
                                    groupIndex,
                                    card.value,
                                    false
                                  );
                                }
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

                {FeeProductTypeList.map((modeBase) => {
                  const mode = getExtendedProductType(modeBase);
                  return (
                    <div key={`${group.id}-${mode.value}`}>
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
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={handleSave}
                disabled={isPending}
              >
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <h3 className="text-lg font-semibold mb-4">
        Tabela de Taxas por Bandeira e Tipo de Produto
      </h3>
      {fee.feeBrand.map((brand) => (
        <div key={brand.brand} className="mb-6">
          <h4 className="font-medium mb-2">{brand.brand}</h4>
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-orange-100">
                <th className="border px-2 py-1">Modo de Pagamento</th>
                <th className="border px-2 py-1">MDR Cartão Presente</th>
                <th className="border px-2 py-1">MDR Cartão Não Presente</th>
                <th className="border px-2 py-1">
                  Taxa Intermediação Presente
                </th>
                <th className="border px-2 py-1">
                  Taxa Intermediação Não Presente
                </th>
              </tr>
            </thead>
            <tbody>
              {brand.feeBrandProductType.map((product) => (
                <tr key={product.producttype}>
                  <td className="border px-2 py-1">{product.producttype}</td>
                  <td className="border px-2 py-1">
                    {product.cardTransactionFee}
                  </td>
                  <td className="border px-2 py-1">
                    {product.nonCardTransactionFee}
                  </td>
                  <td className="border px-2 py-1">
                    {product.cardTransactionMdr}
                  </td>
                  <td className="border px-2 py-1">
                    {product.nonCardTransactionMdr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
});
