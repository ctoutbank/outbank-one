'use server'

import { db } from "@/lib/db";
import { customerCustomization, users } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function validateUserAccessBySubdomain(email: string, subdomain: string) {
    const tenantResult = await db.select().from(customerCustomization).where(eq(customerCustomization.slug, subdomain));
    const tenant = tenantResult[0];
    if (!tenant) return { authorized: false, reason: "Credenciais inválidas" };

    const userResult = await db.select().from(users).where(eq(users.email, email));
    const user = userResult[0];
    if (!user) return { authorized: false, reason: "Credenciais inválidas" };

    if (user.idCustomer !== tenant.customerId) {
        return { authorized: false, reason: "Credenciais inválidas" };
    }

    return { authorized: true };
}
