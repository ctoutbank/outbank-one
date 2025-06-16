import { db } from "@/lib/db";
import { customerCustomization } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function getTenantBySubdomain(subdomain: string | null) {
    if (!subdomain) return null;

    const result = await db
        .select()
        .from(customerCustomization)
        .where(eq(customerCustomization.slug, subdomain))
        .limit(1);

    return result[0] || null;
}
