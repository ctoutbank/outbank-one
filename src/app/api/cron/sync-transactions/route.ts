import { NextResponse } from "next/server";
import { syncTransactions } from "@/server/integrations/dock/sync-transactions/main";

export async function GET() {
  try {
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
