import { NextResponse } from "next/server";
import { reportExecutionsProcessing } from "@/features/reports/_actions/report-executions-processing";

export async function GET() {
  try {
    console.log("[API] Iniciando chamada para processamento de relatórios");

    // Executa o processamento dos relatórios de forma assíncrona
    reportExecutionsProcessing().catch((error) => {
      console.error("[API] Erro ao processar relatórios:", error);
    });

    console.log("[API] Requisição de processamento de relatórios iniciada");

    return NextResponse.json(
      {
        success: true,
        message: "Requisição de processamento de relatórios iniciada",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Erro ao iniciar processamento de relatórios:", error);

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
