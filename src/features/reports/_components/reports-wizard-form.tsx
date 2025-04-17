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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreloadedFilterData } from "@/features/reports/filter/filter-Actions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ReportFilterParamDetail,
  deleteReportFilter,
} from "../filter/filter-Actions";
import FilterForm from "../filter/filter-form";
import { ReportFilterSchema } from "../filter/schema";
import { ReportSchema } from "../schema/schema";
import {
  FileFormatDD,
  PeriodDD,
  Recorrence,
  ReportTypeDD,
} from "../server/reports";
import ReportForm from "./reports-form";

// Tipo para representar os filtros já formatados que vêm do servidor
export interface FormattedFilter {
  id: number;
  idReport: number;
  idReportFilterParam: number;
  value: string;
  dtinsert?: Date | null;
  dtupdate?: Date | null;
  typeName?: string | null;
  paramName: string;
  displayValue: string;
}

interface ReportsWizardFormProps {
  report: ReportSchema;
  recorrence: Recorrence[];
  period: PeriodDD[];
  fileFormat: FileFormatDD[];
  reportType: ReportTypeDD[];
  permissions: string[];
  reportFilterParams: ReportFilterParamDetail[];
  activeTabDefault: string;
  existingFilters: FormattedFilter[];
  preloadedFilterData?: PreloadedFilterData;
  editFilterId?: number;
}

export default function ReportsWizardForm({
  report,
  recorrence,
  period,
  fileFormat,
  reportType,
  permissions,
  reportFilterParams,
  activeTabDefault,
  existingFilters,
  preloadedFilterData,
  editFilterId,
}: ReportsWizardFormProps) {
  const [activeTab, setActiveTab] = useState(activeTabDefault);
  const [newReportId, setNewReportId] = useState<number | null>(
    report.id ? (report.id as number) : null
  );
  const [isFirstStepComplete, setIsFirstStepComplete] = useState(!!report.id);
  const [open, setOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<ReportFilterSchema | null>(
    null
  );

  const handleStepChange = (value: string) => {
    // Só permite ir para o segundo passo se o relatório foi criado
    if (value === "step2" && !isFirstStepComplete) {
      toast.error(
        "É necessário criar o relatório antes de configurar os filtros"
      );
      return;
    }
    setActiveTab(value);
  };

  // Função para marcar que o primeiro passo foi concluído e passar para o próximo
  const onReportCreated = (id: number) => {
    setNewReportId(id);
    setIsFirstStepComplete(true);
    setActiveTab("step2");
  };

  // Função que será passada para o ReportForm para notificar quando o relatório for criado
  const handleFirstStepComplete = (id: number) => {
    onReportCreated(id);
  };

  // Função para fechar o dialog
  const handleCloseDialog = () => {
    setOpen(false);
    setEditingFilter(null);
  };

  // Função para abrir o dialog de adição de novo filtro
  const handleAddFilter = () => {
    // Obter o tipo do relatório atual
    const reportTypeCode = report.reportType || "VN"; // default para VN se não estiver definido
    const reportTypeName =
      reportType.find((type) => type.code === reportTypeCode)?.name || "Vendas";

    setEditingFilter({
      idReport: newReportId || (report.id as number),
      idReportFilterParam:
        reportFilterParams.length > 0 ? reportFilterParams[0].id : 0,
      value: "",
      typeName: reportTypeName, // Adicionar o nome do tipo de relatório
    });
    setOpen(true);
  };

  // Função para editar um filtro existente
  const handleEditFilter = (filter: FormattedFilter) => {
    // Caso o typeName não esteja definido no filtro, usar o tipo do relatório atual
    const reportTypeCode = report.reportType || "VN";
    const reportTypeName =
      filter.typeName ||
      reportType.find((type) => type.code === reportTypeCode)?.name ||
      "Vendas";

    setEditingFilter({
      id: filter.id,
      idReport: filter.idReport,
      idReportFilterParam: filter.idReportFilterParam,
      value: filter.value,
      dtinsert: filter.dtinsert ? new Date(filter.dtinsert) : undefined,
      dtupdate: filter.dtupdate ? new Date(filter.dtupdate) : undefined,
      typeName: reportTypeName, // Garantir que o typeName esteja sempre definido
    });
    setOpen(true);
  };

  // Função para excluir um filtro
  const handleDeleteFilter = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este filtro?")) {
      try {
        await deleteReportFilter(id);
        toast.success("Filtro excluído com sucesso");
        // Forçar refresh da página após exclusão, mantendo na aba de filtros
        const reportId = newReportId || report.id;
        window.location.href = `/portal/reports/${reportId}?activeTab=step2`;
      } catch (error) {
        console.error("Erro ao excluir filtro:", error);
        toast.error("Erro ao excluir filtro");
      }
    }
  };

  // Função para formatar data e hora
  const formatDateTime = (date: Date | string | null | undefined): string => {
    if (!date) return "-";
    try {
      const dateObj = new Date(date);
      return (
        dateObj.toLocaleDateString("pt-BR") +
        " " +
        dateObj.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "-";
    }
  };

  // Adicionando o useEffect para abrir automaticamente o filtro para edição
  useEffect(() => {
    if (editFilterId && existingFilters.length > 0) {
      const filterToEdit = existingFilters.find(
        (filter) => filter.id === editFilterId
      );
      if (filterToEdit) {
        handleEditFilter(filterToEdit);
      }
    }
  }, [editFilterId, existingFilters]);

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        onValueChange={handleStepChange}
        className="w-full"
      >
        <div className="flex justify-center w-full mb-4">
          <div className="w-full md:w-1/3">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="step1" className="text-sm">
                1. Criar Relatório
              </TabsTrigger>
              <TabsTrigger
                value="step2"
                className="text-sm"
                disabled={!isFirstStepComplete}
              >
                2. Configurar Filtros
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="step1">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <ReportForm
                report={report}
                recorrence={recorrence}
                period={period}
                fileFormat={fileFormat}
                reportType={reportType}
                permissions={permissions}
                onReportCreated={handleFirstStepComplete}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step2">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              {isFirstStepComplete && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Filtros do Relatório
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Configure os filtros para o relatório
                      </p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={handleAddFilter}>
                          Adicionar Filtro
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {editingFilter?.id
                              ? "Editar Filtro"
                              : "Novo Filtro"}
                          </DialogTitle>
                        </DialogHeader>
                        {editingFilter && (
                          <FilterForm
                            filter={editingFilter as ReportFilterSchema}
                            reportId={newReportId || (report.id as number)}
                            reportFilterParams={reportFilterParams}
                            closeDialog={handleCloseDialog}
                            reportTypeDD={reportType}
                            preloadedData={preloadedFilterData}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>

                  {existingFilters.length === 0 ? (
                    <div className="text-center py-8 bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">
                        Nenhum filtro configurado. Clique em Adicionar Filtro
                        para começar.
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parâmetro</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Data de Inserção</TableHead>
                            <TableHead>Data de Atualização</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {existingFilters.map((filter) => (
                            <TableRow key={filter.id}>
                              <TableCell className="font-medium">
                                {filter.paramName}
                              </TableCell>
                              <TableCell>{filter.displayValue}</TableCell>
                              <TableCell>
                                {formatDateTime(filter.dtinsert).split(" ")[0]}
                              </TableCell>
                              <TableCell>
                                {formatDateTime(filter.dtupdate).split(" ")[0]}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mr-1"
                                  onClick={() => handleEditFilter(filter)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteFilter(filter.id)}
                                >
                                  Excluir
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
