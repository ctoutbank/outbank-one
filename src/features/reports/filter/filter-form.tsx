"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductType, Status } from "@/lib/lookuptables";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { ReportTypeDD } from "../server/reports";
import { BrandOption, getAllBrands, insertReportFilter, MerchantOption, ReportFilterParamDetail, searchMerchants, updateReportFilter } from "./filter-Actions";
import { ReportFilterSchema, SchemaReportFilter } from "./schema";

// Tipo de seletor a exibir
type SelectorType = "none" | "brand" | "status" | "dateRange" | "merchant" | "valueRange" | "transactionType";

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
    const [selectorType, setSelectorType] = useState<SelectorType>("none");
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [minValue, setMinValue] = useState<string>('');
    const [maxValue, setMaxValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedParamName, setSelectedParamName] = useState<string>('');
    const [paramSelected, setParamSelected] = useState<boolean>(!!filter.id);
    const [debugInfo, setDebugInfo] = useState<string>('');
    const [merchants, setMerchants] = useState<MerchantOption[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedMerchant, setSelectedMerchant] = useState<MerchantOption | null>(null);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

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
            console.log("Inicializando componente, tipo:", selectedType);
            
            if (selectedType) {
                const filtered = reportFilterParams.filter(param => param.type === selectedType);
                setFilteredParams(filtered);
                
                // Se existe um ID de filtro, então é edição e inicializamos os controles
                if (filter.id) {
                    const paramId = filter.idReportFilterParam;
                    const param = reportFilterParams.find(p => p.id === paramId);
                    
                    console.log("Inicializando com parâmetro (edição):", param?.name, "ID:", paramId);
                    
                    if (param) {
                        setSelectedParamName(param.name || '');
                        
                        // Atualizar o tipo de seletor com base no nome do parâmetro
                        if (param.name === 'Bandeira') {
                            setSelectorType("brand");
                            console.log("Configurado para mostrar seletor de BANDEIRAS");
                            
                            // Inicializar seleção de bandeiras
                            if (filter.value) {
                                if (filter.value.includes(',')) {
                                    const brandValues = filter.value.split(',').map(b => b.trim());
                                    console.log("Inicializado com bandeiras:", brandValues);
                                    setSelectedBrands(brandValues);
                                } else if (filter.value) {
                                    console.log("Inicializado com bandeira única:", filter.value);
                                    setSelectedBrands([filter.value]);
                                }
                            }
                        } else if (param.name === 'totalAmount' && selectedType === 'VN') {
                            setSelectorType("dateRange");
                            console.log("Configurado para mostrar seletor de DATAS");
                            
                            // Inicializar datas
                            if (filter.value && filter.value.includes(',')) {
                                const [start, end] = filter.value.split(',').map(d => d.trim());
                                setStartDate(start);
                                setEndDate(end);
                                console.log("Inicializado com datas:", start, "até", end);
                            }
                        } else if (param.name && param.name.toLowerCase() === 'valor' && selectedType === 'VN') {
                            setSelectorType("valueRange");
                            console.log("Configurado para mostrar seletor de VALORES");
                            
                            // Inicializar valores
                            if (filter.value && filter.value.includes(',')) {
                                const [min, max] = filter.value.split(',').map(v => v.trim());
                                setMinValue(min);
                                setMaxValue(max);
                                console.log("Inicializado com valores:", min, "até", max);
                            }
                        } else if (param.name === 'Status') {
                            setSelectorType("status");
                            console.log("Configurado para mostrar seletor de STATUS");
                            
                            // Inicializar status selecionado
                            if (filter.value) {
                                console.log("Inicializado com status:", filter.value);
                                setSelectedStatus(filter.value);
                            }
                        } else if (param.name === 'Estabelecimento') {
                            setSelectorType("merchant");
                            console.log("Configurado para mostrar seletor de ESTABELECIMENTOS");
                            
                            // Inicializar estabelecimento se houver valor
                            if (filter.value) {
                                console.log("Inicializado com estabelecimento:", filter.value);
                                
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
                                            console.log("Estabelecimento encontrado:", merchant);
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
                            console.log("TIPO DE TRANSAÇÃO selecionado - Definindo selectorType para transactionType");
                            console.log("Configurado para mostrar seletor de TIPO DE TRANSAÇÃO, novo valor de selectorType:", "transactionType");
                            
                            // Inicializar tipo de transação selecionado
                            if (filter.value) {
                                console.log("Inicializado com tipo de transação:", filter.value);
                                setSelectedTransactionType(filter.value);
                            }
                        } else {
                            setSelectorType("none");
                            console.log("Nenhum seletor específico configurado");
                        }
                    }
                } else {
                    // Para novo filtro, não inicializamos nada
                    console.log("Novo filtro, aguardando seleção do parâmetro");
                    setSelectorType("none");
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
                    console.log("Bandeiras carregadas no início:", brandsData);
                    setBrands(brandsData);
                } catch (error) {
                    console.error("Erro ao carregar bandeiras:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        
        loadBrands();
    }, []);

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
        console.log("Parâmetro selecionado:", param?.name, "ID:", paramId, "Tipo:", selectedType);
        
        // Resetar todos os valores e seletores
        setSelectorType("none");
        setSelectedStatus('');
        setSelectedBrands([]);
        setStartDate('');
        setEndDate('');
        setMinValue('');
        setMaxValue('');
        setSelectedMerchant(null);
        setSelectedParamName(param?.name || '');
        setParamSelected(!!paramId);
        
        // Log para depuração - valores antes da alteração
        console.log("DEBUG - Antes de alterar selectorType, valores: ", {
            paramName: param?.name,
            currentSelectorType: selectorType,
            paramSelected: !!paramId
        });
        
        // Verificar explicitamente para "Tipo de Transação"
        if (param?.name === 'Tipo de Transação') {
            // Tratamento especial para Tipo de Transação
            console.log("TIPO DE TRANSAÇÃO detectado - Aplicando tratamento especial");
            setSelectedParamName('Tipo de Transação');
            setSelectorType("transactionType");
            setParamSelected(true);
            
            // Log adicional para confirmar a mudança
            console.log("Após tratamento especial:", {
                selectedParamName: 'Tipo de Transação',
                selectorType: "transactionType",
                paramSelected: true
            });
            return;
        }
        
        // Definir o tipo de seletor apropriado
        if (param?.name === 'Bandeira') {
            setSelectorType("brand");
            console.log("Configurado para mostrar seletor de BANDEIRAS");
            
            // Carregar bandeiras se necessário
            if (brands.length === 0) {
                setLoading(true);
                try {
                    const brandsData = await getAllBrands();
                    console.log("Bandeiras carregadas:", brandsData);
                    setBrands(brandsData);
                    setLoading(false);
                } catch (error) {
                    console.error("Erro ao carregar bandeiras:", error);
                    setLoading(false);
                }
            }
        }  else if (param?.name && param.name.toLowerCase() === 'valor' && selectedType === 'VN') {
            setSelectorType("valueRange");
            console.log("Configurado para mostrar seletor de VALORES", param);
        } else if (param?.name === 'Status') {
            setSelectorType("status");
            console.log("Configurado para mostrar seletor de STATUS");
        } else if (param?.name === 'Estabelecimento') {
            setSelectorType("merchant");
            console.log("Configurado para mostrar seletor de ESTABELECIMENTOS");
            
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
        } else if (param?.name === 'Tipo de Transação') {
            console.log("TIPO DE TRANSAÇÃO selecionado - Definindo selectorType para transactionType");
            setSelectorType("transactionType");
            console.log("Configurado para mostrar seletor de TIPO DE TRANSAÇÃO, novo valor de selectorType:", "transactionType");
            
            // Log para depuração - confirmação imediata após a alteração
            setTimeout(() => {
                console.log("DEBUG - Imediatamente após definir selectorType para transactionType:", {
                    selectorType,
                    paramSelected,
                    selectedParamName
                });
            }, 0);
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

    // Função para alternar a seleção de uma marca
    const toggleBrandSelection = (code: string) => {
        setSelectedBrands(prev => {
            const newSelection = prev.includes(code)
                ? prev.filter(b => b !== code)
                : [...prev, code];
            
            return newSelection;
        });
    };

    // Formatar data para exibição e validação
    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return format(date, 'yyyy-MM-dd');
        } catch (error) {
            return dateString;
        }
    };

    // Validar se a data final é maior que a inicial
    const isDateRangeValid = (): boolean => {
        if (!startDate || !endDate) return false;
        
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            return end >= start;
        } catch (error) {
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
        } catch (error) {
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

    // Monitorar mudanças no tipo de seletor para depuração
    useEffect(() => {
        console.log("DEBUG - selectorType mudou para:", selectorType);
        if (selectorType === "transactionType") {
            console.log("DEBUG - Seletor de tipo de transação ativado");
        }
    }, [selectorType]);

    // Para fins de depuração, forçar o selectorType para "transactionType" caso o parâmetro "Tipo de Transação" esteja selecionado
    useEffect(() => {
        if (selectedParamName === 'Tipo de Transação' && selectorType !== 'transactionType') {
            console.log("CORREÇÃO - Forçando selectorType para transactionType");
            setSelectorType('transactionType');
        }
    }, [selectedParamName, selectorType]);

    // Debug dos seletores
    useEffect(() => {
        const allSelectors = [
            { type: "brand", visible: !loading && paramSelected && selectorType === "brand" },
            { type: "status", visible: !loading && paramSelected && selectorType === "status" },
            { type: "dateRange", visible: !loading && paramSelected && selectorType === "dateRange" },
            { type: "valueRange", visible: !loading && paramSelected && selectorType === "valueRange" },
            { type: "merchant", visible: !loading && paramSelected && selectorType === "merchant" },
            { type: "transactionType", visible: !loading && paramSelected && selectorType === "transactionType" }
        ];
        
        const visibleSelectors = allSelectors.filter(s => s.visible);
        console.log("DEBUG - Seletores atualmente visíveis:", visibleSelectors);
        
        if (paramSelected && selectorType === "transactionType") {
            console.log("DEBUG - Condição para renderizar transactionType:", {
                loading,
                paramSelected,
                selectorType,
                isVisible: !loading && paramSelected && selectorType === "transactionType"
            });
        }
    }, [loading, paramSelected, selectorType]);

    // Renderizar seletor de bandeiras
    const renderBrandSelector = () => (
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
    );

    // Renderizar seletor de status
    const renderStatusSelector = () => (
        <div className="mt-4">
            <Select
                onValueChange={(value) => {
                    setSelectedStatus(value);
                    setDebugInfo(prev => `${prev}\nStatus selecionado: ${value}`);
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
    );

    // Renderizar seletor de intervalo de datas
    const renderDateRangeSelector = () => (
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
                            setDebugInfo(prev => `${prev}\nData inicial definida: ${e.target.value}`);
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
                            setDebugInfo(prev => `${prev}\nData final definida: ${e.target.value}`);
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
    );

    // Renderizar seletor de intervalo de valores
    const renderValueRangeSelector = () => (
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
                            setDebugInfo(prev => `${prev}\nValor mínimo definido: ${e.target.value}`);
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
                            setDebugInfo(prev => `${prev}\nValor máximo definido: ${e.target.value}`);
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
    );

    // Renderizar seletor de estabelecimentos
    const renderMerchantSelector = () => (
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
    );

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
            // Quando é estabelecimento, salvamos o nome e o ID separados por '|'
            // para poder recuperar facilmente depois
            valueToSave = `${selectedMerchant.name}`;
            console.log("Salvando estabelecimento:", valueToSave);
        } else if (selectorType === "transactionType" && selectedTransactionType) {
            valueToSave = selectedTransactionType;
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
                            console.log("Parâmetro selecionado com ID:", value);
                          }}
                          defaultValue=""
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

       

                {/* Seletor direto para Tipo de Transação - independente do selectorType */}
                {!loading && paramSelected && selectedParamName === 'Tipo de Transação' && (
                  <div className="mt-4 border border-blue-300 p-4 rounded-md">
                    <p className="text-sm font-medium mb-2">Selecione o Tipo de Transação:</p>
                    <Select
                      onValueChange={(value) => {
                        setSelectedTransactionType(value);
                        setDebugInfo(prev => `${prev}\nTipo de transação selecionado: ${value}`);
                        console.log("Tipo de transação selecionado diretamente:", value);
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
                  </div>
                )}

                {/* Mostrar o seletor apropriado com base no tipo selecionado e apenas se um parâmetro estiver selecionado */}
                {!loading && paramSelected && selectorType === "brand" && renderBrandSelector()}
                {!loading && paramSelected && selectorType === "status" && renderStatusSelector()}
                {!loading && paramSelected && selectorType === "dateRange" && renderDateRangeSelector()}
                {!loading && paramSelected && selectorType === "valueRange" && renderValueRangeSelector()}
                {!loading && paramSelected && selectorType === "merchant" && renderMerchantSelector()}
                
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
                              (selectorType === "transactionType" && !selectedTransactionType)}
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
