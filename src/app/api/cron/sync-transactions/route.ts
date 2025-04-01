import { syncTransactions } from "@/server/integrations/dock/sync-transactions/main";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Iniciando sincronização de transações...");
    await syncTransactions();
    return NextResponse.json({
      message: "Sincronização de transações concluída com sucesso",
    });
  } catch (error: any) {
    console.error("Erro na sincronização de transações:", error);
    return NextResponse.json(
      { error: "Erro na sincronização de transações" },
      { status: 500 }
    );
  }
}
