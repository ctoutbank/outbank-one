"use server";

import { salesAgents } from "../../../../drizzle/schema";
import { db } from "../../../server/db";

// Ensure the salesAgents schema includes the slug property

import { and, count, desc, eq, gte, like, lte, max, or } from "drizzle-orm";

export type SalesAgentFull = {
  id: number;
  slug: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  active: boolean | null;
  dtinsert: Date | null;
  dtupdate: Date | null;
  documentId: string | null;
  slugCustomer: string | null;
  totalMerchants?: number;
  pendingMerchants?: number;
  approvedMerchants?: number;
  rejectedMerchants?: number;
};

export interface SalesAgentsList {
  salesAgents: SalesAgentFull[];
  totalCount: number;
}

export type SalesAgentesDetail = typeof salesAgents.$inferSelect;
export type SalesAgentesInsert = typeof salesAgents.$inferInsert;

export async function getSalesAgents(
  search: string,
  page: number,
  pageSize: number,
  status?: string,
  dateFrom?: string,
  dateTo?: string,
  email?: string
): Promise<SalesAgentsList> {
  const offset = (page - 1) * pageSize;

  const conditions = [
    or(
      like(salesAgents.firstName, `%${search}%`),
      like(salesAgents.lastName, `%${search}%`),
      like(salesAgents.email, `%${search}%`)
    ),
  ];

  if (email) {
    conditions.push(like(salesAgents.email, `%${email}%`));
  }

  if (status) {
    conditions.push(eq(salesAgents.active, status === "ACTIVE"));
  }

  if (dateFrom) {
    conditions.push(gte(salesAgents.dtinsert, dateFrom));
  }

  if (dateTo) {
    conditions.push(lte(salesAgents.dtinsert, dateTo));
  }

  const result = await db
    .select()
    .from(salesAgents)
    .where(and(...conditions))
    .orderBy(desc(salesAgents.id))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(salesAgents);
  const totalCount = totalCountResult[0]?.count || 0;

  return {
    salesAgents: result.map((salesAgent) => ({
      id: salesAgent.id,
      slug: salesAgent.slug || "",
      firstName: salesAgent.firstName || "",
      lastName: salesAgent.lastName || "",
      email: salesAgent.email || "",
      active: salesAgent.active || null,
      dtinsert: salesAgent.dtinsert
        ? new Date(salesAgent.dtinsert)
        : new Date(),
      dtupdate: salesAgent.dtupdate
        ? new Date(salesAgent.dtupdate)
        : new Date(),
      documentId: salesAgent.documentId || "",
      slugCustomer: salesAgent.slugCustomer || "",
    })),
    totalCount,
  };
}

/**
 * Gera o próximo documentId sequencial no formato c0001, c0002, etc.
 */
export async function generateNextDocumentId(): Promise<string> {
  try {
    // Buscar o maior documentId atual
    const result = await db
      .select({
        maxDocumentId: max(salesAgents.documentId),
      })
      .from(salesAgents)
      .where(like(salesAgents.documentId, "c%"));

    const maxDocumentId = result[0]?.maxDocumentId;
    let nextNumber = 1;

    if (maxDocumentId) {
      // Extrair o número do último documentId (c0001 -> 1)
      const match = maxDocumentId.match(/c(\d+)/);
      if (match && match[1]) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    let documentId = "";
    let isUnique = false;

    // Loop até encontrar um documentId único
    while (!isUnique) {
      // Formatar com zeros à esquerda (1 -> 0001)
      const formattedNumber = nextNumber.toString().padStart(4, "0");
      documentId = `c${formattedNumber}`;

      // Verificar se este documentId já existe
      const existingAgent = await db
        .select()
        .from(salesAgents)
        .where(eq(salesAgents.documentId, documentId))
        .limit(1);

      if (existingAgent.length === 0) {
        // Não encontrou, então é único
        isUnique = true;
      } else {
        // Já existe, incrementar e tentar novamente
        console.log(
          `DocumentId ${documentId} já existe, tentando o próximo...`
        );
        nextNumber++;
      }
    }

    return documentId;
  } catch (error) {
    console.error("Erro ao gerar próximo documentId:", error);
    // Em caso de erro, retornar um valor padrão
    return `c0001`;
  }
}

export async function insertSalesAgent(salesAgent: SalesAgentesInsert) {
  console.log("Inserindo salesAgent:", salesAgent);

  // Se não tiver documentId, gerar um novo documentId sequencial
  if (!salesAgent.documentId || salesAgent.documentId === "") {
    salesAgent.documentId = await generateNextDocumentId();
    console.log("Novo documentId gerado:", salesAgent.documentId);
  } else {
    // Se tiver um documentId fornecido, verificar se já existe
    const existingAgent = await db
      .select()
      .from(salesAgents)
      .where(eq(salesAgents.documentId, salesAgent.documentId))
      .limit(1);

    if (existingAgent.length > 0) {
      console.log(
        `DocumentId ${salesAgent.documentId} já existe, gerando um novo...`
      );
      salesAgent.documentId = await generateNextDocumentId();
      console.log("Novo documentId gerado:", salesAgent.documentId);
    }
  }

  const result = await db.insert(salesAgents).values(salesAgent).returning({
    id: salesAgents.id,
  });

  return result[0].id;
}

export async function getSalesAgentById(
  id: number
): Promise<SalesAgentesDetail | null> {
  const result = await db
    .select()
    .from(salesAgents)
    .where(eq(salesAgents.id, id))
    .limit(1);

  return result[0] || null;
}

export async function updateSalesAgent(
  salesAgent: SalesAgentesDetail
): Promise<void> {
  console.log("Atualizando salesAgent:", JSON.stringify(salesAgent, null, 2));
  console.log("CPF a ser atualizado:", salesAgent.cpf);
  console.log("Telefone a ser atualizado:", salesAgent.phone);
  console.log("Data de nascimento a ser atualizada:", salesAgent.birthDate);

  try {
    await db
      .update(salesAgents)
      .set({
        firstName: salesAgent.firstName,
        lastName: salesAgent.lastName,
        email: salesAgent.email,
        active: salesAgent.active,
        dtupdate: new Date().toISOString(),
        documentId: salesAgent.documentId,
        slugCustomer: salesAgent.slugCustomer,
        cpf: salesAgent.cpf,
        phone: salesAgent.phone,
        birthDate: salesAgent.birthDate,
        idUsers: salesAgent.idUsers,
      })
      .where(eq(salesAgents.id, salesAgent.id));

    // Verificar se a atualização funcionou, consultando os dados atualizados
    const updated = await getSalesAgentById(salesAgent.id);
    console.log("Dados após atualização:", JSON.stringify(updated, null, 2));
    console.log("CPF após atualização:", updated?.cpf);
    console.log("Telefone após atualização:", updated?.phone);
    console.log("Data de nascimento após atualização:", updated?.birthDate);

    console.log(
      "SalesAgent atualizado com sucesso, incluindo cpf, phone e birthDate"
    );
  } catch (error) {
    console.error("Erro ao atualizar salesAgent:", error);
    throw error;
  }
}
