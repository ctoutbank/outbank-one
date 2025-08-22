"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { PaymentLinkSchema, schemaPaymentLink } from "../schema/schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  DDMerchant,
  insertPaymentLink,
  PaymentLinkDetail,
  PaymentLinkDetailForm,
  ShoppingItemsUpdate,
  updatePaymentLink,
} from "../server/paymentLink";

interface PaymentLinkFormProps {
  paymentLink: PaymentLinkDetailForm;
  merchant: DDMerchant[];
}

export default function PaymentLinkForm({
  paymentLink,
  merchant,
}: PaymentLinkFormProps) {
  const router = useRouter();

  console.log("PaymentLinkForm carregado com:", {
    paymentLinkId: paymentLink?.id,
    paymentLinkSlug: paymentLink?.slug,
    shoppingItemsCount: paymentLink?.shoppingItems?.length || 0,
    shoppingItems: paymentLink?.shoppingItems,
  });

  // Calcular valores padrão para expiresAt e diffNumber
  const calculateDefaultValues = () => {
    if (paymentLink?.dtExpiration && paymentLink?.dtinsert) {
      const timeDiff = TimeDiff(paymentLink.dtExpiration, paymentLink.dtinsert);
      return {
        expiresAt: timeDiff.type,
        diffNumber: timeDiff.value,
      };
    }
    return {
      expiresAt: "hour",
      diffNumber: "1",
    };
  };

  const defaultValues = calculateDefaultValues();

  console.log("Valores padrão calculados:", defaultValues);
  console.log("PaymentLink para defaultValues:", {
    dtExpiration: paymentLink?.dtExpiration,
    dtinsert: paymentLink?.dtinsert,
    installments: paymentLink?.installments,
  });

  const form = useForm<PaymentLinkSchema>({
    resolver: zodResolver(schemaPaymentLink),
    defaultValues: {
      id: paymentLink?.id || 0,
      slug: paymentLink?.slug || "",
      linkName: paymentLink?.linkName ?? "",
      idMerchant: paymentLink?.idMerchant?.toString(),
      dtExpiration: paymentLink?.dtExpiration ?? "-",
      installments: paymentLink?.installments?.toString() || "1",
      totalAmount: paymentLink?.totalAmount ?? "",
      shoppingItems: paymentLink?.shoppingItems ?? [],
      pixEnabled: false,
      productType: "CREDIT",
      paymentLinkStatus: "PENDING",
      active: paymentLink?.active ?? true,
      dtinsert: paymentLink?.dtinsert
        ? new Date(paymentLink.dtinsert).toISOString()
        : new Date().toISOString(),
      dtupdate: paymentLink?.dtupdate
        ? new Date(paymentLink.dtupdate).toISOString()
        : new Date().toISOString(),
      expiresAt: defaultValues.expiresAt,
      diffNumber: defaultValues.diffNumber,
    },
  });

  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemAmount, setItemAmount] = useState("");

  const watchedShoppingItems = useWatch({
    control: form.control,
    name: "shoppingItems",
  });

  // Função auxiliar para recalcular o total
  const recalculateTotal = useCallback(
    (items: any[]) => {
      if (items && items.length > 0) {
        const total = items.reduce((acc, item) => {
          const quantity =
            typeof item.quantity === "string"
              ? parseInt(item.quantity)
              : item.quantity;
          const amount =
            typeof item.amount === "number"
              ? item.amount
              : parseFloat(item.amount);
          const itemTotal = quantity * amount;
          return acc + itemTotal;
        }, 0);
        form.setValue("totalAmount", total.toFixed(2));
      } else {
        form.setValue("totalAmount", "0.00");
      }
    },
    [form]
  );

  useEffect(() => {
    if (watchedShoppingItems) {
      recalculateTotal(watchedShoppingItems);
    }
  }, [watchedShoppingItems, recalculateTotal]);

  async function updatePaymentLinkFormAction(data: PaymentLinkSchema) {
    // Calcular data de expiração baseada no horário atual em UTC
    const currentTime = DateTime.utc().toISO() || new Date().toISOString();
    const diffNumber = Number(data.diffNumber || 1);
    const expiresAt = (data.expiresAt as "day" | "hour") || "hour";

    const expirationTime = addTimeToDate(currentTime, diffNumber, expiresAt);

    const paymentLinkDetailUpdate: PaymentLinkDetail = {
      id: typeof data.id === "string" ? parseInt(data.id) : data.id || 0,
      slug: data.slug || "",
      linkName: data.linkName || "",
      linkUrl: data.linkUrl || "",
      active: true,
      dtExpiration: expirationTime,
      idMerchant: Number(data.idMerchant),
      productType: data.productType || "",
      totalAmount: data.totalAmount?.toString() || "0",
      paymentLinkStatus: data.paymentLinkStatus || "",
      dtinsert: data.dtinsert || currentTime,
      dtupdate: DateTime.utc().toISO() || new Date().toISOString(),
      installments: Number(data.installments),
      pixEnabled: false,
      transactionSlug: data.transactionSlug || "",
      isDeleted: null,
      isFromServer: null,
      modified: null,
    };

    let shoppingItemsUpdate: ShoppingItemsUpdate[] = [];
    if (data.shoppingItems && data.shoppingItems.length > 0) {
      shoppingItemsUpdate = data.shoppingItems?.map((shoppingItemUp) => {
        // Verificar se é um item existente ou novo
        const existingItem = paymentLink.shoppingItems?.find(
          (itemOld) => itemOld.slug === shoppingItemUp.slug
        );

        return {
          name: shoppingItemUp.name,
          quantity:
            typeof shoppingItemUp.quantity === "string"
              ? parseInt(shoppingItemUp.quantity)
              : shoppingItemUp.quantity,
          amount:
            typeof shoppingItemUp.amount === "number"
              ? shoppingItemUp.amount.toString()
              : shoppingItemUp.amount,
          slug: shoppingItemUp.slug,
          idPaymentLink:
            typeof shoppingItemUp.idPaymentLink === "string"
              ? parseInt(shoppingItemUp.idPaymentLink)
              : shoppingItemUp.idPaymentLink ||
                (typeof data.id === "string" ? parseInt(data.id) : data.id) ||
                0,
          wasModified: !existingItem, // true se não existir (novo item)
        };
      });
    }

    await updatePaymentLink(paymentLinkDetailUpdate, shoppingItemsUpdate);
    return data.id;
  }

  async function insertPaymentLinkFormAction(data: PaymentLinkSchema) {
    const currentTime = DateTime.utc().toISO() || new Date().toISOString();
    const diffNumber = Number(data.diffNumber || 1);
    const expiresAt = (data.expiresAt as "day" | "hour") || "hour";
    const expirationTime = addTimeToDate(currentTime, diffNumber, expiresAt);

    const newId = insertPaymentLink({
      linkName: data.linkName,
      dtExpiration: expirationTime,
      idMerchant: Number(data.idMerchant),
      linkUrl: data.linkUrl,
      productType: "CREDIT",
      totalAmount: data.totalAmount?.toString() || "0",
      paymentLinkStatus: "PENDING",
      dtinsert: currentTime,
      active: true,
      dtupdate: DateTime.utc().toISO() || new Date().toISOString(),
      installments: Number(data.installments),
      pixEnabled: false,
      shoppingItems: data.shoppingItems?.map((item) => ({
        name: item.name,
        quantity:
          typeof item.quantity === "string"
            ? parseInt(item.quantity)
            : item.quantity,
        amount:
          typeof item.amount === "number"
            ? item.amount.toString()
            : item.amount,
        idPaymentLink: 0,
      })),
    });
    return newId;
  }

  const onSubmit = async (data: PaymentLinkSchema) => {
    try {
      const toastId = toast.loading("Salvando link de pagamento...");
      const idNumber =
        typeof data.id === "string" ? parseInt(data.id) : data.id || 0;

      if (idNumber > 0) {
        await updatePaymentLinkFormAction(data);
        toast.dismiss(toastId);
        toast.success("Link de pagamento atualizado com sucesso!");
        router.refresh();
      } else {
        const newId = await insertPaymentLinkFormAction(data);
        toast.dismiss(toastId);
        toast.success("Link de pagamento criado com sucesso!");
        router.push(`/portal/paymentLink/${newId}`);
      }
    } catch (error) {
      console.error("Erro ao salvar link de pagamento:", error);
      toast.error("Erro ao salvar link de pagamento. Tente novamente.");
    }
  };

  function TimeDiff(
    date1: string,
    date2: string
  ): { type: string; value: string } {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    const diff = Math.abs(dt2.getTime() - dt1.getTime());
    const hour = diff / (1000 * 60 * 60);

    if (hour > 24) {
      return { type: "day", value: Math.round(hour / 24).toString() };
    } else {
      return { type: "hour", value: Math.round(hour).toString() };
    }
  }

  function addTimeToDate(
    date: string,
    value: number,
    type: "day" | "hour"
  ): string {
    // Usar a data fornecida como base, convertendo para UTC se necessário
    const baseDate = DateTime.fromISO(date, { zone: "utc" });
    let newDate: DateTime;

    if (type === "day") {
      newDate = baseDate.plus({ days: value });
    } else if (type === "hour") {
      newDate = baseDate.plus({ hours: value });
    } else {
      // Fallback para a data base
      newDate = baseDate;
    }

    // Garantir que o valor seja válido e retornar string
    if (!newDate.isValid) {
      console.error("Data inválida gerada:", { date, value, type });
      return new Date().toISOString();
    }

    const isoString = newDate.toISO();
    return isoString || new Date().toISOString();
  }

  const watch = form.watch;

  const handleAddItem = () => {
    if (!itemName || !itemQuantity || !itemAmount) return;

    const newItem = {
      name: itemName,
      quantity: parseInt(itemQuantity),
      amount: parseFloat(itemAmount).toString(),
      idPaymentLink: 0,
    };

    const currentItems = form.getValues("shoppingItems") || [];
    const updatedItems = [...currentItems, newItem];

    form.setValue("shoppingItems", updatedItems);

    setItemName("");
    setItemQuantity("");
    setItemAmount("");
  };

  const handleRemoveItem = (index: number) => {
    const currentItems = form.getValues("shoppingItems") || [];
    const updatedItems = currentItems.filter(
      (_, itemIndex) => itemIndex !== index
    );
    form.setValue("shoppingItems", updatedItems);
    recalculateTotal(updatedItems);
  };

  const handleEditItem = (index: number) => {
    const item = form.getValues("shoppingItems")?.[index];
    if (item) {
      setItemName(item.name);
      setItemQuantity(item.quantity.toString());
      setItemAmount(item.amount.toString());

      const currentItems = form.getValues("shoppingItems") || [];
      const updatedItems = currentItems.filter(
        (_, itemIndex) => itemIndex !== index
      );
      form.setValue("shoppingItems", updatedItems);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Identificador Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Identificador</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="linkName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            ID Link{" "}
                            <span className="text-destructive ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="idMerchant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Nome do EC{" "}
                            <span className="text-destructive ml-1">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString() || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {merchant.map((merchant) => (
                                <SelectItem
                                  key={merchant.id}
                                  value={merchant.id.toString()}
                                >
                                  {merchant.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Mais opções Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Mais opções</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="expiresAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link expirará em</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={
                              field.value || defaultValues.expiresAt
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="day">Dia(s)</SelectItem>
                              <SelectItem value="hour">Hora(s)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="diffNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-transparent">|</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={
                              field.value || defaultValues.diffNumber
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue defaultValue="1" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[...Array(48)].map((_, i) => (
                                <SelectItem
                                  key={i + 1}
                                  value={(i + 1).toString()}
                                >
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="installments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade máxima de parcelas</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString() || "1"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue defaultValue="1" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Crédito à vista</SelectItem>
                              {[...Array(11)].map((_, i) => (
                                <SelectItem
                                  key={i + 2}
                                  value={(i + 2).toString()}
                                >
                                  {i + 2}x
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Valor da Cobrança Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Valor da Cobrança</h3>
                  <Tabs defaultValue="single" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                      <TabsTrigger value="single">Valor Único</TabsTrigger>
                      <TabsTrigger value="items">Valor Por Itens</TabsTrigger>
                    </TabsList>
                    <TabsContent value="single" className="mt-4">
                      <FormField
                        control={form.control}
                        name="totalAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              Valor total da cobrança{" "}
                              <span className="text-destructive ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="items" className="mt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <Input
                            placeholder="Nome"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Quantidade"
                            value={itemQuantity}
                            onChange={(e) => setItemQuantity(e.target.value)}
                          />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Valor"
                            value={itemAmount}
                            onChange={(e) => setItemAmount(e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleAddItem}
                        >
                          Inserir item
                        </Button>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead>Quantidade</TableHead>
                              <TableHead>Valor Unid.</TableHead>
                              <TableHead>Valor Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {form.watch("shoppingItems")?.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.amount}</TableCell>
                                <TableCell>
                                  {item.quantity !== undefined
                                    ? (typeof item.quantity === "string"
                                        ? parseInt(item.quantity)
                                        : item.quantity) *
                                      (typeof item.amount === "number"
                                        ? item.amount
                                        : parseFloat(item.amount))
                                    : 0}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => handleRemoveItem(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => handleEditItem(index)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex justify-between">
                  <Link href="/portal/paymentLink">
                    <Button type="button" variant="outline">
                      Voltar
                    </Button>
                  </Link>

                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6 space-y-8">
          <div>
            <h3 className="font-semibold text-lg text-slate-800">
              Resumo da cobrança
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex flex-col">
              <span className="text-slate-600">Valor Total</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[2.5rem] font-semibold text-slate-800">
                  {watch("totalAmount") || "0,00"}
                </span>
                <span className="text-slate-600">BRL</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Identificador</span>
              <span className="text-slate-800">{watch("linkName") || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Nome do EC</span>
              <span className="text-slate-800">
                {(watch("idMerchant") !== undefined &&
                  merchant.filter(
                    (item) => item.id == Number(watch("idMerchant"))
                  )[0].name) ||
                  "-"}
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Link expirará em</span>
              <span className="text-slate-800">
                {watch("dtExpiration") || ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tipo de pagamento</span>
              <span className="text-slate-800">
                {watch("installments") == "1"
                  ? "Crédito à vista"
                  : watch("installments") == null
                    ? ""
                    : watch("installments") + "x"}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-slate-600 mb-4">Itens cadastrados</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Unid.</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchedShoppingItems && watchedShoppingItems.length > 0 ? (
                  watchedShoppingItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell className="text-right">
                        {(
                          (typeof item.quantity === "string"
                            ? parseInt(item.quantity)
                            : item.quantity) *
                          (typeof item.amount === "number"
                            ? item.amount
                            : parseFloat(item.amount))
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-slate-600">-</TableCell>
                    <TableCell className="text-slate-600">-</TableCell>
                    <TableCell className="text-slate-600">-</TableCell>
                    <TableCell className="text-right text-slate-600">
                      -
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
