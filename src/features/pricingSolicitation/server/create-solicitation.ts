"use server";

import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { users } from "../../../../drizzle/schema";
import { insertPricingSolicitation } from "./pricing-solicitation";

// Função para validar e garantir que os valores numéricos sejam realmente números
function sanitizeNumericValues(data: any) {
  // Lista de campos que devem ser números
  const numericFields = [
    "cnpjQuantity",
    "monthlyPosFee",
    "averageTicket",
    "cardPixMdr",
    "cardPixCeilingFee",
    "cardPixMinimumCostFee",
    "nonCardPixMdr",
    "nonCardPixCeilingFee",
    "nonCardPixMinimumCostFee",
    "eventualAnticipationFee",
  ];

  // Converter campos para números válidos ou zero
  const sanitized = { ...data };
  for (const field of numericFields) {
    if (field in sanitized) {
      const value = Number(sanitized[field]);
      sanitized[field] = isNaN(value) ? 0 : value;
    }
  }

  // Se houver marcas, sanitizar os valores numéricos dos tipos de produto
  if (sanitized.brands && Array.isArray(sanitized.brands)) {
    sanitized.brands = sanitized.brands.map((brand: any) => {
      if (brand.productTypes && Array.isArray(brand.productTypes)) {
        brand.productTypes = brand.productTypes.map((pt: any) => {
          // Lista de campos que devem ser números no tipo de produto
          const ptNumericFields = [
            "fee",
            "feeAdmin",
            "feeDock",
            "transactionFeeStart",
            "transactionFeeEnd",
            "noCardFee",
            "noCardFeeAdmin",
            "noCardFeeDock",
            "noCardTransactionAnticipationMdr",
            "transactionAnticipationMdr",
          ];

          const sanitizedPt = { ...pt };
          for (const field of ptNumericFields) {
            if (field in sanitizedPt) {
              const value = Number(sanitizedPt[field]);
              sanitizedPt[field] = isNaN(value) ? 0 : value;
            }
          }
          return sanitizedPt;
        });
      }
      return brand;
    });
  }

  return sanitized;
}

// Função para criar uma nova solicitação de precificação
export async function createPricingSolicitationForUpload(
  pricingSolicitationData?: any
): Promise<number> {
  try {
    // Obter o usuário atual
    const user = await currentUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Obter o ID do cliente associado ao usuário
    const userDB = await db
      .select({ customersId: users.idCustomer })
      .from(users)
      .where(eq(users.idClerk, user.id || ""));

    if (!userDB.length || !userDB[0].customersId) {
      throw new Error("Cliente não encontrado");
    }

    // Dados padrão para a solicitação
    const defaultData = {
      cnae: "00000000",
      mcc: "0000",
      cnpjQuantity: 1,
      idCustomers: userDB[0].customersId,
      description: "Solicitação criada automaticamente",
      status: "SEND_SOLICITATION",
      brands: [],
    };

    // Criar a solicitação com os dados fornecidos ou com valores padrão
    let data = pricingSolicitationData
      ? { ...defaultData, ...pricingSolicitationData }
      : defaultData;

    // Garantir que o customerId está definido
    if (!data.idCustomers) {
      data.idCustomers = userDB[0].customersId;
    }

    // Sanitizar os valores numéricos para evitar erros SQL
    data = sanitizeNumericValues(data);

    console.log("Dados sanitizados para criação de solicitação:", data);

    // Inserir a solicitação
    const newSolicitation = await insertPricingSolicitation(data);

    if (!newSolicitation || !newSolicitation.id) {
      throw new Error("Falha ao criar solicitação");
    }

    return newSolicitation.id;
  } catch (error) {
    console.error("Erro ao criar solicitação:", error);
    throw new Error(
      "Não foi possível criar a solicitação necessária para o upload"
    );
  }
}
