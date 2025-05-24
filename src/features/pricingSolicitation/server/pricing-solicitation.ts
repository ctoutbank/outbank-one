"use server";
import { generateSlug } from "@/lib/utils";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, count, desc, eq, sql } from "drizzle-orm";
import {
  customers,
  solicitationBrandProductType,
  solicitationFee,
  solicitationFeeBrand,
  users,
} from "../../../../drizzle/schema";
import { PricingSolicitationSchema } from "../schema/schema";

export interface DDMerchant {
  id: number;
  name: string;
}

export interface PricingSolicitationList {
  pricingSolicitations: {
    id: number | null;
    cnae: string | null;
    status: string | null;
    dtinsert?: string | null;
  }[];
  totalCount: number | null;
}

export type PricingSolicitationInsert = typeof solicitationFee.$inferInsert;
export type PricingSolicitationDetail = typeof solicitationFee.$inferSelect & {
  eventualAnticipationFee?: string | null;
  nonCardEventualAnticipationFee?: string | null;
};

export interface ProductType {
  name: string;
  fee: number;
  feeAdmin: number;
  feeDock: number;
  transactionFeeStart: number;
  transactionFeeEnd: number;
  pixMinimumCostFee: number;
  pixCeilingFee: number;
  transactionAnticipationMdr: number;
  noCardFee: number;
  noCardTransactionAnticipationMdr: number;
  noCardFeeAdmin: number;
  noCardFeeDock: number;
}

export interface Brand {
  name: string;
  productTypes?: ProductType[];
}

export interface PricingSolicitationForm extends PricingSolicitationDetail {
  brands?: Brand[];
}

export async function getPricingSolicitations(
  cnae: string,
  status: string,
  page: number,
  pageSize: number
): Promise<PricingSolicitationList | null> {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const conditions = [];

  if (cnae) {
    conditions.push(eq(solicitationFee.cnae, cnae));
  }
  if (status) {
    conditions.push(eq(solicitationFee.status, status));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const pricingSolicitations = await db
    .select({
      id: solicitationFee.id,
      cnae: solicitationFee.cnae,
      status: solicitationFee.status,
      dtinsert: solicitationFee.dtinsert,
    })
    .from(solicitationFee)
    .where(where)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(solicitationFee.id));

  const totalCount = await db
    .select({ count: count() })
    .from(solicitationFee)
    .where(where);
  return {
    pricingSolicitations,
    totalCount: totalCount[0].count,
  };
}

export async function getPricingSolicitationById(
  id: number
): Promise<PricingSolicitationForm | null> {
  console.log("getPricingSolicitationById", id);
  const pricingSolicitation = await db.execute(sql`
    SELECT 
      sf.id,
      sf.cnae,
      sf.mcc,
      sf.cnpj_quantity as "cnpjQuantity",
      sf.status,
      sf.dtinsert,
      sf.dtupdate,
      sf.slug,
      sf.id_customers as "idCustomers",
      sf.monthly_pos_fee as "monthlyPosFee",
      sf.average_ticket as "averageTicket",
      sf.description,
      sf.cnae_in_use as "cnaeInUse",
      sf.card_pix_mdr as "cardPixMdr",
      sf.card_pix_ceiling_fee as "cardPixCeilingFee",
      sf.card_pix_minimum_cost_fee as "cardPixMinimumCostFee",
      sf.eventual_anticipation_fee as "eventualAnticipationFee",
      sf.non_card_pix_mdr as "nonCardPixMdr",
      sf.non_card_pix_ceiling_fee as "nonCardPixCeilingFee",
      sf.non_card_pix_minimum_cost_fee as "nonCardPixMinimumCostFee",
      json_agg(
        json_build_object(
          'name', sfb.brand,
          'productTypes', (
            SELECT json_agg(
              json_build_object(
                'name', sbpt.product_type,
                'fee', sbpt.fee,
                'feeAdmin', sbpt.fee_admin,
                'feeDock', sbpt.fee_dock,
                'transactionFeeStart', sbpt.transaction_fee_start,
                'transactionFeeEnd', sbpt.transaction_fee_end,
                'noCardFee', sbpt.no_card_fee,
                'noCardFeeAdmin', sbpt.no_card_fee_admin,
                'noCardFeeDock', sbpt.no_card_fee_dock,
                'noCardTransactionAnticipationMdr', sbpt.no_card_transaction_anticipation_mdr,
                'transactionAnticipationMdr', sbpt.transaction_anticipation_mdr
              )
            )
            FROM ${solicitationBrandProductType} sbpt
            WHERE sbpt.solicitation_fee_brand_id = sfb.id
          )
        )
      ) as brands
    FROM ${solicitationFee} sf
    LEFT JOIN ${solicitationFeeBrand} sfb ON sf.id = sfb.solicitation_fee_id
    WHERE sf.id = ${id}
    GROUP BY sf.id
  `);

  console.log("pricingSolicitation", pricingSolicitation);

  return pricingSolicitation.rows[0] as unknown as PricingSolicitationForm;
}

export async function insertPricingSolicitation(
  pricingSolicitation: PricingSolicitationForm
) {
  const user = await currentUser();

  const userDB = await db
    .select({ customersId: users.idCustomer })
    .from(users)
    .where(eq(users.idClerk, user?.id || ""));

  const customerId = await db
    .select({ id: customers.id })
    .from(customers)
    .where(eq(customers.id, userDB[0].customersId || 0));

  pricingSolicitation.slug = generateSlug();
  pricingSolicitation.idCustomers = customerId[0].id || null;

  try {
    // 1. Create the main solicitation fee record
    const { brands, ...solicitationData } = pricingSolicitation;

    // Remove the id field to let the database auto-generate it
    const { ...dataToInsert } = solicitationData;

    const [newSolicitation] = await db
      .insert(solicitationFee)
      .values(dataToInsert)
      .returning({ id: solicitationFee.id });

    if (!newSolicitation) {
      throw new Error("Failed to create pricing solicitation");
    }

    // 2. Create brand records for each brand
    for (const brand of brands || []) {
      const [newBrand] = await db
        .insert(solicitationFeeBrand)
        .values({
          slug: generateSlug(),
          solicitationFeeId: newSolicitation.id,
          brand: brand.name,
          dtinsert: new Date().toISOString(),
          dtupdate: new Date().toISOString(),
        })
        .returning({ id: solicitationFeeBrand.id });

      if (!newBrand) continue;

      // 3. Create product type records for each product type in the brand
      for (const productType of brand.productTypes || []) {
        // Use the same field names as defined in the schema
        await db.insert(solicitationBrandProductType).values({
          slug: generateSlug(),
          solicitationFeeBrandId: newBrand.id,
          productType: productType.name,
          fee: sql`${productType.fee}::numeric`,
          feeAdmin: sql`${productType.feeAdmin}::numeric`,
          feeDock: sql`${productType.feeDock}::numeric`,
          transactionFeeStart: sql`${productType.transactionFeeStart}::integer`,
          transactionFeeEnd: sql`${productType.transactionFeeEnd}::integer`,
          noCardFee: sql`${productType.noCardFee}::numeric`,
          noCardFeeAdmin: sql`${productType.noCardFeeAdmin}::numeric`,
          noCardFeeDock: sql`${productType.noCardFeeDock}::numeric`,
          noCardTransactionAnticipationMdr: sql`${productType.noCardTransactionAnticipationMdr}::numeric`,
          transactionAnticipationMdr: sql`${productType.transactionAnticipationMdr}::numeric`,
          dtinsert: new Date().toISOString(),
          dtupdate: new Date().toISOString(),
        });
      }
    }

    return newSolicitation;
  } catch (error) {
    console.error("Error creating pricing solicitation:", error);
    throw error;
  }
}

export async function updatePricingSolicitation(
  pricingSolicitation: PricingSolicitationForm
) {
  if (!pricingSolicitation.id) {
    throw new Error("Solicitation ID is required for updates");
  }

  // Update the last modified date
  pricingSolicitation.dtupdate = new Date().toISOString();

  try {
    const { brands, ...solicitationData } = pricingSolicitation;

    // 1. Update the main solicitation fee record
    await db
      .update(solicitationFee)
      .set(solicitationData)
      .where(eq(solicitationFee.id, pricingSolicitation.id));

    // 2. Delete existing brand records and product types (we'll recreate them)
    const existingBrands = await db
      .select({ id: solicitationFeeBrand.id })
      .from(solicitationFeeBrand)
      .where(
        eq(solicitationFeeBrand.solicitationFeeId, pricingSolicitation.id)
      );

    for (const brand of existingBrands) {
      // Delete product types first (due to foreign key constraints)
      await db
        .delete(solicitationBrandProductType)
        .where(
          eq(solicitationBrandProductType.solicitationFeeBrandId, brand.id)
        );
    }

    // Delete the brands
    await db
      .delete(solicitationFeeBrand)
      .where(
        eq(solicitationFeeBrand.solicitationFeeId, pricingSolicitation.id)
      );

    // 3. Create new brand records for each brand
    for (const brand of brands || []) {
      // Create a brand record with only the necessary fields
      const brandData = {
        slug: generateSlug(),
        solicitationFeeId: pricingSolicitation.id,
        brand: brand.name,
        dtinsert: new Date().toISOString(),
        dtupdate: new Date().toISOString(),
      };

      const [newBrand] = await db
        .insert(solicitationFeeBrand)
        .values(brandData)
        .returning({ id: solicitationFeeBrand.id });

      if (!newBrand) continue;

      // 4. Create product type records for each product type in the brand
      for (const productType of brand.productTypes || []) {
        // Create a product type record with only the necessary fields
        const productTypeData = {
          slug: generateSlug(),
          solicitationFeeBrandId: newBrand.id,
          productType: productType.name,
          fee: sql`${productType.fee}::numeric`,
          feeAdmin: sql`${productType.feeAdmin}::numeric`,
          feeDock: sql`${productType.feeDock}::numeric`,
          transactionFeeStart: sql`${productType.transactionFeeStart}::integer`,
          transactionFeeEnd: sql`${productType.transactionFeeEnd}::integer`,
          noCardFee: sql`${productType.noCardFee}::numeric`,
          noCardFeeAdmin: sql`${productType.noCardFeeAdmin}::numeric`,
          noCardFeeDock: sql`${productType.noCardFeeDock}::numeric`,
          noCardTransactionAnticipationMdr: sql`${productType.noCardTransactionAnticipationMdr}::numeric`,
          transactionAnticipationMdr: sql`${productType.transactionAnticipationMdr}::numeric`,
          dtinsert: new Date().toISOString(),
          dtupdate: new Date().toISOString(),
        };

        await db.insert(solicitationBrandProductType).values(productTypeData);
      }
    }

    return { id: pricingSolicitation.id };
  } catch (error) {
    console.error("Error updating pricing solicitation:", error);
    throw error;
  }
}

// Função para aprovar uma solicitação de taxas
export async function approvePricingSolicitation(id: number) {
  if (!id) {
    throw new Error("Solicitation ID is required for approval");
  }

  try {
    await db
      .update(solicitationFee)
      .set({
        status: "APPROVED",
        dtupdate: new Date().toISOString(),
      })
      .where(eq(solicitationFee.id, id));

    return { id, success: true };
  } catch (error) {
    console.error("Error approving pricing solicitation:", error);
    throw error;
  }
}

// Função para rejeitar uma solicitação de taxas
export async function rejectPricingSolicitation(id: number, reason?: string) {
  if (!id) {
    throw new Error("Solicitation ID is required for rejection");
  }

  try {
    await db
      .update(solicitationFee)
      .set({
        status: "CANCELED",
        description: reason ? `CANCELED: ${reason}` : "CANCELED",
        dtupdate: new Date().toISOString(),
      })
      .where(eq(solicitationFee.id, id));

    return { id, success: true };
  } catch (error) {
    console.error("Error rejecting pricing solicitation:", error);
    throw error;
  }
}

// Map form data to solicitation structure
export async function mapFormDataToSolicitation(
  data: PricingSolicitationSchema
) {
  return {
    cnae: data.cnae || null,
    mcc: data.mcc || null,
    cnpjQuantity: data.cnpjsQuantity ? Number(data.cnpjsQuantity) : null,
    slug: null,
    dtinsert: new Date().toISOString(),
    dtupdate: new Date().toISOString(),
    idCustomers: null,
    monthlyPosFee: data.tpvMonthly || null,
    averageTicket: data.ticketAverage || null,
    description: data.description || null,
    cnaeInUse: data.cnaeInUse ?? null,
    cardPixMdr: data.cardPixMdr || null,
    cardPixCeilingFee: data.cardPixCeilingFee || null,
    cardPixMinimumCostFee: data.cardPixMinimumCostFee || null,
    eventualAnticipationFee: data.eventualAnticipationFee || null,
    nonCardPixMdr: data.nonCardPixMdr || null,
    nonCardPixCeilingFee: data.nonCardPixCeilingFee || null,
    nonCardPixMinimumCostFee: data.nonCardPixMinimumCostFee || null,

    brands: (data.brands || []).map((brand) => ({
      name: brand.name,
      productTypes: (brand.productTypes || []).map((productType) => ({
        name: productType.name,
        fee: productType.fee || "",
        feeAdmin: productType.feeAdmin || "",
        feeDock: productType.feeDock || "",
        transactionFeeStart: productType.transactionFeeStart || "",
        transactionFeeEnd: productType.transactionFeeEnd || "",
      })),
    })),
  };
}
