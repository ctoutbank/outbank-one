"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  BandeiraFeeDetails,
  FeeData,
  ModoFeeDetails,
} from "@/features/newTax/data/mock-fee-data";
import { PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { saveFee } from "../server/fee";

// Schema para validação do formulário
const schemaFeeForm = z.object({
  id: z.string(),
  code: z.string().min(1, "Código é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  type: z.string().min(1, "Tipo é obrigatório"),
  count: z.number().min(0, "Contagem deve ser maior ou igual a zero"),
  feeDetails: z.array(
    z.object({
      bandeira: z.string(),
      bandeiraImage: z.string(),
      modos: z.array(
        z.object({
          modo: z.string(),
          cartaoPresente: z.object({
            composicao: z.object({
              transacao: z.string(),
              antecipacao: z.string(),
            }),
            taxaIntermediacao: z.string(),
          }),
          cartaoNaoPresente: z.object({
            composicao: z.object({
              transacao: z.string(),
              antecipacao: z.string(),
            }),
            taxaIntermediacao: z.string(),
          }),
        })
      ),
    })
  ),
});

type FeeFormSchema = z.infer<typeof schemaFeeForm>;

interface FeeFormProps {
  fee: FeeData;
  bandeiras: string[];
  modosPagamento: string[];
}

// Função para obter a imagem do cartão
const getCardImage = (cardName: string): string => {
  const cardMap: { [key: string]: string } = {
    MASTERCARD: "/mastercard.svg",
    VISA: "/visa.svg",
    ELO: "/elo.svg",
    AMERICAN_EXPRESS: "/american-express.svg",
    HIPERCARD: "/hipercard.svg",
    AMEX: "/american-express.svg",
  };
  return cardMap[cardName] || "";
};

export default function FeeForm({
  fee,
  bandeiras,
  modosPagamento,
}: FeeFormProps) {
  const router = useRouter();
  const isNewFee = !fee || !fee.id || fee.id === "0";

  const form = useForm<FeeFormSchema>({
    resolver: zodResolver(schemaFeeForm),
    defaultValues: {
      id: fee?.id || Date.now().toString(),
      code: fee?.code || "",
      description: fee?.description || "",
      type: fee?.type || "Antecipação Compulsória",
      count: fee?.count || 0,
      feeDetails: fee?.feeDetails || [],
    },
  });

  // Função para calcular a taxa de intermediação
  const calculateTaxaIntermediacao = (
    transacao: string,
    antecipacao: string
  ): string => {
    const transacaoValue = Number.parseFloat(
      transacao.replace(",", ".").replace(" %", "")
    );
    const antecipacaoValue =
      antecipacao === "-"
        ? 0
        : Number.parseFloat(antecipacao.replace(",", ".").replace(" %", ""));
    return (
      (transacaoValue + antecipacaoValue).toFixed(2).replace(".", ",") + " %"
    );
  };

  // Função para adicionar uma nova bandeira
  const handleAddBandeira = () => {
    const newBandeira: BandeiraFeeDetails = {
      bandeira: bandeiras[0],
      bandeiraImage: getCardImage(bandeiras[0]),
      modos: [],
    };

    const updatedFeeDetails = [
      ...(form.getValues("feeDetails") || []),
      newBandeira,
    ];
    form.setValue("feeDetails", updatedFeeDetails);
  };

  // Função para remover uma bandeira
  const handleRemoveBandeira = (index: number) => {
    const updatedFeeDetails = form
      .getValues("feeDetails")
      .filter((_, i) => i !== index);
    form.setValue("feeDetails", updatedFeeDetails);
  };

  // Função para adicionar um novo modo de pagamento a uma bandeira
  const handleAddModo = (bandeiraIndex: number) => {
    const newModo: ModoFeeDetails = {
      modo: modosPagamento[0],
      cartaoPresente: {
        composicao: {
          transacao: "0,00 %",
          antecipacao: "-",
        },
        taxaIntermediacao: "0,00 %",
      },
      cartaoNaoPresente: {
        composicao: {
          transacao: "0,00 %",
          antecipacao: "-",
        },
        taxaIntermediacao: "0,00 %",
      },
    };

    const updatedFeeDetails = [...form.getValues("feeDetails")];
    updatedFeeDetails[bandeiraIndex].modos.push(newModo);
    form.setValue("feeDetails", updatedFeeDetails);
  };

  // Função para remover um modo de pagamento
  const handleRemoveModo = (bandeiraIndex: number, modoIndex: number) => {
    const updatedFeeDetails = [...form.getValues("feeDetails")];
    updatedFeeDetails[bandeiraIndex].modos = updatedFeeDetails[
      bandeiraIndex
    ].modos.filter((_, i) => i !== modoIndex);
    form.setValue("feeDetails", updatedFeeDetails);
  };

  // Função para atualizar o campo de uma bandeira
  const handleUpdateBandeira = (
    index: number,
    field: keyof BandeiraFeeDetails,
    value: string
  ) => {
    const updatedFeeDetails = [...form.getValues("feeDetails")];
    updatedFeeDetails[index] = {
      ...updatedFeeDetails[index],
      [field]: value,
      bandeiraImage:
        field === "bandeira"
          ? getCardImage(value)
          : updatedFeeDetails[index].bandeiraImage,
    };
    form.setValue("feeDetails", updatedFeeDetails);
  };

  // Função para atualizar o campo de um modo de pagamento
  const handleUpdateModo = (
    bandeiraIndex: number,
    modoIndex: number,
    field: keyof ModoFeeDetails,
    value: string
  ) => {
    const updatedFeeDetails = [...form.getValues("feeDetails")];
    updatedFeeDetails[bandeiraIndex].modos[modoIndex] = {
      ...updatedFeeDetails[bandeiraIndex].modos[modoIndex],
      [field]: value,
    };
    form.setValue("feeDetails", updatedFeeDetails);
  };

  // Função para atualizar um campo de composição
  const handleUpdateComposicao = (
    bandeiraIndex: number,
    modoIndex: number,
    cardType: "cartaoPresente" | "cartaoNaoPresente",
    field: "transacao" | "antecipacao",
    value: string
  ) => {
    const updatedFeeDetails = [...form.getValues("feeDetails")];
    const modo = updatedFeeDetails[bandeiraIndex].modos[modoIndex];

    // Formatar o valor para incluir o símbolo de porcentagem
    const formattedValue =
      value === "" || value === "-" ? "-" : `${value.replace(" %", "")} %`;

    // Atualizar o campo específico
    modo[cardType].composicao[field] = formattedValue;

    // Recalcular a taxa de intermediação
    const transacao = modo[cardType].composicao.transacao;
    const antecipacao = modo[cardType].composicao.antecipacao;
    modo[cardType].taxaIntermediacao = calculateTaxaIntermediacao(
      transacao === "-" ? "0" : transacao,
      antecipacao === "-" ? "0" : antecipacao
    );

    form.setValue("feeDetails", updatedFeeDetails);
  };

  // Função para salvar o formulário
  const onSubmit = async (data: FeeFormSchema) => {
    try {
      const toastId = toast.loading("Salvando taxa...");

      // Recalcular todas as taxas de intermediação antes de salvar
      const updatedFeeDetails = data.feeDetails.map((bandeira) => {
        const updatedModos = bandeira.modos.map((modo) => {
          // Para cartão presente
          const cpTransacao =
            modo.cartaoPresente.composicao.transacao === "-"
              ? "0"
              : modo.cartaoPresente.composicao.transacao;
          const cpAntecipacao =
            modo.cartaoPresente.composicao.antecipacao === "-"
              ? "0"
              : modo.cartaoPresente.composicao.antecipacao;
          modo.cartaoPresente.taxaIntermediacao = calculateTaxaIntermediacao(
            cpTransacao,
            cpAntecipacao
          );

          // Para cartão não presente
          const cnpTransacao =
            modo.cartaoNaoPresente.composicao.transacao === "-"
              ? "0"
              : modo.cartaoNaoPresente.composicao.transacao;
          const cnpAntecipacao =
            modo.cartaoNaoPresente.composicao.antecipacao === "-"
              ? "0"
              : modo.cartaoNaoPresente.composicao.antecipacao;
          modo.cartaoNaoPresente.taxaIntermediacao = calculateTaxaIntermediacao(
            cnpTransacao,
            cnpAntecipacao
          );

          return modo;
        });

        return {
          ...bandeira,
          modos: updatedModos,
        };
      });

      const finalData = {
        ...data,
        feeDetails: updatedFeeDetails,
      };

      // Chamar a função de servidor para salvar a taxa
      await saveFee(finalData as FeeData);

      toast.dismiss(toastId);
      toast.success(
        isNewFee ? "Taxa criada com sucesso!" : "Taxa atualizada com sucesso!"
      );

      // Redirecionar para a lista
      router.push("/portal/pricing");
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar taxa:", error);
      toast.error("Erro ao salvar taxa. Tente novamente.");
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código *</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Antecipação *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Antecipação Compulsória">
                        Antecipação Compulsória
                      </SelectItem>
                      <SelectItem value="Antecipação Eventual">
                        Antecipação Eventual
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bandeiras e Modos de Pagamento */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Bandeiras</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBandeira}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Bandeira
              </Button>
            </div>

            {form.watch("feeDetails")?.map((bandeira, bandeiraIndex) => (
              <div
                key={bandeiraIndex}
                className="border rounded-md p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Select
                      value={bandeira.bandeira}
                      onValueChange={(value) =>
                        handleUpdateBandeira(bandeiraIndex, "bandeira", value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione a bandeira" />
                      </SelectTrigger>
                      <SelectContent>
                        {bandeiras.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {bandeira.bandeiraImage && (
                      <img
                        src={bandeira.bandeiraImage || "/placeholder.svg"}
                        alt={bandeira.bandeira}
                        width={40}
                        height={24}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveBandeira(bandeiraIndex)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover Bandeira
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Modos de Pagamento</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddModo(bandeiraIndex)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar Modo
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[15%]">Modo</TableHead>
                        <TableHead colSpan={3} className="text-center">
                          Cartão Presente
                        </TableHead>
                        <TableHead colSpan={3} className="text-center">
                          Cartão Não Presente
                        </TableHead>
                        <TableHead className="w-[10%]">Ações</TableHead>
                      </TableRow>
                      <TableRow>
                        <TableHead></TableHead>
                        <TableHead className="text-center">
                          Transação (%)
                        </TableHead>
                        <TableHead className="text-center">
                          Antecipação (%)
                        </TableHead>
                        <TableHead className="text-center">Taxa (%)</TableHead>
                        <TableHead className="text-center">
                          Transação (%)
                        </TableHead>
                        <TableHead className="text-center">
                          Antecipação (%)
                        </TableHead>
                        <TableHead className="text-center">Taxa (%)</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bandeira.modos.map((modo, modoIndex) => (
                        <TableRow key={modoIndex}>
                          <TableCell>
                            <Select
                              value={modo.modo}
                              onValueChange={(value) =>
                                handleUpdateModo(
                                  bandeiraIndex,
                                  modoIndex,
                                  "modo",
                                  value
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o modo" />
                              </SelectTrigger>
                              <SelectContent>
                                {modosPagamento.map((m) => (
                                  <SelectItem key={m} value={m}>
                                    {m}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={modo.cartaoPresente.composicao.transacao.replace(
                                " %",
                                ""
                              )}
                              onChange={(e) =>
                                handleUpdateComposicao(
                                  bandeiraIndex,
                                  modoIndex,
                                  "cartaoPresente",
                                  "transacao",
                                  e.target.value
                                )
                              }
                              className="w-20 text-center"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={
                                modo.cartaoPresente.composicao.antecipacao ===
                                "-"
                                  ? ""
                                  : modo.cartaoPresente.composicao.antecipacao.replace(
                                      " %",
                                      ""
                                    )
                              }
                              onChange={(e) =>
                                handleUpdateComposicao(
                                  bandeiraIndex,
                                  modoIndex,
                                  "cartaoPresente",
                                  "antecipacao",
                                  e.target.value === "" ? "-" : e.target.value
                                )
                              }
                              className="w-20 text-center"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {modo.cartaoPresente.taxaIntermediacao}
                          </TableCell>
                          <TableCell>
                            <Input
                              value={modo.cartaoNaoPresente.composicao.transacao.replace(
                                " %",
                                ""
                              )}
                              onChange={(e) =>
                                handleUpdateComposicao(
                                  bandeiraIndex,
                                  modoIndex,
                                  "cartaoNaoPresente",
                                  "transacao",
                                  e.target.value
                                )
                              }
                              className="w-20 text-center"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={
                                modo.cartaoNaoPresente.composicao
                                  .antecipacao === "-"
                                  ? ""
                                  : modo.cartaoNaoPresente.composicao.antecipacao.replace(
                                      " %",
                                      ""
                                    )
                              }
                              onChange={(e) =>
                                handleUpdateComposicao(
                                  bandeiraIndex,
                                  modoIndex,
                                  "cartaoNaoPresente",
                                  "antecipacao",
                                  e.target.value === "" ? "-" : e.target.value
                                )
                              }
                              className="w-20 text-center"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {modo.cartaoNaoPresente.taxaIntermediacao}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleRemoveModo(bandeiraIndex, modoIndex)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {bandeira.modos.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center text-muted-foreground py-4"
                          >
                            Nenhum modo de pagamento adicionado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}

            {(!form.watch("feeDetails") ||
              form.watch("feeDetails").length === 0) && (
              <div className="text-center p-8 border rounded-md text-muted-foreground">
                Nenhuma bandeira adicionada. Clique em Adicionar Bandeira para
                começar.
              </div>
            )}
          </div>

          {/* PIX e outras informações (apenas para o primeiro item) */}
          {fee.id === "1" && (
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="font-medium">Informações Adicionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">PIX</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>MDR (%)</span>
                      <Input value="0,01" className="w-24 text-right" />
                    </div>
                    <div className="flex justify-between">
                      <span>Custo mínimo</span>
                      <Input value="0,72" className="w-24 text-right" />
                    </div>
                    <div className="flex justify-between">
                      <span>Custo máximo</span>
                      <Input value="0,72" className="w-24 text-right" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cartão Presente</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>MDR (%)</span>
                      <Input value="0,01" className="w-24 text-right" />
                    </div>
                    <div className="flex justify-between">
                      <span>Custo mínimo</span>
                      <Input value="0,72" className="w-24 text-right" />
                    </div>
                    <div className="flex justify-between">
                      <span>Custo máximo</span>
                      <Input value="0,72" className="w-24 text-right" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cartão Não Presente</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>MDR (%)</span>
                      <Input value="0,01" className="w-24 text-right" />
                    </div>
                    <div className="flex justify-between">
                      <span>Custo mínimo</span>
                      <Input value="0,96" className="w-24 text-right" />
                    </div>
                    <div className="flex justify-between">
                      <span>Custo máximo</span>
                      <Input value="0,96" className="w-24 text-right" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span>Dias úteis para antecipar (d+)</span>
                  <Input value="1" className="w-24 text-right" />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Link href="/portal/pricing">
              <Button type="button" variant="outline">
                Voltar
              </Button>
            </Link>

            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
