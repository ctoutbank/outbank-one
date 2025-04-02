"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Status } from "@/lib/lookuptables";
import { useEffect, useState } from "react";
import { ReportTypeDD } from "../server/reports";
import {
  deleteReportFilter,
  getFilterFormData,
  ReportFilterDetail,
  ReportFilterDetailWithTypeName,
  ReportFilterParamDetail,
} from "./filter-Actions";
import FilterForm from "./filter-form";
import { ReportFilterSchema } from "./schema";

interface FilterTableAndFormProps {
  filter: ReportFilterDetailWithTypeName[];
  reportId: number;
  reportFilterParams: ReportFilterParamDetail[];
  reportTypeDD: ReportTypeDD[];
}

export default function FilterTableAndForm({
  filter,
  reportId,
  reportFilterParams,
  reportTypeDD,
}: FilterTableAndFormProps) {
  const [record, setRecord] = useState<ReportFilterSchema | null>(null);
  const [open, setOpen] = useState(false);
  const [filteredParams, setFilteredParams] = useState<
    ReportFilterParamDetail[]
  >([]);
  const [selectedType, setSelectedType] = useState<string>("");

  // Pré-carregar os dados necessários para o formulário
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Carrega todos os dados necessários de uma vez
        const formData = await getFilterFormData(reportId);

        // Configura o tipo selecionado baseado no relatório
        const reportTypeCode =
          formData.reportType ||
          (reportTypeDD.length > 0 ? reportTypeDD[0].code : "");
        setSelectedType(reportTypeCode);

        // Filtra os parâmetros pelo tipo
        const filtered = reportFilterParams.filter(
          (param) => param.type === reportTypeCode
        );
        setFilteredParams(filtered);
      } catch {
        console.error("");
      }
    };

    initializeData();
  }, [reportId, reportTypeDD, reportFilterParams]);

  const closeDialog = () => {
    setOpen(false);
  };

  // Prepara o formulário antes de abrir o dialog
  function handleNewReportFilter() {
    setRecord({
      idReport: reportId,
      idReportFilterParam:
        filteredParams.length > 0
          ? filteredParams[0].id
          : reportFilterParams[0]?.id,
      value: selectedType || "",
      typeName:
        reportTypeDD.find((type) => type.code === selectedType)?.name || "",
    });
    setOpen(true);
  }

  async function handleEditReportFilter(record: ReportFilterDetail) {
    // Em vez de carregar do banco, pegamos diretamente o registro da lista
    setRecord({
      idReportFilterParam: record.idReportFilterParam,
      value: record.value,
      id: record.id,
      idReport: record.idReport,
      dtinsert: record.dtinsert ? new Date(record.dtinsert) : undefined,
      dtupdate: record.dtupdate ? new Date(record.dtupdate) : undefined,
      typeName: (record as ReportFilterDetailWithTypeName).typeName || "",
    });
    setOpen(true);
  }

  async function handleDeleteReportFilter(record: ReportFilterDetail) {
    if (confirm("Tem certeza que deseja excluir este filtro?")) {
      await deleteReportFilter(record.id);
    }
  }

  // Função para verificar se um filtro é de bandeiras do tipo AL
  const isBrandFilter = (record: ReportFilterDetailWithTypeName): boolean => {
    const param = reportFilterParams.find(
      (p) => p.id === record.idReportFilterParam
    );
    return param?.name === "Bandeira";
  };

  // Função para verificar se um filtro é de intervalo de datas (totalAmount do tipo Vendas)
  const isDateRangeFilter = (
    record: ReportFilterDetailWithTypeName
  ): boolean => {
    const param = reportFilterParams.find(
      (p) => p.id === record.idReportFilterParam
    );
    return param?.name === "totalAmount" && record.typeName === "Vendas";
  };

  // Função para verificar se um filtro é de Status
  const isStatusFilter = (record: ReportFilterDetailWithTypeName): boolean => {
    const param = reportFilterParams.find(
      (p) => p.id === record.idReportFilterParam
    );
    return param?.name === "Status";
  };

  // Função para verificar se um filtro é de intervalo de valores
  const isValueRangeFilter = (
    record: ReportFilterDetailWithTypeName
  ): boolean => {
    const param = reportFilterParams.find(
      (p) => p.id === record.idReportFilterParam
    );
    return param?.name === "valor" && record.typeName === "Vendas";
  };

  // Função para verificar se um filtro é de Estabelecimento
  const isMerchantFilter = (
    record: ReportFilterDetailWithTypeName
  ): boolean => {
    const param = reportFilterParams.find(
      (p) => p.id === record.idReportFilterParam
    );
    return param?.name === "Estabelecimento";
  };

  // Função para formatar uma data para exibição
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  // Função para formatar um intervalo de valores para exibição
  const formatValueRange = (valueString: string): string => {
    if (!valueString.includes(",")) return valueString;

    const [min, max] = valueString.split(",").map((v) => v.trim());
    return `De ${parseFloat(min).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })} até ${parseFloat(max).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`;
  };

  // Função para formatar um intervalo de datas para exibição
  const formatDateRange = (dateString: string): string => {
    if (!dateString.includes(",")) return dateString;

    const [startDate, endDate] = dateString.split(",").map((d) => d.trim());
    return `De ${formatDate(startDate)} até ${formatDate(endDate)}`;
  };

  // Função para renderizar os valores de filtros
  const renderFilterValue = (
    record: ReportFilterDetailWithTypeName
  ): React.ReactNode => {
    // Verificar se é filtro de bandeiras do tipo AL
    if (isBrandFilter(record)) {
      // Mostrar lista separada por vírgulas
      return record.value
        .split(",")
        .map((b) => b.trim())
        .join(", ");
    }

    // Verificar se é filtro de intervalo de datas
    if (isDateRangeFilter(record)) {
      return formatDateRange(record.value);
    }

    // Verificar se é filtro de intervalo de valores
    if (isValueRangeFilter(record)) {
      return formatValueRange(record.value);
    }

    // Verificar se é filtro de Status
    if (isStatusFilter(record)) {
      // Mostrar o label do status em vez do valor
      return (
        Status.find((s) => s.value === record.value)?.label || record.value
      );
    }

    // Verificar se é filtro de Estabelecimento
    if (isMerchantFilter(record) && record.value.includes("|")) {
      // Mostrar apenas o nome do estabelecimento (sem o ID)
      return record.value.split("|")[0];
    }

    // Padrão: mostrar o valor como está
    return record.value;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Filtros</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os filtros de relatórios
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger onClick={handleNewReportFilter}>
            <div className="h-8 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90">
              Novo Filtro
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {record?.id ? "Editar Filtro" : "Novo Filtro"}
              </DialogTitle>

              <FilterForm
                filter={
                  record || {
                    idReport: reportId,
                    idReportFilterParam:
                      filteredParams.length > 0
                        ? filteredParams[0].id
                        : reportFilterParams[0]?.id,
                    value: "",
                  }
                }
                reportId={reportId}
                reportFilterParams={reportFilterParams}
                closeDialog={closeDialog}
                reportTypeDD={reportTypeDD}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parâmetro</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data de Inserção</TableHead>
                <TableHead>Data de Atualização</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filter?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {
                      reportFilterParams.find(
                        (p) => p.id === record.idReportFilterParam
                      )?.name
                    }
                  </TableCell>
                  <TableCell>{renderFilterValue(record)}</TableCell>
                  <TableCell>
                    {record.dtinsert
                      ? new Date(record.dtinsert).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {record.dtupdate
                      ? new Date(record.dtupdate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="">
                    <div>
                      <Button onClick={() => handleEditReportFilter(record)}>
                        Editar
                      </Button>
                      <Button
                        variant={"destructive"}
                        onClick={() => handleDeleteReportFilter(record)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
