"use server";

import { LegalNatureDetail } from "@/features/legalNature/server/legalNature-db";
import { getUserMerchantsAccess } from "@/features/users/server/users";
import { db } from "@/server/db";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  ilike,
  inArray,
  lte,
  or,
  sql,
} from "drizzle-orm";
import {
  addresses,
  categories,
  configurations,
  contacts,
  establishmentFormat,
  legalNatures,
  merchantpixaccount,
  merchantPrice,
  merchants,
  salesAgents,
} from "../../../../drizzle/schema";
import {
  MerchantRegistrationChart,
  MerchantRegistrationSummary,
  MerchantTransactionChart,
  MerchantTypeChart,
} from "./merchant-dashboard";

export type MerchantInsert = typeof merchants.$inferInsert;

export interface Merchantlist {
  merchants: {
    merchantid: number | bigint;
    slug: string;
    active: boolean;
    name: string;
    email: string;
    phone_type: string;
    revenue: number;
    id_category: number;
    kic_status: string;
    addressname: string;
    time_zone: string;
    dtinsert: string;
    dtupdate: string;
    lockCpAnticipationOrder: boolean;
    lockCnpAnticipationOrder: boolean;

    sales_agent: string;
    state: string;
    cnpj: string;
    corporate_name: string;
    slug_category: string;
    areaCode: string;
    number: string;
    priceTable: string;
    hasPix: boolean;
    salesAgentDocument: string;
    city: string;
    legalNature: string;
    MCC: string;
    CNAE: string;
    Inclusion: string;
    dtdelete: string;
  }[];
  totalCount: number;
  active_count: number;
  inactive_count: number;
  pending_kyc_count: number;
  approved_kyc_count: number;
  rejected_kyc_count: number;
  cp_anticipation_count: number;
  cnp_anticipation_count: number;
}

export async function getMerchants(
  search: string,
  page: number,
  pageSize: number,
  establishment?: string,
  status?: string,
  state?: string,
  dateFrom?: string,
  email?: string,
  cnpj?: string,
  active?: string,
  salesAgent?: string
): Promise<Merchantlist> {
  const offset = (page - 1) * pageSize;

  const conditions = [];

  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // If user doesn't have full access, add merchant ID filter
  if (!userAccess.fullAccess && userAccess.idMerchants.length > 0) {
    conditions.push(inArray(merchants.id, userAccess.idMerchants));
  } else if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    // If user has no merchant access and no full access, return empty result
    return {
      merchants: [],
      totalCount: 0,
      active_count: 0,
      inactive_count: 0,
      pending_kyc_count: 0,
      approved_kyc_count: 0,
      rejected_kyc_count: 0,
      cp_anticipation_count: 0,
      cnp_anticipation_count: 0,
    };
  }

  if (search) {
    conditions.push(
      or(
        ilike(merchants.name, `%${search}%`),
        ilike(merchants.corporateName, `%${search}%`)
      )
    );
  }

  if (establishment) {
    conditions.push(ilike(merchants.name, `%${establishment}%`));
  }

  if (status) {
    if (status === "all") {
      // Não aplica nenhum filtro de status
    } else if (status === "PENDING") {
      // Status de análise (pendentes)
      conditions.push(
        inArray(merchants.riskAnalysisStatus, [
          "PENDING",
          "WAITINGDOCUMENTS",
          "NOTANALYSED",
        ])
      );
    } else if (status === "APPROVED") {
      // Aprovados
      conditions.push(eq(merchants.riskAnalysisStatus, "APPROVED"));
    } else if (status === "DECLINED") {
      // Recusados/rejeitados
      conditions.push(
        inArray(merchants.riskAnalysisStatus, ["DECLINED", "KYCOFFLINE"])
      );
    } else {
      // Caso seja outro status específico, usa o valor diretamente
      conditions.push(eq(merchants.riskAnalysisStatus, status));
    }
  }

  if (state) {
    conditions.push(eq(addresses.state, state));
  }

  if (dateFrom) {
    // Quando um dateFrom é fornecido, vamos interpretar como "cadastrado em"
    // e criar um filtro para pegar registros daquele dia específico
    const date = new Date(dateFrom);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Início e fim do dia específico
    const startOfDay = new Date(year, month, day, 0, 0, 0).toISOString();
    const endOfDay = new Date(year, month, day, 23, 59, 59, 999).toISOString();

    conditions.push(
      and(
        gte(merchants.dtinsert, startOfDay),
        lte(merchants.dtinsert, endOfDay)
      )
    );
  }

  // Novos filtros
  if (email) {
    conditions.push(ilike(merchants.email, `%${email}%`));
  }

  if (cnpj) {
    conditions.push(ilike(merchants.idDocument, `%${cnpj}%`));
  }

  if (active === "true") {
    conditions.push(eq(merchants.active, true));
  } else if (active === "false") {
    conditions.push(eq(merchants.active, false));
  }

  if (salesAgent) {
    conditions.push(ilike(salesAgents.firstName, `%${salesAgent}%`));
  }

  const result = await db
    .select({
      merchantid: merchants.id,
      corporate_name: merchants.corporateName,
      name: merchants.name,
      risk_analysis_status: merchants.riskAnalysisStatus,
      addressname: addresses.streetAddress, // Nome do endereço
      dtinsert: merchants.dtinsert,
      email: merchants.email,
      phone_type: merchants.phoneType,
      revenue: merchants.revenue,
      id_category: merchants.idCategory,
      kic_status: merchants.riskAnalysisStatus,
      active: merchants.active,
      slug: merchants.slug,
      salesAgents: salesAgents.firstName,
      addresses: addresses.state,
      document: merchants.idDocument,
      lockCpAnticipationOrder: configurations.lockCpAnticipationOrder,
      lockCnpAnticipationOrder: configurations.lockCnpAnticipationOrder,
      cnpj: merchants.idDocument,
      slug_category: merchants.slugCategory,
      time_zone: merchants.timezone,
      areaCode: merchants.areaCode,
      number: merchants.number,
      priceTable: merchantPrice.name,
      hasPix: merchants.hasPix,
      salesAgentDocument: salesAgents.documentId,
      city: addresses.city,
      legalNature: legalNatures.name,
      MCC: categories.mcc,
      CNAE: categories.cnae,
      Inclusion: merchants.inclusion,
      dtupdate: merchants.dtupdate,
      dtdelete: merchants.dtdelete,
    })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .leftJoin(merchantPrice, eq(merchants.idMerchantPrice, merchantPrice.id))
    .leftJoin(legalNatures, eq(merchants.idLegalNature, legalNatures.id))
    .leftJoin(categories, eq(merchants.idCategory, categories.id))
    .where(and(...conditions))
    .orderBy(desc(merchants.dtinsert))
    .offset(offset)
    .limit(pageSize);

  console.log("result", result);

  // Consultas separadas para obter as contagens totais
  const totalCount = await db
    .select({ count: count() })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id)) // Adicionado para filtro de salesAgent
    .where(and(...conditions))
    .then((res) => res[0]?.count || 0);

  // Contagem de ativos
  const activeCount = await db
    .select({ count: count() })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id)) // Adicionado para filtro de salesAgent
    .where(and(...conditions, eq(merchants.active, true)))
    .then((res) => res[0]?.count || 0);

  // Contagem de inativos
  const inactiveCount = await db
    .select({ count: count() })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id)) // Adicionado para filtro de salesAgent
    .where(and(...conditions, eq(merchants.active, false)))
    .then((res) => res[0]?.count || 0);

  // Contagem de KYC pendente (estados de análise)
  const pendingKycCount = await db
    .select({ count: count() })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .where(
      and(
        ...conditions,
        or(
          eq(merchants.riskAnalysisStatus, "PENDING"),
          eq(merchants.riskAnalysisStatus, "WAITINGDOCUMENTS"),
          eq(merchants.riskAnalysisStatus, "NOTANALYSED")
        )
      )
    )
    .then((res) => res[0]?.count || 0);

  // Contagem de KYC aprovado
  const approvedKycCount = await db
    .select({ count: count() })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .where(and(...conditions, eq(merchants.riskAnalysisStatus, "APPROVED")))
    .then((res) => res[0]?.count || 0);

  // Contagem de KYC rejeitado/recusado
  const rejectedKycCount = await db
    .select({ count: count() })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .where(
      and(
        ...conditions,
        or(
          eq(merchants.riskAnalysisStatus, "DECLINED"),
          eq(merchants.riskAnalysisStatus, "KYCOFFLINE")
        )
      )
    )
    .then((res) => res[0]?.count || 0);

  // Contagem de antecipação CP
  const cpAnticipationCount = await db
    .select({ count: count() })
    .from(merchants)
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id)) // Adicionado para filtro de salesAgent
    .where(
      and(...conditions, eq(configurations.lockCpAnticipationOrder, false))
    )
    .then((res) => res[0]?.count || 0);

  // Contagem de antecipação CNP
  const cnpAnticipationCount = await db
    .select({ count: count() })
    .from(merchants)
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id)) // Adicionado para filtro de salesAgent
    .where(
      and(...conditions, eq(configurations.lockCnpAnticipationOrder, false))
    )
    .then((res) => res[0]?.count || 0);

  return {
    merchants: result.map((merchant) => ({
      merchantid: merchant.merchantid,
      slug: merchant.slug ?? "N/A",
      active: merchant.active ?? false,
      name: merchant.name ?? "Não informado",
      email: merchant.email ?? "N/A",
      phone_type: merchant.phone_type ?? "N/A",
      revenue:
        typeof merchant.revenue === "string"
          ? parseFloat(merchant.revenue)
          : merchant.revenue ?? 0,
      id_category: merchant.id_category ?? 0,
      kic_status: merchant.kic_status ?? "N/A",
      corporate_name: merchant.corporate_name ?? " ",
      risk_analysis_status: merchant.risk_analysis_status ?? "",
      addressname: merchant.addressname ?? "",
      dtinsert: merchant.dtinsert ? merchant.dtinsert.toString() : "N/A",
      state: merchant.addresses ?? "N/A",
      cnpj: merchant.document ?? "N/A",
      lockCpAnticipationOrder: merchant.lockCpAnticipationOrder ?? false,
      lockCnpAnticipationOrder: merchant.lockCnpAnticipationOrder ?? false,
      slug_category: merchant.slug_category ?? "N/A",
      time_zone: merchant.time_zone ?? "N/A",
      sales_agent: merchant.salesAgents ?? "N/A",
      areaCode: merchant.areaCode || "",
      number: merchant.number || "",
      priceTable: merchant.priceTable || "",
      hasPix: merchant.hasPix ?? false,
      salesAgentDocument: merchant.salesAgentDocument || "",
      city: merchant.city || "",
      legalNature: merchant.legalNature || "",
      MCC: merchant.MCC || "",
      CNAE: merchant.CNAE || "",
      Inclusion: merchant.Inclusion || "",
      dtupdate: merchant.dtupdate || "",
      dtdelete: merchant.dtdelete || "",
    })),
    totalCount,
    active_count: Number(activeCount),
    inactive_count: Number(inactiveCount),
    pending_kyc_count: Number(pendingKycCount),
    approved_kyc_count: Number(approvedKycCount),
    rejected_kyc_count: Number(rejectedKycCount),
    cp_anticipation_count: Number(cpAnticipationCount),
    cnp_anticipation_count: Number(cnpAnticipationCount),
  };
}

export type Merchant = {
  id: bigint;
  slug: string;
  active: boolean;
  dtinsert: Date;
  dtupdate: Date;
  id_merchant: string;
  name: string;
  id_document: string;
  corporate_name: string;
  email: string;
  area_code: string;
  number: string;
  phone_type: string;
  language: string;
  timezone: string;
  slug_customer: string;
  risk_analysis_status: string;
  risk_analysis_status_justification: string;
  legal_person: string;
  opening_date: Date;
  inclusion: string;
  opening_days: string;
  opening_hour: string;
  closing_hour: string;
  municipal_registration: string;
  state_subcription: string;
  has_tef: boolean;
  has_pix: boolean;
  has_top: boolean;
  establishment_format: string;
  revenue: number;
  id_category: number;
  slug_category: string;
  id_legal_nature: number;
  slug_legal_nature: string;
  id_sales_agent: number;
  slug_sales_agent: string;
  id_configuration: number;
  slug_configuration: string;
  id_address: number;
};

export type MerchantSelect = typeof merchants.$inferSelect & {
  category?: typeof categories.$inferSelect;
  address?: typeof addresses.$inferSelect;
  legalNaturesname?: typeof legalNatures.$inferSelect;
  salesAgent?: typeof salesAgents.$inferSelect;
  configuration?: typeof configurations.$inferSelect;
  contacts?: typeof contacts.$inferSelect;
};

export async function getMerchantById(id: number) {
  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // Check if user has access to this merchant
  if (!userAccess.fullAccess && !userAccess.idMerchants.includes(id)) {
    throw new Error("You don't have access to this merchant");
  }

  const result = await db
    .select({
      merchants: { ...getTableColumns(merchants) },
      categories: { ...getTableColumns(categories) },
      addresses: { ...getTableColumns(addresses) },
      configurations: { ...getTableColumns(configurations) },
      salesAgents: { ...getTableColumns(salesAgents) },
      legalNatures: { ...getTableColumns(legalNatures) },
      contacts: { ...getTableColumns(contacts) },
      pixaccounts: { ...getTableColumns(merchantpixaccount) },
    })
    .from(merchants)
    .where(eq(merchants.id, Number(id)))
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(categories, eq(merchants.idCategory, categories.id))
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .leftJoin(legalNatures, eq(merchants.idLegalNature, legalNatures.id))
    .leftJoin(contacts, eq(merchants.id, contacts.idMerchant))
    .leftJoin(
      merchantpixaccount,
      eq(merchants.id, merchantpixaccount.idMerchant)
    )
    .limit(1);

  const merchant = result[0];
  return merchant;
}

// Interface para o MerchantDetail
export interface MerchantDetail {
  id: number;
  slug: string;
  name: string;
  active: boolean;
  dtinsert: string;
  dtupdate: string;
  idMerchant?: string;
  idDocument?: string;
  corporateName?: string;
  email?: string;
  areaCode?: string;
  number?: string;
  phoneType?: string;
  language?: string;
  timezone?: string;
  slugCustomer?: string;
  riskAnalysisStatus?: string;
  riskAnalysisStatusJustification?: string;
  legalPerson?: string;
  openingDate?: Date;
  inclusion?: string;
  openingDays?: string;
  openingHour?: string;
  closingHour?: string;
  municipalRegistration?: string;
  stateSubcription?: string;
  hasTef?: boolean;
  hasPix?: boolean;
  hasTop?: boolean;
  establishmentFormat?: string;
  revenue?: number;
  idCategory?: number;
  slugCategory?: string;
  idConfiguration?: number;
  slugConfiguration?: string;
  idAddress?: number;
  idLegalNature?: number;
  slugLegalNature?: string;
}

// Função para inserir um novo merchant
export async function insertMerchant(
  merchant: MerchantInsert
): Promise<number> {
  const result = await db
    .insert(merchants)
    .values({
      slug: merchant.slug,
      name: merchant.name,
      active: merchant.active,
      dtinsert: new Date().toISOString(),
      dtupdate: new Date().toISOString(),
      idMerchant: merchant.idMerchant,
      idDocument: merchant.idDocument,
      corporateName: merchant.corporateName,
      email: merchant.email,
      areaCode: merchant.areaCode,
      number: merchant.number,
      phoneType: merchant.phoneType,
      language: merchant.language,
      timezone: merchant.timezone,
      slugCustomer: merchant.slugCustomer,
      riskAnalysisStatus: merchant.riskAnalysisStatus,
      riskAnalysisStatusJustification: merchant.riskAnalysisStatusJustification,
      legalPerson: merchant.legalPerson,
      openingDate: merchant.openingDate
        ? new Date(merchant.openingDate).toISOString()
        : null,
      inclusion: merchant.inclusion,
      openingDays: merchant.openingDays,
      openingHour: merchant.openingHour,
      closingHour: merchant.closingHour,
      municipalRegistration: merchant.municipalRegistration,
      stateSubcription: merchant.stateSubcription,
      hasTef: merchant.hasTef,
      hasPix: merchant.hasPix,
      hasTop: merchant.hasTop,
      establishmentFormat: merchant.establishmentFormat,
      revenue: merchant.revenue,
      idCategory: merchant.idCategory,
      slugCategory: merchant.slugCategory,
      idConfiguration: merchant.idConfiguration,
      slugConfiguration: merchant.slugConfiguration,
      idAddress: merchant.idAddress,
      idLegalNature: merchant.idLegalNature,
      slugLegalNature: merchant.slugLegalNature,
    })
    .returning({ id: merchants.id });

  return result[0].id;
}

// Função para atualizar um merchant existente
export async function updateMerchant(merchant: MerchantDetail): Promise<void> {
  await db
    .update(merchants)
    .set({
      slug: merchant.slug,
      name: merchant.name,
      active: merchant.active,
      dtupdate: new Date().toISOString(),
      idMerchant: merchant.idMerchant,
      idDocument: merchant.idDocument,
      corporateName: merchant.corporateName,
      email: merchant.email,
      areaCode: merchant.areaCode,
      number: merchant.number,
      phoneType: merchant.phoneType,
      language: merchant.language,
      timezone: merchant.timezone,
      slugCustomer: merchant.slugCustomer,
      riskAnalysisStatus: merchant.riskAnalysisStatus,
      riskAnalysisStatusJustification: merchant.riskAnalysisStatusJustification,
      legalPerson: merchant.legalPerson,
      openingDate: merchant.openingDate
        ? new Date(merchant.openingDate).toISOString()
        : null,
      inclusion: merchant.inclusion,
      openingDays: merchant.openingDays,
      openingHour: merchant.openingHour,
      closingHour: merchant.closingHour,
      municipalRegistration: merchant.municipalRegistration,
      stateSubcription: merchant.stateSubcription,
      hasTef: merchant.hasTef,
      hasPix: merchant.hasPix,
      hasTop: merchant.hasTop,
      establishmentFormat: merchant.establishmentFormat,
      revenue: merchant.revenue?.toString(),
      idCategory: merchant.idCategory,
      slugCategory: merchant.slugCategory,
      idConfiguration: merchant.idConfiguration,
      slugConfiguration: merchant.slugConfiguration,
      idAddress: merchant.idAddress,
      idLegalNature: merchant.idLegalNature,
      slugLegalNature: merchant.slugLegalNature,
    })
    .where(eq(merchants.id, merchant.id));
}

export async function updateMerchantColumnBySlug(
  slug: string,
  columnName: string,
  value: string | number | boolean | null
): Promise<void> {
  try {
    await db
      .update(merchants)
      .set({
        [columnName]: value,
      })
      .where(eq(merchants.slug, slug));

    console.log(
      `Coluna ${columnName} atualizada com sucesso para o slug ${slug}`
    );
  } catch (error) {
    console.error(
      `Erro ao atualizar coluna ${columnName} para o slug ${slug}:`,
      error
    );
    throw new Error(`Falha ao atualizar merchant: ${error}`);
  }
}

export async function updateMerchantColumnById(
  id: number,
  columnName: string,
  value: string | number | boolean | null
): Promise<void> {
  try {
    await db
      .update(merchants)
      .set({
        [columnName]: value,
        dtupdate: new Date().toISOString(),
      })
      .where(eq(merchants.id, id));

    console.log(`Coluna ${columnName} atualizada com sucesso para o ID ${id}`);
  } catch (error) {
    console.error(
      `Erro ao atualizar coluna ${columnName} para o ID ${id}:`,
      error
    );
    throw new Error(`Falha ao atualizar merchant: ${error}`);
  }
}

// Atualizar o nome
//await updateMerchantColumnById(123, "name", "Novo Nome"); //

export async function updateMerchantColumnsById(
  id: number,
  updates: Record<string, string | number | boolean | null>
): Promise<void> {
  try {
    console.log(
      `Atualizando merchant ID ${id} com os seguintes dados:`,
      updates
    );

    // Verificar se o campo timezone está presente nos updates
    if ("timezone" in updates) {
      console.log(`Valor da timezone a ser atualizado: ${updates.timezone}`);
    }

    await db
      .update(merchants)
      .set({
        ...updates,
        dtupdate: new Date().toISOString(),
      })
      .where(eq(merchants.id, id));

    console.log(`Colunas atualizadas com sucesso para o ID ${id}`);

    // Verificar se a atualização foi bem-sucedida
    const updatedMerchant = await db
      .select()
      .from(merchants)
      .where(eq(merchants.id, id))
      .limit(1);

    console.log(`Merchant atualizado:`, updatedMerchant[0]);
  } catch (error) {
    console.error(`Erro ao atualizar colunas para o ID ${id}:`, error);
    throw new Error(`Falha ao atualizar merchant: ${error}`);
  }
}

export type AddressInsert = typeof addresses.$inferInsert;
export type AddressDetail = typeof addresses.$inferSelect;

export async function insertAddress(address: AddressInsert): Promise<number> {
  // Verifica se o endereço já existe
  const existingAddress = await db
    .select({ id: addresses.id })
    .from(addresses)
    .where(
      and(
        eq(addresses.streetAddress, address.streetAddress ?? ""),
        eq(addresses.streetNumber, address.streetNumber ?? ""),
        eq(addresses.neighborhood, address.neighborhood ?? ""),
        eq(addresses.city, address.city ?? ""),
        eq(addresses.state, address.state ?? ""),
        eq(addresses.zipCode, address.zipCode ?? "")
      )
    )
    .limit(1);

  // Se encontrar um endereço existente, retorna o ID dele
  if (existingAddress.length > 0) {
    return existingAddress[0].id;
  }

  // Se não encontrar, insere novo endereço
  const result = await db
    .insert(addresses)
    .values(address)
    .returning({ id: addresses.id });

  return result[0].id;
}

export async function updateAddress(address: AddressDetail): Promise<void> {
  await db.update(addresses).set(address).where(eq(addresses.id, address.id));
}

export async function getDDLegalNatures(): Promise<LegalNatureDetail[]> {
  const result = await db
    .select({
      id: legalNatures.id,
      name: legalNatures.name,
      code: legalNatures.code,
    })
    .from(legalNatures)
    .orderBy(legalNatures.name);
  return result.map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code,
    slug: null,
    active: null,
    dtinsert: null,
    dtupdate: null,
  }));
}
export type LegalNatureDropdown = {
  value: number;
  label: string;
};

export type EstablishmentFormatDropdown = {
  value: string;
  label: string;
};

export async function getEstablishmentFormatForDropdown(): Promise<
  EstablishmentFormatDropdown[]
> {
  const result = await db
    .select({
      value: establishmentFormat.code,
      label: establishmentFormat.name,
    })
    .from(establishmentFormat)
    .orderBy(establishmentFormat.code);

  return result.map((item) => ({
    value: item.value,
    label: item.label ?? "",
  }));
}

export async function getLegalNaturesForDropdown(): Promise<
  LegalNatureDropdown[]
> {
  const result = await db
    .select({
      value: legalNatures.id,
      label: legalNatures.name,
    })
    .from(legalNatures)
    .orderBy(legalNatures.id);

  return result.map((item) => ({
    value: item.value,
    label: item.label ?? "", // Fornece um valor padrão caso seja null
  }));
}

export type CnaeMccDropdown = {
  value: string;
  label: string;
  cnae: string;
  mcc: string;
};

export async function getCnaeMccForDropdown(): Promise<CnaeMccDropdown[]> {
  try {
    const result = await db
      .select({
        value: categories.id,
        label: categories.name,
        cnae: categories.cnae,
        mcc: categories.mcc,
      })
      .from(categories)
      .orderBy(categories.cnae);

    // Adicione este log para debug

    if (!result) return [];

    return result.map((item) => ({
      value: item.value.toString(),
      label: `${item.cnae} - ${item.label}`,
      cnae: item.cnae || "",
      mcc: item.mcc || "",
    }));
  } catch (error) {
    console.error("Error fetching CNAE/MCC:", error);
    return [];
  }
}

export type MerchantList = {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  pendingKycCount: number;
  approvedKycCount: number;
  rejectedKycCount: number;
  cpAnticipationCount: number;
  cnpAnticipationCount: number;
  // ... any other existing properties ...
};

// Função genérica para buscar slug por ID
export async function getSlugById(
  table: typeof legalNatures | typeof categories | typeof configurations,
  id: number
): Promise<string | null> {
  try {
    const result = await db
      .select({ slug: table.slug })
      .from(table)
      .where(eq(table.id, id))
      .limit(1);

    return result[0]?.slug || null;
  } catch (error) {
    console.error(`Erro ao buscar slug para id ${id}:`, error);
    return null;
  }
}

// Tipo para retornar os dados combinados de merchants e dashboard
export type MerchantsWithDashboardData = {
  merchants: Merchantlist;
  dashboardData: {
    registrationData: MerchantRegistrationChart[];
    registrationSummary: MerchantRegistrationSummary;
    transactionData: MerchantTransactionChart[];
    typeData: MerchantTypeChart[];
  };
};

export async function getMerchantsWithDashboardData(
  search: string,
  page: number,
  pageSize: number,
  establishment?: string,
  status?: string,
  state?: string,
  dateFrom?: string,
  email?: string,
  cnpj?: string,
  active?: string,
  salesAgent?: string
): Promise<MerchantsWithDashboardData> {
  // Definir condições para os filtros - este código é comum a todas as consultas
  const conditions = [];

  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // If user doesn't have full access, add merchant ID filter
  if (!userAccess.fullAccess && userAccess.idMerchants.length > 0) {
    conditions.push(inArray(merchants.id, userAccess.idMerchants));
  } else if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    // Se o usuário não tem acesso, retornar dados vazios
    return {
      merchants: {
        merchants: [],
        totalCount: 0,
        active_count: 0,
        inactive_count: 0,
        pending_kyc_count: 0,
        approved_kyc_count: 0,
        rejected_kyc_count: 0,
        cp_anticipation_count: 0,
        cnp_anticipation_count: 0,
      },
      dashboardData: {
        registrationData: [],
        registrationSummary: {
          currentMonth: 0,
          previousMonth: 0,
          currentWeek: 0,
          today: 0,
        },
        transactionData: [
          { name: "Transacionam", value: 0 },
          { name: "Não Transacionam", value: 0 },
        ],
        typeData: [
          { name: "Compulsória", value: 0 },
          { name: "Eventual", value: 0 },
        ],
      },
    };
  }

  if (search) {
    conditions.push(
      or(
        ilike(merchants.name, `%${search}%`),
        ilike(merchants.corporateName, `%${search}%`)
      )
    );
  }
  console.log(
    search,
    establishment,
    status,
    state,
    dateFrom,
    email,
    cnpj,
    active,
    salesAgent
  );

  if (establishment) {
    conditions.push(ilike(merchants.name, `%${establishment}%`));
  }

  if (status) {
    if (status === "all") {
      // Não aplica nenhum filtro de status
    } else if (status === "PENDING") {
      // Status de análise (pendentes)
      conditions.push(
        inArray(merchants.riskAnalysisStatus, [
          "PENDING",
          "WAITINGDOCUMENTS",
          "NOTANALYSED",
        ])
      );
    } else if (status === "APPROVED") {
      // Aprovados
      conditions.push(eq(merchants.riskAnalysisStatus, "APPROVED"));
    } else if (status === "DECLINED") {
      // Recusados/rejeitados
      conditions.push(
        inArray(merchants.riskAnalysisStatus, ["DECLINED", "KYCOFFLINE"])
      );
    } else {
      // Caso seja outro status específico, usa o valor diretamente
      conditions.push(eq(merchants.riskAnalysisStatus, status));
    }
  }

  if (state) {
    conditions.push(eq(addresses.state, state));
  }

  if (dateFrom) {
    // Quando um dateFrom é fornecido, vamos interpretar como "cadastrado em"
    // e criar um filtro para pegar registros daquele dia específico
    const date = new Date(dateFrom);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Início e fim do dia específico
    const startOfDay = new Date(year, month, day, 0, 0, 0).toISOString();
    const endOfDay = new Date(year, month, day, 23, 59, 59, 999).toISOString();

    conditions.push(
      and(
        gte(merchants.dtinsert, startOfDay),
        lte(merchants.dtinsert, endOfDay)
      )
    );
  }

  // Novos filtros
  if (email) {
    conditions.push(ilike(merchants.email, `%${email}%`));
  }

  if (cnpj) {
    conditions.push(ilike(merchants.idDocument, `%${cnpj}%`));
  }

  if (active === "true") {
    conditions.push(eq(merchants.active, true));
  } else if (active === "false") {
    conditions.push(eq(merchants.active, false));
  }

  if (salesAgent) {
    conditions.push(ilike(salesAgents.firstName, `%${salesAgent}%`));
  }

  // 1. Obter a lista de merchants com paginação e todas as contagens em uma única consulta
  // Isso evita fazer várias consultas separadas para cada contagem
  const now = new Date();
  const offset = (page - 1) * pageSize;

  // Definir datas para filtros de período
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayStr = today.toISOString();

  // Primeiro dia da semana atual
  const currentDay = now.getDay();
  const firstDayOfWeek = new Date(now);
  firstDayOfWeek.setDate(now.getDate() - currentDay);
  const firstDayOfWeekStr = firstDayOfWeek.toISOString();

  // Primeiro dia do mês atual
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayCurrentMonthStr = firstDayCurrentMonth.toISOString();

  // Primeiro dia do mês anterior
  const firstDayPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const firstDayPreviousMonthStr = firstDayPreviousMonth.toISOString();

  // Último dia do mês anterior
  const lastDayPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999
  );
  const lastDayPreviousMonthStr = lastDayPreviousMonth.toISOString();

  // Consulta principal para obter merchants com paginação
  const merchantResult = await db
    .select({
      merchantid: merchants.id,
      corporate_name: merchants.corporateName,
      name: merchants.name,
      risk_analysis_status: merchants.riskAnalysisStatus,
      addressname: addresses.streetAddress,
      dtinsert: merchants.dtinsert,
      email: merchants.email,
      phone_type: merchants.phoneType,
      revenue: merchants.revenue,
      id_category: merchants.idCategory,
      kic_status: merchants.riskAnalysisStatus,
      active: merchants.active,
      slug: merchants.slug,
      salesAgents: salesAgents.firstName,
      addresses: addresses.state,
      document: merchants.idDocument,
      lockCpAnticipationOrder: configurations.lockCpAnticipationOrder,
      lockCnpAnticipationOrder: configurations.lockCnpAnticipationOrder,
      cnpj: merchants.idDocument,
      slug_category: merchants.slugCategory,
      time_zone: merchants.timezone,
      areaCode: merchants.areaCode,
      number: merchants.number,
      priceTable: merchantPrice.name,
      hasPix: merchants.hasPix,
      salesAgentDocument: salesAgents.documentId,
      city: addresses.city,
      legalNature: legalNatures.name,
      MCC: categories.mcc,
      CNAE: categories.cnae,
      Inclusion: merchants.inclusion,
      dtupdate: merchants.dtupdate,
      dtdelete: merchants.dtdelete,
    })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .leftJoin(merchantPrice, eq(merchants.idMerchantPrice, merchantPrice.id))
    .leftJoin(legalNatures, eq(merchants.idLegalNature, legalNatures.id))
    .leftJoin(categories, eq(merchants.idCategory, categories.id))
    .where(and(...conditions))
    .orderBy(desc(merchants.dtinsert))
    .offset(offset)
    .limit(pageSize);

  // Consulta para obter todos os indicadores em uma única operação
  const statsQuery = await db.execute(
    sql`
    WITH all_merchants AS (
      SELECT 
        merchants.id,
        merchants.active,
        merchants.dtinsert,
        merchants.has_pix,
        merchants.has_tef,
        merchants.risk_analysis_status,
        c.lock_cp_anticipation_order,
        c.lock_cnp_anticipation_order,
        a.state
      FROM merchants 
      LEFT JOIN addresses a ON merchants.id_address = a.id
      LEFT JOIN configurations c ON merchants.id_configuration = c.id
      LEFT JOIN sales_agents sa ON merchants.id_sales_agent = sa.id
      WHERE ${and(...conditions) || sql`1=1`}
    ),
    date_counts AS (
      SELECT 
        DATE(am.dtinsert),
        COUNT(*) AS count
      FROM all_merchants am
      WHERE am.dtinsert >= ${firstDayPreviousMonthStr}
      GROUP BY DATE(am.dtinsert)
      ORDER BY DATE(am.dtinsert)
    ),
    period_counts AS (
      SELECT
        COUNT(*) FILTER (WHERE am.dtinsert >= ${firstDayCurrentMonthStr} AND am.dtinsert <= ${now.toISOString()}) AS current_month,
        COUNT(*) FILTER (WHERE am.dtinsert >= ${firstDayPreviousMonthStr} AND am.dtinsert <= ${lastDayPreviousMonthStr}) AS previous_month,
        COUNT(*) FILTER (WHERE am.dtinsert >= ${firstDayOfWeekStr} AND am.dtinsert <= ${now.toISOString()}) AS current_week,
        COUNT(*) FILTER (WHERE am.dtinsert >= ${todayStr} AND am.dtinsert <= ${now.toISOString()}) AS today
      FROM all_merchants am
    ),
    transactions AS (
      SELECT
        COUNT(*) FILTER (WHERE am.has_pix = true) AS transacionam,
        COUNT(*) FILTER (WHERE am.has_pix = false) AS nao_transacionam
      FROM all_merchants am
    ),
    merchant_types AS (
      SELECT
        COUNT(*) FILTER (WHERE am.has_tef = true) AS compulsoria,
        COUNT(*) FILTER (WHERE am.has_tef = false) AS eventual
      FROM all_merchants am
    ),
    status_counts AS (
      SELECT
        COUNT(*) AS total_count,
        COUNT(*) FILTER (WHERE am.active = true) AS active_count,
        COUNT(*) FILTER (WHERE am.active = false) AS inactive_count,
        COUNT(*) FILTER (
          WHERE am.risk_analysis_status IN ('PENDING', 'WAITINGDOCUMENTS', 'NOTANALYSED')
        ) AS pending_kyc_count,
        COUNT(*) FILTER (WHERE am.risk_analysis_status = 'APPROVED') AS approved_kyc_count,
        COUNT(*) FILTER (
          WHERE am.risk_analysis_status IN ('DECLINED', 'KYCOFFLINE')
        ) AS rejected_kyc_count,
        COUNT(*) FILTER (WHERE am.lock_cp_anticipation_order = false) AS cp_anticipation_count,
        COUNT(*) FILTER (WHERE am.lock_cnp_anticipation_order = false) AS cnp_anticipation_count
      FROM all_merchants am
    )
    SELECT
      json_build_object(
        'dates', (SELECT json_agg(row_to_json(d)) FROM date_counts d),
        'periods', (SELECT row_to_json(p) FROM period_counts p),
        'transactions', (SELECT row_to_json(t) FROM transactions t),
        'types', (SELECT row_to_json(mt) FROM merchant_types mt),
        'status', (SELECT row_to_json(s) FROM status_counts s)
      ) AS stats
    `
  );

  // Extrair estatísticas
  const stats = statsQuery.rows[0].stats as {
    dates?: Array<{ date: string; count: string }>;
    periods: {
      current_month: number;
      previous_month: number;
      current_week: number;
      today: number;
    };
    transactions: {
      transacionam: number;
      nao_transacionam: number;
    };
    types: {
      compulsoria: number;
      eventual: number;
    };
    status: {
      total_count: number;
      active_count: number;
      inactive_count: number;
      pending_kyc_count: number;
      approved_kyc_count: number;
      rejected_kyc_count: number;
      cp_anticipation_count: number;
      cnp_anticipation_count: number;
    };
  };

  // Processar dados de merchants
  const merchantsList = merchantResult.map((merchant) => ({
    merchantid: merchant.merchantid,
    slug: merchant.slug ?? "N/A",
    active: merchant.active ?? false,
    name: merchant.name ?? "Não informado",
    email: merchant.email ?? "N/A",
    phone_type: merchant.phone_type ?? "N/A",
    revenue:
      typeof merchant.revenue === "string"
        ? parseFloat(merchant.revenue)
        : merchant.revenue ?? 0,
    id_category: merchant.id_category ?? 0,
    kic_status: merchant.kic_status ?? "N/A",
    corporate_name: merchant.corporate_name ?? " ",
    risk_analysis_status: merchant.risk_analysis_status ?? "",
    addressname: merchant.addressname ?? "",
    dtinsert: merchant.dtinsert ? merchant.dtinsert.toString() : "N/A",
    state: merchant.addresses ?? "N/A",
    cnpj: merchant.document ?? "N/A",
    lockCpAnticipationOrder: merchant.lockCpAnticipationOrder ?? false,
    lockCnpAnticipationOrder: merchant.lockCnpAnticipationOrder ?? false,
    slug_category: merchant.slug_category ?? "N/A",
    time_zone: merchant.time_zone ?? "N/A",
    sales_agent: merchant.salesAgents ?? "N/A",
    areaCode: merchant.areaCode || "",
    number: merchant.number || "",
    priceTable: merchant.priceTable || "",
    hasPix: merchant.hasPix ?? false,
    salesAgentDocument: merchant.salesAgentDocument || "",
    city: merchant.city || "",
    legalNature: merchant.legalNature || "",
    MCC: merchant.MCC || "",
    CNAE: merchant.CNAE || "",
    Inclusion: merchant.Inclusion || "",
    dtupdate: merchant.dtupdate || "",
    dtdelete: merchant.dtdelete || "",
  }));

  // Criar objeto de retorno
  return {
    merchants: {
      merchants: merchantsList,
      totalCount: stats.status.total_count,
      active_count: stats.status.active_count,
      inactive_count: stats.status.inactive_count,
      pending_kyc_count: stats.status.pending_kyc_count,
      approved_kyc_count: stats.status.approved_kyc_count,
      rejected_kyc_count: stats.status.rejected_kyc_count,
      cp_anticipation_count: stats.status.cp_anticipation_count,
      cnp_anticipation_count: stats.status.cnp_anticipation_count,
    },
    dashboardData: {
      registrationData:
        stats.dates?.map((item: any) => ({
          date: item.date,
          count: Number(item.count),
        })) ?? [],
      registrationSummary: {
        currentMonth: stats.periods.current_month,
        previousMonth: stats.periods.previous_month,
        currentWeek: stats.periods.current_week,
        today: stats.periods.today,
      },
      transactionData: [
        { name: "Transacionam", value: stats.transactions.transacionam },
        {
          name: "Não Transacionam",
          value: stats.transactions.nao_transacionam,
        },
      ],
      typeData: [
        { name: "Compulsória", value: stats.types.compulsoria },
        { name: "Eventual", value: stats.types.eventual },
      ],
    },
  };
}
