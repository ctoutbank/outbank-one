// lib/queries/validateUserSubdomainAccess.ts
import { db } from "@/lib/db";
import { customerCustomization, users } from "../../../drizzle/schema";
import { eq, } from "drizzle-orm";


export async function validateUserAccessBySubdomain(email: string, subdomain: string) {
    // 1. Buscar o tenant com o slug do subdomínio
    const tenantResult = await db
        .select()
        .from(customerCustomization)
        .where(eq(customerCustomization.slug, subdomain));

    const tenant = tenantResult[0];
    if (!tenant) return { authorized: false, reason: "Subdomínio inválido" };

    // 2. Buscar o usuário com o email
    const userResult = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    const user = userResult[0];
    if (!user) return { authorized: false, reason: "Usuário não encontrado" };

    // 3. Verificar se o id_customer do usuário bate com o customer_id do tenant
    if (user.idCustomer !== tenant.customerId) {
        return { authorized: false, reason: "Usuário não pertence a este subdomínio" };
    }

    return { authorized: true, user, tenant };
}
