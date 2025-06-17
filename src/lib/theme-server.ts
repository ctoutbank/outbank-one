import { eq } from 'drizzle-orm';
import { db } from './db';
import { customerCustomization } from '../../drizzle/schema';

export async function getThemeForTenant(tenantSlug: string) {
    const [tenant] = await db
        .select({
            primary: customerCustomization.primaryColor,
            secondary: customerCustomization.secondaryColor,
        })
        .from(customerCustomization)
        .where(eq(customerCustomization.slug, tenantSlug))
        .limit(1);

    return {
        primary: tenant?.primary || null,
        secondary: tenant?.secondary || null,
    };
}
