"use server";

import { generateSlug } from "@/lib/utils";
import { db } from "@/server/db";
import { and, count, eq, ilike, sql } from "drizzle-orm";
import {
  merchants,
  paymentLink,
  shoppingItems,
} from "../../../../drizzle/schema";

export interface PaymentLinkList {
  linksObject: {
    id: number;
    name: string | null;
    expiresAt: string;
    merchantName: string;
    link: string;
    paymentType: string;
    totalAmount: string;
    status: string;
    dtinsert: string;
  }[];
  totalCount: number;
}

export interface DDMerchant {
  id: number;
  name: string;
}

export type PaymentLinkInsert = typeof paymentLink.$inferInsert;
export type PaymentLinkDetail = typeof paymentLink.$inferSelect;
export interface PaymentLinkDetailForm extends PaymentLinkDetail {
  expiresAt?: string;
  diffNumber?: string;
  shoppingItems: ShoppingItems[];
}

export interface ShoppingItems {
  slug?: string;
  name: string;
  quantity: number;
  amount: string;
  idPaymentLink: number;
}

export interface PaymentLinkDetailInsert extends PaymentLinkInsert {
  shoppingItems: ShoppingItems[];
}

export interface PaymentLinkById extends PaymentLinkDetail {
  shoppingItems: ShoppingItems[];
}

export async function getPaymentLinks(
  merchant: string,
  identifier: string,
  status: string,
  page: number,
  pageSize: number
): Promise<PaymentLinkList> {
  const offset = (page - 1) * pageSize;

  const result = await db
    .select({
      id: paymentLink.id,
      name: paymentLink.linkName,
      expiresAt: paymentLink.dtExpiration,
      merchantName: merchants.name,
      link: paymentLink.linkUrl,
      paymentType: paymentLink.productType,
      totalAmount: paymentLink.totalAmount,
      status: paymentLink.paymentLinkStatus,
      dtinsert: paymentLink.dtinsert,
    })
    .from(paymentLink)
    .leftJoin(merchants, eq(paymentLink.idMerchant, merchants.id))
    .where(
      and(
        ilike(paymentLink.linkName, `%${identifier}%`),
        ilike(merchants.name, `%${merchant}%`),
        status == "" ? undefined : eq(paymentLink.paymentLinkStatus, status)
      )
    )
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(paymentLink)
    .leftJoin(merchants, eq(paymentLink.idMerchant, merchants.id))
    .where(
      and(
        ilike(paymentLink.linkName, `%${identifier}%`),
        ilike(merchants.name, `%${merchant}%`),
        status == "" ? undefined : eq(paymentLink.paymentLinkStatus, status)
      )
    );
  const totalCount = totalCountResult[0]?.count || 0;

  return {
    linksObject: result.map((link) => ({
      id: link.id,
      name: link.name,
      expiresAt: link.expiresAt ?? "",
      merchantName: link.merchantName ?? "",
      link: link.link ?? "",
      paymentType: link.paymentType ?? "",
      totalAmount: link.totalAmount ?? "0",
      status: link.status ?? "",
      dtinsert: link.dtinsert ?? "",
    })),
    totalCount,
  };
}

export async function getPaymentLinkById(
  id: number
): Promise<PaymentLinkById | null> {
  const result = await db.execute(sql`
    SELECT 
      p.id,
      p.slug,
      p.active,
      p.dtinsert,
      p.dtupdate,
      p.link_name as "linkName",
      p.dt_expiration as "dtExpiration",
      p.total_amount as "totalAmount",
      p.id_merchant as "idMerchant",
      p.payment_link_status as "paymentLinkStatus",
      p.product_type as "productType",
      p.installments as "installments",
      p.link_url as "linkUrl",    
      COALESCE(
        JSON_AGG(s.*) FILTER (WHERE s.id IS NOT NULL),
        '[]'
      ) AS "shoppingItems"
    FROM payment_link p
    LEFT JOIN shopping_items s ON s.id_payment_link = p.id
    WHERE p.id = ${id}
    GROUP BY p.id
  `);

  return (result.rows[0] as unknown as PaymentLinkById) || null;
}

export async function insertPaymentLink(paymentLinks: PaymentLinkDetailInsert) {
  const paymentLinkIn: PaymentLinkInsert = {
    slug: generateSlug(),
    linkName: paymentLinks.linkName,
    paymentLinkStatus: "PENDING",
    idMerchant: paymentLinks.idMerchant,
    dtinsert: new Date().toISOString(),
    dtupdate: new Date().toISOString(),
    totalAmount: paymentLinks.totalAmount,
    dtExpiration: paymentLinks.dtExpiration,
    installments: paymentLinks.installments,
    active: true,
    linkUrl: paymentLinks.linkUrl,
    pixEnabled: paymentLinks.pixEnabled,
    productType: paymentLinks.productType,
    transactionSlug: paymentLinks.transactionSlug,
  };

  const resultPaymentLink = await db
    .insert(paymentLink)
    .values(paymentLinkIn)
    .returning({ id: paymentLink.id });

  if (!paymentLinks.shoppingItems || paymentLinks.shoppingItems.length === 0) {
    return resultPaymentLink[0].id;
  }

  const varShoppingItems: ShoppingItems[] = paymentLinks.shoppingItems.map(
    (item) => ({
      slug: generateSlug(),
      name: item.name,
      quantity: item.quantity,
      amount: item.amount,
      idPaymentLink: resultPaymentLink[0].id,
    })
  );

  await db.insert(shoppingItems).values(varShoppingItems);

  return resultPaymentLink[0].id;
}

export async function updatePaymentLink(
  paymentLinks: PaymentLinkDetail
): Promise<void> {
  await db
    .update(paymentLink)
    .set({
      linkName: paymentLinks.linkName,
      linkUrl: paymentLinks.linkUrl,
      productType: paymentLinks.productType,
      totalAmount: paymentLinks.totalAmount,
      paymentLinkStatus: paymentLinks.paymentLinkStatus,
      dtExpiration: paymentLinks.dtExpiration,
      dtupdate: new Date().toISOString(),
    })
    .where(eq(paymentLink.id, paymentLinks.id));
}

export async function deletePaymentLink(id: number): Promise<void> {
  await db.delete(paymentLink).where(eq(paymentLink.id, id));
}

export async function getMerchants(): Promise<DDMerchant[]> {
  const result = await db.select().from(merchants);
  return result.map((merchant) => ({
    id: merchant.id,
    name: merchant.name ?? "",
  }));
}
