"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  cardPaymentMethod,
  cycleTypeList,
  processingTypeList,
  splitTypeList,
  transactionProductTypeList,
  transactionStatusList,
} from "@/lib/lookuptables/lookuptables-transactions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ReportTypeDD } from "../server/reports";
import {
  BrandOption,
  getAllBrands,
  getFilterFormData,
  insertReportFilter,
  MerchantOption,
  ReportFilterParamDetail,
  searchMerchants,
  searchTerminals,
  TerminalOption,
  updateReportFilter,
} from "./filter-Actions";
import { ReportFilterSchema, SchemaReportFilter } from "./schema";

// Tipo de seletor a exibir
type SelectorType =
  | "none"
  | "brand"
  | "status"
  | "dateRange"
  | "merchant"
  | "valueRange"
  | "paymentType"
  | "terminal"
  | "cycleType"
  | "splitType"
  | "captureMode"
  | "entryMode"
  | "nsu";

interface FilterFormProps {
  filter: ReportFilterSchema;
  reportId: number;
  reportFilterParams: ReportFilterParamDetail[];
  closeDialog: () => void;
  reportTypeDD: ReportTypeDD[];
}

// Definir a lista de status da agenda do merchant como uma constante local
const agendaStatusList = [
  { value: "SETTLED", label: "Liquidadas" },
  { value: "FULLY_ANTICIPATED", label: "Antecipadas" },
  { value: "PARTIAL_ANTICIPATED", label: "Parcialmente Antecipadas" },
  { value: "PARTIAL_SETTLED", label: "Parcialmente Liquidadas" },
  { value: "PROVISIONED", label: "Previstas" },
  { value: "PARTIAL_PROVISIONED", label: "Parcialmente Previstas" },
  { value: "CANCELLED", label: "Canceladas" },
];

export default function FilterForm({
  filter,
  reportId,
  reportFilterParams,
  closeDialog,
  reportTypeDD,
}: FilterFormProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>(
    filter.typeName === "Agenda dos logistas"
      ? "AL"
      : filter.typeName === "Vendas"
      ? "VN"
      : ""
  );
  const [filteredParams, setFilteredParams] = useState<
    ReportFilterParamDetail[]
  >(
    selectedType
      ? reportFilterParams.filter((param) => param.type === selectedType)
      : []
  );
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStatusList, setSelectedStatusList] = useState<string[]>([]);

  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState<string[]>(
    []
  );
  const [selectedCycleTypes, setSelectedCycleTypes] = useState<string[]>([]);
  const [selectedSplitTypes, setSelectedSplitTypes] = useState<string[]>([]);
  const [selectedCaptureModes, setSelectedCaptureModes] = useState<string[]>(
    []
  );
  const [selectedEntryModes, setSelectedEntryModes] = useState<string[]>([]);
  const [selectorType, setSelectorType] = useState<SelectorType>("none");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minValue, setMinValue] = useState<string>("");
  const [maxValue, setMaxValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [paramSelected, setParamSelected] = useState<boolean>(!!filter.id);
  const [merchants, setMerchants] = useState<MerchantOption[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMerchant, setSelectedMerchant] =
    useState<MerchantOption | null>(null);
  const [terminals, setTerminals] = useState<TerminalOption[]>([]);
  const [terminalSearchTerm, setTerminalSearchTerm] = useState<string>("");
  const [selectedTerminal, setSelectedTerminal] =
    useState<TerminalOption | null>(null);
  const [showTerminalSuggestions, setShowTerminalSuggestions] =
    useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLDivElement>(null);
  const terminalSearchInputRef = useRef<HTMLDivElement>(null);

  const form = useForm<ReportFilterSchema>({
    resolver: zodResolver(SchemaReportFilter),
    defaultValues: {
      ...filter,
      idReport: reportId,
      idReportFilterParam: filter.id ? filter.idReportFilterParam : undefined,
    },
  });

  // Inicializar o componente
  useEffect(() => {
    const initialize = async () => {
      // Tentar buscar informações sobre o tipo do relatório diretamente
      if (reportId) {
        try {
          const reportData = await getFilterFormData(reportId);

          if (reportData.reportType) {
            // Definir o tipo com base no resultado da consulta
            setSelectedType(reportData.reportType);

            // Filtrar parâmetros com base no tipo do relatório
            const filtered = reportFilterParams.filter(
              (param: ReportFilterParamDetail) =>
                param.type === reportData.reportType
            );

            if (filtered.length > 0) {
              setFilteredParams(filtered);
            } else {
              setFilteredParams(reportFilterParams);
            }

            return; // Sair da função já que já definimos o tipo
          }
        } catch (error) {
          console.error("Erro ao buscar informações do relatório:", error);
        }
      }

      // Continuamos com a lógica existente caso a busca direta falhe
      // Definir o tipo com base no filtro ou no formato padrão
      let typeToUse = "";

      // Se temos um typeName no filtro existente, usamos ele
      if (filter.typeName) {
        if (filter.typeName === "Agenda dos logistas") {
          typeToUse = "AL";
        } else if (filter.typeName === "Vendas") {
          typeToUse = "VN";
        }
      }
      // Caso contrário, usamos o tipo já selecionado (se existir)
      else if (selectedType) {
        typeToUse = selectedType;
      }
      // Se não temos nada, verificamos se temos tipos disponíveis no reportTypeDD
      else if (reportTypeDD.length > 0) {
        // Por padrão, usar Vendas
        const defaultType = reportTypeDD.find((type) => type.name === "Vendas");
        if (defaultType) {
          typeToUse = defaultType.code;
        } else {
          // Se não encontrar Vendas, use o primeiro tipo disponível
          typeToUse = reportTypeDD[0].code;
        }
      }

      // Definir o tipo selecionado
      if (typeToUse) {
        console.log("Definindo tipo como:", typeToUse);
        setSelectedType(typeToUse);

        // Filtrar parâmetros com base no tipo
        const filtered = reportFilterParams.filter(
          (param: ReportFilterParamDetail) => param.type === typeToUse
        );
        console.log(`Parâmetros filtrados para ${typeToUse}:`, filtered);
        setFilteredParams(filtered);
      } else {
        console.log(
          "Não foi possível determinar um tipo, mantendo todos os parâmetros"
        );
        setFilteredParams(reportFilterParams);
      }

      // Se existe um ID de filtro, então é edição e inicializamos os controles
      if (filter.id) {
        const paramId = filter.idReportFilterParam;
        const param = reportFilterParams.find((p) => p.id === paramId);

        if (param) {
          // Atualizar o tipo de seletor com base no nome do parâmetro
          if (param.name === "Bandeira") {
            setSelectorType("brand");

            // Inicializar seleção de bandeiras
            if (filter.value) {
              if (filter.value.includes(",")) {
                const brandValues = filter.value
                  .split(",")
                  .map((b) => b.trim());
                setSelectedBrands(brandValues);
              } else if (filter.value) {
                setSelectedBrands([filter.value]);
              }
            }
          } else if (param.name === "totalAmount" && selectedType === "VN") {
            setSelectorType("dateRange");

            // Inicializar datas
            if (filter.value && filter.value.includes(",")) {
              const [start, end] = filter.value.split(",").map((d) => d.trim());
              setStartDate(start);
              setEndDate(end);
            }
          } else if (
            param.name &&
            param.name.toLowerCase() === "valor" &&
            selectedType === "VN"
          ) {
            setSelectorType("valueRange");

            // Inicializar valores
            if (filter.value && filter.value.includes(",")) {
              const [min, max] = filter.value.split(",").map((v) => v.trim());
              setMinValue(min);
              setMaxValue(max);
            }
          } else if (param.name === "Status") {
            setSelectorType("status");

            // Inicializar status selecionado
            if (filter.value) {
              if (filter.value.includes(",")) {
                const statusValues = filter.value
                  .split(",")
                  .map((s) => s.trim());
                setSelectedStatusList(statusValues);
              } else {
                setSelectedStatusList([filter.value]);
              }
            }
          } else if (param.name === "Estabelecimento") {
            setSelectorType("merchant");

            // Inicializar estabelecimento se houver valor
            if (filter.value) {
              // Verificar se o valor está no formato "nome|id"
              if (filter.value.includes("|")) {
                const [merchantName, merchantId] = filter.value.split("|");

                // Se temos o ID, buscamos diretamente
                if (merchantId) {
                  setLoading(true);
                  try {
                    // Carregamos uma lista de estabelecimentos
                    const merchantsData = await searchMerchants();
                    setMerchants(merchantsData);

                    // Procurar pelo ID nas merchants carregadas
                    const foundMerchant = merchantsData.find(
                      (m) => m.id === Number(merchantId)
                    );

                    if (foundMerchant) {
                      // Se encontrar, usar os dados completos do merchant
                      setSelectedMerchant(foundMerchant);
                      setSearchTerm(foundMerchant.name || "");
                    } else {
                      // Se não encontrar, usar os dados parciais
                      setSelectedMerchant({
                        id: Number(merchantId),
                        name: merchantName,
                        slug: null,
                        corporateName: null,
                      });
                      setSearchTerm(merchantName);
                    }
                  } catch (error) {
                    console.error("Erro ao carregar estabelecimentos:", error);
                  } finally {
                    setLoading(false);
                  }
                }
              } else {
                // Formato antigo - apenas o nome ou slug
                setLoading(true);
                try {
                  const merchantsData = await searchMerchants(filter.value);
                  setMerchants(merchantsData);

                  // Encontrar o estabelecimento pelo slug (prioridade) ou nome
                  const merchant = merchantsData.find(
                    (m) => m.slug === filter.value || m.name === filter.value
                  );
                  if (merchant) {
                    setSelectedMerchant(merchant);
                    setSearchTerm(merchant.name || "");
                  }
                } catch (error) {
                  console.error("Erro ao carregar estabelecimentos:", error);
                } finally {
                  setLoading(false);
                }
              }
            }
          } else if (param.name === "Tipo de Pagamento") {
            setSelectorType("paymentType");

            // Inicializar tipo de pagamento selecionado
            if (filter.value) {
              if (filter.value.includes(",")) {
                const transactionValues = filter.value
                  .split(",")
                  .map((p) => p.trim());
                setSelectedPaymentTypes(transactionValues);
              } else if (filter.value) {
                setSelectedPaymentTypes([filter.value]);
              }
            }
          } else if (param.name === "Terminal") {
            setSelectorType("terminal");

            // Inicializar terminal selecionado
            if (filter.value) {
              setLoading(true);
              try {
                const terminalsData = await searchTerminals(filter.value);
                setTerminals(terminalsData);

                // Encontrar o terminal pelo slug (prioridade) ou logical_number
                const terminal = terminalsData.find(
                  (t) =>
                    t.slug === filter.value || t.logical_number === filter.value
                );
                if (terminal) {
                  setSelectedTerminal(terminal);
                  setTerminalSearchTerm(terminal.logical_number ?? "");
                }
              } catch (error) {
                console.error("Erro ao carregar terminais:", error);
              } finally {
                setLoading(false);
              }
            }
          } else if (param.name === "Ciclo da Transação") {
            setSelectorType("cycleType");

            // Inicializar ciclos de transação selecionados
            if (filter.value) {
              if (filter.value.includes(",")) {
                const cycleValues = filter.value
                  .split(",")
                  .map((c) => c.trim());
                setSelectedCycleTypes(cycleValues);
              } else if (filter.value) {
                setSelectedCycleTypes([filter.value]);
              }
            }
          } else if (param.name === "Repasse da Transação") {
            setSelectorType("splitType");

            // Inicializar tipos de repasse selecionados
            if (filter.value) {
              if (filter.value.includes(",")) {
                const splitValues = filter.value
                  .split(",")
                  .map((s) => s.trim());
                setSelectedSplitTypes(splitValues);
              } else if (filter.value) {
                setSelectedSplitTypes([filter.value]);
              }
            }
          } else if (param.name === "Modo de Captura") {
            setSelectorType("captureMode");

            // Inicializar modos de captura selecionados
            if (filter.value) {
              if (filter.value.includes(",")) {
                const captureValues = filter.value
                  .split(",")
                  .map((c) => c.trim());
                setSelectedCaptureModes(captureValues);
              } else if (filter.value) {
                setSelectedCaptureModes([filter.value]);
              }
            }
          } else if (param.name === "Modo de Entrada") {
            setSelectorType("entryMode");

            // Inicializar modos de entrada selecionados
            if (filter.value) {
              if (filter.value.includes(",")) {
                const entryValues = filter.value
                  .split(",")
                  .map((e) => e.trim());
                setSelectedEntryModes(entryValues);
              } else if (filter.value) {
                setSelectedEntryModes([filter.value]);
              }
            }
          } else {
            setSelectorType("none");
          }
        }
      } else {
        // Para novo filtro, não inicializamos nada
        setSelectorType("none");
        setParamSelected(false); // Reset o estado de parâmetro selecionado
        // Reset all fields
        setSelectedBrands([]);
        setStartDate("");
        setEndDate("");
        setMinValue("");
        setMaxValue("");
        setSelectedStatusList([]);
        setSelectedMerchant(null);

        setSelectedPaymentTypes([]);
        setSelectedCycleTypes([]);
        setSelectedSplitTypes([]);
        setSelectedCaptureModes([]);
        setSelectedEntryModes([]);
        setSelectedTerminal(null);
        setTerminalSearchTerm("");
        setTerminals([]);
      }
    };

    initialize();
  }, [selectedType, filter, reportFilterParams]);

  // Carregar bandeiras no início
  useEffect(() => {
    const loadBrands = async () => {
      if (brands.length === 0) {
        setLoading(true);
        try {
          const brandsData = await getAllBrands();
          setBrands(brandsData);
        } catch (error) {
          console.error("Erro ao carregar bandeiras:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadBrands();
  }, [brands.length]);

  useEffect(() => {
    // Garantir que o tipo selecionado está definido com base no tipo do relatório
    if (!selectedType && reportTypeDD.length > 0) {
      // Verificar se o reportId corresponde a um relatório existente
      const foundReportType = reportId
        ? reportTypeDD.find((type) => {
            // Se já temos um filtro com typeName, verificar se corresponde a um tipo conhecido
            if (filter.typeName) {
              return filter.typeName === "Agenda dos logistas"
                ? type.code === "AL"
                : filter.typeName === "Vendas"
                ? type.code === "VN"
                : false;
            }
            // Caso contrário, por padrão selecionar o tipo "Vendas" se disponível
            return type.name === "Vendas";
          })
        : reportTypeDD.find((type) => type.name === "Vendas");

      if (foundReportType) {
        setSelectedType(foundReportType.code);

        // Filtrar parâmetros baseados no tipo
        const filtered = reportFilterParams.filter(
          (param) => param.type === foundReportType.code
        );
        setFilteredParams(filtered);
      }
    }
  }, [
    reportTypeDD,
    selectedType,
    filter.typeName,
    reportId,
    reportFilterParams,
  ]);

  // Adicionar useEffect para carregar os parâmetros apropriados para relatórios do tipo AL
  useEffect(() => {
    // Verificar se estamos tratando de um relatório do tipo Agenda dos Logistas
    if (filter.typeName === "Agenda dos logistas" || selectedType === "AL") {
      console.log("Verificando parâmetros AL...");

      // Verificar se temos parâmetros do tipo AL
      const alParams = reportFilterParams.filter(
        (param) => param.type === "AL"
      );
      console.log("Parâmetros AL encontrados:", alParams.length);

      if (alParams.length > 0) {
        // Se temos parâmetros, definir filteredParams
        setFilteredParams(alParams);
      } else {
        console.log(
          "Nenhum parâmetro AL encontrado, usando todos os parâmetros disponíveis"
        );
        // Se não encontrarmos parâmetros do tipo AL, usar todos os disponíveis para não deixar o dropdown vazio
        setFilteredParams(reportFilterParams);
      }
    }
  }, [filter.typeName, selectedType, reportFilterParams]);

  // Função para lidar com a alteração de parâmetro
  const handleParamChange = async (paramId: number) => {
    console.log("Parâmetro selecionado ID:", paramId);
    const param = reportFilterParams.find((p) => p.id === paramId);
    console.log("Parâmetro encontrado:", param);

    if (!param) {
      console.log("Parâmetro não encontrado!");
      return;
    }

    setParamSelected(true);

    // Reset all selector states
    setSelectedBrands([]);
    setStartDate("");
    setEndDate("");
    setMinValue("");
    setMaxValue("");
    setSelectedStatusList([]);
    setSelectedMerchant(null);

    setSelectedPaymentTypes([]);
    setSelectedCycleTypes([]);
    setSelectedSplitTypes([]);
    setSelectedCaptureModes([]);
    setSelectedEntryModes([]);
    setSelectedTerminal(null);
    setTerminalSearchTerm("");
    setTerminals([]);

    // Determinar qual tipo de seletor deve ser exibido com base no nome do parâmetro
    if (param.name === "Bandeira") {
      setSelectorType("brand");

      // Carregar bandeiras iniciais
      try {
        const brandsData = await getAllBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error("Erro ao carregar bandeiras:", error);
        setBrands([]);
      }
    } else if (param.name === "Data") {
      setSelectorType("dateRange");
    } else if (param.name === "Valor") {
      setSelectorType("valueRange");
    } else if (param.name === "Status") {
      setSelectorType("status");
    } else if (
      param.name === "NSU" &&
      (selectedType === "AL" || filter.typeName === "Agenda dos logistas")
    ) {
      setSelectorType("nsu");
    } else if (param.name === "Estabelecimento") {
      setSelectorType("merchant");

      // Carregar estabelecimentos iniciais
      setLoading(true);
      try {
        const merchantsData = await searchMerchants();
        setMerchants(merchantsData);
      } catch (error) {
        console.error("Erro ao carregar estabelecimentos:", error);
      } finally {
        setLoading(false);
      }
    } else if (param.name === "Tipo de Pagamento") {
      setSelectorType("paymentType");
    } else if (param.name === "Terminal") {
      setSelectorType("terminal");

      // Carregar terminais iniciais
      setLoading(true);
      try {
        const terminalsData = await searchTerminals();
        setTerminals(terminalsData);
      } catch (error) {
        console.error("Erro ao carregar terminais:", error);
      } finally {
        setLoading(false);
      }
    } else if (param.name === "Ciclo da Transação") {
      setSelectorType("cycleType");
    } else if (param.name === "Repasse da Transação") {
      setSelectorType("splitType");
    } else if (param.name === "Modo de Captura") {
      setSelectorType("captureMode");
    } else if (param.name === "Modo de Entrada") {
      setSelectorType("entryMode");
    } else {
      setSelectorType("none");
    }
  };

  // Função para buscar estabelecimentos quando o botão é clicado
  const searchMerchantsByTerm = useCallback(async () => {
    if (searchTerm.length < 2) return;

    setLoading(true);
    setShowSuggestions(true);

    try {
      const results = await searchMerchants(searchTerm);
      setMerchants(results);
    } catch (error) {
      console.error("Erro ao buscar estabelecimentos:", error);
      setMerchants([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Função para buscar terminais quando o botão é clicado
  const searchTerminalsByTerm = useCallback(async () => {
    if (terminalSearchTerm.length < 2) return;

    setLoading(true);
    setShowTerminalSuggestions(true);

    try {
      const results = await searchTerminals(terminalSearchTerm);
      setTerminals(results);
    } catch (error) {
      console.error("Erro ao buscar terminais:", error);
      setTerminals([]);
    } finally {
      setLoading(false);
    }
  }, [terminalSearchTerm]);

  // Validar se a data final é maior que a inicial
  const isDateRangeValid = (): boolean => {
    if (!startDate || !endDate) return false;

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return end >= start;
    } catch {
      return false;
    }
  };

  // Validar se o intervalo de valores é válido
  const isValueRangeValid = (): boolean => {
    if (!minValue || !maxValue) return false;

    try {
      const min = parseFloat(minValue);
      const max = parseFloat(maxValue);
      return (
        !isNaN(min) && !isNaN(max) && max >= min && min >= 1 && max <= 9999999
      );
    } catch {
      return false;
    }
  };

  // Fechar sugestões quando clicar fora do componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fechar sugestões de terminal quando clicar fora do componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        terminalSearchInputRef.current &&
        !terminalSearchInputRef.current.contains(event.target as Node)
      ) {
        setShowTerminalSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = async (data: ReportFilterSchema) => {
    // Os estados já foram atualizados diretamente nos campos FormField,
    // então data.value já deve conter o valor correto baseado no tipo de seletor

    try {
      if (data?.id) {
        await updateReportFilter({
          ...data,
          id: data.id as number,
          idReport: reportId,
          dtinsert: (data.dtinsert || new Date()).toISOString(),
          dtupdate: (data.dtinsert || new Date()).toISOString(),
          typeName: data.typeName || null,
        });
        router.refresh();
        closeDialog();
      } else {
        await insertReportFilter({
          ...data,
          idReport: reportId,
          idReportFilterParam: data.idReportFilterParam,
          dtinsert: (data.dtinsert || new Date()).toISOString(),
          dtupdate: (data.dtinsert || new Date()).toISOString(),
        });
        router.refresh(); // Apenas atualiza os dados
        closeDialog();
      }
    } catch (error) {
      console.error("Erro ao salvar filtro:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div id="filter-content">
            <p className="text-xs text-muted-foreground mb-2">{`Tipo de relatório: ${
              reportTypeDD.find((type) => type.code === selectedType)?.name ||
              selectedType
            }`}</p>

            {selectedType && (
              <FormField
                control={form.control}
                name="idReportFilterParam"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Parâmetro de Filtro</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        handleParamChange(Number(value));
                      }}
                      value={field.value ? String(field.value) : undefined}
                      disabled={filteredParams.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Verificar se há parâmetros para exibir */}
                        {filteredParams.length > 0 ? (
                          filteredParams.map((param) => (
                            <SelectItem key={param.id} value={String(param.id)}>
                              {param.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value="no-options">
                            Nenhum parâmetro disponível
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Mensagem de carregamento */}
            {loading && (
              <div className="flex items-center justify-center p-4 mt-4 border rounded-md">
                <p className="text-sm text-muted-foreground">
                  Carregando dados...
                </p>
              </div>
            )}

            {/* Mostrar o seletor apropriado com base no tipo selecionado e apenas se um parâmetro estiver selecionado */}
            {!loading && paramSelected && selectorType === "brand" && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione as Bandeiras</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-md">
                        {brands.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            Carregando bandeiras...
                          </p>
                        ) : (
                          brands.map((brand) => (
                            <div
                              key={brand.code}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`brand-${brand.code}`}
                                checked={selectedBrands.includes(brand.code)}
                                onCheckedChange={() => {
                                  // Alternar a seleção
                                  const newSelection = selectedBrands.includes(
                                    brand.code
                                  )
                                    ? selectedBrands.filter(
                                        (b) => b !== brand.code
                                      )
                                    : [...selectedBrands, brand.code];

                                  // Atualizar o estado local
                                  setSelectedBrands(newSelection);

                                  // Atualizar o valor do campo
                                  field.onChange(newSelection.join(","));
                                }}
                              />
                              <label
                                htmlFor={`brand-${brand.code}`}
                                className="text-sm cursor-pointer"
                              >
                                {brand.name}
                              </label>
                            </div>
                          ))
                        )}
                      </div>
                      {selectedBrands.length === 0 && brands.length > 0 && (
                        <p className="text-xs text-destructive mt-1">
                          Selecione pelo menos uma bandeira
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!loading && paramSelected && selectorType === "status" && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione os Status</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-md">
                        {/* Utilizar a lista de status local para AL, transactionStatusList para VN */}
                        {selectedType === "AL" ||
                        filter.typeName === "Agenda dos logistas"
                          ? agendaStatusList.map((status) => (
                              <div
                                key={status.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`status-${status.value}`}
                                  checked={selectedStatusList.includes(
                                    status.value
                                  )}
                                  onCheckedChange={() => {
                                    // Alternar a seleção
                                    const newSelection =
                                      selectedStatusList.includes(status.value)
                                        ? selectedStatusList.filter(
                                            (s) => s !== status.value
                                          )
                                        : [...selectedStatusList, status.value];

                                    // Atualizar o estado local
                                    setSelectedStatusList(newSelection);

                                    // Atualizar o valor do campo
                                    field.onChange(newSelection.join(","));
                                  }}
                                />
                                <label
                                  htmlFor={`status-${status.value}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {status.label}
                                </label>
                              </div>
                            ))
                          : transactionStatusList.map((status) => (
                              <div
                                key={status.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`status-${status.value}`}
                                  checked={selectedStatusList.includes(
                                    status.value
                                  )}
                                  onCheckedChange={() => {
                                    // Alternar a seleção
                                    const newSelection =
                                      selectedStatusList.includes(status.value)
                                        ? selectedStatusList.filter(
                                            (s) => s !== status.value
                                          )
                                        : [...selectedStatusList, status.value];

                                    // Atualizar o estado local
                                    setSelectedStatusList(newSelection);

                                    // Atualizar o valor do campo
                                    field.onChange(newSelection.join(","));
                                  }}
                                />
                                <label
                                  htmlFor={`status-${status.value}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {status.label}
                                </label>
                              </div>
                            ))}
                      </div>
                      {selectedStatusList.length === 0 && (
                        <p className="text-xs text-destructive mt-1">
                          Selecione pelo menos um status
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!loading && paramSelected && selectorType === "dateRange" && (
              <div className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o Intervalo de Datas</FormLabel>
                      <div className="flex space-x-2">
                        <Input
                          type="date"
                          placeholder="Data Inicial"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            field.onChange(`${e.target.value},${endDate}`);
                          }}
                        />
                        <Input
                          type="date"
                          placeholder="Data Final"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            field.onChange(`${startDate},${e.target.value}`);
                          }}
                        />
                      </div>
                      {startDate && endDate && !isDateRangeValid() && (
                        <p className="text-xs text-destructive mt-1">
                          A data final deve ser maior ou igual à data inicial
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!loading && paramSelected && selectorType === "paymentType" && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione os Tipos de Pagamento</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-md">
                        {transactionProductTypeList.map((productType) => (
                          <div
                            key={productType.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`paymentType-${productType.value}`}
                              checked={selectedPaymentTypes.includes(
                                productType.value
                              )}
                              onCheckedChange={() => {
                                // Alternar a seleção
                                const newSelection =
                                  selectedPaymentTypes.includes(
                                    productType.value
                                  )
                                    ? selectedPaymentTypes.filter(
                                        (p) => p !== productType.value
                                      )
                                    : [
                                        ...selectedPaymentTypes,
                                        productType.value,
                                      ];

                                // Atualizar o estado local
                                setSelectedPaymentTypes(newSelection);

                                // Atualizar o valor do campo
                                field.onChange(newSelection.join(","));
                              }}
                            />
                            <label
                              htmlFor={`paymentType-${productType.value}`}
                              className="text-sm cursor-pointer"
                            >
                              {productType.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {selectedPaymentTypes.length === 0 && (
                        <p className="text-xs text-destructive mt-1">
                          Selecione pelo menos um tipo de pagamento
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!loading && paramSelected && selectorType === "merchant" && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o Estabelecimento</FormLabel>
                      <div className="relative" ref={searchInputRef}>
                        <div className="flex space-x-2">
                          <Input
                            type="text"
                            placeholder="Digite para buscar estabelecimentos..."
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              // Limpar a lista de sugestões se o campo estiver vazio
                              if (e.target.value.length === 0) {
                                setMerchants([]);
                                setShowSuggestions(false);
                              }
                            }}
                            onKeyDown={(e) => {
                              // Permitir busca ao pressionar Enter
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (searchTerm.length >= 2) {
                                  searchMerchantsByTerm();
                                }
                              } else if (e.key === "Escape") {
                                // Fechar a lista de sugestões ao pressionar ESC
                                setShowSuggestions(false);
                              }
                            }}
                            onFocus={() => {
                              // Mostrar sugestões apenas se já temos resultados anteriores
                              if (
                                merchants.length > 0 &&
                                searchTerm.length >= 2
                              ) {
                                setShowSuggestions(true);
                              }
                            }}
                            className="w-full"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={searchMerchantsByTerm}
                            disabled={searchTerm.length < 2 || loading}
                          >
                            Buscar
                          </Button>
                        </div>

                        {showSuggestions && (
                          <div className="absolute w-full bg-white z-10 mt-1 rounded-md border shadow-md max-h-[300px] overflow-y-auto">
                            {loading ? (
                              <div className="p-4 text-sm text-center text-muted-foreground">
                                Buscando estabelecimentos...
                              </div>
                            ) : merchants.length === 0 ? (
                              <div className="p-2 text-sm text-center text-muted-foreground">
                                Nenhum estabelecimento encontrado. Tente outro
                                termo de busca.
                              </div>
                            ) : (
                              <ul>
                                {merchants.map((merchant) => (
                                  <li
                                    key={merchant.id}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                      selectedMerchant?.id === merchant.id
                                        ? "bg-blue-50"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      setSelectedMerchant(merchant);
                                      setSearchTerm(merchant.name || "");
                                      setShowSuggestions(false);

                                      // Atualizar o valor do campo para usar o slug do merchant
                                      if (merchant.slug) {
                                        field.onChange(merchant.slug);
                                      } else {
                                        // Fallback caso não tenha slug (pouco provável)
                                        field.onChange(
                                          `${merchant.name}|${merchant.id}`
                                        );
                                      }
                                    }}
                                  >
                                    {merchant.name || "N/A"}
                                    {merchant.corporateName &&
                                      ` (${merchant.corporateName})`}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>

                      {selectedMerchant && (
                        <div className="flex flex-col w-full gap-2 mt-4">
                          <div className="flex items-center mt-5 w-full">
                            <Badge
                              variant="outline"
                              className="px-3 py-1.5 bg-blue-100 text-sm break-words flex-grow overflow-hidden"
                            >
                              <span className="block truncate">
                                {selectedMerchant.name || "N/A"}
                                {selectedMerchant.corporateName &&
                                  ` (${selectedMerchant.corporateName})`}
                              </span>
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-2 rounded-full flex-shrink-0"
                              onClick={() => {
                                setSelectedMerchant(null);
                                setSearchTerm("");

                                // Limpar o valor do campo
                                field.onChange("");
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      )}

                      {!selectedMerchant && (
                        <p className="text-xs text-destructive mt-1">
                          Selecione um estabelecimento
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!loading && paramSelected && selectorType === "terminal" && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o Terminal</FormLabel>
                      <div className="relative" ref={terminalSearchInputRef}>
                        <div className="flex space-x-2">
                          <Input
                            type="text"
                            placeholder="Digite para buscar terminais..."
                            value={terminalSearchTerm}
                            onChange={(e) => {
                              setTerminalSearchTerm(e.target.value);
                              // Limpar a lista de sugestões se o campo estiver vazio
                              if (e.target.value.length === 0) {
                                setTerminals([]);
                                setShowTerminalSuggestions(false);
                              }
                            }}
                            onKeyDown={(e) => {
                              // Permitir busca ao pressionar Enter
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (terminalSearchTerm.length >= 2) {
                                  searchTerminalsByTerm();
                                }
                              } else if (e.key === "Escape") {
                                // Fechar a lista de sugestões ao pressionar ESC
                                setShowTerminalSuggestions(false);
                              }
                            }}
                            onFocus={() => {
                              // Mostrar sugestões apenas se já temos resultados anteriores
                              if (
                                terminals.length > 0 &&
                                terminalSearchTerm.length >= 2
                              ) {
                                setShowTerminalSuggestions(true);
                              }
                            }}
                            className="w-full"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={searchTerminalsByTerm}
                            disabled={terminalSearchTerm.length < 2 || loading}
                          >
                            Buscar
                          </Button>
                        </div>

                        {showTerminalSuggestions && (
                          <div className="absolute w-full bg-white z-10 mt-1 rounded-md border shadow-md max-h-[300px] overflow-y-auto">
                            {loading ? (
                              <div className="p-4 text-sm text-center text-muted-foreground">
                                Buscando terminais...
                              </div>
                            ) : terminals.length === 0 ? (
                              <div className="p-2 text-sm text-center text-muted-foreground">
                                Nenhum terminal encontrado. Tente outro termo de
                                busca.
                              </div>
                            ) : (
                              <ul>
                                {terminals.map((terminal) => (
                                  <li
                                    key={terminal.id}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                      selectedTerminal?.id === terminal.id
                                        ? "bg-blue-50"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      setSelectedTerminal(terminal);
                                      setTerminalSearchTerm(
                                        terminal.logical_number ?? ""
                                      );
                                      setShowTerminalSuggestions(false);

                                      // Atualizar o valor do campo com o slug ao invés do logical_number
                                      field.onChange(terminal.slug || "");
                                    }}
                                  >
                                    {terminal.logical_number || "N/A"} -{" "}
                                    {terminal.model || "Desconhecido"}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>

                      {selectedTerminal && (
                        <div className="flex flex-col w-full gap-2 mt-2">
                          <div className="flex items-center mt-5  w-full">
                            <Badge
                              variant="outline"
                              className="px-3 py-1.5 bg-blue-100 text-sm break-words flex-grow overflow-hidden"
                            >
                              <span className="block truncate">
                                {selectedTerminal.logical_number || "N/A"} -{" "}
                                {selectedTerminal.model || "Desconhecido"}
                              </span>
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-2 rounded-full flex-shrink-0"
                              onClick={() => {
                                setSelectedTerminal(null);
                                setTerminalSearchTerm("");

                                // Limpar o valor do campo
                                field.onChange("");
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      )}

                      {!selectedTerminal && (
                        <p className="text-xs text-destructive mt-1">
                          Selecione um terminal
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!loading && paramSelected && selectorType === "valueRange" && (
              <div className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o Intervalo de Valores</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <FormLabel className="text-sm">De</FormLabel>
                          <Input
                            type="number"
                            min="1"
                            max="9999999"
                            value={minValue}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setMinValue(newValue);
                              // Atualizar o valor do campo sempre, mesmo que o outro valor não esteja preenchido
                              field.onChange(`${newValue},${maxValue || ""}`);
                            }}
                            placeholder="Valor inicial"
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <FormLabel className="text-sm">Até</FormLabel>
                          <Input
                            type="number"
                            min="1"
                            max="9999999"
                            value={maxValue}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setMaxValue(newValue);
                              // Atualizar o valor do campo sempre, mesmo que o outro valor não esteja preenchido
                              field.onChange(`${minValue || ""},${newValue}`);
                            }}
                            placeholder="Valor final"
                            className="w-full"
                          />
                        </div>
                      </div>
                      {(!minValue || !maxValue) && (
                        <p className="text-xs text-destructive">
                          Informe os valores inicial e final
                        </p>
                      )}
                      {minValue && maxValue && !isValueRangeValid() && (
                        <p className="text-xs text-destructive">
                          O valor final deve ser maior ou igual ao valor inicial
                          e ambos devem estar entre 1 e 9.999.999
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!loading && paramSelected && selectorType === "cycleType" && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o Ciclo da Transação</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-md">
                        {cycleTypeList.map((cycleType) => (
                          <div
                            key={cycleType.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`cycleType-${cycleType.value}`}
                              checked={selectedCycleTypes.includes(
                                cycleType.value
                              )}
                              onCheckedChange={() => {
                                // Alternar a seleção
                                const newSelection =
                                  selectedCycleTypes.includes(cycleType.value)
                                    ? selectedCycleTypes.filter(
                                        (c) => c !== cycleType.value
                                      )
                                    : [...selectedCycleTypes, cycleType.value];

                                // Atualizar o estado local
                                setSelectedCycleTypes(newSelection);

                                // Atualizar o valor do campo
                                field.onChange(newSelection.join(","));
                              }}
                            />
                            <label
                              htmlFor={`cycleType-${cycleType.value}`}
                              className="text-sm cursor-pointer"
                            >
                              {cycleType.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {selectedCycleTypes.length === 0 && (
                        <p className="text-xs text-destructive mt-1">
                          Selecione pelo menos um tipo de ciclo
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!loading && paramSelected && selectorType === "splitType" && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o Repasse da Transação</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-md">
                        {splitTypeList.map((splitType) => (
                          <div
                            key={splitType.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`splitType-${splitType.value}`}
                              checked={selectedSplitTypes.includes(
                                splitType.value
                              )}
                              onCheckedChange={() => {
                                // Alternar a seleção
                                const newSelection =
                                  selectedSplitTypes.includes(splitType.value)
                                    ? selectedSplitTypes.filter(
                                        (s) => s !== splitType.value
                                      )
                                    : [...selectedSplitTypes, splitType.value];

                                // Atualizar o estado local
                                setSelectedSplitTypes(newSelection);

                                // Atualizar o valor do campo
                                field.onChange(newSelection.join(","));
                              }}
                            />
                            <label
                              htmlFor={`splitType-${splitType.value}`}
                              className="text-sm cursor-pointer"
                            >
                              {splitType.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {selectedSplitTypes.length === 0 && (
                        <p className="text-xs text-destructive mt-1">
                          Selecione pelo menos um tipo de repasse
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!loading && paramSelected && selectorType === "captureMode" && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o Modo de Captura</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-md">
                        {cardPaymentMethod.map((captureMode) => (
                          <div
                            key={captureMode.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`captureMode-${captureMode.value}`}
                              checked={selectedCaptureModes.includes(
                                captureMode.value
                              )}
                              onCheckedChange={() => {
                                // Alternar a seleção
                                const newSelection =
                                  selectedCaptureModes.includes(
                                    captureMode.value
                                  )
                                    ? selectedCaptureModes.filter(
                                        (c) => c !== captureMode.value
                                      )
                                    : [
                                        ...selectedCaptureModes,
                                        captureMode.value,
                                      ];

                                // Atualizar o estado local
                                setSelectedCaptureModes(newSelection);

                                // Atualizar o valor do campo
                                field.onChange(newSelection.join(","));
                              }}
                            />
                            <label
                              htmlFor={`captureMode-${captureMode.value}`}
                              className="text-sm cursor-pointer"
                            >
                              {captureMode.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {selectedCaptureModes.length === 0 && (
                        <p className="text-xs text-destructive mt-1">
                          Selecione pelo menos um modo de captura
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!loading && paramSelected && selectorType === "entryMode" && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o Modo de Entrada</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-md">
                        {processingTypeList.map((entryMode) => (
                          <div
                            key={entryMode.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`entryMode-${entryMode.value}`}
                              checked={selectedEntryModes.includes(
                                entryMode.value
                              )}
                              onCheckedChange={() => {
                                // Alternar a seleção
                                const newSelection =
                                  selectedEntryModes.includes(entryMode.value)
                                    ? selectedEntryModes.filter(
                                        (e) => e !== entryMode.value
                                      )
                                    : [...selectedEntryModes, entryMode.value];

                                // Atualizar o estado local
                                setSelectedEntryModes(newSelection);

                                // Atualizar o valor do campo
                                field.onChange(newSelection.join(","));
                              }}
                            />
                            <label
                              htmlFor={`entryMode-${entryMode.value}`}
                              className="text-sm cursor-pointer"
                            >
                              {entryMode.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {selectedEntryModes.length === 0 && (
                        <p className="text-xs text-destructive mt-1">
                          Selecione pelo menos um modo de entrada
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!loading && paramSelected && selectorType === "nsu" && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Sequência Único (NSU)</FormLabel>
                      <Input
                        type="text"
                        placeholder="Digite o NSU"
                        value={field.value || ""}
                        onChange={(e) => {
                          // Permitir apenas números
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                      {(!field.value || field.value.trim() === "") && (
                        <p className="text-xs text-destructive mt-1">
                          Informe o número NSU
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={loading || !form.formState.isValid || !paramSelected}
              >
                Salvar
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
