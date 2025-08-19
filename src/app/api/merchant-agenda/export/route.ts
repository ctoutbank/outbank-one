import { NextRequest, NextResponse } from "next/server";
import { getMerchantAgenda } from "@/features/merchantAgenda/server/merchantAgenda"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // pega os filtros da URL
        const page = 1; // sempre página 1
        const pageSize = 999999; // "infinito", traz tudo

        const dateFrom = searchParams.get("dateFrom") || undefined;
        const dateTo = searchParams.get("dateTo") || undefined;
        const establishment = searchParams.get("establishment") || undefined;
        const status = searchParams.get("status") || undefined;
        const cardBrand = searchParams.get("cardBrand") || undefined;
        const settlementDateFrom = searchParams.get("settlementDateFrom") || undefined;
        const settlementDateTo = searchParams.get("settlementDateTo") || undefined;
        const expectedSettlementDateFrom =
            searchParams.get("expectedSettlementDateFrom") || undefined;
        const expectedSettlementDateTo =
            searchParams.get("expectedSettlementDateTo") || undefined;

        const result = await getMerchantAgenda(
            page,
            pageSize,
            dateFrom,
            dateTo,
            establishment,
            status,
            cardBrand,
            settlementDateFrom,
            settlementDateTo,
            expectedSettlementDateFrom,
            expectedSettlementDateTo
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Erro ao exportar merchantAgenda:", error);
        return NextResponse.json(
            { error: "Erro ao exportar dados" },
            { status: 500 }
        );
    }
}
