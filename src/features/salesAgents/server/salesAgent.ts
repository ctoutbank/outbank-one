"use server";

import { hashPassword } from "@/app/utils/password";
import { sendWelcomePasswordEmail } from "@/app/utils/send-email";
import {
  DD,
  generateRandomPassword,
  getCustomerByTentant,
  getUserMerchantsAccess,
} from "@/features/users/server/users";
import { generateSlug } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs/server";
import {
  and,
  count,
  desc,
  eq,
  gte,
  inArray,
  like,
  lte,
  max,
  or,
} from "drizzle-orm";
import {
  addresses,
  customers,
  merchants,
  profiles,
  salesAgents,
  userMerchants,
  users,
} from "../../../../drizzle/schema";
import { db } from "../../../server/db";

export type SalesAgentFull = {
  id: number;
  slug: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  active: boolean | null;
  dtinsert: Date | null;
  dtupdate: Date | null;
  documentId: string | null;
  slugCustomer: string | null;
  totalMerchants?: number;
  pendingMerchants?: number;
  approvedMerchants?: number;
  rejectedMerchants?: number;
};

export interface SalesAgentsList {
  salesAgents: SalesAgentFull[];
  totalCount: number;
}

export type SalesAgentesDetail = typeof salesAgents.$inferSelect;
export type SalesAgentesInsert = typeof salesAgents.$inferInsert;

export type SalesAgentDetail = SalesAgentesDetail & {
  idProfile: number | null;
  idCustomer: number | null;
  idAddress: number | null;
  streetAddress: string | null;
  streetNumber: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  selectedMerchants: string[] | null;
};

export type SalesAgentInsert = SalesAgentesInsert & {
  idProfile: number | null;
  idCustomer: number | null;
  streetAddress: string | null;
  streetNumber: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  selectedMerchants: string[] | null;
};

export async function getSalesAgents(
  search: string,
  page: number,
  pageSize: number,
  status?: string,
  dateFrom?: string,
  dateTo?: string,
  email?: string
): Promise<SalesAgentsList | undefined> {
  try {
    // Get user's merchant access
    const customer = await getCustomerByTentant();

    const offset = (page - 1) * pageSize;

    const conditions = [
      or(
        like(salesAgents.firstName, `%${search}%`),
        like(salesAgents.lastName, `%${search}%`),
        like(salesAgents.email, `%${search}%`)
      ),
    ];

    if (email) {
      conditions.push(like(salesAgents.email, `%${email}%`));
    }

    if (status) {
      conditions.push(eq(salesAgents.active, status === "ACTIVE"));
    }

    if (dateFrom) {
      conditions.push(gte(salesAgents.dtinsert, dateFrom));
    }

    if (dateTo) {
      conditions.push(lte(salesAgents.dtinsert, dateTo));
    }

    if (customer) {
      conditions.push(eq(salesAgents.slugCustomer, customer.slug));
    }

    const result = await db
      .select()
      .from(salesAgents)
      .where(and(...conditions))
      .orderBy(desc(salesAgents.id))
      .limit(pageSize)
      .offset(offset);

    const totalCountResult = await db
      .select({ count: count() })
      .from(salesAgents);
    const totalCount = totalCountResult[0]?.count || 0;

    return {
      salesAgents: result.map((salesAgent) => ({
        id: salesAgent.id,
        slug: salesAgent.slug || "",
        firstName: salesAgent.firstName || "",
        lastName: salesAgent.lastName || "",
        email: salesAgent.email || "",
        active: salesAgent.active || null,
        dtinsert: salesAgent.dtinsert
          ? new Date(salesAgent.dtinsert)
          : new Date(),
        dtupdate: salesAgent.dtupdate
          ? new Date(salesAgent.dtupdate)
          : new Date(),
        documentId: salesAgent.documentId || "",
        slugCustomer: salesAgent.slugCustomer || "",
      })),
      totalCount,
    };
  } catch (error) {
    console.log("error ao buscar sales agent", error);
    return;
  }
}

/**
 * Gera o próximo documentId sequencial no formato c0001, c0002, etc.
 */
export async function generateNextDocumentId(): Promise<string> {
  try {
    // Buscar o maior documentId atual
    const result = await db
      .select({
        maxDocumentId: max(salesAgents.documentId),
      })
      .from(salesAgents)
      .where(like(salesAgents.documentId, "c%"));

    const maxDocumentId = result[0]?.maxDocumentId;
    let nextNumber = 1;

    if (maxDocumentId) {
      // Extrair o número do último documentId (c0001 -> 1)
      const match = maxDocumentId.match(/c(\d+)/);
      if (match && match[1]) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    let documentId = "";
    let isUnique = false;

    while (!isUnique) {
      // Formatar com zeros à esquerda (1 -> 0001)
      const formattedNumber = nextNumber.toString().padStart(4, "0");
      documentId = `c${formattedNumber}`;

      const existingAgent = await db
        .select()
        .from(salesAgents)
        .where(eq(salesAgents.documentId, documentId))
        .limit(1);

      if (existingAgent.length === 0) {
        // Não encontrou, então é único
        isUnique = true;
      } else {
        // Já existe, incrementar e tentar novamente
        console.log(
          `DocumentId ${documentId} já existe, tentando o próximo...`
        );
        nextNumber++;
      }
    }

    return documentId;
  } catch (error) {
    console.error("Erro ao gerar próximo documentId:", error);
    return `c0001`;
  }
}

export async function insertSalesAgent(salesAgent: SalesAgentInsert) {
  console.log("Inserindo salesAgent:", salesAgent);

  // Se não tiver documentId, gerar um novo documentId sequencial
  if (!salesAgent.documentId || salesAgent.documentId === "") {
    salesAgent.documentId = await generateNextDocumentId();
    console.log("Novo documentId gerado:", salesAgent.documentId);
  } else {
    // Se tiver um documentId fornecido, verificar se já existe
    const existingAgent = await db
      .select()
      .from(salesAgents)
      .where(eq(salesAgents.documentId, salesAgent.documentId))
      .limit(1);

    if (existingAgent.length > 0) {
      console.log(
        `DocumentId ${salesAgent.documentId} já existe, gerando um novo...`
      );
      salesAgent.documentId = await generateNextDocumentId();
      console.log("Novo documentId gerado:", salesAgent.documentId);
    }
  }
  const address = await db
    .insert(addresses)
    .values({
      streetAddress: salesAgent.streetAddress,
      streetNumber: salesAgent.streetNumber,
      complement: salesAgent.complement,
      neighborhood: salesAgent.neighborhood,
      city: salesAgent.city,
      state: salesAgent.state,
      zipCode: salesAgent.zipCode,
      country: salesAgent.country,
    })
    .returning({ id: addresses.id });

  const idAddress = address[0].id;
  const clerkUser = await (
    await clerkClient()
  ).users.createUser({
    firstName: salesAgent.firstName || "",
    lastName: salesAgent.lastName || "",
    emailAddress: [salesAgent.email || ""],
    skipPasswordRequirement: true,
    publicMetadata: {
      isFirstLogin: true,
    },
  });

  const password = await generateRandomPassword();

  const hashedPassword = hashPassword(password);
  console.log(password);

  const newUser = await db
    .insert(users)
    .values({
      slug: generateSlug(),
      dtinsert: new Date().toISOString(),
      dtupdate: new Date().toISOString(),
      active: true,
      idClerk: clerkUser.id,
      idCustomer: salesAgent.idCustomer,
      idProfile: salesAgent.idProfile,
      idAddress: idAddress,
      fullAccess: false,
      hashedPassword: hashedPassword,
      email: salesAgent.email,
    })

    .returning({ id: users.id });

  await sendWelcomePasswordEmail(salesAgent.email || "", password);

  // Insert user-merchant relationships if any merchants are selected
  if (salesAgent.selectedMerchants && salesAgent.selectedMerchants.length > 0) {
    const userMerchantValues = salesAgent.selectedMerchants.map(
      (merchantId) => ({
        slug: generateSlug(),
        dtinsert: new Date().toISOString(),
        dtupdate: new Date().toISOString(),
        active: true,
        idUser: newUser[0].id,
        idMerchant: Number(merchantId),
      })
    );

    await db.insert(userMerchants).values(userMerchantValues);
  }

  const result = await db.insert(salesAgents).values(salesAgent).returning({
    id: salesAgents.id,
  });
  return result[0].id;
}

export async function getSalesAgentById(
  id: number
): Promise<SalesAgentDetail | null> {
  // Validar se o ID é um número válido (permitindo 0 para criação)
  if (isNaN(id) || id < 0) {
    return null;
  }

  // Se o ID é 0, retornar um objeto vazio para permitir criação
  if (id === 0) {
    return {
      id: 0,
      slug: null,
      firstName: null,
      lastName: null,
      email: null,
      active: true,
      dtinsert: null,
      dtupdate: null,
      documentId: null,
      slugCustomer: null,
      cpf: null,
      phone: null,
      birthDate: null,
      idUsers: null,
      idProfile: null,
      idCustomer: null,
      idAddress: null,
      streetAddress: null,
      streetNumber: null,
      complement: null,
      neighborhood: null,
      city: null,
      state: null,
      zipCode: null,
      country: null,
      selectedMerchants: [],
    };
  }

  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();
  if (!userAccess.fullAccess && !userAccess.idMerchants.includes(id)) {
    return null;
  }
  const customer = await getCustomerByTentant();

  const result = await db
    .select({
      id: salesAgents.id,
      slug: salesAgents.slug,
      firstName: salesAgents.firstName,
      lastName: salesAgents.lastName,
      email: salesAgents.email,
      active: salesAgents.active,
      dtinsert: salesAgents.dtinsert,
      dtupdate: salesAgents.dtupdate,
      documentId: salesAgents.documentId,
      slugCustomer: salesAgents.slugCustomer,
      cpf: salesAgents.cpf,
      phone: salesAgents.phone,
      birthDate: salesAgents.birthDate,
      idUsers: salesAgents.idUsers,
      idProfile: profiles.id,
      idCustomer: users.idCustomer,
      idAddress: users.idAddress,
      streetAddress: addresses.streetAddress,
      streetNumber: addresses.streetNumber,
      complement: addresses.complement,
      neighborhood: addresses.neighborhood,
      city: addresses.city,
      state: addresses.state,
      zipCode: addresses.zipCode,
      country: addresses.country,
    })
    .from(salesAgents)
    .leftJoin(users, eq(salesAgents.idUsers, users.id))
    .leftJoin(profiles, eq(users.idProfile, profiles.id))
    .leftJoin(addresses, eq(users.idAddress, addresses.id))
    .where(
      and(eq(salesAgents.id, id), eq(salesAgents.slugCustomer, customer.slug))
    )
    .limit(1);

  // Se não encontrou nenhum resultado, retornar null
  if (!result[0]) {
    return null;
  }

  const userMerchantResult = await db
    .select({
      idMerchant: userMerchants.idMerchant,
    })
    .from(userMerchants)
    .where(eq(userMerchants.idUser, result[0]?.idUsers || 0));

  return {
    ...result[0],
    selectedMerchants: userMerchantResult.map(
      (merchant) => merchant.idMerchant?.toString() || ""
    ),
  };
}

export async function updateSalesAgent(
  salesAgent: SalesAgentesDetail
): Promise<void> {
  console.log("Atualizando salesAgent:", JSON.stringify(salesAgent, null, 2));
  console.log("CPF a ser atualizado:", salesAgent.cpf);
  console.log("Telefone a ser atualizado:", salesAgent.phone);
  console.log("Data de nascimento a ser atualizada:", salesAgent.birthDate);

  try {
    await db
      .update(salesAgents)
      .set({
        firstName: salesAgent.firstName,
        lastName: salesAgent.lastName,
        email: salesAgent.email,
        active: salesAgent.active,
        dtupdate: new Date().toISOString(),
        documentId: salesAgent.documentId,
        slugCustomer: salesAgent.slugCustomer,
        cpf: salesAgent.cpf,
        phone: salesAgent.phone,
        birthDate: salesAgent.birthDate,
        idUsers: salesAgent.idUsers,
      })
      .where(eq(salesAgents.id, salesAgent.id));

    // Verificar se a atualização funcionou, consultando os dados atualizados
    const updated = await getSalesAgentById(salesAgent.id);
    console.log("Dados após atualização:", JSON.stringify(updated, null, 2));
    console.log("CPF após atualização:", updated?.cpf);
    console.log("Telefone após atualização:", updated?.phone);
    console.log("Data de nascimento após atualização:", updated?.birthDate);

    console.log(
      "SalesAgent atualizado com sucesso, incluindo cpf, phone e birthDate"
    );
  } catch (error) {
    console.error("Erro ao atualizar salesAgent:", error);
    throw error;
  }
}

export async function getDDMerchants(idCustomer: number): Promise<DD[]> {
  const result = await db
    .select({
      id: merchants.id,
      name: merchants.name,
    })
    .from(merchants)
    .where(eq(merchants.idCustomer, idCustomer));
  return result;
}

export async function getDDProfiles(): Promise<DD[]> {
  const result = await db
    .select({
      id: profiles.id,
      name: profiles.name,
    })
    .from(profiles);
  return result;
}

export async function getDDCustomers(): Promise<DD[]> {
  const result = await db
    .select({
      id: customers.id,
      name: customers.name,
    })
    .from(customers);
  return result;
}

export async function getSalesAgentsWithDashboardData(
  search: string,
  page: number,
  pageSize: number,
  status?: string,
  dateFrom?: string,
  dateTo?: string,
  email?: string
): Promise<SalesAgentsList | undefined> {
  try {
    // Get user's merchant access
    const userAccess = await getUserMerchantsAccess();
    const customer = await getCustomerByTentant();

    const offset = (page - 1) * pageSize;

    const conditions = [
      or(
        like(salesAgents.firstName, `%${search}%`),
        like(salesAgents.lastName, `%${search}%`),
        like(salesAgents.email, `%${search}%`)
      ),
    ];

    if (email) {
      conditions.push(like(salesAgents.email, `%${email}%`));
    }

    if (status) {
      conditions.push(eq(salesAgents.active, status === "ACTIVE"));
    }

    if (dateFrom) {
      conditions.push(gte(salesAgents.dtinsert, dateFrom));
    }

    if (dateTo) {
      conditions.push(lte(salesAgents.dtinsert, dateTo));
    }

    if (customer) {
      conditions.push(eq(salesAgents.slugCustomer, customer.slug));
    }

    // Aplicar controle de acesso baseado nos merchants do usuário
    if (!userAccess.fullAccess && userAccess.idMerchants.length > 0) {
      // Se o usuário tem acesso a merchants específicos, filtrar sales agents que têm esses merchants
      conditions.push(
        inArray(
          salesAgents.id,
          db
            .select({ id: merchants.idSalesAgent })
            .from(merchants)
            .where(inArray(merchants.id, userAccess.idMerchants))
        )
      );
    } else if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
      // Se o usuário não tem acesso a nenhum merchant, retornar dados vazios
      return {
        salesAgents: [],
        totalCount: 0,
      };
    }

    const result = await db
      .select()
      .from(salesAgents)
      .where(and(...conditions))
      .orderBy(desc(salesAgents.id))
      .limit(pageSize)
      .offset(offset);

    const totalCountResult = await db
      .select({ count: count() })
      .from(salesAgents)
      .where(and(...conditions));
    const totalCount = totalCountResult[0]?.count || 0;

    // Calcular estatísticas de merchants para cada sales agent
    const salesAgentsWithStats = await Promise.all(
      result.map(async (salesAgent) => {
        // Condições base para merchants deste sales agent
        const merchantConditions = [eq(merchants.idSalesAgent, salesAgent.id)];

        // Aplicar controle de acesso aos merchants
        if (!userAccess.fullAccess && userAccess.idMerchants.length > 0) {
          merchantConditions.push(
            inArray(merchants.id, userAccess.idMerchants)
          );
        } else if (
          !userAccess.fullAccess &&
          userAccess.idMerchants.length === 0
        ) {
          // Se o usuário não tem acesso, retornar zeros
          return {
            id: salesAgent.id,
            slug: salesAgent.slug || "",
            firstName: salesAgent.firstName || "",
            lastName: salesAgent.lastName || "",
            email: salesAgent.email || "",
            active: salesAgent.active || null,
            dtinsert: salesAgent.dtinsert
              ? new Date(salesAgent.dtinsert)
              : new Date(),
            dtupdate: salesAgent.dtupdate
              ? new Date(salesAgent.dtupdate)
              : new Date(),
            documentId: salesAgent.documentId || "",
            slugCustomer: salesAgent.slugCustomer || "",
            totalMerchants: 0,
            pendingMerchants: 0,
            approvedMerchants: 0,
            rejectedMerchants: 0,
          };
        }

        // Contagem total de merchants
        const totalMerchantsResult = await db
          .select({ count: count() })
          .from(merchants)
          .where(and(...merchantConditions));
        const totalMerchants = totalMerchantsResult[0]?.count || 0;

        // Contagem de merchants pendentes (KYC)
        const pendingMerchantsResult = await db
          .select({ count: count() })
          .from(merchants)
          .where(
            and(
              ...merchantConditions,
              or(
                eq(merchants.riskAnalysisStatus, "PENDING"),
                eq(merchants.riskAnalysisStatus, "WAITINGDOCUMENTS"),
                eq(merchants.riskAnalysisStatus, "NOTANALYSED")
              )
            )
          );
        const pendingMerchants = pendingMerchantsResult[0]?.count || 0;

        // Contagem de merchants aprovados
        const approvedMerchantsResult = await db
          .select({ count: count() })
          .from(merchants)
          .where(
            and(
              ...merchantConditions,
              eq(merchants.riskAnalysisStatus, "APPROVED")
            )
          );
        const approvedMerchants = approvedMerchantsResult[0]?.count || 0;

        // Contagem de merchants rejeitados
        const rejectedMerchantsResult = await db
          .select({ count: count() })
          .from(merchants)
          .where(
            and(
              ...merchantConditions,
              or(
                eq(merchants.riskAnalysisStatus, "DECLINED"),
                eq(merchants.riskAnalysisStatus, "KYCOFFLINE")
              )
            )
          );
        const rejectedMerchants = rejectedMerchantsResult[0]?.count || 0;

        return {
          id: salesAgent.id,
          slug: salesAgent.slug || "",
          firstName: salesAgent.firstName || "",
          lastName: salesAgent.lastName || "",
          email: salesAgent.email || "",
          active: salesAgent.active || null,
          dtinsert: salesAgent.dtinsert
            ? new Date(salesAgent.dtinsert)
            : new Date(),
          dtupdate: salesAgent.dtupdate
            ? new Date(salesAgent.dtupdate)
            : new Date(),
          documentId: salesAgent.documentId || "",
          slugCustomer: salesAgent.slugCustomer || "",
          totalMerchants,
          pendingMerchants,
          approvedMerchants,
          rejectedMerchants,
        };
      })
    );

    return {
      salesAgents: salesAgentsWithStats,
      totalCount,
    };
  } catch (error) {
    console.log("error ao buscar sales agent", error);
    return;
  }
}
