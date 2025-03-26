"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { insertReportFormAction, updateReportFormAction } from "../_actions/reports-formActions";
import { ReportSchema, SchemaReport } from "../schema/schema";
import {
  FileFormatDD,
  PeriodDD,
  Recorrence,
  ReportTypeDD
} from "../server/reports";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";


interface ReportsFormProps {
  report: ReportSchema;
  recorrence: Recorrence[];
  period: PeriodDD[];
  fileFormat: FileFormatDD[];
  reportType: ReportTypeDD[];
}

export default function ReportForm({ report, recorrence, period, fileFormat, reportType }: ReportsFormProps) {
  const router = useRouter();
    
  // Formulário do Relatório
  const form = useForm<ReportSchema>({
    resolver: zodResolver(SchemaReport),
    defaultValues: {
      ...report,
      id: report.id,
      title: report.title || "",
      recurrenceCode: report.recurrenceCode || "",
      recurrenceHour: report.recurrenceHour || "",
      periodCode: report.periodCode || "",
      emails: report.emails || "",
      formatCode: report.formatCode || "",
      reportType: report.reportType || "",
      filters: report.filters || []
    },
  });
  
 
  
  
  const onSubmit = async (data: ReportSchema) => {
             
      if (data.id) {
        await updateReportFormAction(data);
        toast.success("Relatório atualizado com sucesso");
        router.refresh();
      } else {
        const newId = await insertReportFormAction(data);
        toast.success("Relatório criado com sucesso");
        router.push(`/portal/reports/${newId}`);
      }
   
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
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
                      defaultValue={field.value || ""}
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
                      defaultValue={field.value || ""}
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

            <div className="grid grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="recurrenceCode"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Recorrência</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                        className="flex flex-row space-x-4"
                      >
                        {recorrence?.map((type) => (
                          <div key={type.code} className="flex items-center space-x-2">
                            <RadioGroupItem value={type.code} id={`recurrence-${type.code}`} />
                            <Label htmlFor={`recurrence-${type.code}`}>{type.name}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recurrenceHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
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
            </div>

            <div className="mt-4">
              <FormField
                control={form.control}
                name="emails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emails (separados por vírgula)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="email1@example.com, email2@example.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end mt-4">
              <Button type="submit">Salvar</Button>
            </div>
      </form>
    </Form>
  );
} 