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
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
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
          presentTransaction: string;
          notPresentTransaction: string;
        };
      };
      presentIntermediation: string;
      notPresentIntermediation: string;
      presentTransaction: string;
      notPresentTransaction: string;
    };
  };
}

interface PaymentConfigFormProps {
  fee: FeeData;
  hideButtons?: boolean;
  feeFieldErrors?: Record<string, string>;
}

type ModeField =
  | "presentIntermediation"
  | "notPresentIntermediation"
  | "presentTransaction"
  | "notPresentTransaction";
type ModeId = string;

export const PaymentConfigFormWithCard = forwardRef<
  {
    getFormData: () => {
      pixConfig: any;
      groups: PaymentGroup[];
    };
  },
  PaymentConfigFormProps
>(function PaymentConfigFormWithCard(
  { fee, hideButtons = false, feeFieldErrors = {} },
  ref
) {
  console.log("DADOS RECEBIDOS NO SUBFORMULÁRIO EVENTUAL:", fee);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Ajustar a constante de controle:
  const isNoAnticipation = fee.anticipationType === "NOANTECIPATION";
  const isEventualAnticipation = fee.anticipationType === "EVENTUAL";
  const onlyIntermediation = isNoAnticipation || isEventualAnticipation;

  // Inicializar um grupo de pagamento
  const initializePaymentGroup = useCallback((groupId: string): PaymentGroup => {
    return {
      id: groupId,
      selectedCards: [],
      modes: FeeProductTypeList.reduce((acc, mode) => {
        acc[mode.value] = {
          expanded: false,
          presentIntermediation: "",
          notPresentIntermediation: "",
          presentTransaction: "",
          notPresentTransaction: "",
          ...(Number.parseInt(mode.transactionFeeStart) > 0 && {
            installments: createInstallmentsObject(mode),
          }),
        };
        return acc;
      }, {} as any),
    };
  }, []);

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

  // Criar objeto de parcelas para um modo
  function createInstallmentsObject(mode: any) {
    return Array.from(
      {
        length:
          Number.parseInt(mode.transactionFeeEnd) -
          Number.parseInt(mode.transactionFeeStart) +
          1,
      },
      (_, i) => i + Number.parseInt(mode.transactionFeeStart)
    ).reduce((acc, installment) => {
      acc[installment] = {
        presentIntermediation: "",
        notPresentIntermediation: "",
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
          const initialModes = FeeProductTypeList.reduce((acc, mode) => {
            acc[mode.value] = {
              expanded: false,
              presentIntermediation: "",
              notPresentIntermediation: "",
              presentTransaction: "",
              notPresentTransaction: "",
              ...(Number.parseInt(mode.transactionFeeStart) > 0 && {
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
                        pt.cardTransactionMdr?.toString() || "",
                      notPresentTransaction:
                        pt.nonCardTransactionMdr?.toString() || "",
                    };
                    // Se qualquer campo da parcela estiver preenchido, expandir
                    const inst = initialModes[modeId].installments[installment];
                    if (
                      inst.presentIntermediation ||
                      inst.notPresentIntermediation ||
                      inst.presentTransaction ||
                      inst.notPresentTransaction
                    ) {
                      initialModes[modeId].expanded = true;
                    }
                  } else if (initialModes[modeId]) {
                    // Para modo sem parcelamento
                    initialModes[modeId].presentIntermediation =
                      pt.cardTransactionMdr?.toString() || "";
                    initialModes[modeId].notPresentIntermediation =
                      pt.nonCardTransactionMdr?.toString() || "";
                    initialModes[modeId].presentTransaction =
                      pt.cardTransactionMdr?.toString() || "";
                    initialModes[modeId].notPresentTransaction =
                      pt.nonCardTransactionMdr?.toString() || "";
                  }
                }
              });
            }
          });

          // Após preencher todas as parcelas, expandir se houver alguma preenchida
          Object.entries(initialModes).forEach(([mode]: any) => {
            if (mode.installments) {
              const hasAnyFilled = Object.values(mode.installments).some(
                (inst: any) =>
                  inst.presentIntermediation ||
                  inst.notPresentIntermediation ||
                  inst.presentTransaction ||
                  inst.notPresentTransaction
              );
              if (hasAnyFilled) {
                mode.expanded = true;
              }
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
        anticipationRatePresent: fee.eventualAnticipationFee || "",
        anticipationRateNotPresent: fee.eventualAnticipationFee || "",
      });
    }
  }, [fee, initializePaymentGroup]);

  // Mapear tipo de produto para ID do modo e parcela
  function getModeMapping(
    productType: string
  ): { modeId: string; installment?: number } | null {
    if (productType === "Crédito à Vista") {
      return { modeId: "CREDIT" };
    } else if (productType.startsWith("Crédito Parcelado (2 a 6")) {
      return { modeId: "CREDIT_INSTALLMENTS_2_TO_6" };
    } else if (productType.startsWith("Crédito Parcelado (7 a 12")) {
      return { modeId: "CREDIT_INSTALLMENTS_7_TO_12" };
    } else if (/Crédito Parcelado $$(\d+) a \1 vezes$$/.test(productType)) {
      // Match "Crédito Parcelado (N a N vezes)"
      const match = productType.match(/Crédito Parcelado $$(\d+) a \1 vezes$$/);
      if (match) {
        const installment = Number.parseInt(match[1], 10);
        if (installment >= 2 && installment <= 6) {
          return { modeId: "CREDIT_INSTALLMENTS_2_TO_6", installment };
        }
        if (installment >= 7 && installment <= 12) {
          return { modeId: "CREDIT_INSTALLMENTS_7_TO_12", installment };
        }
      }
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
      pixConfig: {
        ...pixConfig,
        anticipationRatePresent:
          pixConfig.anticipationRatePresent !== ""
            ? Number(pixConfig.anticipationRatePresent)
            : undefined,
        anticipationRateNotPresent:
          pixConfig.anticipationRateNotPresent !== ""
            ? Number(pixConfig.anticipationRateNotPresent)
            : undefined,
      },
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
    return mode ? Number.parseInt(mode.transactionFeeStart) > 0 : false;
  };

  const getInstallmentRange = (modeId: string): [number, number] => {
    const mode = FeeProductTypeList.find((item) => item.value === modeId);
    return mode
      ? [
          Number.parseInt(mode.transactionFeeStart),
          Number.parseInt(mode.transactionFeeEnd),
        ]
      : [0, 0];
  };

  const shouldDisableMainModeInput = (
    modeId: string,
    isExpanded: boolean,
    isInstallmentField?: boolean
  ): boolean => {
    // Se for campo de parcela, nunca desabilita
    if (isInstallmentField) return false;
    // Se for campo principal de modo parcelado e expandido, desabilita
    return hasInstallments(modeId) && isExpanded;
  };

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
                              className="h-4 w-4 rounded"
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
                        className="rounded-lg"
                      >
                        Remover
                      </Button>
                    )}
                    {groupIndex === groups.length - 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addNewGroup}
                        className="rounded-lg"
                      >
                        Novo Grupo
                      </Button>
                    )}
                  </div>
                </div>
                {/* Cabeçalho da tabela de modos */}
                {onlyIntermediation ? (
                  <div className="grid grid-cols-3 border-b rounded-t-lg overflow-hidden">
                    <div className="p-3 font-medium border-r bg-gray-50 rounded-tl-lg">
                      Modo
                    </div>
                    <div className="p-3 font-medium text-center border-r bg-gray-50">
                      Taxa de Intermediação (%) - Cartão Presente
                    </div>
                    <div className="p-3 font-medium text-center bg-gray-50 rounded-tr-lg">
                      Taxa de Intermediação (%) - Cartão Não Presente
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 border-b rounded-t-lg overflow-hidden">
                    <div className="p-3 font-medium border-r bg-gray-50 rounded-tl-lg">
                      Modo
                    </div>
                    <div className="p-3 font-medium text-center border-r bg-gray-50">
                      Taxa de Intermediação (%) - Cartão Presente
                    </div>
                    <div className="p-3 font-medium text-center border-r bg-gray-50">
                      Transação (%) - Cartão Presente
                    </div>
                    <div className="p-3 font-medium text-center border-r bg-gray-50">
                      Taxa de Intermediação (%) - Cartão Não Presente
                    </div>
                    <div className="p-3 font-medium text-center bg-gray-50 rounded-tr-lg">
                      Transação (%) - Cartão Não Presente
                    </div>
                  </div>
                )}
                {/* Modos de pagamento */}
                {FeeProductTypeList.map((feeProductType) => (
                  <div key={`${group.id}-${feeProductType.value}`}>
                    {/* Linha principal do modo */}
                    <div
                      className={
                        onlyIntermediation
                          ? "grid grid-cols-3 border-b"
                          : "grid grid-cols-5 border-b"
                      }
                    >
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
                      <div className="p-3 flex items-center justify-center">
                        <PercentageInput
                          value={
                            group.modes[feeProductType.value]
                              .presentIntermediation || ""
                          }
                          disabled={shouldDisableMainModeInput(
                            feeProductType.value,
                            group.modes[feeProductType.value].expanded
                          )}
                          onChange={(value) =>
                            handleInputChange(
                              groupIndex,
                              feeProductType.value,
                              "presentIntermediation",
                              value
                            )
                          }
                          className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                        />
                        {feeFieldErrors?.[
                          `${group.id}-${feeProductType.value}-presentIntermediation`
                        ] && (
                          <span className="ml-2 text-xs text-red-500">
                            mínimo permitido (
                            {(() => {
                              const err =
                                feeFieldErrors[
                                  `${group.id}-${feeProductType.value}-presentIntermediation`
                                ];
                              const match = err.match(/([\d.,]+)%/);
                              return match ? match[1] + "%" : "";
                            })()}
                            )
                          </span>
                        )}
                      </div>
                      {!onlyIntermediation && (
                        <div className="p-3 flex items-center justify-center">
                          <PercentageInput
                            value={
                              group.modes[feeProductType.value]
                                .presentTransaction || ""
                            }
                            disabled={shouldDisableMainModeInput(
                              feeProductType.value,
                              group.modes[feeProductType.value].expanded
                            )}
                            onChange={(value) =>
                              handleInputChange(
                                groupIndex,
                                feeProductType.value,
                                "presentTransaction",
                                value
                              )
                            }
                            className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                          />
                          {feeFieldErrors?.[
                            `${group.id}-${feeProductType.value}-presentTransaction`
                          ] && (
                            <span className="ml-2 text-xs text-red-500">
                              mínimo permitido (
                              {(() => {
                                const err =
                                  feeFieldErrors[
                                    `${group.id}-${feeProductType.value}-presentTransaction`
                                  ];
                                const match = err.match(/([\d.,]+)%/);
                                return match ? match[1] + "%" : "";
                              })()}
                              )
                            </span>
                          )}
                        </div>
                      )}
                      <div className="p-3 border-r flex items-center justify-center">
                        <PercentageInput
                          value={
                            group.modes[feeProductType.value]
                              .notPresentIntermediation || ""
                          }
                          disabled={shouldDisableMainModeInput(
                            feeProductType.value,
                            group.modes[feeProductType.value].expanded
                          )}
                          onChange={(value) =>
                            handleInputChange(
                              groupIndex,
                              feeProductType.value,
                              "notPresentIntermediation",
                              value
                            )
                          }
                          className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                        />
                        {feeFieldErrors?.[
                          `${group.id}-${feeProductType.value}-notPresentIntermediation`
                        ] && (
                          <span className="ml-2 text-xs text-red-500">
                            mínimo permitido (
                            {(() => {
                              const err =
                                feeFieldErrors[
                                  `${group.id}-${feeProductType.value}-notPresentIntermediation`
                                ];
                              const match = err.match(/([\d.,]+)%/);
                              return match ? match[1] + "%" : "";
                            })()}
                            )
                          </span>
                        )}
                      </div>
                      {!onlyIntermediation && (
                        <div className="p-3 flex items-center justify-center">
                          <PercentageInput
                            value={
                              group.modes[feeProductType.value]
                                .notPresentTransaction || ""
                            }
                            disabled={shouldDisableMainModeInput(
                              feeProductType.value,
                              group.modes[feeProductType.value].expanded
                            )}
                            onChange={(value) =>
                              handleInputChange(
                                groupIndex,
                                feeProductType.value,
                                "notPresentTransaction",
                                value
                              )
                            }
                            className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                          />
                          {feeFieldErrors?.[
                            `${group.id}-${feeProductType.value}-notPresentTransaction`
                          ] && (
                            <span className="ml-2 text-xs text-red-500">
                              mínimo permitido (
                              {(() => {
                                const err =
                                  feeFieldErrors[
                                    `${group.id}-${feeProductType.value}-notPresentTransaction`
                                  ];
                                const match = err.match(/([\d.,]+)%/);
                                return match ? match[1] + "%" : "";
                              })()}
                              )
                            </span>
                          )}
                        </div>
                      )}
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
                            className={
                              onlyIntermediation
                                ? "grid grid-cols-3 border-b bg-gray-50"
                                : "grid grid-cols-5 border-b bg-gray-50"
                            }
                          >
                            <div className="p-3 border-r text-left pr-6">
                              {`Crédito Parcelado (${installment} ${installment === 1 ? "vez" : "vezes"})`}
                            </div>
                            <div className="p-3 border-r flex items-center justify-center">
                              <PercentageInput
                                value={
                                  group.modes[feeProductType.value]
                                    .installments?.[installment]
                                    ?.presentIntermediation || ""
                                }
                                disabled={shouldDisableMainModeInput(
                                  feeProductType.value,
                                  group.modes[feeProductType.value].expanded,
                                  true
                                )}
                                onChange={(value) =>
                                  handleInputChange(
                                    groupIndex,
                                    feeProductType.value,
                                    "presentIntermediation",
                                    value,
                                    installment
                                  )
                                }
                                className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                              />
                              {feeFieldErrors?.[
                                `${group.id}-${feeProductType.value}-presentIntermediation-${installment}`
                              ] && (
                                <span className="ml-2 text-xs text-red-500">
                                  mínimo permitido (
                                  {(() => {
                                    const err =
                                      feeFieldErrors[
                                        `${group.id}-${feeProductType.value}-presentIntermediation-${installment}`
                                      ];
                                    const match = err.match(/([\d.,]+)%/);
                                    return match ? match[1] + "%" : "";
                                  })()}
                                  )
                                </span>
                              )}
                            </div>
                            {!onlyIntermediation && (
                              <div className="p-3 border-r flex items-center justify-center">
                                <PercentageInput
                                  value={
                                    group.modes[feeProductType.value]
                                      .installments?.[installment]
                                      ?.presentTransaction || ""
                                  }
                                  disabled={shouldDisableMainModeInput(
                                    feeProductType.value,
                                    group.modes[feeProductType.value].expanded,
                                    true
                                  )}
                                  onChange={(value) =>
                                    handleInputChange(
                                      groupIndex,
                                      feeProductType.value,
                                      "presentTransaction",
                                      value,
                                      installment
                                    )
                                  }
                                  className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                                />
                                {feeFieldErrors?.[
                                  `${group.id}-${feeProductType.value}-presentTransaction-${installment}`
                                ] && (
                                  <span className="ml-2 text-xs text-red-500">
                                    mínimo permitido (
                                    {(() => {
                                      const err =
                                        feeFieldErrors[
                                          `${group.id}-${feeProductType.value}-presentTransaction-${installment}`
                                        ];
                                      const match = err.match(/([\d.,]+)%/);
                                      return match ? match[1] + "%" : "";
                                    })()}
                                    )
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="p-3 border-r flex items-center justify-center">
                              <PercentageInput
                                value={
                                  group.modes[feeProductType.value]
                                    .installments?.[installment]
                                    ?.notPresentIntermediation || ""
                                }
                                disabled={shouldDisableMainModeInput(
                                  feeProductType.value,
                                  group.modes[feeProductType.value].expanded,
                                  true
                                )}
                                onChange={(value) =>
                                  handleInputChange(
                                    groupIndex,
                                    feeProductType.value,
                                    "notPresentIntermediation",
                                    value,
                                    installment
                                  )
                                }
                                className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                              />
                              {feeFieldErrors?.[
                                `${group.id}-${feeProductType.value}-notPresentIntermediation-${installment}`
                              ] && (
                                <span className="ml-2 text-xs text-red-500">
                                  mínimo permitido (
                                  {(() => {
                                    const err =
                                      feeFieldErrors[
                                        `${group.id}-${feeProductType.value}-notPresentIntermediation-${installment}`
                                      ];
                                    const match = err.match(/([\d.,]+)%/);
                                    return match ? match[1] + "%" : "";
                                  })()}
                                  )
                                </span>
                              )}
                            </div>
                            {!onlyIntermediation && (
                              <div className="p-3 flex items-center justify-center">
                                <PercentageInput
                                  value={
                                    group.modes[feeProductType.value]
                                      .installments?.[installment]
                                      ?.notPresentTransaction || ""
                                  }
                                  disabled={shouldDisableMainModeInput(
                                    feeProductType.value,
                                    group.modes[feeProductType.value].expanded,
                                    true
                                  )}
                                  onChange={(value) =>
                                    handleInputChange(
                                      groupIndex,
                                      feeProductType.value,
                                      "notPresentTransaction",
                                      value,
                                      installment
                                    )
                                  }
                                  className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                                />
                                {feeFieldErrors?.[
                                  `${group.id}-${feeProductType.value}-notPresentTransaction-${installment}`
                                ] && (
                                  <span className="ml-2 text-xs text-red-500">
                                    mínimo permitido (
                                    {(() => {
                                      const err =
                                        feeFieldErrors[
                                          `${group.id}-${feeProductType.value}-notPresentTransaction-${installment}`
                                        ];
                                      const match = err.match(/([\d.,]+)%/);
                                      return match ? match[1] + "%" : "";
                                    })()}
                                    )
                                  </span>
                                )}
                              </div>
                            )}
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
