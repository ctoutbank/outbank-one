import { reportExecutionsProcessing } from "@/features/reports/_actions/report-executions-processing";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

export async function GET() {
  try {
    // Executa o processamento dos relatórios de forma assíncrona
    await reportExecutionsProcessing().catch((error) => {
    });

    return NextResponse.json(
      {
        success: true,
        message: "Requisição de processamento de relatórios iniciada",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao iniciar processamento de relatórios",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// Método POST também para permitir chamadas programáticas
export async function POST() {
  return GET();
}
