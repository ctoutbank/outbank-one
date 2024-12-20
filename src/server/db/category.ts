"use server";

import { db } from ".";
import { categories } from "../../../drizzle/schema"
import { eq, count,desc, ilike,or } from "drizzle-orm"

export interface CategoryList {
    categories: {
        id: number
        slug: string | null
        name: string | null
        active: boolean | null
        dtinsert: Date | null
        dtupdate: Date | null
        mcc: string | null
        
        cnae: string | null
        anticipation_risk_factor_cp: number | null
        anticipation_risk_factor_cnp: number | null
        waiting_period_cp: number | null
        waiting_period_cnp: number | null
        }[];
    totalCount: number
    }

export async function getCategories(search:string, page:number , pageSize:number): Promise<CategoryList> {
    const offset = (page - 1) * pageSize;

    const result = await db
        .select({
            id: categories.id,
            slug: categories.slug,
            name: categories.name,
            active: categories.active,
            dtinsert: categories.dtinsert,
            dtupdate: categories.dtupdate,
            mcc: categories.mcc,
           
            cnae: categories.cnae,
            anticipation_risk_factor_cp: categories.anticipationRiskFactorCp,
            anticipation_risk_factor_cnp: categories.anticipationRiskFactorCnp,
            waiting_period_cp: categories.waitingPeriodCp,
            waiting_period_cnp: categories.waitingPeriodCnp,
        })

        .from(categories)
        .where(
            or(
                ilike(categories.name, `%${search}%`),
                ilike(categories.mcc, `%${search}%`),
                ilike(categories.cnae, `%${search}%`)
            )
        )
        .orderBy(desc(categories.id))
        .limit(pageSize)
        .offset(offset);

    const totalCountResult = await db
        .select({ count: count() })
        .from(categories);
    const totalCount = totalCountResult[0]?.count || 0;

    return {
        
        categories: result.map((category) => ({
            id: category.id,
            slug: category.slug || "",
            name: category.name || "",
            active: category.active || false,
            dtinsert: category.dtinsert ? new Date(category.dtinsert) : new Date(),
            dtupdate: category.dtupdate ? new Date(category.dtupdate) : new Date(),
            mcc: category.mcc || "",
            
            cnae: category.cnae || "",
            anticipation_risk_factor_cp: category.anticipation_risk_factor_cp || 0,
            anticipation_risk_factor_cnp: category.anticipation_risk_factor_cnp || 0,
            waiting_period_cp: category.waiting_period_cp || 0,
            waiting_period_cnp: category.waiting_period_cnp || 0,
             
            
        })),
        totalCount,
    };
}



export type CategoryInsert = typeof categories.$inferInsert;
export type CategoryDetail = typeof categories.$inferSelect;

export async function getCategoryById(id: number): Promise<CategoryDetail | null> {
    const result = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id));

    return result[0] || null;
}

export async function insertCategory(category: CategoryInsert): Promise<{ id: number }> {
    const [insertedCategory] = await db
        .insert(categories)
        .values(category)
        .returning();

    return {
        id: insertedCategory.id,
    };
}

export async function updateCategory(category: CategoryDetail): Promise<CategoryDetail> {
    await db
        .update(categories)
        .set(category)
        .where(eq(categories.id, category.id));

    return category;
}

export async function deleteCategory(id: number): Promise<void> {
    await db
        .delete(categories)
        .where(eq(categories.id, id));
}

export async function getCategoriesOptions(): Promise<{ value: number; label: string }[]> {
    const result = await db
        .select({
            value: categories.id,
            label: categories.name,
        })
        .from(categories)
        .orderBy(categories.name);

    return result.map((category) => ({
        value: category.value,
        label: category.label || "",
    }));
}

