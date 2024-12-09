
import { db } from "./index";
import { addresses, merchants } from "../../../drizzle/schema";
import { count,desc,eq } from "drizzle-orm";




export interface Merchantlist  {
  merchants: {
    id: bigint;
    slug: string;
    active: boolean;
    name: string;
    email: string;
    phone_type: string;
    revenue: number;
    id_category: number;
    kic_status: string;
    addressname: string;
  }[];
  totalCount: number;
};



export async function getMerchants(page: number = 1, limit: number = 50): Promise<Merchantlist> {
  const offset = (page - 1) * limit;

  const result = await db
    .select({
      id: merchants.id,
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
    })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id)) 
    .orderBy(desc(merchants.dtinsert))
    .offset(offset)
    .limit(limit);

  const totalCount = await db
    .select({ count: count() })
    .from(merchants)
    .then((res) => res[0]?.count || 0);

  return {
    merchants: result.map((merchant) => ({
      id: BigInt(merchant.id),
      slug: merchant.slug ?? "N/A",
      active: merchant.active ?? false,
      name: merchant.name ?? "Não informado",
      email: merchant.email ?? "N/A",
      phone_type: merchant.phone_type ?? "N/A",
      revenue: typeof merchant.revenue === 'string' ? parseFloat(merchant.revenue) : merchant.revenue ?? 0,
      id_category: merchant.id_category ?? 0,
      kic_status: merchant.kic_status ?? "N/A",
      corporate_name: merchant.corporate_name ?? "Não informado",
      risk_analysis_status: merchant.risk_analysis_status ?? "Indefinido",
      addressname: merchant.addressname ?? "Não informado",
      dtinsert: merchant.dtinsert ? merchant.dtinsert.toString() : "N/A",
    })),
    totalCount,
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
}


export async function getMerchantById(id: bigint): Promise<Merchant | null> {
  const result = await db
    .select({
      id: merchants.id,
      slug: merchants.slug,
      active: merchants.active,
      dtinsert: merchants.dtinsert,
      dtupdate: merchants.dtupdate,
      id_merchant: merchants.idMerchant,
      name: merchants.name,
      id_document: merchants.idDocument,
      corporate_name: merchants.corporateName,
      email: merchants.email,
      area_code: merchants.areaCode,
      number: merchants.number,
      phone_type: merchants.phoneType,
      language: merchants.language,
      timezone: merchants.timezone,
      slug_customer: merchants.slugCustomer,
      risk_analysis_status: merchants.riskAnalysisStatus,
      risk_analysis_status_justification: merchants.riskAnalysisStatusJustification,
      legal_person: merchants.legalPerson,
      opening_date: merchants.openingDate,
      inclusion: merchants.inclusion,
      opening_days: merchants.openingDays,
      opening_hour: merchants.openingHour,
      closing_hour: merchants.closingHour,
      municipal_registration: merchants.municipalRegistration,
      state_subcription: merchants.stateSubcription,
      has_tef: merchants.hasTef,
      has_pix: merchants.hasPix,
      has_top: merchants.hasTop,
      establishment_format: merchants.establishmentFormat,
      revenue: merchants.revenue,
      id_category: merchants.idCategory,
      slug_category: merchants.slugCategory,
      id_legal_nature: merchants.idLegalNature,
      slug_legal_nature: merchants.slugLegalNature,
      id_sales_agent: merchants.idSalesAgent,
      slug_sales_agent: merchants.slugSalesAgent,
      id_configuration: merchants.idConfiguration,
      slug_configuration: merchants.slugConfiguration,
      id_address: merchants.idAddress,
    })
    .from(merchants)
    .where(eq(merchants.id, Number(id)))
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
      .limit(1);
  
    if (result.length === 0) {
      return null;
    }
  
    const merchant = result[0];

  if (!result) {
    return null;
  }

  return {
    id: BigInt(merchant.id),
    slug: merchant.slug ?? "N/A",
    active: merchant.active ?? false,
    dtinsert: typeof merchant.dtinsert === 'string' ? new Date(merchant.dtinsert) : merchant.dtinsert ?? new Date(),
    dtupdate: typeof merchant.dtupdate === 'string' ? new Date(merchant.dtupdate) : merchant.dtupdate ?? new Date(),
    id_merchant: merchant.id_merchant ?? "N/A",
    name: merchant.name ?? "N/A",
    id_document: merchant.id_document ?? "N/A",
    corporate_name: merchant.corporate_name ?? "N/A",
    email: merchant.email ?? "N/A",
    area_code: merchant.area_code ?? "N/A",
    number: merchant.number ?? "N/A",
    phone_type: merchant.phone_type ?? "N/A",
    language: merchant.language ?? "N/A",
    timezone: merchant.timezone ?? "N/A",
    slug_customer: merchant.slug_customer ?? "N/A",
    risk_analysis_status: merchant.risk_analysis_status ?? "N/A",
    risk_analysis_status_justification: merchant.risk_analysis_status_justification ?? "N/A",
    legal_person: merchant.legal_person ?? "N/A",
    opening_date: typeof merchant.opening_date === 'string' ? new Date(merchant.opening_date) : merchant.opening_date ?? new Date(),
    inclusion: merchant.inclusion ?? "N/A",
    opening_days: merchant.opening_days ?? "N/A",
    opening_hour: merchant.opening_hour ?? "N/A",
    closing_hour: merchant.closing_hour ?? "N/A",
    municipal_registration: merchant.municipal_registration ?? "N/A",
    state_subcription: merchant.state_subcription ?? "N/A",
    has_tef: merchant.has_tef ?? false,
    has_pix: merchant.has_pix ?? false,
    has_top: merchant.has_top ?? false,
    establishment_format: merchant.establishment_format ?? "N/A",
    revenue: typeof merchant.revenue === 'string' ? parseFloat(merchant.revenue) : merchant.revenue ?? 0,
    id_category: merchant.id_category ?? 0,
    slug_category: merchant.slug_category ?? "N/A",
    id_legal_nature: merchant.id_legal_nature ?? 0,
    slug_legal_nature: merchant.slug_legal_nature ?? "N/A",
    id_sales_agent: merchant.id_sales_agent ?? 0,
    slug_sales_agent: merchant.slug_sales_agent ?? "N/A",
    id_configuration: merchant.id_configuration ?? 0,
    slug_configuration: merchant.slug_configuration ?? "N/A",
    id_address: merchant.id_address ?? 0,

  
}
}