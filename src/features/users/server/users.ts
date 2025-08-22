"use server";

import { hashPassword } from "@/app/utils/password";
import { sendWelcomePasswordEmail } from "@/app/utils/send-email";
import { generateSlug } from "@/lib/utils";
import { db } from "@/server/db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  addresses,
  customerCustomization,
  customers,
  merchants,
  profiles,
  salesAgents,
  userMerchants,
  users,
} from "../../../../drizzle/schema";
import { AddressSchema } from "../schema/schema";

export type UserInsert = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  idCustomer?: number | null;
  idProfile?: number | null;
  idAddress?: number | null;
  selectedMerchants?: string[];
  fullAccess?: boolean;
  active: boolean | null;
  idClerk: string | null;
  slug?: string;
  dtinsert?: string;
  dtupdate?: string;
};

export interface UserList {
  userObject:
    | {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        profileName: string;
        profileDescription: string;
        status: boolean;
        customerName: string;
        merchants: { id: number; name: string | null }[];
        idClerk: string;
      }[]
    | null;
  totalCount: number;
}

export type DD = {
  id: number;
  name: string | null;
};

export type UserDetail = typeof users.$inferSelect;
export interface UserDetailForm extends UserDetail {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  selectedMerchants?: string[];
  fullAccess: boolean;
  temporaryPassword: string | null;
  firstLogin: boolean | null;
}

export async function getUsers(
    email: string,
    firstName: string,
    lastName: string,
    profile: number,
    page: number,
    pageSize: number
): Promise<UserList> {
  const clerk = await clerkClient();

  // Logar todos os usuários do Clerk (paginação completa)
  let allClerkUsers: any[] = [];
  const limit = 100;
  let offsetAll = 0;
  while (true) {
    const chunk = await clerk.users.getUserList({ limit, offset: offsetAll });
    allClerkUsers = allClerkUsers.concat(chunk.data);
    if (chunk.data.length < limit) break;
    offsetAll += limit;
  }

  console.log("=== TODOS USUÁRIOS DO CLERK ===");
  allClerkUsers.forEach(u => {
    console.log({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.emailAddresses?.[0]?.emailAddress || "",
    });
  });
  console.log(`Total de usuários Clerk: ${allClerkUsers.length}`);

  // Continua com seu código normalmente

  const customer = await getCustomerByTentant();
  const offset = (page - 1) * pageSize;

  const conditions = [
    customer ? eq(customers.slug, customer.slug) : undefined,
    profile ? eq(users.idProfile, profile) : undefined,
    email && email.trim() !== "" ? eq(users.email, email) : undefined,
  ].filter(Boolean);

  const userResults = await db
      .select({
        id: users.id,
        profileName: profiles.name,
        profileDescription: profiles.description,
        status: users.active,
        customerName: customers.name,
        idClerk: users.idClerk,
      })
      .from(users)
      .innerJoin(customers, eq(users.idCustomer, customers.id))
      .leftJoin(profiles, eq(users.idProfile, profiles.id))
      .where(and(...conditions))
      .orderBy(desc(users.id))
      .limit(pageSize)
      .offset(offset);

  if (userResults.length === 0) {
    return { userObject: null, totalCount: 0 };
  }

  const dbClerkIds = userResults
      .map(u => u.idClerk)
      .filter((id): id is string => !!id);

  const clerkResult = (await clerk.users.getUserList({ userId: dbClerkIds })).data;

  const userObject = await Promise.all(
      userResults.map(async (dbUser) => {
        const clerkData = clerkResult.find((c: any) => c.id === dbUser.idClerk);

        // Merchants do usuário
        const userMerchantsList = await db
            .select({
              id: merchants.id,
              name: merchants.name,
            })
            .from(userMerchants)
            .leftJoin(merchants, eq(userMerchants.idMerchant, merchants.id))
            .where(eq(userMerchants.idUser, dbUser.id));

        const merchantsList = userMerchantsList.map((m) => ({
          id: m.id!,
          name: m.name,
        }));

        if (!clerkData) {
          console.warn(`Clerk user not found for idClerk: ${dbUser.idClerk}`);
        }

        return {
          id: dbUser.id,
          firstName: clerkData?.firstName || "",
          lastName: clerkData?.lastName || "",
          email: clerkData?.emailAddresses?.[0]?.emailAddress || "",
          profileName: dbUser.profileName || "",
          profileDescription: dbUser.profileDescription || "",
          status: dbUser.status ?? true,
          customerName: dbUser.customerName || "",
          merchants: merchantsList,
          idClerk: dbUser.idClerk || "",
        };
      })
  );

  console.log("clerkResult", clerkResult.map(u => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.emailAddresses[0]?.emailAddress
  })));

  const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .innerJoin(customers, eq(users.idCustomer, customers.id))
      .where(and(...conditions))
      .then(res => res[0]?.count || 0);

  return {
    userObject,
    totalCount,
  };
}

export async function generateRandomPassword(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomPassword = "";
  for (let i = 0; i < length; i++) {
    randomPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomPassword;
}

export async function InsertUser(data: UserInsert) {
  // Função auxiliar para converter valores numéricos de forma segura
  const safeNumber = (val: any, fieldName: string) => {
    const num = Number(val);
    if (!Number.isFinite(num)) {
      console.error(`⚠️ Valor inválido para campo numérico "${fieldName}":`, val);
      throw new Error(`Valor inválido para campo numérico: ${fieldName}`);
    }
    return num;
  };


  const  userId  = auth()
  if (!userId)  throw new Error("Usuário não autenticado");

  console.log("USERID AQUI", userId)


  // Log inicial
  console.log("📥 Dados recebidos para InsertUser:");
  console.dir(data, { depth: null });

  const fieldsToValidate: (keyof UserInsert)[] = [
    "firstName",
    "lastName",
    "email",
    "idProfile",
  ];

  const hasEmptyFields = fieldsToValidate.some((field) => {
    const value = data[field];
    return (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
    );
  });

  if (hasEmptyFields) {
    throw new Error("Campos obrigatórios não foram preenchidos");
  }

  try {
    // Criar usuário no Clerk
    const clerkUser = await (
        await clerkClient()
    ).users.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      emailAddress: [data.email],
      skipPasswordRequirement: true,
      publicMetadata: {
        isFirstLogin: true,
      },
    });

    const password = await generateRandomPassword();
    const hashedPassword = hashPassword(password);
    console.log("🔑 Senha gerada para novo usuário:", password);

    const idCustomer = await getCustomerIdByTentant()

    // Inserir no banco
    const newUser = await db
        .insert(users)
        .values({
          slug: generateSlug(),
          dtinsert: new Date().toISOString(),
          dtupdate: new Date().toISOString(),
          active: true,
          idClerk: clerkUser.id,
          idCustomer: idCustomer,
          idProfile: safeNumber(data.idProfile, "idProfile"),
          idAddress: safeNumber(data.idAddress, "idAddress"),
          fullAccess: data.fullAccess,
          hashedPassword: hashedPassword,
          email: data.email,
        })
        .returning({ id: users.id });

    console.log("✅ Usuário inserido com ID:", newUser[0].id);

    // Enviar e-mail de boas-vindas
    await sendWelcomePasswordEmail(data.email, password);

    // Relacionar com merchants
    if (data.selectedMerchants && data.selectedMerchants.length > 0) {
      console.log("🛍 Merchants selecionados:", data.selectedMerchants);

      const userMerchantValues = data.selectedMerchants.map((merchantId) => ({
        slug: generateSlug(),
        dtinsert: new Date().toISOString(),
        dtupdate: new Date().toISOString(),
        active: true,
        idUser: newUser[0].id,
        idMerchant: safeNumber(merchantId, "idMerchant"),
      }));

      await db.insert(userMerchants).values(userMerchantValues);
    }

    revalidatePath("/portal/users");
    console.log("🎉 Usuário criado com sucesso:", newUser);
    return newUser;
  } catch (error: any) {
    console.error("❌ Erro ao criar usuário:", error);

    // Verificar erro de senha comprometida (Clerk)
    if (error.status === 422 && error.errors && error.errors.length > 0) {
      const passwordError = error.errors.find(
          (e: any) => e.code === "form_password_pwned"
      );
      if (passwordError) {
        throw new Error(
            "Senha comprometida: Essa senha foi encontrada em vazamentos de dados. Por favor, escolha uma senha mais segura."
        );
      }
    }

    throw error;
  }
}


export async function updateUser(id: number, data: UserInsert) {
  if (!id) {
    throw new Error("ID do usuário é obrigatório");
  }

  const fieldsToValidate: (keyof UserInsert)[] = [
    "firstName",
    "lastName",
    "email",
    "idProfile",
  ];

  const hasInvalidFields = fieldsToValidate.some((field) => {
    const value = data[field];
    return (
      value !== undefined &&
      (value === null || (typeof value === "string" && value.trim() === ""))
    );
  });

  if (hasInvalidFields) {
    throw new Error("Campos obrigatórios não podem estar vazios");
  }

  try {
    const existingUser = await db.select().from(users).where(eq(users.id, id));

    if (!existingUser || existingUser.length === 0) {
      throw new Error("Usuário não encontrado");
    }

    const clerk = await clerkClient();

    await clerk.users.updateUser(existingUser[0].idClerk || "", {
      firstName: data.firstName,
      lastName: data.lastName,
      ...(data.password ? { password: data.password } : {}),
    });

    await db
      .update(users)
      .set({
        idProfile: data.idProfile,
        idCustomer: data.idCustomer,
        idAddress: data.idAddress,
        dtupdate: new Date().toISOString(),
        fullAccess: data.fullAccess,
      })
      .where(eq(users.id, id));

    // Update user-merchant relationships
    // First, delete existing relationships
    await db.delete(userMerchants).where(eq(userMerchants.idUser, id));

    // Then, insert new relationships if any merchants are selected
    if (data.selectedMerchants && data.selectedMerchants.length > 0) {
      const userMerchantValues = data.selectedMerchants.map((merchantId) => ({
        slug: generateSlug(),
        dtinsert: new Date().toISOString(),
        dtupdate: new Date().toISOString(),
        active: true,
        idUser: id,
        idMerchant: Number(merchantId),
      }));

      await db.insert(userMerchants).values(userMerchantValues);
    }

    revalidatePath("/portal/users");
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
}

export async function getUserById(
  idClerk: string
): Promise<UserDetailForm | null> {
  const customer = await getCustomerByTentant();

  const userDb = await db
    .select({
      id: users.id,
      idClerk: users.idClerk,
      idCustomer: users.idCustomer,
      idProfile: users.idProfile,
      active: users.active,
      dtinsert: users.dtinsert,
      dtupdate: users.dtupdate,
      slug: users.slug,
      hashedPassword: users.hashedPassword,
      idAddress: users.idAddress,
      fullAccess: users.fullAccess,
    })
    .from(users)
    .innerJoin(customers, eq(users.idCustomer, customers.id))
    .where(and(eq(users.idClerk, idClerk), eq(customers.slug, customer.slug)));

  if (userDb == undefined || userDb == null || userDb[0] == undefined) {
    return null;
  } else {
    const clerkUser = await (
      await clerkClient()
    ).users.getUser(userDb[0].idClerk || "");

    const userMerchantsList = await db
      .select({
        idMerchant: userMerchants.idMerchant,
      })
      .from(userMerchants)
      .where(eq(userMerchants.idUser, userDb[0].id));

    return {
      id: userDb[0].id,
      active: userDb[0].active,
      dtinsert: userDb[0].dtinsert,
      dtupdate: userDb[0].dtupdate,
      email: clerkUser.emailAddresses[0].emailAddress || "",
      firstName: clerkUser.firstName || "",
      idClerk: userDb[0].idClerk,
      idCustomer: userDb[0].idCustomer,
      idProfile: userDb[0].idProfile,
      lastName: clerkUser.lastName || "",
      hashedPassword: userDb[0].hashedPassword,
      password: "",
      slug: userDb[0].slug,
      idAddress: userDb[0].idAddress,
      fullAccess: userDb[0].fullAccess || false,
      selectedMerchants: userMerchantsList.map(
        (um) => um.idMerchant?.toString() || ""
      ),
      temporaryPassword: "false",
      firstLogin: null,
    };
  }
}

export async function getDDProfiles(): Promise<DD[]> {
  const result = await db
    .select({ id: profiles.id, name: profiles.name })
    .from(profiles)
    .where(eq(profiles.active, true));
  return result as DD[];
}

export async function getDDMerchants(): Promise<DD[]> {
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return empty result
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return [];
  }
  const customerId = userAccess.idCustomer;

  const conditions = [eq(merchants.idCustomer, customerId)];

  if (!userAccess.fullAccess) {
    conditions.push(inArray(merchants.id, userAccess.idMerchants));
  }
  const merchantResult = await db
    .select({ id: merchants.id, name: merchants.name })
    .from(merchants)
    .where(and(...conditions));

  if (!merchantResult || merchantResult.length === 0) {
    return [];
  }

  return merchantResult.map((merchant) => ({
    ...merchant,
    name: merchant.name?.toUpperCase() ?? null,
  })) as DD[];
}

export async function getUserGroupPermissions(
  userSlug: string,
  group: string
): Promise<string[]> {
  try {
    const result = await db.execute(sql`
      SELECT DISTINCT f.name
      FROM users u
      JOIN profiles p ON u.id_profile = p.id
      JOIN profile_functions pf ON p.id = pf.id_profile
      JOIN functions f ON pf.id_functions = f.id
      WHERE u.id_clerk = ${userSlug}
        AND f."group" = ${group}
        AND u.active = true
        AND p.active = true
        AND pf.active = true
      ORDER BY f.name
    `);

    return result.rows.map((row: any) => row.name);
  } catch (error) {
    console.error("Error getting user group permissions:", error);
    return [];
  }
}

export async function validateCurrentPassword(
  currentPassword: string,
  userId: string
): Promise<boolean> {
  try {
    const clerk = await clerkClient();

    const validation = await clerk.users.verifyPassword({
      userId,
      password: currentPassword,
    });

    return validation.verified;
  } catch (error) {
    console.error("Erro ao validar senha:", error);
    return false;
  }
}

export async function UpdateMyProfile(data: {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  idClerk: string;
}) {
  const fieldsToValidate = ["firstName", "lastName", "email"];

  const hasInvalidFields = fieldsToValidate.some((field) => {
    const value = data[field as keyof typeof data];
    return value === undefined || value === null || value.trim() === "";
  });

  if (hasInvalidFields) {
    throw new Error("Nome, sobrenome e email são campos obrigatórios");
  }

  try {
    const clerk = await clerkClient();

    await clerk.users.updateUser(data.idClerk, {
      firstName: data.firstName,
      lastName: data.lastName,
      ...(data.password ? { password: data.password } : {}),
    });

    revalidatePath("/portal/myProfile");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return false;
  }
}

export interface UserMerchantsAccess {
  fullAccess: boolean;
  idMerchants: number[];
  idCustomer: number;
}

export interface UserMerchantSlugs {
  fullAccess: boolean;
  slugMerchants: string[];
}

export async function getUserMerchantsAccess(): Promise<UserMerchantsAccess> {
  try {
    const userClerk = await currentUser();

    if (!userClerk) {
      throw new Error("User not authenticated");
    }

    const user = await db
      .select({
        id: users.id,
        fullAccess: users.fullAccess,
        idCustomer: users.idCustomer,
      })
      .from(users)
      .where(eq(users.idClerk, userClerk.id));

    if (!user || user.length === 0) {
      throw new Error("User not found in database");
    }

    if (user[0].fullAccess) {
      return {
        fullAccess: true,
        idMerchants: [],
        idCustomer: user[0].idCustomer || 0,
      };
    }

    type MerchantResult = { idMerchant: number | null };

    const merchantAccess = await db
      .select({
        idMerchant: userMerchants.idMerchant,
      })
      .from(userMerchants)
      .where(eq(userMerchants.idUser, user[0].id));

    return {
      fullAccess: user[0].fullAccess || false,
      idMerchants: (merchantAccess as MerchantResult[])
        .map((merchant) => merchant.idMerchant)
        .filter((id): id is number => id !== null),
      idCustomer: user[0].idCustomer || 0,
    };
  } catch (error) {
    console.error("Erro ao obter acesso aos comerciantes do usuário:", error);
    throw error;
  }
}

export async function getUserMerchantSlugs(): Promise<UserMerchantSlugs> {
  const userClerk = await currentUser();

  if (!userClerk) {
    throw new Error("User not authenticated");
  }

  const user = await db
    .select({
      id: users.id,
      fullAccess: users.fullAccess,
    })
    .from(users)
    .where(eq(users.idClerk, userClerk.id));

  if (!user || user.length === 0) {
    throw new Error("User not found in database");
  }
  if (user[0].fullAccess) {
    return {
      fullAccess: true,
      slugMerchants: [],
    };
  }

  const merchantAccess = await db
    .select({
      slugMerchant: merchants.slug,
    })
    .from(userMerchants)
    .leftJoin(merchants, eq(userMerchants.idMerchant, merchants.id))
    .where(eq(userMerchants.idUser, user[0].id));

  return {
    fullAccess: false,
    slugMerchants: merchantAccess
      .map((merchant) => merchant.slugMerchant)
      .filter((slug): slug is string => slug !== null),
  };
}

export async function getAddressById(id: number) {
  const result = await db.select().from(addresses).where(eq(addresses.id, id));

  if (!result || result.length === 0) {
    return null;
  }

  return {
    id: result[0].id,
    zipCode: result[0].zipCode,
    streetAddress: result[0].streetAddress,
    streetNumber: result[0].streetNumber,
    complement: result[0].complement,
    neighborhood: result[0].neighborhood,
    city: result[0].city,
    state: result[0].state,
    country: result[0].country,
  };
}

export async function insertAddressFormAction(data: AddressSchema) {
  const result = await db
    .insert(addresses)
    .values({
      zipCode: data.zipCode,
      streetAddress: data.streetAddress,
      streetNumber: data.streetNumber,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      country: data.country,
    })
    .returning({ id: addresses.id });

  return result[0].id;
}

export async function updateAddressFormAction(data: AddressSchema) {
  if (!data.id) {
    throw new Error("ID do endereço é obrigatório para atualização");
  }

  await db
    .update(addresses)
    .set({
      zipCode: data.zipCode,
      streetAddress: data.streetAddress,
      streetNumber: data.streetNumber,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      country: data.country,
    })
    .where(eq(addresses.id, data.id));

  return data.id;
}

export async function getProfileById(id: number) {
  const result = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      isSalesAgent: profiles.isSalesAgent,
    })
    .from(profiles)
    .where(eq(profiles.id, id));

  if (!result || result.length === 0) {
    return null;
  }

  return result[0];
}

export async function createSalesAgent(
  userId: number,
  firstName: string,
  lastName: string,
  email: string
) {
  try {
    const result = await db
      .insert(salesAgents)
      .values({
        slug: generateSlug(),
        firstName,
        lastName,
        email,
        active: true,
        dtinsert: new Date().toISOString(),
        dtupdate: new Date().toISOString(),
        idUsers: userId,
      })
      .returning({ id: salesAgents.id });

    return result[0].id;
  } catch (error) {
    console.error("Erro ao criar agente de vendas:", error);
    throw error;
  }
}

export async function getCustomerByTentant() {
  const cookieStore = cookies();
  const tenant = cookieStore.get("tenant")?.value;
  const customer = await db
    .select({
      slug: customers.slug,
    })
    .from(customerCustomization)
    .innerJoin(customers, eq(customerCustomization.customerId, customers.id))
    .where(eq(customerCustomization.slug, tenant || ""))
    .limit(1);
  return customer[0];
}

export async function getCustomerIdByTentant() {
  const cookieStore = cookies();
  const tenant = cookieStore.get("tenant")?.value;
  const customer = await db
    .select({
      id: customers.id,
    })
    .from(customerCustomization)
    .innerJoin(customers, eq(customerCustomization.customerId, customers.id))
    .where(eq(customerCustomization.slug, tenant || ""))
    .limit(1);

  if (!customer || customer.length === 0) {
    throw new Error(`Customer não encontrado para o tenant: ${tenant}`);
  }

  console.log("CUSTOMER_ID AQUI:", customer[0].id)
  return customer[0].id;

}
