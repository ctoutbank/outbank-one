import { db } from "@/server/db";
import {customerCustomization, file } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export type ThemeData = {
    primary: string;
    secondary: string;
    imageUrl: string;
    slug: string;
};


export async function getThemeByTenant(slug: string) {
    const [tenant] = await db.select().from(customerCustomization).innerJoin(file, eq(customerCustomization.fileId, file.id)).where(eq(customerCustomization.slug, slug));
    if (!tenant) return null;

    return {
        primary: tenant.customer_customization.primaryColor || '0 84% 60%',
        secondary: tenant.customer_customization.secondaryColor || '0 0% 10%',
        imageUrl: tenant.file.fileUrl || '',
        slug: tenant.customer_customization.slug || '',
    };
}


export async function getNameByTenant(slug: string){
    const [tenant] = await db.select().from(customerCustomization).where(eq(customerCustomization.slug, slug));
    if (!tenant) return null;

    return {
        slug: slug
    }

}
