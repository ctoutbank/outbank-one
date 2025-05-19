"use client";

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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { week } from "@/lib/lookuptables/lookuptables";
import { DateMerchantAgendaList } from "@/lib/lookuptables/lookuptables-merchantAgenda";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCallback } from "react";
import {
  insertReportFormAction,
  updateReportFormAction,
} from "../_actions/reports-formActions";
import { ReportSchema, SchemaReport } from "../schema/schema";
import {
  FileFormatDD,
  PeriodDD,
  Recorrence,
  ReportTypeDD,
  deleteEmailFromReport,
} from "../server/reports";
import EmailList from "./email-list";

interface ReportsFormProps {
  report: ReportSchema;
  recorrence: Recorrence[];
  period: PeriodDD[];
  fileFormat: FileFormatDD[];
  reportType: ReportTypeDD[];
  permissions: string[];
  onReportCreated?: (reportId: number) => void;
}

export default function ReportForm({
  report,
  recorrence,
  period,
  fileFormat,
  reportType,
  permissions,
  onReportCreated,
}: ReportsFormProps) {
  const router = useRouter();
  console.log(permissions);
  // Formulário do Relatório
  const form = useForm<ReportSchema>({
    resolver: zodResolver(SchemaReport),
    defaultValues: {
      ...report,
      id: report.id,
      title: report.title || "",
      recurrenceCode: report.recurrenceCode || "",
      shippingTime: report.shippingTime || "",
      periodCode: report.periodCode || "",
      dayWeek: report.dayWeek || "",
      dayMonth: report.dayMonth || "",
      endTime: report.endTime || "",
      startTime: report.startTime || "",
      emails: report.emails || "",
      formatCode: report.formatCode || "",
      reportType: report.reportType || "",
      referenceDateType: report.referenceDateType || "",
    },
  });

  // Use useCallback to create a stable function reference
  const handleDeleteEmail = useCallback(
    async (email: string) => {
      try {
        await deleteEmailFromReport(report.id as number, email);
        toast.success(`Email ${email} removido com sucesso`);
      } catch (error) {
        console.error("Erro ao remover email:", error);
        toast.error("Erro ao remover email. Tente novamente.");
        throw error;
      }
    },
    [report.id]
  );

  const onSubmit = useCallback(async (data: ReportSchema) => {
    // Log para depuração
    console.log("Dados do formulário:", data);

    // Certifique-se de que os campos de horário estão formatados corretamente
    const formattedData = {
      ...data,
      shippingTime: data.shippingTime || "",
      startTime: data.startTime || "",
    };

    // Log dos dados formatados
    console.log("Dados formatados:", formattedData);

    if (formattedData.id) {
      await updateReportFormAction(formattedData);
      toast.success("Relatório atualizado com sucesso");
      router.refresh();

      if (onReportCreated) {
        onReportCreated(formattedData.id as number);
      }
    } else {
      const newId = await insertReportFormAction(formattedData);
      toast.success("Relatório criado com sucesso");

      if (onReportCreated) {
        router.push(`/portal/reports/${newId}?activeTab=step2`);
      } else {
        router.push(`/portal/reports/${newId}`);
      }
    }
  }, [router, onReportCreated]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full mb-4">
          <CardContent className="pt-6 px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Relatório</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {reportType?.map((type) => (
                          <SelectItem key={type.code} value={type.code}>
                            {type.name}
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
                name="formatCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formato</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fileFormat?.map((format) => (
                          <SelectItem key={format.code} value={format.code}>
                            {format.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="periodCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);

                        // Definir automaticamente a recorrência com base no período
                        let recorrenceValue = "";

                        if (value === "DT" || value === "DA") {
                          recorrenceValue = "DIA"; // Diário
                        } else if (value === "SA" || value === "SR") {
                          recorrenceValue = "SEM"; // Semanal
                        } else if (value === "MR" || value === "MA") {
                          recorrenceValue = "MES"; // Mensal
                        }
                        // Atualizar o valor do campo de recorrência
                        form.setValue("recurrenceCode", recorrenceValue);

                        // Forçar a atualização do formulário para refletir a mudança
                        form.trigger("recurrenceCode");
                      }}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {period?.map((period) => (
                          <SelectItem key={period.code} value={period.code}>
                            {period.name}
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
                name="recurrenceCode"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Recorrência</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-row space-x-4 p-2 border rounded-md bg-muted/50"
                        disabled={true}
                      >
                        {recorrence?.map((type) => (
                          <div
                            key={type.code}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={type.code}
                              id={`recurrence-${type.code}`}
                            />
                            <Label htmlFor={`recurrence-${type.code}`}>
                              {type.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(form.watch("periodCode") === "SA" ||
                form.watch("periodCode") === "SR") && (
                <FormField
                  control={form.control}
                  name="dayWeek"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Dia da Semana</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50"
                        >
                          {week.map((day) => (
                            <div
                              key={day.value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={day.value}
                                id={`day-${day.value}`}
                              />
                              <Label htmlFor={`day-${day.value}`}>
                                {day.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {(form.watch("periodCode") === "MA" ||
                form.watch("periodCode") === "MR") && (
                <FormField
                  control={form.control}
                  name="dayMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia do Mês</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Inicial</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        name={field.name}
                        ref={field.ref}
                        value={field.value || ""}
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          console.log(
                            "Novo valor de startTime:",
                            e.target.value
                          );
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Final</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        name={field.name}
                        ref={field.ref}
                        value={field.value || ""}
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          console.log("Novo valor de endTime:", e.target.value);
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("reportType") === "AL" && (
                <FormField
                  control={form.control}
                  name="referenceDateType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Data de Referência</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de data" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DateMerchantAgendaList.map((dateType) => (
                            <SelectItem
                              key={dateType.value}
                              value={dateType.value}
                            >
                              {dateType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="shippingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de Envio</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        name={field.name}
                        ref={field.ref}
                        value={field.value || ""}
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          console.log(
                            "Novo valor de shippingTime:",
                            e.target.value
                          );
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emails"
                render={({ field }) => {
                  // Memoize field value to prevent unnecessary rerenders
                  const emailFieldValue = field.value || "";
                  return (
                    <FormItem className="col-start-1 pl-0 ml-0">
                      <FormControl className="pl-0 ml-0">
                        <EmailList
                          value={emailFieldValue}
                          onChange={field.onChange}
                          label="Emails para envio do relatório"
                          description="Adicione os emails que receberão este relatório"
                          className="shadow-none border-0 p-0"
                          reportExists={!!report.id}
                          onDeleteEmail={report.id ? handleDeleteEmail : undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-end ">
              <Button type="submit">Salvar</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
