"use server";

import { generateSlug } from "@/lib/utils";
import { db } from "@/server/db";
import { and, count, desc, eq, ilike, sql } from "drizzle-orm";
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
  shoppingItems?: ShoppingItems[] | undefined;
}

export interface ShoppingItems {
  slug?: string;
  name: string;
  quantity: number;
  amount: string;
  idPaymentLink?: number;
}

export interface PaymentLinkDetailInsert extends PaymentLinkInsert {
  shoppingItems?: ShoppingItems[];
}

export interface PaymentLinkById extends PaymentLinkDetail {
  shoppingItems: ShoppingItems[];
}

export interface ShoppingItemsUpdate extends ShoppingItems {
  wasModified: boolean;
}
export type ShoppingItem = {
  name: string;
  quantity: number;
  amount: string;
};

export type InsertPaymentLinkAPI = {
  linkName: string;
  totalAmount: string;
  documentId: string;
  dtExpiration: string;
  productType: string;
  installments: number;
  shoppingItems?: ShoppingItem[];
};

export type PaymentLink = {
  slug: string;
  active: boolean;
  dtInsert: string;
  dtUpdate: string;
  linkName: string;
  dtExpiration: string;
  totalAmount: string;
  slugMerchant: string;
  paymentLinkStatus: string;
  productType: string;
  installments: string;
  shoppingItems: ShoppingItem[];
  linkUrl: string;
  slugFinancialTransaction: string;
};

/*async function InsertAPIPaymentLink(data: InsertPaymentLinkAPI) {
  console.log("json", JSON.stringify(data));
  const response = await fetch(
    `https://serviceorder.acquiring.dock.tech/v1/external_payment_links`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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

  const responseData: PaymentLink = await response.json();

  return responseData;
}*/

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
    .orderBy(desc(paymentLink.id))
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
  console.log(offset, result);
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
  try {
    /*const merchant = await db
      .select({ idDocument: merchants.idDocument })
      .from(merchants)
      .where(eq(merchants.id, paymentLinks.idMerchant || 0));

    const insertAPI: InsertPaymentLinkAPI = {
      linkName: paymentLinks.linkName || "",
      totalAmount: paymentLinks.totalAmount || "0",
      documentId: merchant[0].idDocument || "",
      dtExpiration: paymentLinks.dtExpiration || "",
      installments: paymentLinks.installments || 0,
      productType: paymentLinks.productType || "",
      shoppingItems:
        paymentLinks.shoppingItems && paymentLinks.shoppingItems?.length > 0
          ? paymentLinks.shoppingItems
          : undefined,
    };

    await InsertAPIPaymentLink(insertAPI);*/

    const paymentLinkIn: PaymentLinkInsert = {
      slug: null,
      linkName: paymentLinks.linkName,
      paymentLinkStatus: null,
      idMerchant: paymentLinks.idMerchant,
      dtinsert: new Date().toISOString(),
      dtupdate: new Date().toISOString(),
      totalAmount: paymentLinks.totalAmount,
      dtExpiration: paymentLinks.dtExpiration,
      installments: paymentLinks.installments,
      active: true,
      linkUrl: null,
      pixEnabled: null,
      productType: paymentLinks.productType,
      transactionSlug: null,
    };

    const resultPaymentLink = await db
      .insert(paymentLink)
      .values(paymentLinkIn)
      .returning({ id: paymentLink.id });

    if (
      !paymentLinks.shoppingItems ||
      paymentLinks.shoppingItems.length === 0
    ) {
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
  } catch (error) {
    console.log("error no insert do payment link", error);
    throw new Error("Erro ao salvar o link de pagamento");
  }
}

export async function updatePaymentLink(
  paymentLinks: PaymentLinkDetail,
  shoppingItemsIn?: ShoppingItemsUpdate[]
): Promise<void> {
  if (shoppingItemsIn && shoppingItemsIn.length > 0) {
    const modifiedItems = shoppingItemsIn.filter((item) => item.wasModified);
    const unmodifiedItems = shoppingItemsIn.filter((item) => !item.wasModified);

    if (modifiedItems.length > 0) {
      const shoppingItemsInsert: ShoppingItems[] = modifiedItems.map(
        (insertItem) => ({
          slug: generateSlug(),
          name: insertItem.name,
          quantity: insertItem.quantity,
          amount: insertItem.amount,
          idPaymentLink: paymentLinks.id,
        })
      );

      await db.insert(shoppingItems).values(shoppingItemsInsert);
    }

    for (const item of unmodifiedItems) {
      await db
        .update(shoppingItems)
        .set({
          name: item.name,
          quantity: item.quantity,
          amount: item.amount,
          idPaymentLink: item.idPaymentLink,
        })
        .where(eq(shoppingItems.slug, item.slug ?? ""));
    }
  }
  await db
    .update(paymentLink)
    .set(paymentLinks)
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
