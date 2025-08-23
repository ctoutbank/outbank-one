import { NextRequest, NextResponse } from "next/server";
import { getMerchantAgendaAdjustment } from "@/features/merchantAgenda/server/merchantAgendaAdjustment"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page = 1;
        const pageSize = 999999;

        const dateFrom = searchParams.get("dateFrom") || undefined;
        const dateTo = searchParams.get("dateTo") || undefined;
        const establishment = searchParams.get("establishment") || undefined;
        const search = searchParams.get("search") || "";

        const result = await getMerchantAgendaAdjustment(
            search,
            page,
            pageSize,
            dateFrom,
            dateTo,
            establishment,

        );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Erro ao exportar ajustes:", error);
        return NextResponse.json(
            { error: "Erro ao exportar dados de ajustes" },
            { status: 500 }
        );
    }
}



