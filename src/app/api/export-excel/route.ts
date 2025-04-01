// app/api/relatorio/route.ts
import { reportsExecutionSalesGenerateXLSX } from "@/features/reports/_actions/reports-execution-sales";
import { getTransactionsForReport } from "@/features/transactions/serverActions/transaction";
import { getDateUTC } from "@/lib/datetime-utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Obter parâmetros da URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;
    const merchant = searchParams.get("merchant") || undefined;
    const productType = searchParams.get("productType") || undefined;

    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("timezone", timezone);
    // Função auxiliar para validar e processar data

    const dateFromUTC = getDateUTC(dateFrom as string, "America/Sao_Paulo");
    const dateToUTC = getDateUTC(dateTo as string, "America/Sao_Paulo");
    console.log("dateFromUTC", dateFromUTC);
    console.log("dateToUTC", dateToUTC);

    const transactions = await getTransactionsForReport(
      search,

      status,
      merchant,
      dateFromUTC!,
      dateToUTC!,
      productType
    );

    const xlsxBytes = await reportsExecutionSalesGenerateXLSX(
      transactions,
      dateFrom as string,
      dateTo as string
    );

    return new NextResponse(xlsxBytes ? Buffer.from(xlsxBytes) : null, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=relatorio.xlsx",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erro ao gerar relatório" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
