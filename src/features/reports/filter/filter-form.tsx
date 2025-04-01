"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProcessingType, ProductType, Status } from "@/lib/lookuptables";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { ReportTypeDD } from "../server/reports";
import { BrandOption, getAllBrands, insertReportFilter, MerchantOption, ReportFilterParamDetail, searchMerchants, updateReportFilter, searchTerminals, TerminalOption } from "./filter-Actions";
import { ReportFilterSchema, SchemaReportFilter } from "./schema";

// Tipo de seletor a exibir
type SelectorType = "none" | "brand" | "status" | "dateRange" | "merchant" | "valueRange" | "transactionType" | "paymentType" | "processingType" | "terminal";

interface FilterFormProps {
    filter: ReportFilterSchema;
    reportId: number;
    reportFilterParams: ReportFilterParamDetail[];
    closeDialog: () => void;
    reportTypeDD: ReportTypeDD[]
}

export default function FilterForm({ filter, reportId, reportFilterParams, closeDialog, reportTypeDD }: FilterFormProps) {

    const router = useRouter();
    const [selectedType, setSelectedType] = useState<string>(filter.typeName === 'Agenda dos logistas' ? 'AL' : filter.typeName === 'Vendas' ? 'VN' : '');
    const [filteredParams, setFilteredParams] = useState<ReportFilterParamDetail[]>(
        selectedType ? reportFilterParams.filter(param => param.type === selectedType) : []
    );
    const [brands, setBrands] = useState<BrandOption[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedTransactionType, setSelectedTransactionType] = useState<string>('');
    const [selectedPaymentType, setSelectedPaymentType] = useState<string>('');
    const [selectedProcessingTypes, setSelectedProcessingTypes] = useState<string[]>([]);
    const [selectorType, setSelectorType] = useState<SelectorType>("none");
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [minValue, setMinValue] = useState<string>('');
    const [maxValue, setMaxValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [paramSelected, setParamSelected] = useState<boolean>(!!filter.id);
    const [merchants, setMerchants] = useState<MerchantOption[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedMerchant, setSelectedMerchant] = useState<MerchantOption | null>(null);
    const [terminals, setTerminals] = useState<TerminalOption[]>([]);
    const [terminalSearchTerm, setTerminalSearchTerm] = useState<string>('');
    const [selectedTerminal, setSelectedTerminal] = useState<TerminalOption | null>(null);
    const [showTerminalSuggestions, setShowTerminalSuggestions] = useState<boolean>(false);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLDivElement>(null);
    const terminalSearchInputRef = useRef<HTMLDivElement>(null);

    const form = useForm<ReportFilterSchema>({
        resolver: zodResolver(SchemaReportFilter),
        defaultValues: {
            ...filter,
            idReport: reportId,
            idReportFilterParam: filter.id ? filter.idReportFilterParam : undefined
        },
    });

    // Inicializar o componente
    useEffect(() => {
        const initialize = async () => {
            if (selectedType) {
                const filtered = reportFilterParams.filter(param => param.type === selectedType);
                setFilteredParams(filtered);
                
                // Se existe um ID de filtro, então é edição e inicializamos os controles
                if (filter.id) {
                    const paramId = filter.idReportFilterParam;
                    const param = reportFilterParams.find(p => p.id === paramId);
                    
                    if (param) {
                        // Atualizar o tipo de seletor com base no nome do parâmetro
                        if (param.name === 'Bandeira') {
                            setSelectorType("brand");
                            
                            // Inicializar seleção de bandeiras
                            if (filter.value) {
                                if (filter.value.includes(',')) {
                                    const brandValues = filter.value.split(',').map(b => b.trim());
                                    setSelectedBrands(brandValues);
                                } else if (filter.value) {
                                    setSelectedBrands([filter.value]);
                                }
                            }
                        } else if (param.name === 'totalAmount' && selectedType === 'VN') {
                            setSelectorType("dateRange");
                            
                            // Inicializar datas
                            if (filter.value && filter.value.includes(',')) {
                                const [start, end] = filter.value.split(',').map(d => d.trim());
                                setStartDate(start);
                                setEndDate(end);
                            }
                        } else if (param.name && param.name.toLowerCase() === 'valor' && selectedType === 'VN') {
                            setSelectorType("valueRange");
                            
                            // Inicializar valores
                            if (filter.value && filter.value.includes(',')) {
                                const [min, max] = filter.value.split(',').map(v => v.trim());
                                setMinValue(min);
                                setMaxValue(max);
                            }
                        } else if (param.name === 'Status') {
                            setSelectorType("status");
                            
                            // Inicializar status selecionado
                            if (filter.value) {
                                setSelectedStatus(filter.value);
                            }
                        } else if (param.name === 'Estabelecimento') {
                            setSelectorType("merchant");
                            
                            // Inicializar estabelecimento se houver valor
                            if (filter.value) {
                                // Verificar se o valor está no formato "nome|id"
                                if (filter.value.includes('|')) {
                                    const [merchantName, merchantId] = filter.value.split('|');
                                    
                                    // Se temos o ID, buscamos diretamente
                                    if (merchantId) {
                                        setLoading(true);
                                        try {
                                            // Simular o estabelecimento com os dados disponíveis
                                            setSelectedMerchant({
                                                id: Number(merchantId),
                                                name: merchantName,
                                                slug: null,
                                                corporateName: null
                                            });
                                            // Definir o termo de busca para o nome do estabelecimento
                                            setSearchTerm(merchantName);
                                            
                                            // Carregamos uma lista de estabelecimentos para o dropdown
                                            const merchantsData = await searchMerchants();
                                            setMerchants(merchantsData);
                                        } catch (error) {
                                            console.error("Erro ao carregar estabelecimentos:", error);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }
                                } else {
                                    // Formato antigo - apenas o nome
                                    setLoading(true);
                                    try {
                                        const merchantsData = await searchMerchants(filter.value);
                                        setMerchants(merchantsData);
                                        
                                        // Encontrar o estabelecimento pelo nome exato
                                        const merchant = merchantsData.find(m => m.name === filter.value);
                                        if (merchant) {
                                            setSelectedMerchant(merchant);
                                            setSearchTerm(merchant.name || '');
                                        }
                                    } catch (error) {
                                        console.error("Erro ao carregar estabelecimentos:", error);
                                    } finally {
                                        setLoading(false);
                                    }
                                }
                            }
                        } else if (param.name === 'Tipo de Transação') {
                            setSelectorType("transactionType");
                            
                            // Inicializar tipo de transação selecionado
                            if (filter.value) {
                                setSelectedTransactionType(filter.value);
                            }
                        } else if (param.name === 'Tipo de Pagamento') {
                            setSelectorType("paymentType");
                            
                            // Inicializar tipo de pagamento selecionado
                            if (filter.value) {
                                setSelectedPaymentType(filter.value);
                            }
                        } else if (param.name === 'Processamento') {
                            setSelectorType("processingType");
                            
                            // Inicializar tipos de processamento selecionados
                            if (filter.value) {
                                const processingValues = filter.value.split(',').map(p => p.trim());
                                setSelectedProcessingTypes(processingValues);
                            }
                        } else if (param.name === 'Terminal') {
                            setSelectorType("terminal");
                            
                            // Inicializar terminal selecionado
                            if (filter.value) {
                                setLoading(true);
                                try {
                                    const terminalsData = await searchTerminals(filter.value);
                                    setTerminals(terminalsData);
                                    
                                    // Encontrar o terminal pelo logical_number exato
                                    const terminal = terminalsData.find(t => t.logical_number === filter.value);
                                    if (terminal) {
                                        setSelectedTerminal(terminal);
                                        setTerminalSearchTerm(terminal.logical_number ?? '');
                                    }
                                } catch (error) {
                                    console.error("Erro ao carregar terminais:", error);
                                } finally {
                                    setLoading(false);
                                }
                            }
                        } else {
                            setSelectorType("none");
                        }
                    }
                } else {
                    // Para novo filtro, não inicializamos nada
                    setSelectorType("none");
                    // Reset all fields
                    setSelectedBrands([]);
                    setStartDate('');
                    setEndDate('');
                    setMinValue('');
                    setMaxValue('');
                    setSelectedStatus('');
                    setSelectedMerchant(null);
                    setSelectedTransactionType('');
                    setSelectedPaymentType('');
                    setSelectedProcessingTypes([]);
                    setSelectedTerminal(null);
                    setTerminalSearchTerm('');
                    setTerminals([]);
                }
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
            const reportType = reportTypeDD.find(type => type.name === 'Vendas');
            if (reportType) {
                setSelectedType(reportType.code);
            }
        }
    }, [reportTypeDD, selectedType]);

    // Função para lidar com a alteração de parâmetro
    const handleParamChange = async (paramId: number) => {
        const param = reportFilterParams.find(p => p.id === paramId);
        if (!param) return;
        
        setParamSelected(true);
        
        // Reset all selector states
        setSelectedBrands([]);
        setStartDate('');
        setEndDate('');
        setMinValue('');
        setMaxValue('');
        setSelectedStatus('');
        setSelectedMerchant(null);
        setSelectedTransactionType('');
        setSelectedPaymentType('');
        setSelectedProcessingTypes([]);
        setSelectedTerminal(null);
        setTerminalSearchTerm('');
        setTerminals([]);
        
        // Determinar qual tipo de seletor deve ser exibido
        if (param.name === 'Bandeira') {
            setSelectorType("brand");
            
            // Carregar bandeiras iniciais
            try {
                const brandsData = await getAllBrands();
                setBrands(brandsData);
            } catch (error) {
                console.error("Erro ao carregar bandeiras:", error);
                setBrands([]);
            }
        } else if (param.name === 'Data') {
            setSelectorType("dateRange");
        } else if (param.name === 'Valor') {
            setSelectorType("valueRange");
        } else if (param.name === 'Status') {
            setSelectorType("status");
        } else if (param.name === 'Estabelecimento') {
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
        } else if (param.name === 'Tipo de Transação') {
            // Garanta que o selectorType seja definido corretamente aqui
            console.log("TIPO DE TRANSAÇÃO selecionado - Definindo selectorType para transactionType");
            setSelectorType("transactionType");
            console.log("Configurado para mostrar seletor de TIPO DE TRANSAÇÃO, novo valor de selectorType:", "transactionType");
            
            // Log para depuração - confirmação imediata após a alteração
            setTimeout(() => {
                console.log("DEBUG - Imediatamente após definir selectorType para transactionType:", {
                    selectorType: "transactionType", // Referir diretamente ao valor que acabamos de definir
                    paramSelected,
                });
            }, 0);
        } else if (param.name === 'Tipo de Pagamento') {
            console.log("TIPO DE PAGAMENTO selecionado - Definindo selectorType para paymentType");
            setSelectorType("paymentType");
        } else if (param.name === 'Processamento') {
            console.log("PROCESSAMENTO selecionado - Definindo selectorType para processingType");
            setSelectorType("processingType");
        } else if (param.name === 'Terminal') {
            console.log("TERMINAL selecionado - Definindo selectorType para terminal");
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

    // Função para alternar a seleção de uma marca
    const toggleBrandSelection = (code: string) => {
        setSelectedBrands(prev => {
            const newSelection = prev.includes(code)
                ? prev.filter(b => b !== code)
                : [...prev, code];
            
            return newSelection;
        });
    };

    // Função para alternar a seleção de um tipo de processamento
    const toggleProcessingTypeSelection = (value: string) => {
        setSelectedProcessingTypes(prev => {
            const newSelection = prev.includes(value)
                ? prev.filter(p => p !== value)
                : [...prev, value];
            
            console.log("Seleção de tipos de processamento atualizada:", newSelection);
            return newSelection;
        });
    };

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
            return !isNaN(min) && !isNaN(max) && max >= min && min >= 1 && max <= 9999999;
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
        // Definir valor a ser salvo baseado no tipo de seletor
        let valueToSave = data.value || selectedType;
        
        if (selectorType === "brand" && selectedBrands.length > 0) {
            valueToSave = selectedBrands.join(',');
        } else if (selectorType === "dateRange" && startDate && endDate) {
            valueToSave = `${startDate},${endDate}`;
        } else if (selectorType === "valueRange" && minValue && maxValue && isValueRangeValid()) {
            valueToSave = `${minValue},${maxValue}`;
        } else if (selectorType === "status" && selectedStatus) {
            valueToSave = selectedStatus;
        } else if (selectorType === "merchant" && selectedMerchant) {
            // Quando é estabelecimento, salvamos o nome
            valueToSave = `${selectedMerchant.name}`;
            console.log("Salvando estabelecimento:", valueToSave);
        } else if (selectorType === "terminal" && selectedTerminal) {
            // Quando é terminal, salvamos o logical_number
            valueToSave = selectedTerminal.logical_number || '';
            console.log("Salvando terminal:", valueToSave);
        } else if (selectorType === "transactionType" && selectedTransactionType) {
            valueToSave = selectedTransactionType;
        } else if (selectorType === "paymentType" && selectedPaymentType) {
            valueToSave = selectedPaymentType;
        } else if (selectorType === "processingType" && selectedProcessingTypes.length > 0) {
            // Juntar os tipos de processamento em uma string separada por vírgulas
            valueToSave = selectedProcessingTypes.join(',');
            console.log("Salvando tipos de processamento:", valueToSave);
        }

        if (data?.id) {
            await updateReportFilter({
                ...data,
                id: data.id as number,
                idReport: reportId,
                value: valueToSave,
                dtinsert: (data.dtinsert || new Date()).toISOString(),
                dtupdate: (data.dtinsert || new Date()).toISOString(),
                typeName: data.typeName || null
            });
            router.refresh();
            closeDialog();
        } else {
             await insertReportFilter({
                ...data,
                idReport: reportId,
                idReportFilterParam: data.idReportFilterParam,
                value: valueToSave,
                dtinsert: (data.dtinsert || new Date()).toISOString(),
                dtupdate: (data.dtinsert || new Date()).toISOString(),
            });
            router.push(`/portal/reports/${reportId}`);

            closeDialog();
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
                <p className="text-xs text-muted-foreground mb-2">{`Tipo de relatório: ${reportTypeDD.find(type => type.code === selectedType)?.name || selectedType}`}</p>

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
                          defaultValue={filter?.idReportFilterParam ? String(filter.idReportFilterParam) : ""}
                          disabled={filteredParams.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredParams.map((param) => (
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

                {/* Mensagem de carregamento */}
                {loading && (
                  <div className="flex items-center justify-center p-4 mt-4 border rounded-md">
                    <p className="text-sm text-muted-foreground">Carregando dados...</p>
                  </div>
                )}

                {/* Mostrar o seletor apropriado com base no tipo selecionado e apenas se um parâmetro estiver selecionado */}
                {!loading && paramSelected && selectorType === "brand" && (
                    <div className="mt-4">
                        <FormLabel>Selecione as Bandeiras</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-md">
                            {brands.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Carregando bandeiras...</p>
                            ) : (
                                brands.map((brand) => (
                                    <div key={brand.code} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`brand-${brand.code}`} 
                                            checked={selectedBrands.includes(brand.code)}
                                            onCheckedChange={() => toggleBrandSelection(brand.code)}
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
                            <p className="text-xs text-destructive mt-1">Selecione pelo menos uma bandeira</p>
                        )}
                    </div>
                )}
                {!loading && paramSelected && selectorType === "status" && (
                    <div className="mt-4">
                        <Select
                            onValueChange={(value) => {
                                setSelectedStatus(value);
                            }}
                            defaultValue={selectedStatus}
                        >
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Status.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {!loading && paramSelected && selectorType === "dateRange" && (
                    <div className="mt-4 space-y-4">
                        <FormLabel>Selecione o Intervalo de Datas</FormLabel>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <FormLabel className="text-sm">Data Inicial</FormLabel>
                                <Input 
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                    }}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <FormLabel className="text-sm">Data Final</FormLabel>
                                <Input 
                                    type="date" 
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                    }}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        {(!startDate || !endDate) && (
                            <p className="text-xs text-destructive">Selecione as datas inicial e final</p>
                        )}
                        {startDate && endDate && !isDateRangeValid() && (
                            <p className="text-xs text-destructive">A data final deve ser maior ou igual à data inicial</p>
                        )}
                    </div>
                )}
                {!loading && paramSelected && selectorType === "valueRange" && (
                    <div className="mt-4 space-y-4">
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
                                        setMinValue(e.target.value);
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
                                        setMaxValue(e.target.value);
                                    }}
                                    placeholder="Valor final"
                                    className="w-full"
                                />
                            </div>
                        </div>
                        {(!minValue || !maxValue) && (
                            <p className="text-xs text-destructive">Informe os valores inicial e final</p>
                        )}
                        {minValue && maxValue && !isValueRangeValid() && (
                            <p className="text-xs text-destructive">O valor final deve ser maior ou igual ao valor inicial e ambos devem estar entre 1 e 9.999.999</p>
                        )}
                    </div>
                )}
                {!loading && paramSelected && selectorType === "merchant" && (
                    <div className="mt-4">
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
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (searchTerm.length >= 2) {
                                                searchMerchantsByTerm();
                                            }
                                        } else if (e.key === 'Escape') {
                                            // Fechar a lista de sugestões ao pressionar ESC
                                            setShowSuggestions(false);
                                        }
                                    }}
                                    onFocus={() => {
                                        // Mostrar sugestões apenas se já temos resultados anteriores
                                        if (merchants.length > 0 && searchTerm.length >= 2) {
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
                                            Nenhum estabelecimento encontrado. Tente outro termo de busca.
                                        </div>
                                    ) : (
                                        <ul>
                                            {merchants.map((merchant) => (
                                                <li 
                                                    key={merchant.id}
                                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedMerchant?.id === merchant.id ? 'bg-blue-50' : ''}`}
                                                    onClick={() => {
                                                        setSelectedMerchant(merchant);
                                                        setSearchTerm(merchant.name || '');
                                                        setShowSuggestions(false);
                                                    }}
                                                >
                                                    {merchant.corporateName 
                                                        ? `${merchant.name} (${merchant.corporateName})` 
                                                        : merchant.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {selectedMerchant && (
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="px-2 py-1 bg-blue-100">
                                    {selectedMerchant.name}
                                    {selectedMerchant.corporateName && ` (${selectedMerchant.corporateName})`}
                                </Badge>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-5 w-5 p-0 rounded-full"
                                    onClick={() => {
                                        setSelectedMerchant(null);
                                        setSearchTerm('');
                                    }}
                                >
                                    ×
                                </Button>
                            </div>
                        )}
                        
                        {!selectedMerchant && (
                            <p className="text-xs text-destructive mt-1">Selecione um estabelecimento</p>
                        )}
                    </div>
                )}
                {!loading && paramSelected && selectorType === "paymentType" && (
                    <div className="mt-4">
                        <Select
                            onValueChange={(value) => {
                                setSelectedPaymentType(value);
                            }}
                            defaultValue={selectedPaymentType}
                        >
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {ProductType.map((productType) => (
                                    <SelectItem key={productType.value} value={productType.value}>
                                        {productType.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {!loading && paramSelected && selectorType === "processingType" && (
                    <div className="mt-4">
                        <FormLabel>Selecione os Tipos de Processamento</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-md">
                            {ProcessingType.map((processingType) => (
                                <div key={processingType.value} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`processingType-${processingType.value}`} 
                                        checked={selectedProcessingTypes.includes(processingType.value)}
                                        onCheckedChange={() => toggleProcessingTypeSelection(processingType.value)}
                                    />
                                    <label 
                                        htmlFor={`processingType-${processingType.value}`}
                                        className="text-sm cursor-pointer"
                                    >
                                        {processingType.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {selectedProcessingTypes.length === 0 && (
                            <p className="text-xs text-destructive mt-1">Selecione pelo menos um tipo de processamento</p>
                        )}
                    </div>
                )}
                {!loading && paramSelected && selectorType === "transactionType" && (
                    <div className="mt-4 border border-blue-300 p-4 rounded-md">
                        <p className="text-sm font-medium mb-2">Selecione o Tipo de Transação:</p>
                        <Select
                            onValueChange={(value) => {
                                setSelectedTransactionType(value);
                            }}
                            defaultValue={selectedTransactionType}
                        >
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um tipo de transação" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {ProductType.map((productType) => (
                                    <SelectItem key={productType.value} value={productType.value}>
                                        {productType.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {!selectedTransactionType && (
                            <p className="text-xs text-destructive mt-1">Selecione um tipo de transação</p>
                        )}
                    </div>
                )}
                {!loading && paramSelected && selectorType === "terminal" && (
                    <div className="mt-4">
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
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (terminalSearchTerm.length >= 2) {
                                                searchTerminalsByTerm();
                                            }
                                        } else if (e.key === 'Escape') {
                                            // Fechar a lista de sugestões ao pressionar ESC
                                            setShowTerminalSuggestions(false);
                                        }
                                    }}
                                    onFocus={() => {
                                        // Mostrar sugestões apenas se já temos resultados anteriores
                                        if (terminals.length > 0 && terminalSearchTerm.length >= 2) {
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
                                            Nenhum terminal encontrado. Tente outro termo de busca.
                                        </div>
                                    ) : (
                                        <ul>
                                            {terminals.map((terminal) => (
                                                <li 
                                                    key={terminal.id}
                                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedTerminal?.id === terminal.id ? 'bg-blue-50' : ''}`}
                                                    onClick={() => {
                                                        setSelectedTerminal(terminal);
                                                        setTerminalSearchTerm(terminal.logical_number ?? '');
                                                        setShowTerminalSuggestions(false);
                                                    }}
                                                >
                                                    {terminal.logical_number || 'N/A'} - {terminal.model || 'Desconhecido'}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {selectedTerminal && (
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="px-2 py-1 bg-blue-100">
                                    {selectedTerminal.logical_number || 'N/A'} - {selectedTerminal.model || 'Desconhecido'}
                                </Badge>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-5 w-5 p-0 rounded-full"
                                    onClick={() => {
                                        setSelectedTerminal(null);
                                        setTerminalSearchTerm('');
                                    }}
                                >
                                    ×
                                </Button>
                            </div>
                        )}
                        
                        {!selectedTerminal && (
                            <p className="text-xs text-destructive mt-1">Selecione um terminal</p>
                        )}
                    </div>
                )}
                
                <div className="flex justify-end mt-6">
                  <Button 
                    type="submit" 
                    disabled={loading || 
                              !paramSelected ||
                              (selectorType === "brand" && selectedBrands.length === 0) || 
                              (selectorType === "dateRange" && (!startDate || !endDate || !isDateRangeValid())) ||
                              (selectorType === "valueRange" && (!minValue || !maxValue || !isValueRangeValid())) ||
                              (selectorType === "status" && !selectedStatus) ||
                              (selectorType === "merchant" && !selectedMerchant) ||
                              (selectorType === "terminal" && !selectedTerminal) ||
                              (selectorType === "transactionType" && !selectedTransactionType) ||
                              (selectorType === "paymentType" && !selectedPaymentType) ||
                              (selectorType === "processingType" && selectedProcessingTypes.length === 0)}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </form>
        </Form>
        </>
    )
}
