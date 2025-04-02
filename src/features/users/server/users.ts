"use server";

import { generateSlug } from "@/lib/utils";
import { db } from "@/server/db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  customers,
  merchants,
  profiles,
  userMerchants,
  users,
} from "../../../../drizzle/schema";

export type UserInsert = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  idCustomer: number | null;
  idProfile: number | null;
  selectedMerchants?: string[];
  fullAccess: boolean;
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
}

export async function getUsers(
  email: string,
  firstName: string,
  lastName: string,
  profile: number,
  merchant: number,
  customer: number,
  page: number,
  pageSize: number
): Promise<UserList> {
  const offset = (page - 1) * pageSize;

  const userListParams = {
    limit: pageSize,
    offset: offset,
    emailAddress: email ? [email] : undefined,
    query: firstName
      ? lastName
        ? firstName + " " + lastName
        : firstName
      : undefined,
  };

  const clerk = await clerkClient();
  const clerkResult = (await clerk.users.getUserList(userListParams)).data;

  const conditions = [
    customer ? eq(users.idCustomer, customer) : undefined,
    profile ? eq(users.idProfile, profile) : undefined,
  ].filter(Boolean);

  if (clerkResult.length == 0) {
    return {
      userObject: null,
      totalCount: 0,
    };
  }

  if (email && email.trim() !== "" && clerkResult.length > 0) {
    const clerkIds = clerkResult.map((clerk: any) => clerk.id);
    conditions.push(inArray(users.idClerk, clerkIds));
  }

  // First, get all users that match the conditions
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
    .leftJoin(customers, eq(users.idCustomer, customers.id))
    .leftJoin(profiles, eq(users.idProfile, profiles.id))
    .where(and(...conditions))
    .orderBy(desc(users.id))
    .limit(pageSize)
    .offset(offset);

  // Then, for each user, get their merchants
  const userObject = await Promise.all(
    userResults.map(async (dbUser) => {
      const clerkData = clerkResult.find(
        (clerk: any) => clerk.id === dbUser.idClerk
      );

      // Get user's merchants
      const userMerchantsList = await db
        .select({
          id: merchants.id,
          name: merchants.name,
        })
        .from(userMerchants)
        .leftJoin(merchants, eq(userMerchants.idMerchant, merchants.id))
        .where(eq(userMerchants.idUser, dbUser.id));

      const merchantsList = userMerchantsList.map((merchant) => ({
        id: merchant.id!,
        name: merchant.name,
      }));

      return {
        id: dbUser.id,
        firstName: clerkData?.firstName || "",
        lastName: clerkData?.lastName || "",
        email: clerkData?.emailAddresses[0].emailAddress || "",
        profileName: dbUser.profileName || "",
        profileDescription: dbUser.profileDescription || "",
        status: dbUser.status || true,
        customerName: dbUser.customerName || "",
        merchants: merchantsList,
        idClerk: dbUser.idClerk || "",
      };
    })
  );

  const totalCountResult = await db
    .select({ count: count() })
    .from(users)
    .where(and(...conditions));

  const totalCount = totalCountResult[0]?.count || 0;
  return {
    userObject,
    totalCount,
  };
}

export async function InsertUser(data: UserInsert) {
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
    const clerkUser = await (
      await clerkClient()
    ).users.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      emailAddress: [data.email],
      password: data.password,
    });

    const newUser = await db
      .insert(users)
      .values({
        slug: generateSlug(),
        dtinsert: new Date().toISOString(),
        dtupdate: new Date().toISOString(),
        active: true,
        idClerk: clerkUser.id,
        idCustomer: data.idCustomer,
        idProfile: data.idProfile,
        fullAccess: data.fullAccess,
      })
      .returning({ id: users.id });

    // Insert user-merchant relationships if any merchants are selected
    if (data.selectedMerchants && data.selectedMerchants.length > 0) {
      const userMerchantValues = data.selectedMerchants.map((merchantId) => ({
        slug: generateSlug(),
        dtinsert: new Date().toISOString(),
        dtupdate: new Date().toISOString(),
        active: true,
        idUser: newUser[0].id,
        idMerchant: Number(merchantId),
      }));

      await db.insert(userMerchants).values(userMerchantValues);
    }

    revalidatePath("/portal/users");
    return newUser;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
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
  const userDb = await db
    .select()
    .from(users)
    .where(eq(users.idClerk, idClerk));

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
      password: "",
      slug: userDb[0].slug,
      fullAccess: userDb[0].fullAccess || false,
      selectedMerchants: userMerchantsList.map(
        (um) => um.idMerchant?.toString() || ""
      ),
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

export async function getDDMerchants(customerId?: number): Promise<DD[]> {
  if (customerId == undefined || customerId == null) {
    const userClerk = await currentUser();
    const userId = userClerk?.id;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.idClerk, userId || ""));
    if (user && user.length > 0) {
      customerId = user[0].idCustomer || 0;
    }
    if (customerId == undefined || customerId == null) {
      return [];
    }
  }
  const merchantResult = await db
    .select({ id: merchants.id, name: merchants.name })
    .from(merchants)
    .where(eq(merchants.idCustomer, customerId));

  if (!merchantResult || merchantResult.length === 0) {
    return [];
  }

  return merchantResult as DD[];
}

export async function getDDCustomers(): Promise<DD[]> {
  const result = await db
    .select({ id: customers.id, name: customers.name })
    .from(customers);
  return result as DD[];
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
