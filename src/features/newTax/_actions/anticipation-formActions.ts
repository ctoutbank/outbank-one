"use server";

import { AnticipationTypeSchema } from "@/features/newTax/schema/fee-new-Schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { fee } from "../../../../drizzle/schema";

export async function updateAnticipationTypeAction(
  data: AnticipationTypeSchema
) {
  try {
    if (!data.id) {
      throw new Error("ID da taxa não fornecido");
    }

    // Mapear o tipo de antecipação para o formato do banco de dados
    let anticipationType = "";
    switch (data.anticipationType) {
      case "NOANTECIPATION":
        anticipationType = "Sem Antecipação";
        break;
      case "EVENTUAL":
        anticipationType = "Antecipação Eventual";
        break;
      case "COMPULSORY":
        anticipationType = "Antecipação Compulsória";
        break;
    }

    // Atualizar o tipo de antecipação no banco de dados
    await db
      .update(fee)
      .set({
        anticipationType,
        dtupdate: new Date().toISOString(),
      })
      .where(eq(fee.id, parseInt(data.id)));

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar tipo de antecipação:", error);
    throw error;
  }
}

export async function getAnticipationTypeAction(
  id: string
): Promise<AnticipationTypeSchema> {
  try {
    // Se o ID não for válido, retornar tipo padrão
    if (!id || id === "0" || isNaN(parseInt(id))) {
      console.log("ID inválido, retornando tipo de antecipação padrão");
      return { anticipationType: "NOANTECIPATION" };
    }

    // Buscar o tipo de antecipação atual no banco de dados
    const feeData = await db
      .select({ anticipationType: fee.anticipationType })
      .from(fee)
      .where(eq(fee.id, parseInt(id)))
      .then((results) => results[0])
      .catch((error) => {
        console.error("Erro na consulta ao banco de dados:", error);
        return null;
      });

    if (!feeData) {
      console.log(
        "Dados da taxa não encontrados, retornando tipo de antecipação padrão"
      );
      return { anticipationType: "NOANTECIPATION" };
    }

    // Mapear o tipo de antecipação do banco de dados para o formato do schema
    let anticipationType: "NOANTECIPATION" | "EVENTUAL" | "COMPULSORY" =
      "NOANTECIPATION";
    switch (feeData.anticipationType) {
      case "Sem Antecipação":
        anticipationType = "NOANTECIPATION";
        break;
      case "Antecipação Eventual":
        anticipationType = "EVENTUAL";
        break;
      case "Antecipação Compulsória":
        anticipationType = "COMPULSORY";
        break;
      default:
        // Se o tipo de antecipação não for reconhecido, usar "none" como padrão
        anticipationType = "NOANTECIPATION";
    }

    console.log("Tipo de antecipação encontrado:", anticipationType);
    return { id, anticipationType };
  } catch (error) {
    console.error(`Erro ao buscar tipo de antecipação com ID ${id}:`, error);
    return { anticipationType: "NOANTECIPATION" };
  }
}
