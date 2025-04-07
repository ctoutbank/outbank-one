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
import { transactionStatusList } from "@/lib/lookuptables/lookuptables-transactions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ReportFilterDetailWithTypeName,
  ReportFilterParamDetail,
  deleteReportFilter,
  getMerchantBySlug,
  getReportFilters,
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

interface ReportsWizardFormProps {
  report: ReportSchema;
  recorrence: Recorrence[];
  period: PeriodDD[];
  fileFormat: FileFormatDD[];
  reportType: ReportTypeDD[];
  permissions: string[];
  reportFilterParams: ReportFilterParamDetail[];
  activeTabDefault: string;
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
}: ReportsWizardFormProps) {
  const [activeTab, setActiveTab] = useState(activeTabDefault);
  const [newReportId, setNewReportId] = useState<number | null>(
    report.id ? (report.id as number) : null
  );
  const [isFirstStepComplete, setIsFirstStepComplete] = useState(!!report.id);
  const [filters, setFilters] = useState<ReportFilterDetailWithTypeName[]>([]);
  const [open, setOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<ReportFilterSchema | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  // Cache para armazenar os nomes dos merchants por slug
  const [merchantNames, setMerchantNames] = useState<Record<string, string>>(
    {}
  );

  // Carregar os filtros existentes quando o componente for montado ou quando o ID do relatório mudar
  useEffect(() => {
    async function loadFilters() {
      if (report.id) {
        setLoading(true);
        try {
          const fetchedFilters = await getReportFilters(report.id as number);
          setFilters(fetchedFilters);

          // Buscar nomes de merchants para slugs
          const merchantSlugs = fetchedFilters
            .filter((f) => {
              const paramName = getFilterParamName(f.idReportFilterParam);
              return paramName === "Estabelecimento" && !f.value.includes("|");
            })
            .map((f) => f.value);

          if (merchantSlugs.length > 0) {
            const namesMap: Record<string, string> = {};

            for (const slug of merchantSlugs) {
              try {
                const merchant = await getMerchantBySlug(slug);
                if (merchant && merchant.name) {
                  namesMap[slug] = merchant.name;
                } else {
                  namesMap[slug] = slug; // Fallback para o slug se não encontrar o nome
                }
              } catch (error) {
                console.error(
                  `Erro ao buscar merchant para slug ${slug}:`,
                  error
                );
                namesMap[slug] = slug; // Fallback para o slug em caso de erro
              }
            }

            setMerchantNames(namesMap);
          }
        } catch (error) {
          console.error("Erro ao carregar filtros:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadFilters();
  }, [report.id]);

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

  // Função que simula o fechamento do dialog para o FilterForm
  const handleCloseDialog = () => {
    setOpen(false);
    // Recarrega os filtros após fechar o diálogo
    if (newReportId || report.id) {
      refreshFilters();
    }
  };

  // Função para recarregar os filtros
  const refreshFilters = async () => {
    if (newReportId || report.id) {
      setLoading(true);
      try {
        const fetchedFilters = await getReportFilters(
          newReportId || (report.id as number)
        );
        setFilters(fetchedFilters);

        // Buscar nomes de merchants para slugs
        const merchantSlugs = fetchedFilters
          .filter((f) => {
            const paramName = getFilterParamName(f.idReportFilterParam);
            return paramName === "Estabelecimento" && !f.value.includes("|");
          })
          .map((f) => f.value);

        if (merchantSlugs.length > 0) {
          const namesMap: Record<string, string> = { ...merchantNames }; // Manter os nomes já carregados

          for (const slug of merchantSlugs) {
            if (!namesMap[slug]) {
              // Só buscar se ainda não tiver no cache
              try {
                const merchant = await getMerchantBySlug(slug);
                if (merchant && merchant.name) {
                  namesMap[slug] = merchant.name;
                } else {
                  namesMap[slug] = slug; // Fallback para o slug se não encontrar o nome
                }
              } catch (error) {
                console.error(
                  `Erro ao buscar merchant para slug ${slug}:`,
                  error
                );
                namesMap[slug] = slug; // Fallback para o slug em caso de erro
              }
            }
          }

          setMerchantNames(namesMap);
        }
      } catch (error) {
        console.error("Erro ao recarregar filtros:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para abrir o dialog de adição de novo filtro
  const handleAddFilter = () => {
    setEditingFilter({
      idReport: newReportId || (report.id as number),
      idReportFilterParam:
        reportFilterParams.length > 0 ? reportFilterParams[0].id : 0,
      value: "",
    });
    setOpen(true);
  };

  // Função para editar um filtro existente
  const handleEditFilter = (filter: ReportFilterDetailWithTypeName) => {
    setEditingFilter({
      id: filter.id,
      idReport: filter.idReport,
      idReportFilterParam: filter.idReportFilterParam,
      value: filter.value,
      dtinsert: filter.dtinsert ? new Date(filter.dtinsert) : undefined,
      dtupdate: filter.dtupdate ? new Date(filter.dtupdate) : undefined,
      typeName: filter.typeName || undefined,
    });
    setOpen(true);
  };

  // Função para excluir um filtro
  const handleDeleteFilter = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este filtro?")) {
      try {
        await deleteReportFilter(id);
        toast.success("Filtro excluído com sucesso");
        refreshFilters();
      } catch (error) {
        console.error("Erro ao excluir filtro:", error);
        toast.error("Erro ao excluir filtro");
      }
    }
  };

  // Função para obter o nome do parâmetro de filtro pelo ID
  const getFilterParamName = (paramId: number): string => {
    const param = reportFilterParams.find((p) => p.id === paramId);
    return param?.name || "Parâmetro desconhecido";
  };

  // Função para formatar o valor do filtro para exibição
  const formatFilterValue = (
    filter: ReportFilterDetailWithTypeName
  ): string => {
    const paramName = getFilterParamName(filter.idReportFilterParam);

    // Tratamento específico para Status
    if (paramName === "Status") {
      const statusValues = filter.value.split(",").map((s) => s.trim());
      return statusValues
        .map((value) => {
          const status = transactionStatusList.find((s) => s.value === value);
          return status ? status.label : value;
        })
        .join(", ");
    }

    // Tratamento específico para Estabelecimento (merchant)
    if (paramName === "Estabelecimento") {
      // Caso seja um slug (sem | no valor)
      if (!filter.value.includes("|")) {
        // Buscar no cache de nomes de merchants
        return merchantNames[filter.value] || filter.value;
      }

      // Caso seja o formato antigo (nome|id)
      const parts = filter.value.split("|");
      return parts[0]; // Retorna apenas o nome
    }

    // Formatação padrão
    return filter.value;
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
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>

                  {loading ? (
                    <div className="text-center py-4">
                      Carregando filtros...
                    </div>
                  ) : filters.length === 0 ? (
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
                          {filters.map((filter) => (
                            <TableRow key={filter.id}>
                              <TableCell className="font-medium">
                                {getFilterParamName(filter.idReportFilterParam)}
                              </TableCell>
                              <TableCell>{formatFilterValue(filter)}</TableCell>
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
