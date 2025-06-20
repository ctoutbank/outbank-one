"use server";

import { CategoryDetail } from "@/features/categories/server/category";
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
  isNotNull,
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
  merchantBankAccounts,
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

// Extender o tipo MerchantInsert para incluir os novos campos
type MerchantInsertBase = typeof merchants.$inferInsert;
export interface MerchantInsert extends MerchantInsertBase {
  isMainOffice?: boolean; // Indica se é matriz (true) ou filial (false)
  idMatriz?: number; // ID da matriz, caso seja uma filial
}

export type Merchantlist = {
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
};

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
          : (merchant.revenue ?? 0),
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
  isMainOffice?: boolean; // Indica se é matriz (true) ou filial (false)
  idMatriz?: number; // ID da matriz, caso seja uma filial
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

/**
 * Cria ou atualiza um merchant na API de onboarding da Dock
 * @param merchantData - Dados do merchant para serem enviados à API
 * @param addressData - Dados do endereço do merchant (opcional)
 * @param contactsData - Dados de contatos do merchant (opcional)
 * @param categoryData - Dados da categoria do merchant (opcional)
 * @param legalNatureData - Dados da natureza jurídica do merchant (opcional)
 * @param bankAccountData - Dados da conta bancária do merchant (opcional)
 * @param configurationData - Dados de configuração do merchant (opcional)
 * @returns Resposta da API com os dados do merchant criado/atualizado
 */
export async function createUpdateAPImerchantOnboarding(
  merchantData: MerchantDetail | any,
  addressData?: AddressDetail | any,
  contactsData?: any[],
  categoryData?: CategoryDetail | any,
  legalNatureData?: LegalNatureDetail | any,
  merchantBankData?: any,
  filialDetail?: MerchantDetail | any,
  configurationData?: any
): Promise<any> {
  try {
    console.log("Preparando dados para envio à API de onboarding");

    // Formatar o payload conforme esperado pela API
    const payload = {
      name: merchantData.name || "",
      // Garantir que documentId está no formato correto (apenas números, sem pontuação)
      documentId: (merchantData.idDocument || "").replace(/[^\d]/g, ""),
      corporateName: merchantData.corporateName || "",
      email: merchantData.email || "",
      areaCode: merchantData.areaCode || "",
      number: merchantData.number || "",
      // Garantir que phoneType seja sempre um valor válido (C ou P)
      phoneType: validatePhoneType(merchantData.phoneType),
      timezone: merchantData.timezone || "-0300",
      contacts: contactsData?.length
        ? contactsData.map((contact) => ({
            contactName: contact.name || "",
            contactEmail: contact.email || "",
            contactDDD: contact.areaCode || "",
            contactNumber: contact.number || "",
            contactType: contact.type || "ADMINISTRATIVE",
          }))
        : [
            {
              contactName: "admin",
              contactEmail: "admin@example.com",
              contactDDD: "11",
              contactNumber: "999999999",
              contactType: "ADMINISTRATIVE",
            },
          ],
      address: addressData
        ? {
            streetAddress: addressData.streetAddress || "",
            streetNumber: addressData.streetNumber || "",
            complement: addressData.complement || "",
            neighborhood: addressData.neighborhood || "",
            city: addressData.city || "",
            state: addressData.state || "",
            zipCode: addressData.zipCode?.replace(/[^\d]/g, "") || "",
            country: addressData.country || "BR",
          }
        : {
            streetAddress: "Rua Exemplo",
            streetNumber: "123",
            complement: "Sala 1",
            neighborhood: "Centro",
            city: "São Paulo",
            state: "SP",
            zipCode: "01001000",
            country: "BR",
          },
      isMainOffice: merchantData.isMainOffice ?? true,
      mainOffice: filialDetail?.slug
        ? {
            slug: filialDetail.slug,
          }
        : undefined,
      // Garantir que legalPerson seja um valor válido
      legalPerson: "JURIDICAL", // Valor fixo conforme exemplo curl
      openingDate: merchantData.openingDate
        ? merchantData.openingDate.toISOString().split("T")[0]
        : "2023-01-01",
      openingDays: merchantData.openingDays || "0111110",
      openingHour: merchantData.openingHour || "09:00:00",
      closingHour: merchantData.closingHour || "18:00:00",
      municipalRegistration: merchantData.municipalRegistration || null,
      stateSubcription: merchantData.stateSubcription || null,
      // Garantir valores booleanos
      hasTef: true, // Valor fixo conforme exemplo curl
      hasPix: true, // Valor fixo conforme exemplo curl
      hasTop: true, // Valor fixo conforme exemplo curl
      // Garantir um valor válido para establishmentFormat
      establishmentFormat: "EI", // Valor fixo conforme exemplo curl
      revenue: merchantData.revenue || 7.4,
      category: categoryData
        ? {
            mcc: categoryData.mcc || "5999",
            cnae: categoryData.cnae || "4789-0/04",
          }
        : {
            mcc: "5999",
            cnae: "4789-0/04",
          },
      legalNature: legalNatureData
        ? {
            code: legalNatureData.code || "206-2",
          }
        : {
            code: "206-2",
          },
      merchantBankAccount: merchantBankData
        ? {
            bankId: merchantBankData.bankId || "341",
            agencyNumber: merchantBankData.agencyNumber || "0001",
            accountNumber: merchantBankData.accountNumber || "123456",
            accountType: merchantBankData.accountType || "CHECKING", // Usando valor aceito pela API
            legalPerson: "JURIDICAL", // Valor fixo conforme exemplo curl
          }
        : {
            bankId: "341",
            agencyNumber: "0001",
            accountNumber: "123456",
            accountType: "CHECKING", // Usando valor aceito pela API
            legalPerson: "JURIDICAL", // Valor fixo conforme exemplo curl
          },
      configuration: configurationData || undefined,
    };

    console.log("Enviando dados para API:", JSON.stringify(payload, null, 2));

    // Determinar o método HTTP e URL com base na presença de slug
    const method = merchantData.slug ? "PUT" : "POST";
    let url = `https://merchant.acquiring.hml.dock.tech/v1/onboarding`;

    // Se tiver slug, verificar se é válido antes de usar na URL
    if (merchantData.slug) {
      // Verificar se o slug é válido (comprimento ≤ 32)
      if (merchantData.slug.length > 32) {
        console.warn(
          `Slug inválido para merchant: ${merchantData.slug} (comprimento > 32)`
        );
        throw new Error(
          `Slug inválido para merchant: ${merchantData.slug} (comprimento > 32)`
        );
      }

      url = `https://merchant.acquiring.hml.dock.tech/v1/onboarding/${merchantData.slug}`;
    }

    console.log(`Usando método ${method} para ${url}`);

    try {
      // Enviar para a API
      const response = await fetch(url, {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiIxMkMxQzk1QjlGM0I0MzgyOUI2MEVEQ0UxQzQ1NzAwRSIsInNpcCI6IjRFN0I5NUY3RTBGOTQ5N0FBOTEzM0NGRjM5RDlGQUE3In0.ebqadX2yKxJPBji0HJTdn8F2vae57K1KvHUJb-v1AUD7w3D_HUWjoJbSq5M8t_bm4u69E8krQ47abarQqubRIg`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na API (${response.status}):`, errorText);

        // Tentar analisar o erro JSON para fornecer mais detalhes
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.errors && errorJson.errors.length > 0) {
            // Log com mais detalhes sobre o erro
            console.error(
              "Detalhes do erro:",
              JSON.stringify(errorJson.errors, null, 2)
            );

            // Mensagem de erro mais descritiva
            const errorDetails = errorJson.errors
              .map(
                (err: any) =>
                  `Campo: ${err.data || "desconhecido"}, Erro: ${
                    err.msg || "erro desconhecido"
                  }, Código: ${err.code || "sem código"}`
              )
              .join("; ");

            throw new Error(
              `Falha na API de onboarding: ${
                response.statusText || response.status
              }. Detalhes: ${errorDetails}`
            );
          }
        } catch {
          // Se não conseguir fazer parse do JSON, apenas use o texto original
        }

        throw new Error(
          `Falha na API de onboarding: ${
            response.statusText || response.status
          }. Detalhes: ${errorText}`
        );
      }

      const responseData = await response.json();
      console.log("Resposta da API de onboarding:", responseData);
      return responseData;
    } catch (error) {
      console.error("Erro ao criar/atualizar merchant na API:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erro ao criar/atualizar merchant na API:", error);
    throw error;
  }
}

/**
 * Cria um novo merchant na base de dados local sem enviar para a API
 * @param merchantData - Dados do merchant a ser criado
 * @param addressData - Dados do endereço do merchant (opcional)
 * @returns ID do merchant criado na base de dados local
 */
export async function createMerchantWithAPI(
  merchantData: MerchantInsert,
  addressData?: AddressInsert
): Promise<number> {
  try {
    console.log("Iniciando criação de merchant apenas no banco local");

    // 1. Se tiver dados de endereço, inserir primeiro para obter o ID
    let addressId: number | undefined = undefined;
    if (addressData) {
      addressId = await insertAddress(addressData);
      merchantData.idAddress = addressId;
    }

    // 2. Inserir o merchant na base local
    const merchantId = await insertMerchant(merchantData);

    console.log(`Merchant ID ${merchantId} criado no banco local com sucesso`);
    console.log(
      "Para enviar à API, complete o cadastro com os dados bancários"
    );

    return merchantId;
  } catch (error) {
    console.error("Erro ao criar merchant no banco local:", error);
    throw error;
  }
}

/**
 * Atualiza um merchant existente na base de dados local e na API da Dock
 * @param merchantData - Dados do merchant a serem atualizados
 * @param addressData - Dados do endereço a serem atualizados (opcional)
 * @returns void
 */
export async function updateMerchantWithAPI(
  merchantData: MerchantDetail,
  addressData?: AddressDetail
): Promise<void> {
  try {
    console.log(
      `Iniciando atualização de merchant ID ${merchantData.id} com integração API`
    );

    // 1. Verificar se o merchant existe
    const existingMerchant = await db
      .select()
      .from(merchants)
      .where(eq(merchants.id, merchantData.id))
      .limit(1);

    if (existingMerchant.length === 0) {
      throw new Error(`Merchant ID ${merchantData.id} não encontrado`);
    }

    // 2. Atualizar endereço se fornecido
    if (addressData && addressData.id) {
      await updateAddress(addressData);
    } else if (merchantData.idAddress && !addressData) {
      // Buscar endereço associado caso não tenha sido fornecido
      addressData = await db
        .select()
        .from(addresses)
        .where(eq(addresses.id, merchantData.idAddress))
        .limit(1)
        .then((res) => res[0] || undefined);
    }

    // 3. Buscar dados relacionados necessários para a API
    const categoryData = merchantData.idCategory
      ? await db
          .select()
          .from(categories)
          .where(eq(categories.id, merchantData.idCategory))
          .limit(1)
          .then((res) => res[0] || undefined)
      : undefined;

    const legalNatureData = merchantData.idLegalNature
      ? await db
          .select()
          .from(legalNatures)
          .where(eq(legalNatures.id, merchantData.idLegalNature))
          .limit(1)
          .then((res) => res[0] || undefined)
      : undefined;

    // 4. Buscar dados de contatos
    const contactsData = await db
      .select()
      .from(contacts)
      .where(eq(contacts.idMerchant, merchantData.id));

    // 5. Tentar atualizar na API
    let apiUpdated = false;
    try {
      // Só enviar para API se tiver slug (indicando que já existe na API)
      if (merchantData.slug) {
        const apiResponse = await createUpdateAPImerchantOnboarding(
          merchantData,
          addressData,
          contactsData,
          categoryData,
          legalNatureData
        );

        if (apiResponse) {
          apiUpdated = true;

          // Atualizar dados que podem ter mudado na API
          if (apiResponse.riskAnalysisStatus) {
            merchantData.riskAnalysisStatus = apiResponse.riskAnalysisStatus;
          }
        }
      } else {
        console.log(
          "Merchant não possui slug, criando na API pela primeira vez"
        );

        // Criar na API como novo
        const apiResponse = await createUpdateAPImerchantOnboarding(
          merchantData,
          addressData,
          contactsData,
          categoryData,
          legalNatureData
        );

        if (apiResponse && apiResponse.slug) {
          apiUpdated = true;
          merchantData.slug = apiResponse.slug;
          merchantData.slugCustomer = apiResponse.slug;
          if (apiResponse.riskAnalysisStatus) {
            merchantData.riskAnalysisStatus = apiResponse.riskAnalysisStatus;
          }
        }
      }
    } catch (apiError) {
      console.error("Erro ao atualizar merchant na API:", apiError);
      // Continuamos com a atualização local mesmo se a API falhar
    }

    // 6. Atualizar merchant na base local
    // Garantir que campos de data estejam no formato correto
    const updateData = {
      ...merchantData,
      dtupdate: new Date().toISOString(),
      openingDate: merchantData.openingDate
        ? new Date(merchantData.openingDate).toISOString()
        : null,
      // Converter revenue para string conforme esperado pelo schema
      revenue:
        merchantData.revenue !== undefined
          ? merchantData.revenue.toString()
          : null,
    };

    await db
      .update(merchants)
      .set(updateData)
      .where(eq(merchants.id, merchantData.id));

    if (apiUpdated) {
      console.log(
        `Merchant ID ${merchantData.id} atualizado com sucesso na API e na base local`
      );
    } else {
      console.log(
        `Merchant ID ${merchantData.id} atualizado somente na base local`
      );
    }
  } catch (error) {
    console.error("Erro ao atualizar merchant com integração API:", error);
    throw error;
  }
}

/**
 * Verifica o status de um merchant específico na API da Dock
 * @param merchantSlug - O slug do merchant na API para verificar
 * @returns Objeto com os dados do status do merchant ou null se não encontrado
 */
export async function verificarStatusMerchantPorSlug(
  merchantSlug: string
): Promise<any> {
  try {
    if (!merchantSlug) {
      throw new Error("Slug do merchant não fornecido");
    }

    // Verificar se o slug é válido (comprimento ≤ 32)
    if (merchantSlug.length > 32) {
      console.warn(
        `Slug inválido para verificação de status: ${merchantSlug} (comprimento > 32)`
      );
      return null;
    }

    console.log(`Verificando status do merchant com slug: ${merchantSlug}`);

    // Consultar a API da Dock para verificar o status
    const response = await fetch(
      `https://merchant.acquiring.hml.dock.tech/v1/onboarding/${merchantSlug}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiIxMkMxQzk1QjlGM0I0MzgyOUI2MEVEQ0UxQzQ1NzAwRSIsInNpcCI6IjRFN0I5NUY3RTBGOTQ5N0FBOTEzM0NGRjM5RDlGQUE3In0.ebqadX2yKxJPBji0HJTdn8F2vae57K1KvHUJb-v1AUD7w3D_HUWjoJbSq5M8t_bm4u69E8krQ47abarQqubRIg`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Merchant com slug ${merchantSlug} não encontrado na API`);
        return null;
      }

      const errorText = await response.text();
      console.error(`Erro na API (${response.status}):`, errorText);
      throw new Error(
        `Falha na API: ${response.statusText}. Detalhes: ${errorText}`
      );
    }

    const merchantData = await response.json();
    console.log(
      `Status do merchant ${merchantSlug}:`,
      merchantData.riskAnalysisStatus
    );

    // Atualizar o status no banco de dados local se necessário
    const localMerchant = await db
      .select()
      .from(merchants)
      .where(eq(merchants.slug, merchantSlug))
      .limit(1);

    if (
      localMerchant.length > 0 &&
      localMerchant[0].riskAnalysisStatus !== merchantData.riskAnalysisStatus
    ) {
      console.log(
        `Atualizando status do merchant no banco local: ${merchantData.riskAnalysisStatus}`
      );

      await db
        .update(merchants)
        .set({
          riskAnalysisStatus: merchantData.riskAnalysisStatus,
          riskAnalysisStatusJustification:
            merchantData.riskAnalysisStatusJustification || null,
          dtupdate: new Date().toISOString(),
        })
        .where(eq(merchants.slug, merchantSlug));
    }

    return merchantData;
  } catch (error) {
    console.error(
      `Erro ao verificar status do merchant ${merchantSlug}:`,
      error
    );
    return null;
  }
}

/**
 * Verifica o status de múltiplos merchants na API da Dock
 * @param limit - Limite de merchants a serem verificados (opcional, padrão: 50)
 * @returns Número de merchants atualizados
 */
export async function verificarStatusMultiplosMerchants(
  limit: number = 50
): Promise<number> {
  try {
    console.log(`Verificando status de até ${limit} merchants`);

    // Buscar merchants com status pendente de análise
    const merchantsParaVerificar = await db
      .select({
        id: merchants.id,
        slug: merchants.slug,
        riskAnalysisStatus: merchants.riskAnalysisStatus,
      })
      .from(merchants)
      .where(
        and(
          eq(merchants.active, true),
          isNotNull(merchants.slug),
          or(
            eq(merchants.riskAnalysisStatus, "PENDING"),
            eq(merchants.riskAnalysisStatus, "WAITINGDOCUMENTS"),
            eq(merchants.riskAnalysisStatus, "NOTANALYSED")
          )
        )
      )
      .limit(limit);

    console.log(
      `Encontrados ${merchantsParaVerificar.length} merchants para verificar status`
    );

    if (merchantsParaVerificar.length === 0) {
      return 0;
    }

    let merchantsAtualizados = 0;

    // Verificar cada merchant
    for (const merchant of merchantsParaVerificar) {
      if (!merchant.slug) continue;

      try {
        const statusAPI = await verificarStatusMerchantPorSlug(merchant.slug);

        if (
          statusAPI &&
          statusAPI.riskAnalysisStatus !== merchant.riskAnalysisStatus
        ) {
          merchantsAtualizados++;
        }
      } catch (erro) {
        console.error(`Erro ao verificar merchant ${merchant.slug}:`, erro);
        // Continuar para o próximo merchant
      }

      // Pequeno intervalo entre requisições para não sobrecarregar a API
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`Atualizados ${merchantsAtualizados} merchants no total`);
    return merchantsAtualizados;
  } catch (error) {
    console.error("Erro ao verificar status de múltiplos merchants:", error);
    throw error;
  }
}

// Definição dos tipos para endereço
export type AddressInsert = typeof addresses.$inferInsert;
export type AddressDetail = typeof addresses.$inferSelect;

/**
 * Cria uma filial de merchant na API da Dock
 * Esta função cria um merchant que não é matriz (isMainOffice = false)
 * e requer a referência para a matriz (mainOffice)
 *
 * @param filialData - Dados da filial a ser criada
 * @param matrizDocumentId - Documento (CNPJ) da matriz a qual esta filial está vinculada
 * @param addressData - Dados do endereço da filial (opcional)
 * @param contactsData - Dados de contatos da filial (opcional)
 * @param categoryData - Dados da categoria da filial (opcional)
 * @param legalNatureData - Dados da natureza jurídica da filial (opcional)
 * @param bankAccountData - Dados da conta bancária da filial (opcional)
 * @returns ID da filial criada na base de dados local
 */
export async function criarFilialMerchant(
  filialData: MerchantInsert,
  matrizDocumentId: string,
  addressData?: AddressInsert,
  contactsData?: any[],
  categoryData?: any,
  legalNatureData?: any,
  bankAccountData?: any
): Promise<number> {
  try {
    console.log("Iniciando criação de filial de merchant");

    // Verificar se o documento da matriz foi fornecido
    if (!matrizDocumentId) {
      throw new Error(
        "É necessário fornecer o documento da matriz para criar uma filial"
      );
    }

    // 1. Buscar informações da matriz no banco local
    const matrizInfo = await db
      .select()
      .from(merchants)
      .where(eq(merchants.idDocument, matrizDocumentId))
      .limit(1);

    if (matrizInfo.length === 0) {
      throw new Error(
        `Matriz com documento ${matrizDocumentId} não encontrada no banco local`
      );
    }

    const matriz = matrizInfo[0];

    // Verificar se a matriz tem um slug válido na API
    if (!matriz.slug) {
      throw new Error(
        "A matriz não possui um slug válido na API. Crie a matriz primeiro."
      );
    }

    // 2. Se tiver dados de endereço, inserir primeiro para obter o ID
    let addressId: number | undefined = undefined;
    if (addressData) {
      addressId = await insertAddress(addressData);
      filialData.idAddress = addressId;
    }

    // 3. Inserir a filial na base local (modificando para indicar que é uma filial)
    // Garantir que o campo isMainOffice esteja disponível na tabela de merchants
    filialData.isMainOffice = false;
    filialData.idMatriz = matriz.id; // Relação com a matriz

    const filialId = await insertMerchant(filialData);

    // 4. Buscar a filial completa para enviar à API
    const completeData = await db
      .select()
      .from(merchants)
      .where(eq(merchants.id, filialId))
      .limit(1);

    if (completeData.length === 0) {
      throw new Error("Filial não encontrada após inserção");
    }

    const filialDetail: MerchantDetail = {
      id: completeData[0].id,
      slug: completeData[0].slug || "",
      name: completeData[0].name || "",
      active: completeData[0].active || false,
      dtinsert: completeData[0].dtinsert || new Date().toISOString(),
      dtupdate: completeData[0].dtupdate || new Date().toISOString(),
      idMerchant: completeData[0].idMerchant || undefined,
      idDocument: completeData[0].idDocument || undefined,
      corporateName: completeData[0].corporateName || undefined,
      email: completeData[0].email || undefined,
      areaCode: completeData[0].areaCode || undefined,
      number: completeData[0].number || undefined,
      phoneType: completeData[0].phoneType || undefined,
      language: completeData[0].language || undefined,
      timezone: completeData[0].timezone || undefined,
      slugCustomer: completeData[0].slugCustomer || undefined,
      riskAnalysisStatus: completeData[0].riskAnalysisStatus || undefined,
      riskAnalysisStatusJustification:
        completeData[0].riskAnalysisStatusJustification || undefined,
      legalPerson: completeData[0].legalPerson || undefined,
      openingDate: completeData[0].openingDate
        ? new Date(completeData[0].openingDate)
        : undefined,
      inclusion: completeData[0].inclusion || undefined,
      openingDays: completeData[0].openingDays || undefined,
      openingHour: completeData[0].openingHour || undefined,
      closingHour: completeData[0].closingHour || undefined,
      municipalRegistration: completeData[0].municipalRegistration || undefined,
      stateSubcription: completeData[0].stateSubcription || undefined,
      hasTef: completeData[0].hasTef || undefined,
      hasPix: completeData[0].hasPix || undefined,
      hasTop: completeData[0].hasTop || undefined,
      establishmentFormat: completeData[0].establishmentFormat || undefined,
      revenue: completeData[0].revenue
        ? Number(completeData[0].revenue)
        : undefined,
      idCategory: completeData[0].idCategory || undefined,
      slugCategory: completeData[0].slugCategory || undefined,
      idConfiguration: completeData[0].idConfiguration || undefined,
      slugConfiguration: completeData[0].slugConfiguration || undefined,
      idAddress: completeData[0].idAddress || undefined,
      idLegalNature: completeData[0].idLegalNature || undefined,
      slugLegalNature: completeData[0].slugLegalNature || undefined,
      isMainOffice: false,
      idMatriz: matriz.id,
    };

    // 5. Buscar dados adicionais necessários para a API
    const addressDetail = addressId
      ? await db
          .select()
          .from(addresses)
          .where(eq(addresses.id, addressId))
          .limit(1)
          .then((res) => res[0])
      : undefined;

    const categoryObject = categoryData
      ? categoryData
      : filialDetail.idCategory
        ? await db
            .select()
            .from(categories)
            .where(eq(categories.id, filialDetail.idCategory))
            .limit(1)
            .then((res) => res[0])
        : undefined;

    const legalNatureObject = legalNatureData
      ? legalNatureData
      : filialDetail.idLegalNature
        ? await db
            .select()
            .from(legalNatures)
            .where(eq(legalNatures.id, filialDetail.idLegalNature))
            .limit(1)
            .then((res) => res[0])
        : undefined;

    // 6. Enviar para a API como uma filial
    try {
      // Formatar o payload para criar uma filial
      const payload = {
        name: filialDetail.name || "",
        documentId: filialDetail.idDocument || "",
        corporateName: filialDetail.corporateName || "",
        email: filialDetail.email || "",
        areaCode: filialDetail.areaCode || "",
        number: filialDetail.number || "",
        phoneType: filialDetail.phoneType || "C",
        timezone: filialDetail.timezone || "-0300",
        contacts: contactsData?.length
          ? contactsData.map((contact) => ({
              contactName: contact.name || "",
              contactEmail: contact.email || filialDetail.email || "",
              contactDDD: contact.areaCode || filialDetail.areaCode || "",
              contactNumber: contact.number || filialDetail.number || "",
              contactType: contact.contactType || "ADMINISTRATIVE",
            }))
          : [
              {
                contactName: filialDetail.name || "",
                contactEmail: filialDetail.email || "",
                contactDDD: filialDetail.areaCode || "",
                contactNumber: filialDetail.number || "",
                contactType: "ADMINISTRATIVE",
              },
            ],
        address: addressDetail
          ? {
              streetAddress: addressDetail.streetAddress || "",
              streetNumber: addressDetail.streetNumber || "",
              complement: addressDetail.complement || null,
              neighborhood: addressDetail.neighborhood || "",
              city: addressDetail.city || "",
              state: addressDetail.state || "",
              zipCode: addressDetail.zipCode || "",
              country: "BR",
            }
          : {
              streetAddress: "",
              streetNumber: "",
              complement: null,
              neighborhood: "",
              city: "",
              state: "",
              zipCode: "",
              country: "BR",
            },
        isMainOffice: false, // Indica que é uma filial
        mainOffice: {
          documentId: matrizDocumentId, // Documento da matriz
        },
        legalPerson: filialDetail.legalPerson || "JURIDICAL",
        openingDate: filialDetail.openingDate
          ? new Date(filialDetail.openingDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        openingDays: filialDetail.openingDays || "1111100",
        openingHour: filialDetail.openingHour || "08:00",
        closingHour: filialDetail.closingHour || "18:00",
        municipalRegistration: filialDetail.municipalRegistration || null,
        stateSubcription: filialDetail.stateSubcription || null,
        hasTef: filialDetail.hasTef ?? true,
        hasPix: filialDetail.hasPix ?? true,
        hasTop: filialDetail.hasTop ?? true,
        establishmentFormat: filialDetail.establishmentFormat || "EI",
        revenue: filialDetail.revenue || 0,
        category: categoryObject
          ? {
              mcc: categoryObject.mcc || "5999",
              cnae: categoryObject.cnae || "6499999",
            }
          : {
              mcc: "5999",
              cnae: "6499999",
            },
        legalNature: legalNatureObject
          ? {
              code: legalNatureObject.code || "2135",
            }
          : {
              code: "2135",
            },
        merchantBankAccount: bankAccountData
          ? {
              bankId: bankAccountData.bankId || "341",
              agencyNumber: bankAccountData.agencyNumber || "0001",
              accountNumber: bankAccountData.accountNumber || "123456",
              accountType: bankAccountData.accountType || "CC",
              legalPerson: filialDetail.legalPerson || "JURIDICAL",
            }
          : {
              bankId: "341",
              agencyNumber: "0001",
              accountNumber: "123456",
              accountType: "CC",
              legalPerson: "JURIDICAL",
            },
      };

      console.log(
        "Enviando dados de filial para API:",
        JSON.stringify(payload)
      );

      // Enviar para a API
      const response = await fetch(
        `https://merchant.acquiring.hml.dock.tech/v1/onboarding`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiIxMkMxQzk1QjlGM0I0MzgyOUI2MEVEQ0UxQzQ1NzAwRSIsInNpcCI6IjRFN0I5NUY3RTBGOTQ5N0FBOTEzM0NGRjM5RDlGQUE3In0.ebqadX2yKxJPBji0HJTdn8F2vae57K1KvHUJb-v1AUD7w3D_HUWjoJbSq5M8t_bm4u69E8krQ47abarQqubRIg`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na API (${response.status}):`, errorText);
        throw new Error(
          `Falha na API de criação de filial: ${response.statusText}. Detalhes: ${errorText}`
        );
      }

      const apiResponse = await response.json();
      console.log("Resposta da API de criação de filial:", apiResponse);

      // 7. Atualizar a filial no banco local com dados da API
      if (apiResponse && apiResponse.slug) {
        await db
          .update(merchants)
          .set({
            slug: apiResponse.slug,
            riskAnalysisStatus:
              apiResponse.riskAnalysisStatus || filialDetail.riskAnalysisStatus,
            slugCustomer: apiResponse.slug,
            dtupdate: new Date().toISOString(),
          })
          .where(eq(merchants.id, filialId));
      }
    } catch (apiError) {
      console.error("Erro ao criar filial na API:", apiError);
      // Continuamos mesmo se houve erro na API, pois a filial já está criada localmente
    }

    return filialId;
  } catch (error) {
    console.error("Erro ao criar filial merchant:", error);
    throw error;
  }
}

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
        : (merchant.revenue ?? 0),
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

/**
 * Realiza o soft delete de um merchant (define active=false) no banco de dados local e na API da Dock
 * @param merchantId - ID do merchant no banco de dados local
 * @returns Objeto com status da operação
 */
export async function softDeleteMerchant(
  merchantId: number
): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`Iniciando soft delete do merchant ID ${merchantId}`);

    // 1. Buscar o merchant no banco local para obter o slug
    const merchantData = await db
      .select()
      .from(merchants)
      .where(eq(merchants.id, merchantId))
      .limit(1);

    if (merchantData.length === 0) {
      throw new Error(`Merchant ID ${merchantId} não encontrado`);
    }

    const merchant = merchantData[0];
    const merchantSlug = merchant.slug;

    // 2. Atualizar o status para inativo no banco local
    await db
      .update(merchants)
      .set({
        active: false,
        dtupdate: new Date().toISOString(),
      })
      .where(eq(merchants.id, merchantId));

    console.log(
      `Merchant ID ${merchantId} marcado como inativo no banco local`
    );

    // 3. Se tiver slug, atualizar na API da Dock
    let apiUpdated = false;
    if (merchantSlug) {
      try {
        // Verificar se o slug é válido (UUID com comprimento ≤ 32)
        if (!merchantSlug || merchantSlug.length > 32) {
          console.warn(
            `Slug inválido para merchant ID ${merchantId}: ${merchantSlug}`
          );
          return {
            success: true,
            message:
              "Merchant desativado no banco de dados local, mas não foi possível atualizar na API Dock devido a slug inválido.",
          };
        }

        // Preparar payload para a API
        const payload = {
          active: false,
        };

        console.log(
          `Enviando requisição para desativar merchant ${merchantSlug} na API`
        );

        // Chamar a API da Dock para atualizar o status
        const response = await fetch(
          `https://merchant.acquiring.hml.dock.tech/v1/onboarding/${merchantSlug}`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiIxMkMxQzk1QjlGM0I0MzgyOUI2MEVEQ0UxQzQ1NzAwRSIsInNpcCI6IjRFN0I5NUY3RTBGOTQ5N0FBOTEzM0NGRjM5RDlGQUE3In0.ebqadX2yKxJPBji0HJTdn8F2vae57K1KvHUJb-v1AUD7w3D_HUWjoJbSq5M8t_bm4u69E8krQ47abarQqubRIg`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Erro na API (${response.status}):`, errorText);
          throw new Error(
            `Falha na API: ${response.statusText}. Detalhes: ${errorText}`
          );
        }

        const apiResponse = await response.json();
        console.log(
          `Merchant ${merchantSlug} desativado na API com sucesso:`,
          apiResponse
        );
        apiUpdated = true;
      } catch (apiError) {
        console.error(
          `Erro ao desativar merchant ${merchantSlug} na API:`,
          apiError
        );
        return {
          success: true,
          message:
            "Merchant desativado no banco de dados local, mas houve um erro ao desativar na API Dock.",
        };
      }
    }

    return {
      success: true,
      message: apiUpdated
        ? "Merchant desativado com sucesso no banco de dados e na API Dock."
        : "Merchant desativado com sucesso apenas no banco de dados local.",
    };
  } catch (error) {
    console.error(
      `Erro ao realizar soft delete do merchant ID ${merchantId}:`,
      error
    );
    throw error;
  }
}

/**
 * Envia os dados de um merchant para a API da Dock usando o formato correto do corpo da requisição
 * @param merchantId - ID do merchant no banco de dados local
 * @param bankAccountData - Dados bancários do merchant
 * @returns Resposta da API com os dados do merchant criado
 */
export async function sendMerchantToAPIV2(
  merchantId: number,
  bankAccountData: any
): Promise<any> {
  try {
    console.log(
      `Enviando merchant ID ${merchantId} para API Dock com formato correto`
    );

    // 1. Buscar dados completos do merchant
    const merchantData = await db
      .select()
      .from(merchants)
      .where(eq(merchants.id, merchantId))
      .limit(1);

    if (merchantData.length === 0) {
      throw new Error(`Merchant ID ${merchantId} não encontrado`);
    }

    const merchant = merchantData[0];

    // 2. Buscar dados relacionados necessários para API
    const addressData = merchant.idAddress
      ? await db
          .select()
          .from(addresses)
          .where(eq(addresses.id, merchant.idAddress))
          .limit(1)
          .then((res) => (res.length > 0 ? res[0] : null))
      : null;

    const contactsData = await db
      .select()
      .from(contacts)
      .where(eq(contacts.idMerchant, merchantId))
      .then((res) => res);

    const categoryData = merchant.idCategory
      ? await db
          .select()
          .from(categories)
          .where(eq(categories.id, merchant.idCategory))
          .limit(1)
          .then((res) => (res.length > 0 ? res[0] : null))
      : null;

    const legalNatureData = merchant.idLegalNature
      ? await db
          .select()
          .from(legalNatures)
          .where(eq(legalNatures.id, merchant.idLegalNature))
          .limit(1)
          .then((res) => (res.length > 0 ? res[0] : null))
      : null;

    const configData = merchant.idConfiguration
      ? await db
          .select()
          .from(configurations)
          .where(eq(configurations.id, merchant.idConfiguration))
          .limit(1)
          .then((res) => (res.length > 0 ? res[0] : null))
      : null;

    // Buscar dados da tabela de preço (merchantPrice)
    let merchantPriceData: any = null;
    let merchantPriceSlug = "defaultPriceTable"; // Valor padrão

    if (merchant.idMerchantPrice) {
      merchantPriceData = await db
        .select()
        .from(merchantPrice)
        .where(eq(merchantPrice.id, merchant.idMerchantPrice))
        .limit(1)
        .then((res) => (res.length > 0 ? res[0] : null));

      if (merchantPriceData && merchantPriceData.slug) {
        merchantPriceSlug = merchantPriceData.slug;
      }
    }

    // Se não encontrou pelo idMerchantPrice, tentar buscar pelo slug fornecido
    if (!merchantPriceData) {
      const fixedSlug = "691D4947FB7B4AB6996BC87875E422B7";

      console.log(`Tentando buscar merchantPrice pelo slug fixo: ${fixedSlug}`);

      merchantPriceData = await db
        .select()
        .from(merchantPrice)
        .where(eq(merchantPrice.slug, fixedSlug))
        .limit(1)
        .then((res) => (res.length > 0 ? res[0] : null));

      if (merchantPriceData && merchantPriceData.slug) {
        merchantPriceSlug = merchantPriceData.slug;
        console.log(
          `Encontrado merchantPrice pelo slug fixo: ${merchantPriceSlug}`
        );
      } else {
        console.log(
          `Não foi encontrado merchantPrice pelo slug fixo. Usando valores padrão.`
        );
      }
    }

    // 3. Validar dados obrigatórios
    if (!merchant.idDocument || merchant.idDocument.trim() === "") {
      throw new Error("O documento do merchant (CNPJ/CPF) é obrigatório");
    }

    if (!merchant.name || merchant.name.trim() === "") {
      throw new Error("O nome do merchant é obrigatório");
    }

    if (!merchant.corporateName || merchant.corporateName.trim() === "") {
      throw new Error("A razão social do merchant é obrigatória");
    }

    if (!legalNatureData) {
      throw new Error("A natureza jurídica do merchant é obrigatória");
    }

    // 4. Formatar o documento (remover caracteres não numéricos)
    const documentId = (merchant.idDocument || "").replace(/[^\d]/g, "");

    // 5. Validar CEP (garantir 8 dígitos)
    const zipCode = addressData?.zipCode
      ? addressData.zipCode.replace(/[^\d]/g, "").padStart(8, "0")
      : "01001000";

    // 6. Validar data de abertura (não pode ser futura)
    const today = new Date();
    let openingDate = merchant.openingDate
      ? new Date(merchant.openingDate)
      : new Date();
    if (openingDate > today) {
      openingDate = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      );
    }
    const formattedOpeningDate = openingDate.toISOString().split("T")[0];

    // Data padrão para nascimento (30 anos atrás)
    const defaultBirthDate = new Date(
      today.getFullYear() - 30,
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split("T")[0];

    // Definir código da cidade em função do estado
    // Códigos de cidades brasileiras comuns por estado
    let cityCode = "3550308"; // São Paulo/SP por padrão
    let city = addressData?.city || "São Paulo";
    const state = addressData?.state || "SP";

    // Mapear códigos IBGE comuns para as capitais estaduais
    const cityCodeMap: { [key: string]: { code: string; city: string } } = {
      AC: { code: "1200401", city: "Rio Branco" },
      AL: { code: "2704302", city: "Maceió" },
      AM: { code: "1302603", city: "Manaus" },
      AP: { code: "1600303", city: "Macapá" },
      BA: { code: "2927408", city: "Salvador" },
      CE: { code: "2304400", city: "Fortaleza" },
      DF: { code: "5300108", city: "Brasília" },
      ES: { code: "3205309", city: "Vitória" },
      GO: { code: "5208707", city: "Goiânia" },
      MA: { code: "2111300", city: "São Luís" },
      MG: { code: "3106200", city: "Belo Horizonte" },
      MS: { code: "5003702", city: "Campo Grande" },
      MT: { code: "5103403", city: "Cuiabá" },
      PA: { code: "1501402", city: "Belém" },
      PB: { code: "2507507", city: "João Pessoa" },
      PE: { code: "2611606", city: "Recife" },
      PI: { code: "2211001", city: "Teresina" },
      PR: { code: "4106902", city: "Curitiba" },
      RJ: { code: "3304557", city: "Rio de Janeiro" },
      RN: { code: "2408102", city: "Natal" },
      RO: { code: "1100205", city: "Porto Velho" },
      RR: { code: "1400100", city: "Boa Vista" },
      RS: { code: "4314902", city: "Porto Alegre" },
      SC: { code: "4205407", city: "Florianópolis" },
      SE: { code: "2800308", city: "Aracaju" },
      SP: { code: "3550308", city: "São Paulo" },
      TO: { code: "1721000", city: "Palmas" },
    };

    // Se o estado existir no mapa, obtém o código e a cidade correspondente
    if (state && cityCodeMap[state]) {
      cityCode = cityCodeMap[state].code;
      // Só substitui a cidade se não tiver sido fornecida
      if (!city || city.trim() === "") {
        city = cityCodeMap[state].city;
      }
    }

    // 7. Preparar payload para a API seguindo exatamente o formato da documentação
    const payload = {
      // Campos do merchant (obrigatórios)

      merchantData: merchant,

      // Campo merchantPrice obrigatório (adicionado para resolver o erro)
      merchantPrice: {
        slug: merchantPriceData?.slug ?? "691D4947FB7B4AB6996BC87875E422B7",
        name: merchantPriceData?.name ?? "OUTBANK TESTE 22-2-2024_9-50-12",
        tableType: merchantPriceData?.tableType ?? "SIMPLE",
        anticipationType: merchantPriceData?.anticipationType ?? "EVENTUAL",
        eventualAnticipationFee:
          merchantPriceData?.eventualAnticipationFee ?? 0.02,
        cardPixMdr: merchantPriceData?.cardPixMdr ?? 0.01,
        cardPixCeilingFee: merchantPriceData?.cardPixCeilingFee ?? 0.8,
        cardPixMinimumCostFee: merchantPriceData?.cardPixMinimumCostFee ?? 0.8,
        nonCardPixMdr: merchantPriceData?.nonCardPixMdr ?? 0.01,
        nonCardPixCeilingFee: merchantPriceData?.nonCardPixCeilingFee ?? 0.96,
        nonCardPixMinimumCostFee:
          merchantPriceData?.nonCardPixMinimumCostFee ?? 0.96,
        listMerchantPriceGroup: [
          // VISA
          {
            brand: "VISA",
            groupId: 1,
            listMerchantTransactionPrice: [
              // À vista - Crédito
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0148, // 1.48%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0148,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.002,
                nonCardCompulsoryAnticipationMdr: 0.002,
              },
              // À vista - Débito
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0095, // 0.95%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0095,
                productType: "DEBIT",
                cardCompulsoryAnticipationMdr: 0,
                nonCardCompulsoryAnticipationMdr: 0,
              },
              // À vista - Pré-pago
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0148, // 1.48%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0148,
                productType: "PREPAID",
                cardCompulsoryAnticipationMdr: 0.002,
                nonCardCompulsoryAnticipationMdr: 0.002,
              },
              // Parcelado 2-6x - Crédito
              {
                installmentTransactionFeeStart: 2,
                installmentTransactionFeeEnd: 6,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0167, // 1.67%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0167,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.003,
                nonCardCompulsoryAnticipationMdr: 0.003,
              },
              // Parcelado 7-12x - Crédito
              {
                installmentTransactionFeeStart: 7,
                installmentTransactionFeeEnd: 12,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0204, // 2.04%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0204,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.004,
                nonCardCompulsoryAnticipationMdr: 0.004,
              },
            ],
          },

          // MASTERCARD
          {
            brand: "MASTERCARD",
            groupId: 2,
            listMerchantTransactionPrice: [
              // À vista - Crédito
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0126, // 1.26%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0126,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.002,
                nonCardCompulsoryAnticipationMdr: 0.002,
              },
              // À vista - Débito
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0088, // 0.88%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0088,
                productType: "DEBIT",
                cardCompulsoryAnticipationMdr: 0,
                nonCardCompulsoryAnticipationMdr: 0,
              },
              // À vista - Pré-pago
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0126, // 1.26%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0126,
                productType: "PREPAID",
                cardCompulsoryAnticipationMdr: 0.002,
                nonCardCompulsoryAnticipationMdr: 0.002,
              },
              // Parcelado 2-6x - Crédito
              {
                installmentTransactionFeeStart: 2,
                installmentTransactionFeeEnd: 6,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0191, // 1.91%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0191,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.003,
                nonCardCompulsoryAnticipationMdr: 0.003,
              },
              // Parcelado 7-12x - Crédito
              {
                installmentTransactionFeeStart: 7,
                installmentTransactionFeeEnd: 12,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0183, // 1.83%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0183,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.004,
                nonCardCompulsoryAnticipationMdr: 0.004,
              },
            ],
          },

          // ELO
          {
            brand: "ELO",
            groupId: 4,
            listMerchantTransactionPrice: [
              // À vista - Crédito
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0105, // 1.05%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0105,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.002,
                nonCardCompulsoryAnticipationMdr: 0.002,
              },
              // À vista - Débito
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0095, // 0.95%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0095,
                productType: "DEBIT",
                cardCompulsoryAnticipationMdr: 0,
                nonCardCompulsoryAnticipationMdr: 0,
              },
              // À vista - Pré-pago
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0105, // 1.05%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0105,
                productType: "PREPAID",
                cardCompulsoryAnticipationMdr: 0.002,
                nonCardCompulsoryAnticipationMdr: 0.002,
              },
              // Parcelado 2-6x - Crédito
              {
                installmentTransactionFeeStart: 2,
                installmentTransactionFeeEnd: 6,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0118, // 1.18%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0118,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.003,
                nonCardCompulsoryAnticipationMdr: 0.003,
              },
              // Parcelado 7-12x - Crédito
              {
                installmentTransactionFeeStart: 7,
                installmentTransactionFeeEnd: 12,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0143, // 1.43%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0143,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.004,
                nonCardCompulsoryAnticipationMdr: 0.004,
              },
            ],
          },
        ],
      },

      // Contatos do merchant (obrigatório)
      contacts: [
        {
          name: contactsData[0]?.name || merchant.name,
          documentId: contactsData[0]?.idDocument || documentId,
          email:
            contactsData[0]?.email || merchant.email || "contato@exemplo.com",
          areaCode: contactsData[0]?.areaCode || merchant.areaCode || "11",
          number: contactsData[0]?.number || merchant.number || "999999999",
          phoneType: validatePhoneType(contactsData[0]?.phoneType) || "C",
          birthDate: contactsData[0]?.birthDate
            ? new Date(contactsData[0].birthDate).toISOString().split("T")[0]
            : defaultBirthDate,
          mothersName: contactsData[0]?.mothersName || "Não informado",
          isPartnerContact: true,
          isPep: false,
        },
      ],

      // Endereço (obrigatório)
      address: {
        streetAddress: addressData?.streetAddress || "Rua Exemplo",
        streetNumber: addressData?.streetNumber || "123",
        complement: addressData?.complement || "",
        neighborhood: addressData?.neighborhood || "Centro",
        city: city,
        state: state,
        zipCode: zipCode,
        country: "BRA", // Formato ISO 3166-1 alpha-3
        cityCode: cityCode, // Código IBGE da cidade
      },

      // Campos adicionais obrigatórios
      isMainOffice: true,
      legalPerson: "JURIDICAL",
      openingDate: formattedOpeningDate,
      openingDays: merchant.openingDays || "0111110",
      openingHour: (merchant.openingHour || "09:00").substring(0, 5),
      closingHour: (merchant.closingHour || "18:00").substring(0, 5),
      municipalRegistration: merchant.municipalRegistration || null,
      stateSubcription: merchant.stateSubcription || null,
      hasTef: merchant.hasTef !== false,
      hasPix: merchant.hasPix !== false,
      hasTop: merchant.hasTop !== false,
      establishmentFormat: merchant.establishmentFormat || "EI",
      revenue: merchant.revenue ? Number(merchant.revenue) : 10000,

      // Categoria (obrigatório)
      category: {
        mcc: categoryData?.mcc || "5999",
        cnae: categoryData?.cnae || "4789-0/04",
      },

      // Natureza jurídica (obrigatório)
      legalNature: {
        code: legalNatureData.code || "206-2",
      },

      // Conta bancária (obrigatório)
      merchantBankAccount: {
        documentId: documentId,
        corporateName: merchant.corporateName,
        legalPerson: "JURIDICAL",
        bankBranchNumber: String(
          bankAccountData.bankBranchNumber || "0001"
        ).replace(/[^\d]/g, ""),
        bankBranchCheckDigit: bankAccountData.bankBranchCheckDigit || "",
        accountNumber: String(
          bankAccountData.accountNumber ||
            bankAccountData.bankAccountNumber ||
            "123456"
        ).replace(/[^\d]/g, ""),
        accountNumberCheckDigit:
          bankAccountData.accountNumberCheckDigit ||
          bankAccountData.bankAccountDigit ||
          "",
        accountType: "CHECKING",
        compeCode: String(
          bankAccountData.compeCode || bankAccountData.bankNumber || "341"
        ).replace(/[^\d]/g, ""),
      },

      // Configuração (opcional)
      configuration: configData
        ? {
            url: configData.url || "https://dock.tech/",
          }
        : undefined,
    };

    console.log("Enviando payload para API:", JSON.stringify(payload, null, 2));

    const merchantMock = {
      // Dados básicos do merchant
      name: "Meu Estabelecimento Teste",
      idDocument: "12345678901234", // CNPJ
      corporateName: "Minha Empresa LTDA",
      email: "contato@minhaempresa.com.br",
      areaCode: "11",
      number: "999999999",
      phoneType: "C", // C para celular
      timezone: "-0300",

      // Dados de endereço
      address: {
        streetAddress: "Rua Exemplo",
        streetNumber: "123",
        complement: "Sala 1",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zipCode: "01001000",
        country: "BRA",
        cityCode: "3550308", // Código IBGE São Paulo
      },

      // Dados adicionais obrigatórios
      isMainOffice: true,
      legalPerson: "JURIDICAL",
      openingDate: "2023-01-01",
      openingDays: "0111110", // Segunda a sexta
      openingHour: "09:00",
      closingHour: "18:00",
      municipalRegistration: null,
      stateSubcription: null,
      hasTef: true,
      hasPix: true,
      hasTop: true,
      establishmentFormat: "EI",
      revenue: 10000,

      // Categoria
      category: {
        mcc: "5999",
        cnae: "4789-0/04",
      },

      // Natureza jurídica
      legalNature: {
        code: "206-2",
      },

      // Conta bancária
      merchantBankAccount: {
        documentId: "12345678901234",
        corporateName: "Minha Empresa LTDA",
        legalPerson: "JURIDICAL",
        bankBranchNumber: "0001",
        bankBranchCheckDigit: "",
        accountNumber: "123456",
        accountNumberCheckDigit: "7",
        accountType: "CHECKING",
        compeCode: "341", // Itaú
      },

      // Contatos
      contacts: [
        {
          name: "João Silva",
          documentId: "12345678901", // CPF
          email: "joao@minhaempresa.com.br",
          areaCode: "11",
          number: "999999999",
          phoneType: "C", // C para celular
          birthDate: "1980-01-01",
          mothersName: "Maria Silva",
          isPartnerContact: true,
          isPep: false,
        },
      ],

      // Tabela de preços - merchantPrice
      merchantPrice: {
        slug: "691D4947FB7B4AB6996BC87875E422B7",
        name: "TABELA DE PREÇOS TESTE",
        tableType: "SIMPLE",
        anticipationType: "EVENTUAL",
        eventualAnticipationFee: 0.02,
        cardPixMdr: 0.01,
        cardPixCeilingFee: 0.8,
        cardPixMinimumCostFee: 0.8,
        nonCardPixMdr: 0.01,
        nonCardPixCeilingFee: 0.96,
        nonCardPixMinimumCostFee: 0.96,

        // Grupos de preço por bandeira
        listMerchantPriceGroup: [
          // VISA
          {
            brand: "VISA",
            groupId: 1,
            listMerchantTransactionPrice: [
              // À vista - Crédito
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0148, // 1.48%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0148,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.002,
                nonCardCompulsoryAnticipationMdr: 0.002,
              },
              // À vista - Débito
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0095, // 0.95%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0095,
                productType: "DEBIT",
                cardCompulsoryAnticipationMdr: 0,
                nonCardCompulsoryAnticipationMdr: 0,
              },
              // À vista - Pré-pago
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0148, // 1.48%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0148,
                productType: "PREPAID",
                cardCompulsoryAnticipationMdr: 0.002,
                nonCardCompulsoryAnticipationMdr: 0.002,
              },
              // Parcelado 2-6x - Crédito
              {
                installmentTransactionFeeStart: 2,
                installmentTransactionFeeEnd: 6,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0167, // 1.67%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0167,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.003,
                nonCardCompulsoryAnticipationMdr: 0.003,
              },
              // Parcelado 7-12x - Crédito
              {
                installmentTransactionFeeStart: 7,
                installmentTransactionFeeEnd: 12,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0204, // 2.04%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0204,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.004,
                nonCardCompulsoryAnticipationMdr: 0.004,
              },
            ],
          },

          // MASTERCARD
          {
            brand: "MASTERCARD",
            groupId: 2,
            listMerchantTransactionPrice: [
              // À vista - Crédito
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0126, // 1.26%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0126,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.002,
                nonCardCompulsoryAnticipationMdr: 0.002,
              },
              // À vista - Débito
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0088, // 0.88%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0088,
                productType: "DEBIT",
                cardCompulsoryAnticipationMdr: 0,
                nonCardCompulsoryAnticipationMdr: 0,
              },
              // À vista - Pré-pago
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0126, // 1.26%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0126,
                productType: "PREPAID",
                cardCompulsoryAnticipationMdr: 0.002,
                nonCardCompulsoryAnticipationMdr: 0.002,
              },
              // Parcelado 2-6x - Crédito
              {
                installmentTransactionFeeStart: 2,
                installmentTransactionFeeEnd: 6,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0191, // 1.91%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0191,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.003,
                nonCardCompulsoryAnticipationMdr: 0.003,
              },
              // Parcelado 7-12x - Crédito
              {
                installmentTransactionFeeStart: 7,
                installmentTransactionFeeEnd: 12,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0183, // 1.83%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0183,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.004,
                nonCardCompulsoryAnticipationMdr: 0.004,
              },
            ],
          },

          // ELO
          {
            brand: "ELO",
            groupId: 4,
            listMerchantTransactionPrice: [
              // À vista - Crédito
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0105, // 1.05%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0105,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.002,
                nonCardCompulsoryAnticipationMdr: 0.002,
              },
              // À vista - Débito
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0095, // 0.95%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0095,
                productType: "DEBIT",
                cardCompulsoryAnticipationMdr: 0,
                nonCardCompulsoryAnticipationMdr: 0,
              },
              // À vista - Pré-pago
              {
                installmentTransactionFeeStart: 1,
                installmentTransactionFeeEnd: 1,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0105, // 1.05%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0105,
                productType: "PREPAID",
                cardCompulsoryAnticipationMdr: 0.002,
                nonCardCompulsoryAnticipationMdr: 0.002,
              },
              // Parcelado 2-6x - Crédito
              {
                installmentTransactionFeeStart: 2,
                installmentTransactionFeeEnd: 6,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0118, // 1.18%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0118,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.003,
                nonCardCompulsoryAnticipationMdr: 0.003,
              },
              // Parcelado 7-12x - Crédito
              {
                installmentTransactionFeeStart: 7,
                installmentTransactionFeeEnd: 12,
                cardTransactionFee: 0,
                cardTransactionMdr: 0.0143, // 1.43%
                nonCardTransactionFee: 0,
                nonCardTransactionMdr: 0.0143,
                productType: "CREDIT",
                cardCompulsoryAnticipationMdr: 0.004,
                nonCardCompulsoryAnticipationMdr: 0.004,
              },
            ],
          },
        ],
      },
    };

    console.log("merchantMock:", JSON.stringify(merchantMock, null, 2));

    // 8. Enviar para a API
    const apiResponse = await fetch(
      "https://merchant.acquiring.hml.dock.tech/v1/onboarding",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiIxMkMxQzk1QjlGM0I0MzgyOUI2MEVEQ0UxQzQ1NzAwRSIsInNpcCI6IjRFN0I5NUY3RTBGOTQ5N0FBOTEzM0NGRjM5RDlGQUE3In0.ebqadX2yKxJPBji0HJTdn8F2vae57K1KvHUJb-v1AUD7w3D_HUWjoJbSq5M8t_bm4u69E8krQ47abarQqubRIg`,
        },
        body: JSON.stringify(payload),
      }
    );

    // 9. Tratar resposta
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`Erro na API (${apiResponse.status}): ${errorText}`);

      try {
        // Tentar parsear JSON para obter detalhes estruturados do erro
        const errorJson = JSON.parse(errorText);
        console.error("Erros detalhados:");
        if (errorJson.errors && Array.isArray(errorJson.errors)) {
          for (let i = 0; i < errorJson.errors.length; i++) {
            const err = errorJson.errors[i];
            console.error(`Erro ${i + 1}: ${err.msg} (${err.code})`);
          }
        }
      } catch {
        // Se falhar ao parsear JSON, apenas continuar
        console.error("Não foi possível parsear o erro como JSON");
      }

      throw new Error(
        `Falha na API: ${apiResponse.status}. Detalhes: ${errorText}`
      );
    }

    const responseData = await apiResponse.json();
    console.log(
      "Resposta bem-sucedida da API:",
      JSON.stringify(responseData, null, 2)
    );

    // 10. Atualizar o merchant no banco local com os dados retornados pela API
    if (responseData && responseData.slug) {
      await db
        .update(merchants)
        .set({
          slug: responseData.slug,
          riskAnalysisStatus:
            responseData.riskAnalysisStatus || merchant.riskAnalysisStatus,
          dtupdate: new Date().toISOString(),
        })
        .where(eq(merchants.id, merchantId));

      console.log(
        `Merchant ID ${merchantId} atualizado com slug ${responseData.slug} da API`
      );
    }

    return responseData;
  } catch (error) {
    console.error(`Erro ao enviar merchant ID ${merchantId} para API:`, error);
    throw error;
  }
}

// Função auxiliar para garantir que phoneType seja um valor válido para a API
function validatePhoneType(phoneType: string | undefined | null): "C" | "P" {
  if (phoneType === "P") {
    return "P"; // Telefone fixo
  }
  return "C"; // Celular (valor padrão)
}

export type InsertMerchantAPI = {
  name: string; // Nome fantasia do merchant (máx 30 caracteres)
  documentId: string; // CPF ou CNPJ (entre 11 e 14 caracteres)
  corporateName: string; // Razão social do merchant (máx 200 caracteres)
  email: string; // Email para contato (máx 50 caracteres)
  areaCode: string; // DDD do número de contato (máx 5 caracteres)
  number: string; // Número de contato (máx 15 caracteres)
  phoneType: "C" | "P"; // Tipo do número (C - Celular, P - Telefone)
  timezone: string; // Fuso horário padrão (máx 5 caracteres)

  // Contatos
  contacts: {
    name: string; // Nome do contato (máx 80 caracteres)
    documentId: string; // CPF do contato (máx 50 caracteres)
    email: string; // Email do contato (máx 50 caracteres)
    areaCode: string; // DDD do contato (máx 5 caracteres)
    number: string; // Número de telefone do contato (máx 15 caracteres)
    phoneType: "C" | "P"; // Tipo do telefone (C - Celular, P - Telefone)
    birthDate: string; // Data de nascimento do contato (formato 'YYYY-MM-DD')
    mothersName: string; // Nome da mãe do contato (máx 80 caracteres)
    isPartnerContact: boolean; // Define se o contato é o proprietário do merchant
    isPep: boolean; // Define se o contato é uma pessoa politicamente exposta
    address: {
      streetAddress: string; // Nome da rua (máx 100 caracteres)
      streetNumber: string; // Número do endereço (máx 10 caracteres)
      complement?: string; // Complemento (máx 100 caracteres)
      neighborhood: string; // Bairro (máx 50 caracteres)
      city: string; // Cidade (máx 50 caracteres)
      state: string; // Sigla do estado (máx 50 caracteres)
      country: string; // País (máx 50 caracteres)
      zipCode: string; // CEP (máx 20 caracteres)
    };
  };

  // Endereço
  address: {
    streetAddress: string; // Nome da rua (máx 100 caracteres)
    streetNumber: string; // Número do endereço (máx 10 caracteres)
    complement?: string; // Complemento (máx 100 caracteres)
    neighborhood: string; // Bairro (máx 50 caracteres)
    city: string; // Cidade (máx 50 caracteres)
    state: string; // Sigla do estado (máx 50 caracteres)
    country: string; // País (máx 50 caracteres)
    zipCode: string; // CEP (máx 20 caracteres)
  };
  isMainOffice: boolean;
  mainOffice?: {
    // Dados do merchant principal se for filial
    slug?: string;
    documentId?: string;
  };

  // Categoria
  category: {
    mcc: string; // MCC do merchant (máx 10 caracteres)
    cnae: string; // CNAE do merchant (máx 10 caracteres)
  };

  // Natureza jurídica
  legalNature: {
    code: string; // Código da natureza jurídica (máx 10 caracteres)
  };

  // Conta bancária
  merchantBankAccount: {
    documentId: string; // CPF ou CNPJ do responsável pela conta bancária (entre 11 e 14 caracteres)
    corporateName: string; // Razão social do responsável pela conta bancária (máx 200 caracteres)
    legalPerson: "JURIDICAL"; // Natureza jurídica do estabelecimento comercial
    bankBranchNumber: string; // Número da agência bancária (máx 4 caracteres)
    bankBranchCheckDigit?: string; // Dígito da agência bancária (máx 2 caracteres)
    accountNumber: string; // Número da conta (máx 15 caracteres)
    accountNumberCheckDigit?: string; // Dígito da conta (máx 2 caracteres)
    accountType: "CHECKING" | "SAVINGS"; // Tipo da conta bancária
    compeCode: string; // Código do banco (máx 3 caracteres)
  };

  // Configuração (obrigatório se o merchant tiver configuração CNP)
  configuration: {
    url: string; // URL do site ou perfil de mídia social de onde o merchant recebe pedidos de compra CNP (máx 500 caracteres)
  };

  // Tabela de preços
  merchantPrice: {
    name: string; // Nome da tabela de taxas (máx 200 caracteres)
    tableType: "SIMPLE"; // Tipo da tabela de preços
    anticipationType: "EVENTUAL" | "COMPULSORY"; // Tipo de antecipação
    compulsoryAnticipationConfig?: number; // Dias para antecipação (obrigatório se COMPULSORY)
    eventualAnticipationFee?: number; // Taxa de antecipação eventual (obrigatório se EVENTUAL)
    cardPixMdr?: number; // MDR de transações PIX CP
    cardPixCeilingFee?: number; // Valor máximo em reais para dedução PIX CP
    cardPixMinimumCostFee?: number; // Valor mínimo em reais para cobrança PIX CP
    nonCardPixMdr?: number; // MDR de transações PIX CNP
    nonCardPixCeilingFee?: number; // Valor máximo em reais para dedução PIX CNP
    nonCardPixMinimumCostFee?: number; // Valor mínimo em reais para cobrança PIX CNP

    // Grupos de preço por bandeira
    listMerchantPriceGroup: Array<{
      brand: string; // Nome da bandeira do cartão
      groupId: number; // Identificador do grupo de taxas (máx 10)

      // Taxas de transação
      listMerchantTransactionPrice: Array<{
        installmentTransactionFeeStart: number; // Parcela inicial para aplicação das taxas
        installmentTransactionFeeEnd: number; // Parcela final para aplicação das taxas
        cardTransactionFee: number; // Taxa para cartão presente (padrão: 0)
        cardTransactionMdr: number; // MDR para cartão presente
        nonCardTransactionFee: number; // Taxa para cartão não presente (padrão: 0)
        nonCardTransactionMdr: number; // MDR para cartão não presente
        productType: "CREDIT" | "DEBIT" | "PREPAID"; // Tipo de transação
        cardCompulsoryAnticipationMdr?: number; // MDR para antecipação compulsória CP
        nonCardCompulsoryAnticipationMdr?: number; // MDR para antecipação compulsória CNP
      }>;
    }>;
  };

  // Dados da pessoa jurídica
  legalPerson: "JURIDICAL"; // Tipo de pessoa jurídica
  openingDate: string; // Data de abertura do merchant (formato 'YYYY-MM-DD')
  openingDays: string; // Dias de funcionamento (formato: "0111110") - 7 caracteres onde cada um é '0' ou '1'
  openingHour: string; // Horário de abertura (máx 5 caracteres, formato 'HH:MM')
  closingHour: string; // Horário de fechamento (máx 5 caracteres, formato 'HH:MM')
  municipalRegistration?: string | null; // Inscrição municipal
  stateSubscription?: string | null; // Inscrição estadual
  hasTef: boolean; // Indica se o merchant tem TEF habilitado
  hasPix: boolean; // Indica se o merchant tem PIX habilitado
  hasTop: boolean; // Indica se o merchant tem Tap On Phone habilitado
  establishmentFormat: "EI" | "LTDA" | "SA" | "MEI" | "EIRELI"; // Formato legal do merchant
  revenue: number; // Valor em reais da receita anual do merchant
};

async function InsertAPIMerchant(data: InsertMerchantAPI) {
  console.log("data", data);
  const response = await fetch(
    "https://merchant.acquiring.hml.dock.tech/v1/onboarding",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiIxMkMxQzk1QjlGM0I0MzgyOUI2MEVEQ0UxQzQ1NzAwRSIsInNpcCI6IjRFN0I5NUY3RTBGOTQ5N0FBOTEzM0NGRjM5RDlGQUE3In0.ebqadX2yKxJPBji0HJTdn8F2vae57K1KvHUJb-v1AUD7w3D_HUWjoJbSq5M8t_bm4u69E8krQ47abarQqubRIg`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    const errorMessage = `Failed to save data: ${response.statusText}`;
    console.error(response);
    throw new Error(errorMessage);
  }
  const responseData = await response.json();
  return responseData;
}

export async function InsertMerchant1(
  data: InsertMerchantAPI & { id?: number }
) {
  try {
    // Se um ID foi fornecido, busca o merchant completo com todos os relacionamentos

    // Se não existe ou não foi fornecido ID, cria um novo na API
    const response = await InsertAPIMerchant(data);
    return response;
  } catch (error) {
    console.error("Erro ao inserir merchant:", error);
    throw error;
  }
}

/**
 * Busca informações completas de um merchant pelo ID
 * @param id - ID do merchant a ser buscado
 * @returns Dados completos do merchant ou null se não encontrado
 */
export async function buscarMerchantPorId(id: number) {
  try {
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
        bankaccounts: { ...getTableColumns(merchantBankAccounts) },
      })
      .from(merchants)
      .where(eq(merchants.id, Number(id)))
      .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
      .leftJoin(categories, eq(merchants.idCategory, categories.id))
      .leftJoin(
        configurations,
        eq(merchants.idConfiguration, configurations.id)
      )
      .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
      .leftJoin(legalNatures, eq(merchants.idLegalNature, legalNatures.id))
      .leftJoin(contacts, eq(merchants.id, contacts.idMerchant))
      .leftJoin(
        merchantpixaccount,
        eq(merchants.id, merchantpixaccount.idMerchant)
      )
      .leftJoin(merchantBankAccounts, eq(merchants.id, merchantBankAccounts.id))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Erro ao buscar merchant ID ${id}:`, error);
    return null;
  }
}

/**
 * Busca dados básicos de um merchant pelo ID
 * @param id - ID do merchant a ser buscado
 * @returns Dados básicos do merchant ou null se não encontrado
 */
export async function buscarDadosBasicosMerchant(id: number) {
  try {
    const result = await db
      .select()
      .from(merchants)
      .where(eq(merchants.id, Number(id)))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Erro ao buscar dados básicos do merchant ID ${id}:`, error);
    return null;
  }
}
