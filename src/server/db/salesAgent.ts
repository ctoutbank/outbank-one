"use server";

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { db } from ".";
import { salesAgents } from "../../../drizzle/schema";

// Ensure the salesAgents schema includes the slug property

import { count, desc, eq, like, or } from "drizzle-orm";
import { z } from "zod";


export type SalesAgentFull = typeof salesAgents.$inferSelect;
export type SalesAgentInsert = typeof salesAgents.$inferInsert;
export const salesAgentSchema = createInsertSchema(salesAgents);
export const salesAgentFullSchema = createSelectSchema(salesAgents);
export type SalesAgentSchema = z.infer<typeof salesAgentSchema>;
export type SalesAgentFullSchema = z.infer<typeof salesAgentFullSchema>;

export interface SalesAgentsList {
    salesAgents: SalesAgentFull[];
    totalCount: number
}







export async function getSalesAgents(search:string, page:number , pageSize:number): Promise<SalesAgentsList> {
    const offset = (page - 1) * pageSize;

    const result: SalesAgentFull[]  = await db
        .select()

        .from(salesAgents)
        .where(
            or(
                like(salesAgents.firstName, `%${search}%`),
                like(salesAgents.lastName, `%${search}%`),
                like(salesAgents.email, `%${search}%`)
            )
        )
        .orderBy(desc(salesAgents.id))
        .limit(pageSize)
        .offset(offset);

    const totalCountResult = await db
        .select({ count: count() })
        .from(salesAgents);
    const totalCount = totalCountResult[0]?.count || 0;

    
      const salesAgentsList : SalesAgentsList = {
        salesAgents: result ,
        totalCount: totalCount,
      };

    return salesAgentsList;
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


  export async function insertSalesAgent(salesAgent: SalesAgentInsert) {
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
      dtinsert: salesAgent.dtinsert ,
      dtupdate: salesAgent.dtupdate ,
      documentId: typeof salesAgent.documentId === 'number' ? salesAgent.documentId : null,
      slugCustomer: salesAgent.slug_customer || "",
    };
  }