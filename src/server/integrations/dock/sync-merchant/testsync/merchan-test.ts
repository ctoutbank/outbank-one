"use server";

import { sql } from "drizzle-orm";
import { Merchant } from "../types";
import { getOrCreateLegalNature } from "./legalNature-test";
import { db } from "@/server/db";
import { merchants } from "../../../../../../drizzle/schema";
import { getIdBySlug } from "../getslug";



export async function insertMerchantAndRelationss(merchant: Merchant) {
  console.log("Inserting merchant:", merchant);
  try {
   
    
    const legalnatureslug = merchant.legalNature
      ? await getOrCreateLegalNature(merchant.legalNature)
      : null;
    console.log("legalnatureslug", legalnatureslug);

    const legalNatureId = merchant.legalNature
      ? await getIdBySlug("legal_natures", merchant.legalNature.slug)
      : null;
    console.log("legalNatureId", legalNatureId);
    
    // Inserir o merchant com os IDs e slugs obtidos
    await insertMerchant(
      merchant,
      
      legalNatureId
      
  );
    
  } catch (error) {
    console.error(`Erro ao processar merchant ${merchant.slug}:`, error);
  }
}

async function insertMerchant(
  merchant: Merchant,
 
  legalNatureId: number | null,
  
) {
  try {
    // Verificar se o merchant já existe
    const existingMerchant = await db
      .select({ slug: merchants.slug })
      .from(merchants)
      .where(sql`${merchants.slug} = ${merchant.slug}`);

    if (existingMerchant.length > 0) {
      console.log(`Merchant ${merchant.slug} já existe, pulando inserção.`);
      return;
    }

    console.log("Inserting merchant:", merchant);

    const DtInsert = merchant.dtInsert ? new Date(merchant.dtInsert).toISOString() : null;
    const DtUpdate = merchant.dtUpdate ? new Date(merchant.dtUpdate).toISOString() : null;

    await db.insert(merchants).values({
      slug: merchant.slug || null,
      active: merchant.active,
      dtinsert: DtInsert,
      dtupdate: DtUpdate,
      idMerchant: merchant.merchantId,
      name: merchant.name,
      idDocument: merchant.documentId,
      corporateName: merchant.corporateName || null,
      email: merchant.email || null,
      areaCode: merchant.areaCode || null,
      number: merchant.number || null,
      phoneType: merchant.phoneType || null,
      language: merchant.language || null,
      timezone: merchant.timezone || null,
      slugCustomer: merchant.slugCustomer || null,
      riskAnalysisStatus: merchant.riskAnalysisStatus || null,
      riskAnalysisStatusJustification: merchant.riskAnalysisStatusJustification || null,
      legalPerson: merchant.legalPerson || null,
      openingDate: merchant.openingDate ? new Date(merchant.openingDate).toISOString() : null, // Corrigido
      inclusion: merchant.inclusion || null,
      openingDays: merchant.openingDays || null,
      openingHour: merchant.openingHour || null,
      closingHour: merchant.closingHour || null,
      municipalRegistration: merchant.municipalRegistration || null,
      stateSubcription: merchant.stateSubcription || null,
      hasTef: merchant.hasTef,
      hasPix: merchant.hasPix,
      hasTop: merchant.hasTop,
      establishmentFormat: merchant.establishmentFormat || null,
      revenue: merchant.revenue?.toString() || null,
      idCategory: null,
      slugCategory: null,
      idLegalNature: legalNatureId,
      slugLegalNature: merchant.legalNature?.slug || null,
      idSalesAgent: null,
      slugSalesAgent: null,
      idConfiguration: null,
      slugConfiguration: null,
      idAddress: null
    });


    console.log("Merchant inserted successfully.");
  } catch (error) {
    console.error("Error inserting merchant:", error);
  }
}
