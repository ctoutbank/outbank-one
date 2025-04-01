import { createCronJobMonitoring } from "@/features/cronJob/actions";
import { syncTransactions } from "@/server/integrations/dock/sync-transactions/main";
import { NextResponse } from "next/server";

export async function GET() {
  await createCronJobMonitoring({
    jobName: "Sincronização de transações",
    status: "pending",
    startTime: new Date().toISOString(),
  });
  try {
    console.log("Iniciando sincronização de transações...");
    console.log("Verificando variáveis de ambiente:", {
      hasApiUrl: !!process.env.DOCK_API_URL_TRANSACTIONS,
      hasApiKey: !!process.env.DOCK_API_KEY,
      dbHost: process.env.DATABASE_HOST, // não exponha as credenciais reais
    });

    await syncTransactions();

    return NextResponse.json({
      message: "Sincronização de transações concluída com sucesso",
    });
  } catch (error: any) {
    console.error("Erro detalhado na sincronização:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return NextResponse.json(
      {
        error: "Erro na sincronização de transações",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
