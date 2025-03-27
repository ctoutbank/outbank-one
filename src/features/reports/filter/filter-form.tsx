import { useRouter } from "next/navigation";
import { insertReportFilter, ReportFilterParamDetail, updateReportFilter } from "./filter-Actions";
import { ReportFilterSchema, SchemaReportFilter } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { FormField, FormMessage } from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { Select, SelectValue, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";
import { ReportTypeDD } from "../server/reports";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";






interface FilterFormProps {
    filter: ReportFilterSchema;
    reportId: number;
    reportFilterParams: ReportFilterParamDetail[];
    closeDialog: () => void;
    reportTypeDD: ReportTypeDD[]
}

export default function FilterForm({ filter, reportId, reportFilterParams, closeDialog, reportTypeDD }: FilterFormProps) {

    const router = useRouter();
    const [selectedType, setSelectedType] = useState<string>('');
    const [filteredParams, setFilteredParams] = useState<ReportFilterParamDetail[]>([]);

    const form = useForm<ReportFilterSchema>({
        resolver: zodResolver(SchemaReportFilter),
        defaultValues: {
            ...filter,
            idReport: reportId,
            idReportFilterParam: filter.idReportFilterParam || reportFilterParams[0]?.id
        },
    });

    useEffect(() => {
        // Se já existir um tipo selecionado no formulário, use-o como estado inicial
        if (filter.value) {
            setSelectedType(filter.value);
            
            // Filtra os parâmetros baseado no tipo selecionado
            const filtered = reportFilterParams.filter(param => param.type === filter.value);
            setFilteredParams(filtered);
        }
    }, [filter, reportFilterParams]);

    const onSubmit = async (data: ReportFilterSchema) => {
        if (data?.id) {
            await updateReportFilter({
                ...data,
                id: data.id as number,
                idReport: reportId,
                dtinsert: (data.dtinsert || new Date()).toISOString(),
                dtupdate: (data.dtinsert || new Date()).toISOString(),
            });
            router.refresh();
            closeDialog();
        } else {
            const newId = await insertReportFilter({
                ...data,
                idReport: reportId,
                idReportFilterParam: data.idReportFilterParam,
                value: data.value,
                dtinsert: (data.dtinsert || new Date()).toISOString(),
                dtupdate: (data.dtinsert || new Date()).toISOString(),
            });
            router.push(`/portal/reports/${reportId}/filters/${newId}`);
            closeDialog();
        }
    };

    // Função para atualizar os filtros quando o tipo for alterado
    const handleTypeChange = (type: string) => {
        setSelectedType(type);
        
        // Filtra os parâmetros baseado no tipo selecionado
        const filtered = reportFilterParams.filter(param => param.type === type);
        setFilteredParams(filtered);
        
        // Redefine o valor de idReportFilterParam se não houver parâmetros disponíveis
        if (filtered.length > 0) {
            form.setValue('idReportFilterParam', filtered[0].id);
        } else {
            form.setValue('idReportFilterParam', undefined as any);
        }
    };

    return (
        <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div id="filter-content">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Relatório</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleTypeChange(value);
                        }}
                        defaultValue={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {reportTypeDD &&
                            reportTypeDD.map((tipo) => (
                              <SelectItem key={tipo.code} value={tipo.code}>
                                {tipo.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedType && (
                  <FormField
                    control={form.control}
                    name="idReportFilterParam"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Parâmetro de Filtro</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          defaultValue={String(field?.value ?? "")}
                          disabled={filteredParams.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={filteredParams.length === 0 ? "Nenhum parâmetro disponível" : "Selecione um parâmetro"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredParams
                              .filter(param => {
                                if (selectedType === 'AL') return param.type === 'AL';
                                if (selectedType === 'VN') return param.type === 'VN';
                                return true;
                              })
                              .map((param) => (
                                <SelectItem key={param.id} value={String(param.id)}>
                                  {param.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="flex justify-end mt-6">
                  <Button type="submit">
                    Salvar
                  </Button>
                </div>
              </div>
            </form>
        </Form>
        </>
    )
}
