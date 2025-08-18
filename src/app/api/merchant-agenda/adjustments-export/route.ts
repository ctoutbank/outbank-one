import { NextRequest, NextResponse } from "next/server";
import { getMerchantAgenda } from "@/features/merchantAgenda/server/merchantAgenda"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page = 1;
        const pageSize = 999999;

        const dateFrom = searchParams.get("dateFrom") || undefined;
        const dateTo = searchParams.get("dateTo") || undefined;
        const establishment = searchParams.get("establishment") || undefined;
        const status = searchParams.get("status") || undefined;

        const result = await getMerchantAgenda(
            page,
            pageSize,
            dateFrom,
            dateTo,
            establishment,
            status
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
