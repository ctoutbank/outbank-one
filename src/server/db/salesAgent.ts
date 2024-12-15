import { db } from "."
import { salesAgents } from "../../../drizzle/schema"
import { eq, count,desc, like,or } from "drizzle-orm"




export interface SalesAgentsList {
    salesAgents: {
        id: number
        slug: string | null
        firstName: string | null
        lastName: string | null
        email: string | null
        active: boolean | null
        dtinsert: Date | null
        dtupdate: Date | null
        documentId: string | null
        slugCustomer: string | null
        
    }[];
    totalCount: number
}







export async function getSalesAgents(search:string, page:number , pageSize:number): Promise<SalesAgentsList> {
    const offset = (page - 1) * pageSize;

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

    return {
        salesAgents: result.map((salesAgent) => ({
            id: salesAgent.id,
            slug: salesAgent.slug || "",
            firstName: salesAgent.firstName || "",
            lastName: salesAgent.lastName || "",
            email: salesAgent.email || "",
            active: salesAgent.active || null,
            dtinsert: salesAgent.dtinsert ? new Date(salesAgent.dtinsert) : null,
            dtupdate: salesAgent.dtupdate ? new Date(salesAgent.dtupdate) : null,
            documentId: typeof salesAgent.documentId === 'number' ? salesAgent.documentId : null,
            slugCustomer: salesAgent.slug_customer || "",
            totalcontent: 0, // or any appropriate value
        })),
        totalCount,

    };
}