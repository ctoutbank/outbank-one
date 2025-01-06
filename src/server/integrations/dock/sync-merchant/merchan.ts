"use server";
import { insertAddress } from "./address";
import { getOrCreateCategory } from "./category";
import { getOrCreateCofiguration } from "./configuration";
import { insertContact } from "./contact";
import pool from "./db";
import { getIdBySlug } from "./getslug";
import { getOrCreateLegalNature } from "./legalNature";
import { insertmerchantPixAccount } from "./merchantPixAccount";
import { getOrCreateSaleAgent } from "./salesAgent";
import { Merchantdock } from "./types";

export async function insertMerchantAndRelations(merchant: Merchantdock) {
  console.log("Inserting merchant:", merchant);
  try {
    // Obter slugs das tabelas relacionadas
    const categoryslug = merchant.category
      ? await getOrCreateCategory (merchant.category)
      : null;
    console.log("categoryslug", categoryslug);
    const legalnatureslug = merchant.legalNature
      ? await getOrCreateLegalNature(merchant.legalNature)
      : null;
    console.log("legalnatureslug", legalnatureslug);
    const saleagentslug = merchant.saleAgent
      ? await getOrCreateSaleAgent(merchant.saleAgent)
      : null;
    console.log("saleagentslug", saleagentslug);
    const configurationslug = merchant.configuration
      ? await getOrCreateCofiguration(merchant.configuration)
      : null;
    console.log("configurationslug", configurationslug);
    const addressId = merchant.address
      ? await insertAddress(merchant.address)
      : null;
    console.log("addressId", addressId);
    // Obter IDs das tabelas relacionadas
    const categoryId = merchant.category
      ? await getIdBySlug("categories", merchant.category.slug)
      : null;
    console.log("categoryId", categoryId);
    const legalNatureId = merchant.legalNature
      ? await getIdBySlug("legal_natures", merchant.legalNature.slug)
      : null;
    console.log("legalNatureId", legalNatureId);
    const saleAgentId = merchant.saleAgent
      ? await getIdBySlug("sales_agents", merchant.saleAgent.slug)
      : null;
    console.log("saleAgentId", saleAgentId);
    const configurationId = merchant.configuration
      ? await getIdBySlug("configurations", merchant.configuration.slug)
      : null;
    console.log("configurationId", configurationId);
    // Inserir o merchant com os IDs e slugs obtidos
    await insertMerchant(
      merchant,
      addressId || null,
      categoryslug || null,
      configurationslug || null,
      legalnatureslug || null,
      saleagentslug || null,
      categoryId || null,
      legalNatureId || null,
      saleAgentId || null,
      configurationId || null
    );
    console.log("Merchant inserted successfully.");
    //inserir contatos
    if (merchant.contacts) {
      for (const contact of merchant.contacts) {
        console.log("inserting contacts", contact);
        await insertContact(contact, merchant, contact.address);
      }
    }
    if (merchant.merchantPixAccount) {
      await insertmerchantPixAccount(merchant.merchantPixAccount, merchant);
    }
  } catch (error) {
    console.error(`Erro ao processar merchant ${merchant.slug}:`, error);
  }
}

async function insertMerchant(
  merchant: Merchantdock,
  addressId: number | null,
  categoryslug: string | null,
  configurationslug: string | null,
  legalnatureslug: string | null,
  saleagentslug: string | null,
  categoryId: number | null,
  legalNatureId: number | null,
  saleAgentId: number | null,
  configurationId: number | null
) {
  try {
    console.log("Inserting merchant:", merchant);

    const dtInsert = merchant.dtInsert ? new Date(merchant.dtInsert) : null;
    const dtUpdate = merchant.dtUpdate ? new Date(merchant.dtUpdate) : null;

    await pool.query(
      `INSERT INTO merchants (
            slug, active, dtinsert, dtupdate, id_merchant, name, id_document,
            corporate_name, email, area_code, number, phone_type, language, timezone,
            risk_analysis_status, risk_analysis_status_justification, legal_person,
            opening_date, inclusion, opening_days, opening_hour, closing_hour,
            municipal_registration, state_subcription, has_tef, has_pix, has_top,
            establishment_format, revenue, id_address,  slug_sales_agent, 
            slug_configuration, slug_category, slug_legal_nature, id_category, 
            id_legal_nature, id_sales_agent, id_configuration
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12, $13, $14,
            $15, $16, $17, $18, $19, $20, $21, $22,
            $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35,
            $36, $37, $38
          )
          `,
      [
        merchant.slug,
        merchant.active,
        dtInsert,
        dtUpdate,
        merchant.merchantId,
        merchant.name,
        merchant.documentId,
        merchant.corporateName,
        merchant.email,
        merchant.areaCode,
        merchant.number,
        merchant.phoneType,
        merchant.language,
        merchant.timezone,
        merchant.riskAnalysisStatus,
        merchant.riskAnalysisStatusJustification,
        merchant.legalPerson,
        merchant.openingDate ? new Date(merchant.openingDate) : null,
        merchant.inclusion,
        merchant.openingDays,
        merchant.openingHour,
        merchant.closingHour,
        merchant.municipalRegistration || null,
        merchant.stateSubcription || null,
        merchant.hasTef,
        merchant.hasPix,
        merchant.hasTop,
        merchant.establishmentFormat,
        merchant.revenue,
        addressId,
        saleagentslug,
        configurationslug,
        categoryslug,
        legalnatureslug,
        categoryId,
        legalNatureId,
        saleAgentId,
        configurationId,
      ]
    );

    console.log("Merchant inserted successfully.");
  } catch (error) {
    console.error("Error inserting merchant:", error);
  }
}
