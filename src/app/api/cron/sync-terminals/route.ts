import { NextResponse } from "next/server";
import { syncTerminals } from "@/server/integrations/dock/sync-terminals/main";

export async function GET() {
  try {
    await syncTerminals();
    return NextResponse.json({
      message: "Sincronização de terminais concluída com sucesso",
    });
  } catch (error: any) {
    console.error("Erro na sincronização de terminais:", error);
    return NextResponse.json(
      { error: "Erro na sincronização de terminais" },
      { status: 500 }
    );
  }
}
