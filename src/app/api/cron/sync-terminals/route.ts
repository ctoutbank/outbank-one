import { syncTerminals } from "@/server/integrations/dock/sync-terminals/main";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

export async function GET() {
  try {
    await syncTerminals();
    return NextResponse.json({
      message: "Sincronização de terminais concluída com sucesso",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro na sincronização de terminais" },
      { status: 500 }
    );
  }
}
