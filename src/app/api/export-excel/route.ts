// app/api/relatorio/route.ts
import { reportsExecutionSalesGenerateXLSX } from "@/features/reports/_actions/reports-execution-sales";
import { getTransactionsForReport } from "@/features/transactions/serverActions/transaction";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Obter parâmetros da URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const pageNumber = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "100", 10);
    const status = searchParams.get("status") || undefined;
    const merchant = searchParams.get("merchant") || undefined;
    const productType = searchParams.get("productType") || undefined;

    let dateFrom = searchParams.get("dateFrom") || undefined;
    let dateTo = searchParams.get("dateTo") || undefined;

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("timezone", timezone);
    // Função auxiliar para validar e processar data
    const processDate = (dateString: string | undefined) => {
      if (!dateString) return undefined;

      try {
        const [datePart, timePart] = dateString.split("T");
        if (!datePart) return undefined;

        const [year, month, day] = datePart.split("-").map(Number);
        const [hours = "00", minutes = "00", seconds = "00"] = timePart
          ? timePart.split(":")
          : [];

        // Validação básica dos valores
        if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;

        // Ajuste para mês (0-indexed)
        const date = new Date(
          year,
          month - 1,
          day,
          parseInt(hours),
          parseInt(minutes),
          parseInt(seconds)
        );

        // Validação da data
        if (isNaN(date.getTime())) return undefined;

        // Adiciona 3 horas
        date.setHours(date.getHours() + 3);

        return date.toISOString();
      } catch (error) {
        console.error("Erro ao processar data:", error);
        return undefined;
      }
    };

    // Processa as datas
    dateFrom = processDate(dateFrom);
    dateTo = processDate(dateTo);

    console.log("dateFrom processado:", dateFrom);
    console.log("dateTo processado:", dateTo);

    const transactions = await getTransactionsForReport(
      search,
      pageNumber,
      pageSize,
      status,
      merchant,
      dateFrom,
      dateTo,
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
