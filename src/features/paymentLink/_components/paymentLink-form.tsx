"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const form = useForm<PaymentLinkSchema>({
    resolver: zodResolver(schemaPaymentLink),
    defaultValues: {
      id: paymentLink?.id || 0,
      linkName: paymentLink?.linkName ?? "",
      idMerchant: paymentLink?.idMerchant?.toString(),
      dtExpiration: paymentLink?.dtExpiration ?? "-",
      installments: paymentLink?.installments?.toString(),
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
    },
  });

  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemAmount, setItemAmount] = useState("");

  const watchedShoppingItems = useWatch({
    control: form.control,
    name: "shoppingItems",
  });

  useEffect(() => {
    if (watchedShoppingItems && watchedShoppingItems.length > 0) {
      const total = watchedShoppingItems.reduce((acc, item) => {
        const itemTotal = item.quantity * parseFloat(item.amount);
        return acc + itemTotal;
      }, 0);
      form.setValue("totalAmount", total.toFixed(2));
    }
  }, [watchedShoppingItems, form]);

  async function updatePaymentLinkFormAction(data: PaymentLinkSchema) {
    console.log("updatePaymentLinkFormAction", data);
    const paymentLinkDetailUpdate: PaymentLinkDetail = {
      id: data.id || 0,
      slug: data.slug || "",
      linkName: data.linkName || "",
      linkUrl: data.linkUrl || "",
      active: true,
      dtExpiration: addTimeToDate(
        new Date().toISOString(),
        Number(data.diffNumber),
        data.expiresAt as "day" | "hour"
      ),
      idMerchant: Number(data.idMerchant),
      productType: data.productType || "",
      totalAmount: data.totalAmount?.toString() || "0",
      paymentLinkStatus: data.paymentLinkStatus || "",
      dtinsert: data.dtinsert || new Date().toISOString(),
      dtupdate: new Date().toISOString(),
      installments: Number(data.installments),
      pixEnabled: false,
      transactionSlug: data.transactionSlug || "",
      isDeleted: null,
      isFromServer: null,
      modified: null,
    };
    let shoppingItemsUpdate: ShoppingItemsUpdate[] = [];
    if (data.shoppingItems && data.shoppingItems.length > 0) {
      shoppingItemsUpdate = data.shoppingItems?.map((shoppingItemUp) => ({
        name: shoppingItemUp.name,
        quantity: shoppingItemUp.quantity,
        amount: shoppingItemUp.amount,
        slug: shoppingItemUp.slug,
        wasModified: !paymentLink.shoppingItems?.some(
          (itemOld) => itemOld.slug === shoppingItemUp.slug
        ),
      }));
    }

    updatePaymentLink(paymentLinkDetailUpdate, shoppingItemsUpdate);
    return data.id;
  }

  async function insertPaymentLinkFormAction(data: PaymentLinkSchema) {
    console.log("insertPaymentLinkFormAction", data);
    const newId = insertPaymentLink({
      linkName: data.linkName,
      dtExpiration: addTimeToDate(
        new Date().toISOString(),
        Number(data.diffNumber),
        data.expiresAt as "day" | "hour"
      ),
      idMerchant: Number(data.idMerchant),
      linkUrl: data.linkUrl,
      productType: "CREDIT",
      totalAmount: data.totalAmount?.toString() || "0",
      paymentLinkStatus: "PENDING",
      dtinsert: new Date().toISOString(),
      active: true,
      dtupdate: new Date().toISOString(),
      installments: Number(data.installments),
      pixEnabled: false,
      shoppingItems: data.shoppingItems?.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        amount: item.amount,
        idPaymentLink: 0,
      })),
    });
    return newId;
  }

  const onSubmit = async (data: PaymentLinkSchema) => {
    try {
      const toastId = toast.loading("Salvando link de pagamento...");
      if (data?.id) {
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
    const newDate = new Date(date);

    if (type === "day") {
      newDate.setDate(newDate.getDate() + value);
    } else if (type === "hour") {
      newDate.setHours(newDate.getHours() + value);
    }

    return newDate.toISOString();
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

    const updatedItems = [...(form.getValues("shoppingItems") || []), newItem];
    form.setValue("shoppingItems", updatedItems);

    setItemName("");
    setItemQuantity("");
    setItemAmount("");
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
                          <FormLabel>ID Link *</FormLabel>
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
                          <FormLabel>Nome do EC *</FormLabel>
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
                              field.value ||
                              TimeDiff(
                                paymentLink.dtExpiration ||
                                  new Date().toISOString(),
                                paymentLink.dtinsert || new Date().toISOString()
                              ).type
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
                              field.value ||
                              TimeDiff(
                                paymentLink.dtExpiration ||
                                  new Date().toISOString(),
                                paymentLink.dtinsert || new Date().toISOString()
                              ).value
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
                            defaultValue={field.value?.toString() || ""}
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
                            <FormLabel>Valor total da cobrança *</FormLabel>
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
                                    ? item.quantity * Number(item.amount)
                                    : 0}
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
                        {(item.quantity * parseFloat(item.amount)).toFixed(2)}
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
