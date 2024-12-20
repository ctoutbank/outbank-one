"use server";

import { db } from ".";
import { salesAgents } from "../../../drizzle/schema";


// Ensure the salesAgents schema includes the slug property

import { count, desc, eq, like, or,asc } from "drizzle-orm";

export type SalesAgentFull = {
    id: number | null;
    slug: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    active: boolean | null;
    dtinsert: string | null;
    dtupdate: string | null;
    documentId: string | null;
    slugCustomer: string | null;
};



export interface SalesAgentsList {  
    salesAgents: SalesAgentFull[];
    totalCount: number
}





export async function getSalesAgents(
  search: string,
  page: number,
  pageSize: number,
  sortField: keyof SalesAgentFull,
  sortOrder: "asc" | "desc"
): Promise<SalesAgentsList> {
  const offset = (page - 1) * pageSize;
  const validSortField = salesAgents[sortField];

  const result = await db
    .select()
    .from(salesAgents)
    .where(
      or(
        like(salesAgents.firstName, `%${search}%`),
        like(salesAgents.lastName, `%${search}%`),
        like(salesAgents.email, `%${search}%`)
      )
    )
    .orderBy(validSortField, sortOrder === "asc" ? asc(validSortField) : desc(validSortField))
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
      dtinsert: salesAgent.dtinsert ? new Date(salesAgent.dtinsert).toISOString() : null,
      dtupdate: salesAgent.dtupdate ? new Date(salesAgent.dtupdate).toISOString() : null,
      documentId: salesAgent.documentId || "",
      slugCustomer: salesAgent.slugCustomer || "",
    })),
    totalCount,
  };
}



export async function createdOrUpdateSalesAgents(
    salesAgent: SalesAgentFull
  ): Promise<SalesAgentFull> {
    if (!salesAgent.id || salesAgent.id === 0) {
       
      const [insertedAgent] = await db.insert(salesAgents).values(salesAgent)
        
        .returning(); 
  
      return {
        ...salesAgent,
        id: insertedAgent.id, 
      };
    } else {
      // Atualização
      await db
        .update(salesAgents)
        .set({
          
          firstName: salesAgent.firstName,
          lastName: salesAgent.lastName,
          email: salesAgent.email,
          active: salesAgent.active,
          dtupdate: new Date().toISOString(), // Atualiza o campo de última modificação
          documentId: salesAgent.documentId,
          slugCustomer: salesAgent.slugCustomer,
        })
        .where(eq(salesAgents.id, salesAgent.id));
  
      return salesAgent; // Retorna o agente atualizado
    }
  }


  export async function insertSalesAgent(salesAgent: any ): Promise<{ id: number }> {
    const [insertedAgent] = await db
      .insert(salesAgents)
      .values(salesAgent)
      .returning();
  
    return {
      id: insertedAgent.id,
    };
  }


  export async function getSalesAgentById(id: number): Promise<SalesAgentFull | null> {
    const result = await db
      .select({
        id: salesAgents.id,
        slug: salesAgents.slug,
        firstName: salesAgents.firstName,
        lastName: salesAgents.lastName,
        email: salesAgents.email,
        active: salesAgents.active,
        dtinsert: salesAgents.dtinsert,
        dtupdate: salesAgents.dtupdate,
        documentId: salesAgents.documentId,
        slug_customer: salesAgents.slugCustomer,
      })
      .from(salesAgents)
      .where(eq(salesAgents.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const salesAgent = result[0];

    return {
      id: salesAgent.id,
      slug: salesAgent.slug || "",
      firstName: salesAgent.firstName || "",
      lastName: salesAgent.lastName || "",
      email: salesAgent.email || "",
      active: salesAgent.active || null,
      dtinsert: salesAgent.dtinsert ? new Date(salesAgent.dtinsert).toISOString() : null,
      dtupdate: salesAgent.dtupdate ? new Date(salesAgent.dtupdate).toISOString() : null,
      documentId: salesAgent.documentId || "",
      slugCustomer: salesAgent.slug_customer || "",
    };
  }


  export type NewSalesAgent = typeof salesAgents.$inferInsert;
  export const insertSalesAgentt = async (salesAgent: NewSalesAgent) => {
    try {
      // Remover o campo `id` de salesAgent
     
  
      // Inserir os dados na tabela salesAgents sem o campo `id`
      const result = await db.insert(salesAgents).values(salesAgent);
  
      console.log("Novo Sales Agent inserido com sucesso:", result);
      return result;
    } catch (error) {
      console.error("Erro ao inserir Sales Agent:", error);
      throw error;
    }
  };