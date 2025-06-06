"use client";

import { Button } from "@/components/ui/button";
import { getEndOfDay, getStartOfDay } from "@/lib/datetime-utils";
import { FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function TransactionsExport() {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const onGetExporTransactions = async () => {
        setIsLoading(true);

        try {
            const page = 1; // Começa com a primeira página
            const pageSize = 1000; // Busca um número grande de registros
            const search = searchParams?.get("search") || "";
            const status = searchParams?.get("status") || undefined;
            const merchant = searchParams?.get("merchant") || undefined;
            const dateFrom = searchParams?.get("dateFrom") || getStartOfDay();
            const dateTo = searchParams?.get("dateTo") || getEndOfDay();
            const productType = searchParams?.get("productType") || undefined;
            const brand = searchParams?.get("brand") || undefined;
            const nsu = searchParams?.get("nsu") || undefined;
            const method = searchParams?.get("method") || undefined;
            const salesChannel = searchParams?.get("salesChannel") || undefined;
            const terminal = searchParams?.get("terminal") || undefined;
            const valueMin = searchParams?.get("valueMin") || undefined;
            const valueMax = searchParams?.get("valueMax") || undefined;

            console.log("Exportando transações para Excel...");

            // Construir a URL com os parâmetros de consulta
            const queryParams = new URLSearchParams();
            if (search) queryParams.append("search", search);
            if (status) queryParams.append("status", status);
            if (merchant) queryParams.append("merchant", merchant);
            if (dateFrom) queryParams.append("dateFrom", dateFrom);
            if (dateTo) queryParams.append("dateTo", dateTo);
            if (productType) queryParams.append("productType", productType);
            if (brand) queryParams.append("brand", brand);
            if (nsu) queryParams.append("nsu", nsu);
            if (method) queryParams.append("method", method);
            if (salesChannel) queryParams.append("salesChannel", salesChannel);
            if (terminal) queryParams.append("terminal", terminal);
            if (valueMin) queryParams.append("valueMin", valueMin);
            if (valueMax) queryParams.append("valueMax", valueMax);
            queryParams.append("page", page.toString());
            queryParams.append("pageSize", pageSize.toString());

            const response = await fetch(
                `/api/export-excel?${queryParams.toString()}`
            );

            if (!response.ok) {
                throw new Error(`Erro na resposta: ${response.status}`);
            }

            // Obter o blob do PDF da resposta
            const blob = await response.blob();

            // Criar URL para o blob
            const url = window.URL.createObjectURL(blob);

            // Criar um elemento de link para download
            const a = document.createElement("a");
            a.href = url;
            a.download = "transacoes.xlsx";

            // Adicionar ao documento, clicar e remover
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Liberar a URL do objeto
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao gerar Excel:", error);
            alert("Erro ao gerar o Excel. Verifique o console para mais detalhes.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button onClick={onGetExporTransactions} disabled={isLoading}>
                <FileText className="w-4 h-4" />
                {isLoading ? "Gerando..." : "Gerar Relatório"}
            </Button>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-4 rounded-md shadow-lg">
                        <span className="text-sm font-medium">Exportando Excel...</span>
                    </div>
                </div>
            )}
        </>
    );
}
