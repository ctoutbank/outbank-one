"use server";

import { generateSlug } from "@/lib/utils";
import { db } from "@/server/db";
import { clerkClient } from "@clerk/nextjs/server";
import { count, eq, and, desc, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  customers,
  merchants,
  profiles,
  users,
} from "../../../../drizzle/schema";

export type UserInsert = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  idCustomer: number | null;
  idProfile: number | null;
  idMerchant: number | null;
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
        merchantName: string;
        customerName: string;
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
  console.log(userListParams);
  const clerk = await clerkClient();
  const clerkResult = (await clerk.users.getUserList(userListParams)).data;
  console.log(clerkResult);

  const conditions = [
    merchant ? eq(users.idMerchant, merchant) : undefined,
    customer ? eq(users.idCustomer, customer) : undefined,
    profile ? eq(users.idProfile, profile) : undefined,
  ];
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

  const result = await db
    .select({
      id: users.id,
      profileName: profiles.name,
      profileDescription: profiles.description,
      status: users.active,
      merchantName: merchants.name,
      customerName: customers.name,
      clerkId: users.idClerk,
    })
    .from(users)
    .leftJoin(merchants, eq(users.idMerchant, merchants.id))
    .leftJoin(customers, eq(users.idCustomer, customers.id))
    .leftJoin(profiles, eq(users.idProfile, profiles.id))
    .where(and(...conditions))
    .orderBy(desc(users.id))
    .limit(pageSize)
    .offset(offset);

  const userObject = result.map((dbUser) => {
    const clerkData = clerkResult.find(
      (clerk: any) => clerk.id === dbUser.clerkId
    );

    return {
      id: dbUser.id,
      firstName: clerkData?.firstName || "",
      lastName: clerkData?.lastName || "",
      email: clerkData?.emailAddresses[0].emailAddress || "",
      profileName: dbUser.profileName || "",
      profileDescription: dbUser.profileDescription || "",
      status: dbUser.status || true,
      merchantName: dbUser.merchantName || "",
      customerName: dbUser.customerName || "",
    };
  });

  const totalCountResult = await db
    .select({ count: count() })
    .from(users)
    .where(and(...conditions));

  const totalCount = totalCountResult[0]?.count || 0;
  console.log(offset, result);
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
      })
      .returning({ id: users.id });
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

    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }

    const clerk = await clerkClient();

    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }
    await clerk.users.updateUser(existingUser[0].idClerk || "", {
      firstName: data.firstName,
      lastName: data.lastName,
      ...(data.password ? { password: data.password } : {}),
    });

    await db
      .update(users)
      .set({
        idProfile: data.idProfile,
        dtupdate: new Date().toISOString(),
      })
      .where(eq(users.id, id));

    revalidatePath("/portal/users");
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
}

export async function getUserById(id: number): Promise<UserDetailForm | null> {
  const userDb = await db.select().from(users).where(eq(users.id, id));
  console.log(
    "condição",
    userDb == undefined || userDb == null || userDb[0] == undefined
  );
  if (userDb == undefined || userDb == null || userDb[0] == undefined) {
    return null;
  } else {
    const clerkUser = await (
      await clerkClient()
    ).users.getUser(userDb[0].idClerk || "");
    return {
      id: userDb[0].id,
      active: userDb[0].active,
      dtinsert: userDb[0].dtinsert,
      dtupdate: userDb[0].dtupdate,
      email: clerkUser.emailAddresses[0].emailAddress || "",
      firstName: clerkUser.firstName || "",
      idClerk: userDb[0].idClerk,
      idCustomer: userDb[0].idCustomer,
      idMerchant: userDb[0].idMerchant,
      idProfile: userDb[0].idProfile,
      lastName: clerkUser.lastName || "",
      password: "",
      slug: userDb[0].slug,
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
  const result = await db
    .select({ id: merchants.id, name: merchants.name })
    .from(merchants)
    .where(eq(merchants.active, true));
  return result as DD[];
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
