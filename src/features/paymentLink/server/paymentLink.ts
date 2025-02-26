"use server";

import { db } from "@/server/db";
import { count, eq, ilike, or } from "drizzle-orm";
import { merchants, paymentLink } from "../../../../drizzle/schema";

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

export async function getPaymentLinks(
  search: string,
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
      or(
        ilike(paymentLink.linkName, `%${search}%`),
        ilike(merchants.name, `%${search}%`)
      )
    )
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(paymentLink)
    .leftJoin(merchants, eq(paymentLink.idMerchant, merchants.id))
    .where(
      or(
        ilike(paymentLink.linkName, `%${search}%`),
        ilike(merchants.name, `%${search}%`)
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
): Promise<PaymentLinkDetail | null> {
  const result = await db
    .select()
    .from(paymentLink)
    .where(eq(paymentLink.id, id));

  return result[0] || null;
}

export async function insertPaymentLink(paymentLinks: PaymentLinkInsert) {
  const result = await db
    .insert(paymentLink)
    .values(paymentLinks)
    .returning({ id: paymentLink.id });

  return result[0].id;
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
