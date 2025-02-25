"use server";

import { db } from "@/server/db";
import { count, desc, eq, getTableColumns, ilike, or,and, gte, lte } from "drizzle-orm";
import {
  addresses,
  categories,
  configurations,
  contacts,
  establishmentFormat,
  legalNatures,
  merchantpixaccount,
  merchants,
  salesAgents,
} from "../../../../drizzle/schema";
import { LegalNatureDetail } from "@/features/legalNature/server/legalNature-db";


export type MerchantInsert = typeof merchants.$inferInsert;


export interface Merchantlist {
  merchants: {
    merchantid: number | bigint ;
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

    lockCpAnticipationOrder: boolean;
    lockCnpAnticipationOrder: boolean;
    

    sales_agent: string;
    state: string;
    cnpj: string;
    corporate_name: string;
    slug_category: string;
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
  dateTo?: string
): Promise<Merchantlist> {
  const offset = (page - 1) * pageSize;
  
  const conditions = [];

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
    conditions.push(eq(merchants.riskAnalysisStatus, status));
  }

  if (state) {
    conditions.push(eq(addresses.state, state));
  }

  if (dateFrom) {
    conditions.push(gte(merchants.dtinsert, dateFrom));
  }

  if (dateTo) {
    conditions.push(lte(merchants.dtinsert, dateTo));
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
      
    })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .where(and(...conditions))
    .orderBy(desc(merchants.dtinsert))
    .offset(offset)
    .limit(pageSize);

    console.log("result", result);
 

  const totalCount = await db
    .select({ count: count() })
    .from(merchants)
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
    })
  ),
    totalCount,
    active_count: result.filter(m => m.active).length,
    inactive_count: result.filter(m => !m.active).length,
    pending_kyc_count: result.filter(m => m.kic_status === "PENDING").length,
    approved_kyc_count: result.filter(m => m.kic_status === "APPROVED").length,
    rejected_kyc_count: result.filter(m => m.kic_status === "REJECTED").length,
    cp_anticipation_count: result.filter(m => !m.lockCpAnticipationOrder).length,
    cnp_anticipation_count: result.filter(m => !m.lockCnpAnticipationOrder).length,
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
  legalNaturesname?:typeof legalNatures.$inferSelect;
  salesAgent?:typeof salesAgents.$inferSelect;
  configuration?:typeof configurations.$inferSelect;
  contacts?:typeof contacts.$inferSelect;
  
};



export async function getMerchantById(id: number) {
 


    const result = await db
      .select({
       merchants: {...getTableColumns(merchants)},
       categories: {...getTableColumns(categories)},
       addresses: {...getTableColumns(addresses)},
       configurations: {...getTableColumns(configurations)},
       salesAgents: {...getTableColumns(salesAgents)},
       legalNatures: {...getTableColumns(legalNatures)},
       contacts: {...getTableColumns(contacts)},
       pixaccounts: {...getTableColumns(merchantpixaccount)},

      })
      .from(merchants)
      .where(eq(merchants.id, Number(id)))
      .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
      .leftJoin(categories, eq(merchants.idCategory, categories.id))
      .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
      .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
      .leftJoin(legalNatures, eq(merchants.idLegalNature, legalNatures.id))
      .leftJoin(contacts, eq(merchants.id, contacts.idMerchant))
      .leftJoin(merchantpixaccount, eq(merchants.id, merchantpixaccount.idMerchant))
      .limit(1);

    console.log(result)

    const merchant = result[0];

    return merchant;
    };
  


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
        [columnName]: value
       
      })
      .where(eq(merchants.slug, slug));

    console.log(`Coluna ${columnName} atualizada com sucesso para o slug ${slug}`);
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
    await db
      .update(merchants)
      .set({
        ...updates,
        dtupdate: new Date().toISOString(),
      })
      .where(eq(merchants.id, id));

    console.log(`Colunas atualizadas com sucesso para o ID ${id}`);
  } catch (error) {
    console.error(
      `Erro ao atualizar colunas para o ID ${id}:`,
      error
    );
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
        eq(addresses.streetAddress, address.streetAddress ?? ''),
        eq(addresses.streetNumber, address.streetNumber ?? ''),
        eq(addresses.neighborhood, address.neighborhood ?? ''),
        eq(addresses.city, address.city ?? ''),
        eq(addresses.state, address.state ?? ''),
        eq(addresses.zipCode, address.zipCode ?? '')
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
      code: legalNatures.code
    })
    .from(legalNatures)
    .orderBy(legalNatures.name);
  return result.map(item => ({
    id: item.id,
    name: item.name,
    code: item.code,
    slug: null,
    active: null, 
    dtinsert: null,
    dtupdate: null
  }));
}
export type LegalNatureDropdown = {
  value: number;
  label: string;
}

export type EstablishmentFormatDropdown = {
  value: string;
  label: string;
}

export async function getEstablishmentFormatForDropdown(): Promise<EstablishmentFormatDropdown[]> {
  const result = await db
    .select({
      value: establishmentFormat.code,
      label: establishmentFormat.name,
    })
    .from(establishmentFormat)
    .orderBy(establishmentFormat.code);

  return result.map(item => ({
    value: item.value,
    label: item.label ?? ''
  }));
}

export async function getLegalNaturesForDropdown(): Promise<LegalNatureDropdown[]> {
  const result = await db
    .select({
      value: legalNatures.id,
      label: legalNatures.name,
    })
    .from(legalNatures)
    .orderBy(legalNatures.id);

    return result.map(item => ({
      value: item.value,
      label: item.label ?? '' // Fornece um valor padrão caso seja null
    }))
    
  }

  export type CnaeMccDropdown = {
    value: string;
    label: string;
    cnae: string;
    mcc: string;
  }

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
  
      return result.map(item => ({
        value: item.value.toString(),
        label: `${item.cnae} - ${item.label}`,
        cnae: item.cnae || '',
        mcc: item.mcc || ''
      }));
    } catch (error) {
      console.error('Error fetching CNAE/MCC:', error);
      return [];
    }
  }

export type MerchantList = {
  totalCount: number
  activeCount: number
  inactiveCount: number
  pendingKycCount: number
  approvedKycCount: number
  rejectedKycCount: number
  cpAnticipationCount: number
  cnpAnticipationCount: number
  // ... any other existing properties ...
}