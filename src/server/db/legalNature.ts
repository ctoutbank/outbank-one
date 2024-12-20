"use server";

import { db } from ".";
import { legalNatures } from "../../../drizzle/schema"
import { eq, count,desc, ilike,or } from "drizzle-orm"

export interface LegalNatureList {
    legalNatures: {
        id: number
        slug: string | null
        name: string | null
        code: string | null
        active: boolean | null
        dtinsert: Date | null
        dtupdate: Date | null
       
        
    }[];
    totalCount: number
}

export type LegalNatureDetail = typeof legalNatures.$inferSelect;
export type LegalNatureInsert = typeof legalNatures.$inferInsert;


export async function getLegalNatures(search:string, page:number , pageSize:number): Promise<LegalNatureList> {
    const offset = (page - 1) * pageSize;

    const result = await db
        .select({
            id: legalNatures.id,
            slug: legalNatures.slug,
            name: legalNatures.name,
            active: legalNatures.active,
            dtinsert: legalNatures.dtinsert,
            dtupdate: legalNatures.dtupdate,
            code: legalNatures.code,
            
        })

        .from(legalNatures)
        .where(
            or(
                ilike(legalNatures.name, `%${search}%`),
                ilike(legalNatures.code, `%${search}%`)
               
            )
        )
        .orderBy(desc(legalNatures.id))
        .limit(pageSize)
        .offset(offset);

    const totalCountResult = await db
        .select({ count: count() })
        .from(legalNatures);
    const totalCount = totalCountResult[0]?.count || 0;

    return {
       
        legalNatures: result.map((legalNature) => ({
            id: legalNature.id,
            slug: legalNature.slug || "",
            name: legalNature.name || "",
            active: legalNature.active || false,
            dtinsert: legalNature.dtinsert ? new Date(legalNature.dtinsert) : new Date(),
            dtupdate: legalNature.dtupdate ? new Date(legalNature.dtupdate) : new Date(),
            code: legalNature.code || "",
            
        })),
        totalCount,
    };
}


export async function getLegalNatureById(id: number): Promise<LegalNatureDetail | null> {
    const result = await db
        .select()
        .from(legalNatures)
        .where(eq(legalNatures.id, id))
        .limit(1);

    return result[0] || null;
}

export async function insertLegalNature(legalNature: LegalNatureInsert) {
    const result = await db
        .insert(legalNatures)
        .values(legalNature)
        .returning({
            id: legalNatures.id
        });

    return result[0].id;
}


export async function updateLegalNature(legalNature: LegalNatureDetail): Promise<void> {
    await db
        .update(legalNatures)
        .set({ name: legalNature.name})
        .where(eq(legalNatures.id, legalNature.id));
}

export async function deleteLegalNature(id: number): Promise<void> {
    await db
        .delete(legalNatures)
        .where(eq(legalNatures.id, id));
}