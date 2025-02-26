"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { schemaPaymentLink } from "../schema/schema";

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
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DDMerchant, PaymentLinkDetail } from "../server/paymentLink";
import Link from "next/link";

interface PaymentLinkFormProps {
  paymentLink: PaymentLinkDetail;
  merchant: DDMerchant[];
}

async function updatePaymentLinkFormAction(data: PaymentLinkDetail) {
  console.log("updatePaymentLinkFormAction", data);
  // TODO: Implement the update action
  return data.id;
}

async function insertPaymentLinkFormAction(data: PaymentLinkDetail) {
  console.log("insertPaymentLinkFormAction", data);
  // TODO: Implement the insert action
  return "new-id";
}

export default function PaymentLinkForm({
  paymentLink,
  merchant,
}: PaymentLinkFormProps) {
  const router = useRouter();
  const form = useForm<PaymentLinkDetail>({
    resolver: zodResolver(schemaPaymentLink),
    defaultValues: paymentLink,
  });

  const onSubmit = async (data: PaymentLinkDetail) => {
    if (data?.id) {
      await updatePaymentLinkFormAction(data);
      router.refresh();
    } else {
      const newId = await insertPaymentLinkFormAction(data);
      router.push(`/portal/paymentLink/${newId}`);
    }
  };
  const watch = form.watch;

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
                          <FormLabel>Identificador do link *</FormLabel>
                          <FormControl>
                            <Input value={field.value || ""} />
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
                      name="dtExpiration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link expirará em</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Hora(s)" />
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
                      name="installments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-transparent">
                            |
                          </FormLabel>
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
                      <TabsTrigger value="single">VALOR ÚNICO</TabsTrigger>
                      <TabsTrigger value="items">VALOR POR ITENS</TabsTrigger>
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
                          <Input placeholder="Nome" />
                          <Input type="number" placeholder="Quantidade" />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Valor"
                          />
                        </div>
                        <Button type="button" variant="secondary">
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
                          <TableBody>{/* Add table rows here */}</TableBody>
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
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Resumo da cobrança</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Identificador:</span>
              <span className="font-semibold">
                {watch("linkName") || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Nome do EC:</span>
              <span className="font-semibold">
                {merchant.find(
                  (m) => m.id.toString() === watch("idMerchant")?.toString()
                )?.name || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Expiração:</span>
              <span className="font-semibold">
                {watch("dtExpiration") === "day"
                  ? "Dia(s)"
                  : watch("dtExpiration") === "hour"
                  ? "Hora(s)"
                  : ""}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Parcelas:</span>
              <span className="font-semibold">
                {watch("installments") || ""}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Valor total:</span>
              <span className="font-semibold">
                {watch("totalAmount")
                  ? `R$ ${parseFloat(watch("totalAmount") || "0").toFixed(2)}`
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
