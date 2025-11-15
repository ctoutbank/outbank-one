import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { customerCustomization, customers, file } from "../../drizzle/schema";

export type ThemeData = {
  primary: string;
  secondary: string;
  imageUrl: string;
  loginImageUrl: string;
  slug: string;
  name: string;
};

export async function getThemeByTenant(slug: string) {
  const [tenant] = await db
    .select({
      primaryColor: customerCustomization.primaryColor,
      secondaryColor: customerCustomization.secondaryColor,
      fileUrl: file.fileUrl,
      slug: customerCustomization.slug,
      name: customers.name,
    })
    .from(customerCustomization)
    .leftJoin(file, eq(customerCustomization.fileId, file.id))
    .innerJoin(customers, eq(customerCustomization.customerId, customers.id))
    .where(eq(customerCustomization.slug, slug));
  if (!tenant) return null;

  return {
    primary: tenant.primaryColor || "0 84% 60%",
    secondary: tenant.secondaryColor || "0 0% 10%",
    imageUrl: tenant.fileUrl || "",
    loginImageUrl: tenant.fileUrl || "/bg_login.jpg",
    slug: tenant.slug || "",
    name: tenant.name || "",
  };
}

export async function getNameByTenant(slug: string) {
  const [tenant] = await db
    .select()
    .from(customerCustomization)
    .where(eq(customerCustomization.slug, slug));
  if (!tenant) return null;

  return {
    slug: slug,
  };
}
