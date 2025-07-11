"use server";

import { getUserMerchantsAccess } from "@/features/users/server/users";
import { generateSlug } from "@/lib/utils";
import { db } from "@/server/db";
import { PaymentLinkAPI } from "@/server/integrations/sync/paymentLink";
import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  sql,
} from "drizzle-orm";
import { DateTime } from "luxon";
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

async function InsertAPIPaymentLink(data: InsertPaymentLinkAPI) {
  // Remover campos desnecessários dos shoppingItems
  // Os valores monetários já foram validados e mantidos com ponto
  const formattedData = {
    ...data,
    shoppingItems: data.shoppingItems?.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      amount: item.amount,
      // Removendo idPaymentLink pois a API não espera esse campo
    })),
  };

  console.log("json", JSON.stringify(formattedData));
  const response = await fetch(
    `https://serviceorder.acquiring.dock.tech/v1/external_payment_links`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IjUwQUYxMDdFMTRERDQ2RTJCQjg5RkE5OEYxNTI2M0RBIn0.2urCljTPGjtwk6oSlGoOBfM16igLfFUNRqDg63WvzSFpB79gYf3lw1jEgVr4RCH_NU6A-5XKbuzIJtAXyETvzw`,
      },
      body: JSON.stringify(formattedData),
    }
  );

  if (!response.ok) {
    let errorDetails = `Status: ${response.status} - ${response.statusText}`;

    try {
      const errorResponse = await response.text();
      errorDetails += `\nResponse: ${errorResponse}`;
    } catch {
      errorDetails += `\nCould not read response body`;
    }

    console.error("API Error Details:", errorDetails);
    console.error("Request Data:", JSON.stringify(formattedData, null, 2));

    const errorMessage = `Failed to save data: ${errorDetails}`;
    throw new Error(errorMessage);
  }

  const responseData: PaymentLink = await response.json();

  return responseData;
}

export async function getPaymentLinks(
  merchant: string,
  identifier: string,
  status: string,
  page: number,
  pageSize: number
): Promise<PaymentLinkList> {
  const offset = (page - 1) * pageSize;

  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return empty result
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return {
      linksObject: [],
      totalCount: 0,
    };
  }

  const conditions = [
    ilike(paymentLink.linkName, `%${identifier}%`),
    ilike(merchants.name, `%${merchant}%`),
    status == "" ? undefined : eq(paymentLink.paymentLinkStatus, status),
  ].filter(Boolean);

  // Add merchant access filter if user doesn't have full access
  if (!userAccess.fullAccess) {
    conditions.push(inArray(merchants.id, userAccess.idMerchants));
  }
  conditions.push(eq(merchants.idCustomer, userAccess.idCustomer));

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
    .innerJoin(merchants, eq(paymentLink.idMerchant, merchants.id))
    .where(and(...conditions))
    .orderBy(desc(paymentLink.id))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(paymentLink)
    .leftJoin(merchants, eq(paymentLink.idMerchant, merchants.id))
    .where(and(...conditions));

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
  if (isNaN(id) || id < 0) {
    return null;
  }

  // Se o ID é 0, retornar um objeto vazio para permitir criação
  if (id === 0) {
    return {
      id: 0,
      slug: null,
      active: false,
      dtinsert: null,
      dtupdate: null,
      linkName: null,
      dtExpiration: null,
      totalAmount: null,
      idMerchant: null,
      paymentLinkStatus: null,
      productType: null,
      installments: null,
      linkUrl: null,
      pixEnabled: null,
      transactionSlug: null,
      isFromServer: null,
      modified: null,
      isDeleted: null,
      shoppingItems: [],
    };
  }

  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return null
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return null;
  }

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
      JSON_AGG(s.*) FILTER (WHERE s.id IS NOT NULL) AS "shoppingItems"
    FROM payment_link p
    LEFT JOIN shopping_items s ON s.id_payment_link = p.id
    INNER JOIN merchants m ON m.id = p.id_merchant
    WHERE p.id = ${id}
    ${
      !userAccess.fullAccess
        ? sql`AND m.id IN (${sql.join(userAccess.idMerchants, sql`, `)})`
        : sql``
    }
    ${userAccess.idCustomer ? sql`AND m.id_customer = ${userAccess.idCustomer}` : sql``}
    GROUP BY p.id
  `);

  return (result.rows[0] as unknown as PaymentLinkById) || null;
}

export async function insertPaymentLink(paymentLinks: PaymentLinkDetailInsert) {
  try {
    // Verificar se o usuário tem acesso ao merchant
    const userAccess = await getUserMerchantsAccess();

    if (
      !userAccess.fullAccess &&
      !userAccess.idMerchants.includes(paymentLinks.idMerchant || 0)
    ) {
      throw new Error("Você não tem acesso a este estabelecimento");
    }

    const merchantDoc = await db
      .select({ idDocument: merchants.idDocument })
      .from(merchants)
      .where(eq(merchants.id, paymentLinks.idMerchant || 0));

    // Formatar data de expiração preservando as horas quando definidas
    const formatExpirationDate = (dateString: string) => {
      if (!dateString) return "";

      // Usar DateTime do Luxon para garantir processamento em UTC
      const date = DateTime.fromISO(dateString, { zone: "utc" });

      if (!date.isValid) {
        console.error("Data inválida recebida:", dateString);
        return "";
      }

      // Se a data tem horas específicas (não é meia-noite), preservar as horas
      if (date.hour !== 0 || date.minute !== 0 || date.second !== 0) {
        return date.toISO();
      }

      // Se é apenas uma data (meia-noite), manter o comportamento anterior
      return date.toFormat("yyyy-MM-dd") + "T00:00:00.000Z";
    };

    // Validar valores monetários
    const validateAndFormatAmount = (amount: string) => {
      // Validar o valor numérico
      const numAmount = parseFloat(amount);
      if (numAmount < 0.01) {
        throw new Error("Valor mínimo deve ser R$ 0,01");
      }

      // Manter o valor original (com ponto) - a API espera ponto, não vírgula
      return amount;
    };

    const insertAPI: InsertPaymentLinkAPI = {
      linkName: paymentLinks.linkName || "",
      totalAmount: validateAndFormatAmount(paymentLinks.totalAmount || "0"),
      documentId: merchantDoc[0]?.idDocument || "0MerchantDock1",
      dtExpiration: formatExpirationDate(paymentLinks.dtExpiration || ""),
      installments: paymentLinks.installments || 0,
      productType: paymentLinks.productType || "",
      shoppingItems:
        paymentLinks.shoppingItems && paymentLinks.shoppingItems?.length > 0
          ? paymentLinks.shoppingItems.map((item) => ({
              ...item,
              amount: validateAndFormatAmount(item.amount),
            }))
          : undefined,
    };

    console.log("insertAPI", insertAPI);

    const response = await InsertAPIPaymentLink(insertAPI);

    console.log("response", response);

    const paymentLinkIn: PaymentLinkInsert = {
      slug: response.slug,
      linkName: paymentLinks.linkName,
      paymentLinkStatus: response.paymentLinkStatus,
      idMerchant: paymentLinks.idMerchant,
      dtinsert: DateTime.utc().toISO() || new Date().toISOString(),
      dtupdate: DateTime.utc().toISO() || new Date().toISOString(),
      totalAmount: paymentLinks.totalAmount,
      dtExpiration: paymentLinks.dtExpiration,
      installments: paymentLinks.installments,
      active: true,
      linkUrl: response.linkUrl,
      pixEnabled: null,
      productType: paymentLinks.productType,
      transactionSlug: response.slugFinancialTransaction,
      isFromServer: false,
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
  // Se o link tem slug, usar a função completa que atualiza na API
  if (paymentLinks.slug) {
    await updateCompletePaymentLink(paymentLinks, shoppingItemsIn);
    return;
  }

  // Caso contrário, apenas atualizar no banco local
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
  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return empty result
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return [];
  }

  const conditions = [eq(merchants.idCustomer, userAccess.idCustomer)];

  // Add merchant access filter if user doesn't have full access
  if (!userAccess.fullAccess) {
    conditions.push(inArray(merchants.id, userAccess.idMerchants));
  }

  const result = await db
    .select({ id: merchants.id, name: merchants.name })
    .from(merchants)
    .where(and(...conditions))
    .orderBy(merchants.name);

  return result.map((merchant) => ({
    id: merchant.id,
    name: merchant.name?.toUpperCase() ?? "",
  }));
}

/**
 * Atualiza um link de pagamento na API Dock
 * @param slug - O slug do link de pagamento a ser atualizado
 * @param data - Os dados a serem atualizados
 * @returns O link de pagamento atualizado da API
 */
export async function updateAPIPaymentLink(
  slug: string,
  data: UpdatePaymentLinkAPI
): Promise<PaymentLink> {
  // Remover campos desnecessários dos shoppingItems
  // Os valores monetários já foram validados e mantidos com ponto
  const formattedData = {
    ...data,
    shoppingItems: data.shoppingItems?.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      amount: item.amount,
      // Removendo idPaymentLink pois a API não espera esse campo
    })),
  };

  console.log("updateAPIPaymentLink", slug, JSON.stringify(formattedData));

  const response = await fetch(
    `https://serviceorder.acquiring.dock.tech/v1/external_payment_links/${slug}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IjUwQUYxMDdFMTRERDQ2RTJCQjg5RkE5OEYxNTI2M0RBIn0.2urCljTPGjtwk6oSlGoOBfM16igLfFUNRqDg63WvzSFpB79gYf3lw1jEgVr4RCH_NU6A-5XKbuzIJtAXyETvzw`,
      },
      body: JSON.stringify(formattedData),
    }
  );

  if (!response.ok) {
    const errorMessage = `Falha ao atualizar link de pagamento: ${response.statusText}`;
    console.error(response);
    throw new Error(errorMessage);
  }

  const responseData: PaymentLink = await response.json();
  return responseData;
}

// Definição do tipo para atualização
export type UpdatePaymentLinkAPI = {
  linkName: string;
  totalAmount: string;
  documentId: string;
  dtExpiration: string;
  productType: string;
  installments: number;
  shoppingItems?: ShoppingItem[];
};

// Função para atualizar um link de pagamento (completa)
export async function updateCompletePaymentLink(
  paymentLinks: PaymentLinkDetail,
  shoppingItemsIn?: ShoppingItemsUpdate[]
): Promise<void> {
  try {
    // 1. Busca informações do comerciante
    const merchant = await db
      .select({ idDocument: merchants.idDocument })
      .from(merchants)
      .where(eq(merchants.id, paymentLinks.idMerchant || 0));

    // Formatar data de expiração preservando as horas quando definidas
    const formatExpirationDate = (dateString: string) => {
      if (!dateString) return "";
      const date = DateTime.fromISO(dateString, { zone: "utc" });

      if (!date.isValid) {
        console.error("Data inválida recebida:", dateString);
        return "";
      }

      // Se a data tem horas específicas (não é meia-noite), preservar as horas
      if (date.hour !== 0 || date.minute !== 0 || date.second !== 0) {
        return date.toISO();
      }

      // Se é apenas uma data (meia-noite), manter o comportamento anterior
      return date.toFormat("yyyy-MM-dd") + "T00:00:00.000Z";
    };

    // Validar valores monetários
    const validateAndFormatAmount = (amount: string) => {
      // Validar o valor numérico
      const numAmount = parseFloat(amount);
      if (numAmount < 0.01) {
        throw new Error("Valor mínimo deve ser R$ 0,01");
      }

      // Manter o valor original (com ponto) - a API espera ponto, não vírgula
      return amount;
    };

    // 2. Prepara dados para atualização na API
    const updateData: UpdatePaymentLinkAPI = {
      linkName: paymentLinks.linkName || "",
      totalAmount: validateAndFormatAmount(paymentLinks.totalAmount || "0"),
      documentId: merchant[0]?.idDocument || "0MerchantDock1", // Valor padrão como fallback
      dtExpiration: formatExpirationDate(paymentLinks.dtExpiration || ""),
      installments: paymentLinks.installments || 0,
      productType: paymentLinks.productType || "CREDIT",
    };

    // 3. Adiciona itens de compra se existirem
    if (shoppingItemsIn && shoppingItemsIn.length > 0) {
      updateData.shoppingItems = shoppingItemsIn.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        amount: validateAndFormatAmount(item.amount),
      }));
    }

    // 4. Chama a API para atualizar o link
    if (paymentLinks.slug) {
      const response = await updateAPIPaymentLink(
        paymentLinks.slug,
        updateData
      );
      console.log("API update response:", response);

      // 5. Atualiza os itens de compra no banco local
      if (shoppingItemsIn && shoppingItemsIn.length > 0) {
        const modifiedItems = shoppingItemsIn.filter(
          (item) => item.wasModified
        );
        const unmodifiedItems = shoppingItemsIn.filter(
          (item) => !item.wasModified
        );

        // Adiciona novos itens
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

        // Atualiza itens existentes
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
    }

    // 6. Atualiza o registro no banco local
    await db
      .update(paymentLink)
      .set({
        ...paymentLinks,
        dtupdate: DateTime.utc().toISO() || new Date().toISOString(),
      })
      .where(eq(paymentLink.id, paymentLinks.id));
  } catch (error) {
    console.error("Erro ao atualizar link de pagamento:", error);
    throw new Error("Erro ao atualizar o link de pagamento");
  }
}

/**
 * Verifica links de pagamento que foram excluídos na API Dock e os marca como excluídos no banco local
 * @returns Número de links marcados como excluídos
 */
export async function verificarLinksExcluidos(): Promise<number> {
  try {
    // 1. Buscar todos os links ativos no banco local que não estão marcados como excluídos
    const linksLocais = await db
      .select({
        id: paymentLink.id,
        slug: paymentLink.slug,
      })
      .from(paymentLink)
      .where(
        and(
          eq(paymentLink.active, true),
          eq(paymentLink.isDeleted, false),
          isNotNull(paymentLink.slug)
        )
      );

    if (linksLocais.length === 0) {
      console.log("Nenhum link ativo para verificar");
      return 0;
    }

    // 2. Coletar todos os slugs para verificação
    const slugsLocais = linksLocais.map((link) => link.slug as string);

    // 3. Verificar na API quais links ainda existem
    // Fazer a consulta em lotes para não sobrecarregar
    const TAMANHO_LOTE = 50;
    const linksExcluidos: number[] = [];

    for (let i = 0; i < slugsLocais.length; i += TAMANHO_LOTE) {
      const loteSlugs = slugsLocais.slice(i, i + TAMANHO_LOTE);

      // Para cada slug, verifica se o link existe na API
      const promessasVerificacao = loteSlugs.map(async (slug) => {
        try {
          const response = await fetch(
            `https://serviceorder.acquiring.dock.tech/v1/external_payment_links/${slug}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IjUwQUYxMDdFMTRERDQ2RTJCQjg5RkE5OEYxNTI2M0RBIn0.2urCljTPGjtwk6oSlGoOBfM16igLfFUNRqDg63WvzSFpB79gYf3lw1jEgVr4RCH_NU6A-5XKbuzIJtAXyETvzw`,
              },
            }
          );

          // Se o status for 404, o link não existe mais
          if (response.status === 404) {
            // Encontrar o ID do link local correspondente
            const linkLocalId = linksLocais.find((l) => l.slug === slug)?.id;
            if (linkLocalId) {
              linksExcluidos.push(linkLocalId);
            }
          }

          // Se ocorrer outro erro, ignoramos e continuamos
          // (pode ser um problema temporário de conexão)
        } catch (error) {
          console.error(`Erro ao verificar link ${slug}:`, error);
        }
      });

      // Aguardar todas as verificações deste lote
      await Promise.all(promessasVerificacao);

      // Pequena pausa para não sobrecarregar a API
      if (i + TAMANHO_LOTE < slugsLocais.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // 4. Marcar links excluídos na base local
    if (linksExcluidos.length > 0) {
      await db
        .update(paymentLink)
        .set({
          isDeleted: true,
          active: false,
          dtupdate: DateTime.utc().toISO() || new Date().toISOString(),
        })
        .where(inArray(paymentLink.id, linksExcluidos));

      console.log(`${linksExcluidos.length} links marcados como excluídos`);
    } else {
      console.log("Nenhum link excluído encontrado");
    }

    return linksExcluidos.length;
  } catch (error) {
    console.error("Erro ao verificar links excluídos:", error);
    throw new Error("Falha ao verificar links excluídos na API");
  }
}

// Alternativa mais eficiente usando a API de listagem
export async function verificarLinksExcluidosComLista(): Promise<number> {
  try {
    // 1. Buscar todos os slugs de links ativos no banco local
    const linksLocais = await db
      .select({
        id: paymentLink.id,
        slug: paymentLink.slug,
      })
      .from(paymentLink)
      .where(
        and(
          eq(paymentLink.active, true),
          eq(paymentLink.isDeleted, false),
          isNotNull(paymentLink.slug)
        )
      );

    if (linksLocais.length === 0) {
      return 0;
    }

    // Criar um Map para verificação mais rápida
    const mapLinksLocais = new Map<string, number>();
    linksLocais.forEach((link) => {
      if (link.slug) {
        mapLinksLocais.set(link.slug, link.id);
      }
    });

    // 2. Buscar todos os links na API
    const linksAPI = await fetchAllPaymentLinks();

    // Criar um conjunto de slugs existentes na API
    const slugsAPI = new Set<string>(linksAPI.map((link) => link.slug));

    // 3. Identificar quais links locais não existem mais na API
    const linksExcluidos: number[] = [];

    mapLinksLocais.forEach((id, slug) => {
      if (!slugsAPI.has(slug)) {
        linksExcluidos.push(id);
      }
    });

    // 4. Marcar links excluídos na base local
    if (linksExcluidos.length > 0) {
      await db
        .update(paymentLink)
        .set({
          isDeleted: true,
          active: false,
          dtupdate: DateTime.utc().toISO() || new Date().toISOString(),
        })
        .where(inArray(paymentLink.id, linksExcluidos));

      console.log(`${linksExcluidos.length} links marcados como excluídos`);
    }

    return linksExcluidos.length;
  } catch (error) {
    console.error("Erro ao verificar links excluídos:", error);
    throw new Error("Falha ao verificar links excluídos na API");
  }
}

// Função auxiliar para buscar todos os links da API
async function fetchAllPaymentLinks(): Promise<PaymentLinkAPI[]> {
  let offset = 0;
  const limit = 1000;
  let hasMoreData = true;
  const allData: PaymentLinkAPI[] = [];

  while (hasMoreData) {
    const response = await fetch(
      `https://serviceorder.acquiring.dock.tech/v1/external_payment_links?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IjUwQUYxMDdFMTRERDQ2RTJCQjg5RkE5OEYxNTI2M0RBIn0.2urCljTPGjtwk6oSlGoOBfM16igLfFUNRqDg63WvzSFpB79gYf3lw1jEgVr4RCH_NU6A-5XKbuzIJtAXyETvzw`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Falha ao buscar links: ${response.statusText}`);
    }

    const data = await response.json();
    allData.push(...data.objects);

    offset += limit;
    hasMoreData = offset < data.meta.total_count;
  }

  return allData;
}
