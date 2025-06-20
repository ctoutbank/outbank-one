"use server";

import { FeeNewSchema } from "@/features/newTax/schema/fee-new-Schema";
import { db } from "@/server/db";
import { eq, inArray, sql } from "drizzle-orm";
import {
  categories,
  fee,
  feeBrand,
  feeBrandProductType,
} from "../../../../drizzle/schema";

export async function getFeeByIdAction(id: string): Promise<FeeData | null> {
  try {
    return await getFeeById(id);
  } catch (error) {
    console.error(`Erro ao buscar taxa com ID ${id}:`, error);
    return null;
  }
}

export async function getFeesAction(page = 1, pageSize = 10) {
  try {
    return await getFees(page, pageSize);
  } catch (error) {
    console.error("Erro ao buscar taxas:", error);
    return {
      fees: [],
      totalRecords: 0,
      currentPage: page,
      pageSize,
    };
  }
}

export async function getBandeirasAction(): Promise<string[]> {
  try {
    return await getBandeiras();
  } catch (error) {
    console.error("Erro ao buscar bandeiras:", error);
    return [];
  }
}

export async function getModosPagamentoAction(): Promise<string[]> {
  try {
    return await getModosPagamento();
  } catch (error) {
    console.error("Erro ao buscar modos de pagamento:", error);
    return [];
  }
}

export type feetype = {
  label: string;
  value: string;
};

// Definição dos tipos de dados
export interface FeeData {
  id: string;
  active: boolean;
  dtinsert: string;
  dtupdate: string;
  mcc: string;
  cnae: string;
  code: string;
  name: string;
  tableType: string;
  compulsoryAnticipationConfig: string;
  eventualAnticipationFee: string;
  anticipationType: string;
  cardPixMdr: string;
  cardPixCeilingFee: string;
  cardPixMinimumCostFee: string;
  nonCardPixMdr: string;
  nonCardPixCeilingFee: string;
  nonCardPixMinimumCostFee: string;
  feeBrand: FeeBrand[];
  slug: string;
  feeCredit?: FeeCredit[];
}

export interface FeeBrand {
  id: number;
  slug: string;
  active: boolean;
  dtinsert: string;
  dtupdate: string;
  brand: string;
  idGroup: number;
  idFee: number;
  feeBrandProductType: feeBrandProductType[];
}

export interface feeBrandProductType {
  id: number;
  slug: string;
  active: boolean;
  dtinsert: string;
  dtupdate: string;
  installmentTransactionFeeStart: number;
  installmentTransactionFeeEnd: number;
  cardTransactionFee: number;
  cardTransactionMdr: number;
  nonCardTransactionFee: number;
  nonCardTransactionMdr: number;
  producttype: string;
  idFeeBrand: number;
}

// Função para mapear dados do DB para o formato da FeeData
function mapDbDataToFeeData(
  feeData: any,
  feeBrands: any[],
  feeBrandProductTypes: any[]
): FeeData {
  // Agrupando os dados por marca (bandeira)
  const brandDetails: FeeBrand[] = [];

  for (const brandItem of feeBrands) {
    const productTypes = feeBrandProductTypes.filter(
      (pt) => pt.idFeeBrand === brandItem.id
    );

    const modos: feeBrandProductType[] = productTypes.map((pt) => ({
      id: pt.id,
      slug: pt.slug || "",
      active: pt.active || false,
      dtinsert: pt.dtinsert || "",
      dtupdate: pt.dtupdate || "",
      producttype: getPaymentModeFromProductType(
        pt.producttype,
        pt.installmentTransactionFeeStart,
        pt.installmentTransactionFeeEnd
      ),
      cardTransactionMdr: pt.cardTransactionMdr || 0,
      nonCardTransactionMdr: pt.nonCardTransactionMdr || 0,
      cardTransactionFee: pt.cardTransactionFee || 0,
      nonCardTransactionFee: pt.nonCardTransactionFee || 0,
      installmentTransactionFeeStart: pt.installmentTransactionFeeStart || 0,
      installmentTransactionFeeEnd: pt.installmentTransactionFeeEnd || 0,
      idFeeBrand: pt.idFeeBrand || 0,
    }));

    // Adicionando a bandeira aos detalhes
    brandDetails.push({
      id: brandItem.id || 0,
      slug: brandItem.slug || "",
      active: brandItem.active || false,
      dtinsert: brandItem.dtinsert || "",
      dtupdate: brandItem.dtupdate || "",
      brand: brandItem.brand || "",
      idGroup: brandItem.idGroup || 0,
      idFee: brandItem.idFee || 0,
      feeBrandProductType: modos,
    });
  }

  return {
    id: feeData.id?.toString() || "0",
    active: feeData.active || false,
    dtinsert: feeData.dtinsert || "",
    dtupdate: feeData.dtupdate || "",
    name: feeData.name || "",
    tableType: feeData.tableType || "",
    code: feeData.code || "",
    mcc: feeData.mcc || "",
    cnae: feeData.cnae || "",
    compulsoryAnticipationConfig:
      feeData.compulsoryAnticipationConfig?.toString() || "0",
    eventualAnticipationFee: feeData.eventualAnticipationFee?.toString() || "0",
    anticipationType: feeData.anticipationType || "NOANTECIPATION",
    cardPixMdr: feeData.cardPixMdr?.toString() || "0",
    cardPixCeilingFee: feeData.cardPixCeilingFee?.toString() || "0",
    cardPixMinimumCostFee: feeData.cardPixMinimumCostFee?.toString() || "0",
    nonCardPixMdr: feeData.nonCardPixMdr?.toString() || "0",
    nonCardPixCeilingFee: feeData.nonCardPixCeilingFee?.toString() || "0",
    nonCardPixMinimumCostFee:
      feeData.nonCardPixMinimumCostFee?.toString() || "0",
    feeBrand: brandDetails,
    slug: feeData.slug || "",
  };
}

// Função para obter o modo de pagamento a partir do tipo de produto
function getPaymentModeFromProductType(
  productType: string,
  installmentStart?: number | null,
  installmentEnd?: number | null
): string {
  if (productType === "credit") {
    if (
      !installmentStart ||
      !installmentEnd ||
      (installmentStart === 1 && installmentEnd === 1)
    ) {
      return "Crédito à Vista";
    } else if (installmentStart >= 2 && installmentEnd <= 6) {
      return `Crédito Parcelado (${installmentStart} a ${installmentEnd} vezes)`;
    } else if (installmentStart >= 7 && installmentEnd <= 12) {
      return `Crédito Parcelado (${installmentStart} a ${installmentEnd} vezes)`;
    }
  } else if (productType === "debit") {
    return "Débito";
  } else if (productType === "voucher") {
    return "Voucher";
  } else if (productType === "prepaid") {
    return "Pré-Pago";
  }

  return productType;
}

// Função para buscar todas as taxas
export async function getFees(page: number, pageSize: number): Promise<{
  fees: FeeData[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
}> {
  try {
    const offset = (page - 1) * pageSize;

    // 1. Contar total de registros
    const totalFees = await db
        .select({ id: fee.id })
        .from(fee);

    const totalRecords = totalFees.length;

    // 2. Buscar apenas a página atual
    const paginatedFees = await db
        .select()
        .from(fee)
        .limit(pageSize)
        .offset(offset);

    const feeDataList: FeeData[] = [];

    for (const f of paginatedFees) {
      const brands = await db
          .select()
          .from(feeBrand)
          .where(eq(feeBrand.idFee, f.id));

      const brandIds = brands.map((b) => b.id);

      const productTypes = brandIds.length
          ? await db
              .select()
              .from(feeBrandProductType)
              .where(inArray(feeBrandProductType.idFeeBrand, brandIds))
          : [];

      feeDataList.push(mapDbDataToFeeData(f, brands, productTypes));
    }

    return {
      fees: feeDataList,
      totalRecords,
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    console.error("Erro ao buscar taxas:", error);
    return {
      fees: [],
      totalRecords: 0,
      currentPage: page,
      pageSize,
    };
  }
}

// Função para buscar uma taxa específica pelo ID
export async function getFeeById(id: string): Promise<FeeData | null> {
  try {
    // Se for ID 0, retorna um objeto padrão para nova taxa
    if (id === "0") {
      return createEmptyFee();
    }

    // Buscar a taxa específica
    const [feeData] = await db
      .select()
      .from(fee)
      .where(eq(fee.id, parseInt(id)));

    if (!feeData) {
      return null;
    }

    // Normalizar o tipo de antecipação para um formato padrão
    if (feeData.anticipationType) {
      if (
        feeData.anticipationType === "Sem Antecipação" ||
        feeData.anticipationType === "none"
      ) {
        feeData.anticipationType = "NOANTECIPATION";
      } else if (feeData.anticipationType === "Antecipação Eventual") {
        feeData.anticipationType = "EVENTUAL";
      } else if (feeData.anticipationType === "Antecipação Compulsória") {
        feeData.anticipationType = "COMPULSORY";
      }
    }

    // Buscar as marcas associadas
    const brands = await db
      .select()
      .from(feeBrand)
      .where(eq(feeBrand.idFee, feeData.id));

    // Se não houver marcas, retorna a taxa sem marcas
    if (brands.length === 0) {
      return mapDbDataToFeeData(feeData, [], []);
    }

    const brandIds = brands.map((b) => b.id);
    const productTypes = await db
      .select()
      .from(feeBrandProductType)
      .where(inArray(feeBrandProductType.idFeeBrand, brandIds));

    // Buscar os feeCredit relacionados aos feeBrandProductType
    const feeBrandProductTypeIds = productTypes.map((pt) => pt.id);
    const feeCredits = await getFeeCreditsByFeeBrandProductTypeIds(
      feeBrandProductTypeIds
    );

    // Montar o objeto FeeData incluindo feeCredit
    const feeDataObj = mapDbDataToFeeData(feeData, brands, productTypes);
    return { ...feeDataObj, feeCredit: feeCredits };
  } catch (error) {
    console.error(`Erro ao buscar taxa com ID ${id}:`, error);
    return null;
  }
}

// Função para criar um objeto de taxa vazio/padrão
function createEmptyFee(): FeeData {
  return {
    id: "0",
    active: true,
    dtinsert: new Date().toISOString(),
    dtupdate: new Date().toISOString(),
    name: "",
    tableType: "SIMPLE",
    code: "",
    compulsoryAnticipationConfig: "0",
    eventualAnticipationFee: "0",
    anticipationType: "NOANTECIPATION",
    cardPixMdr: "0",
    cardPixCeilingFee: "0",
    cardPixMinimumCostFee: "0",
    nonCardPixMdr: "0",
    nonCardPixCeilingFee: "0",
    nonCardPixMinimumCostFee: "0",
    feeBrand: [],
    slug: "",
    mcc: "",
    cnae: "",
  };
}

// Função para obter a lista de bandeiras disponíveis
export async function getBandeiras(): Promise<string[]> {
  try {
    const brands = await db.select().from(feeBrand);
    return brands.map((b) => b.brand || "");
  } catch (error) {
    console.error("Erro ao buscar bandeiras:", error);
    return ["MASTERCARD", "VISA", "ELO", "AMERICAN_EXPRESS", "HIPERCARD"];
  }
}

// Função para obter a lista de modos de pagamento disponíveis
export async function getModosPagamento(): Promise<string[]> {
  return [
    "Débito",
    "Crédito à Vista",
    "Crédito Parcelado (2 a 6 vezes)",
    "Crédito Parcelado (7 a 12 vezes)",
    "Voucher",
    "Pré-Pago",
  ];
}

// Função para inserir uma nova taxa
export async function insertFee(feeData: FeeNewSchema): Promise<number> {
  try {
    console.log("Inserindo nova taxa com dados:", {
      mcc: feeData.mcc,
      cnae: feeData.cnae,
    });

    // Converter datas para ISO string
    const now = new Date().toISOString();

    // Preparar dados para inserção
    const insertData = {
      slug: feeData.slug || "",
      active: feeData.active !== undefined ? feeData.active : true,
      dtinsert: now,
      dtupdate: now,
      code: feeData.code || "",
      name: feeData.name || "Nova Taxa",
      tableType: feeData.tableType || "SIMPLE",
      compulsoryAnticipationConfig: sql`${feeData.compulsoryAnticipationConfig || 0}`,
      eventualAnticipationFee: sql`${feeData.eventualAnticipationFee || 0}`,
      anticipationType: feeData.anticipationType || "NOANTECIPATION",
      cardPixMdr: sql`${feeData.cardPixMdr || 0}`,
      cardPixCeilingFee: sql`${feeData.cardPixCeilingFee || 0}`,
      cardPixMinimumCostFee: sql`${feeData.cardPixMinimumCostFee || 0}`,
      nonCardPixMdr: sql`${feeData.nonCardPixMdr || 0}`,
      nonCardPixCeilingFee: sql`${feeData.nonCardPixCeilingFee || 0}`,
      nonCardPixMinimumCostFee: sql`${feeData.nonCardPixMinimumCostFee || 0}`,
      mcc: feeData.mcc || "",
      cnae: feeData.cnae || "",
    };

    // Verificar explicitamente se os valores de mcc e cnae estão presentes
    console.log("Valores finais para inserção:", {
      mcc: insertData.mcc,
      cnae: insertData.cnae,
    });

    // Inserir a nova taxa
    const result = await db
      .insert(fee)
      .values(insertData)
      .returning({ id: fee.id });

    if (!result[0]?.id) {
      throw new Error("Falha ao inserir taxa: ID não retornado");
    }

    const newFeeId = result[0].id;
    console.log(`Taxa inserida com sucesso. ID: ${newFeeId}`);

    // Inserir as marcas (feeBrand) se fornecidas
    if (feeData.feeBrand && feeData.feeBrand.length > 0) {
      await insertBrandsWithProductTypes(feeData.feeBrand, newFeeId);
    }

    return newFeeId;
  } catch (error) {
    console.error("Erro ao inserir taxa:", error);
    throw error;
  }
}

// Função para inserir marcas e tipos de produtos
async function insertBrandsWithProductTypes(brands: any[], feeId: number) {
  const now = new Date().toISOString();

  for (const brand of brands) {
    // Inserir a marca
    const brandInsertData = {
      slug: brand.slug || "",
      active: brand.active !== undefined ? brand.active : true,
      dtinsert: now,
      dtupdate: now,
      brand: brand.brand || "",
      idGroup: brand.idGroup || 0,
      idFee: feeId,
    };

    const brandResult = await db
      .insert(feeBrand)
      .values(brandInsertData)
      .returning({ id: feeBrand.id });

    if (!brandResult[0]?.id) {
      console.warn(`Falha ao inserir marca para taxa ${feeId}`);
      continue;
    }

    const newBrandId = brandResult[0].id;

    // Inserir os tipos de produto (feeBrandProductType) se fornecidos
    if (brand.feeBrandProductType && brand.feeBrandProductType.length > 0) {
      await insertProductTypes(brand.feeBrandProductType, newBrandId, now);
    }
  }
}

// Função para inserir tipos de produtos
async function insertProductTypes(
  productTypes: any[],
  brandId: number,
  timestamp: string
) {
  for (const productType of productTypes) {
    const productTypeInsertData = {
      slug: productType.slug || "",
      active: productType.active !== undefined ? productType.active : true,
      dtinsert: timestamp,
      dtupdate: timestamp,
      installmentTransactionFeeStart: sql`${productType.installmentTransactionFeeStart || 0}`,
      installmentTransactionFeeEnd: sql`${productType.installmentTransactionFeeEnd || 0}`,
      cardTransactionFee: sql`${productType.cardTransactionFee || 0}`,
      cardTransactionMdr: sql`${productType.cardTransactionMdr || 0}`,
      nonCardTransactionFee: sql`${productType.nonCardTransactionFee || 0}`,
      nonCardTransactionMdr: sql`${productType.nonCardTransactionMdr || 0}`,
      producttype: productType.producttype || "",
      idFeeBrand: brandId,
    };

    await db.insert(feeBrandProductType).values(productTypeInsertData);
  }
}

// Função para atualizar uma taxa existente
export async function updateFee(feeData: FeeNewSchema): Promise<void> {
  try {
    if (!feeData.id) {
      throw new Error("ID da taxa não fornecido para atualização");
    }

    console.log("Atualizando taxa ID", feeData.id, "com dados:", {
      mcc: feeData.mcc,
      cnae: feeData.cnae,
    });

    // Converter datas para ISO string
    const now = new Date().toISOString();

    // Preparar dados para atualização
    const updateData = {
      slug: feeData.slug || "",
      active: feeData.active !== undefined ? feeData.active : true,
      dtupdate: now,
      name: feeData.name || "Taxa Atualizada",
      tableType: feeData.tableType || "SIMPLE",
      compulsoryAnticipationConfig: sql`${feeData.compulsoryAnticipationConfig || 0}`,
      eventualAnticipationFee: sql`${feeData.eventualAnticipationFee || 0}`,
      anticipationType: feeData.anticipationType || "NOANTECIPATION",
      cardPixMdr: sql`${feeData.cardPixMdr || 0}`,
      cardPixCeilingFee: sql`${feeData.cardPixCeilingFee || 0}`,
      cardPixMinimumCostFee: sql`${feeData.cardPixMinimumCostFee || 0}`,
      nonCardPixMdr: sql`${feeData.nonCardPixMdr || 0}`,
      nonCardPixCeilingFee: sql`${feeData.nonCardPixCeilingFee || 0}`,
      nonCardPixMinimumCostFee: sql`${feeData.nonCardPixMinimumCostFee || 0}`,
      mcc: feeData.mcc || "",
      cnae: feeData.cnae || "",
    };

    // Verificar explicitamente se os valores de mcc e cnae estão presentes
    console.log("Valores finais para atualização:", {
      mcc: updateData.mcc,
      cnae: updateData.cnae,
    });

    // Atualizar a taxa
    await db
      .update(fee)
      .set(updateData)
      .where(eq(fee.id, Number(feeData.id)));

    console.log(`Taxa ID ${feeData.id} atualizada com sucesso`);

    // Atualizar as marcas (feeBrand) - estratégia de remover e recriar
    if (feeData.feeBrand && feeData.feeBrand.length > 0) {
      await updateBrandsAndProductTypes(feeData);
    }
  } catch (error) {
    console.error(`Erro ao atualizar taxa ID ${feeData.id}:`, error);
    throw error;
  }
}

// Função para atualizar marcas e tipos de produtos
async function updateBrandsAndProductTypes(
  feeData: FeeNewSchema
): Promise<void> {
  const feeId = Number(feeData.id);

  // Primeiro, buscar todas as marcas existentes para essa taxa
  const existingBrands = await db
    .select()
    .from(feeBrand)
    .where(eq(feeBrand.idFee, feeId));

  // Para cada marca existente, excluir seus tipos de produto
  for (const brand of existingBrands) {
    await db
      .delete(feeBrandProductType)
      .where(eq(feeBrandProductType.idFeeBrand, brand.id));
  }

  // Excluir todas as marcas existentes para essa taxa
  await db.delete(feeBrand).where(eq(feeBrand.idFee, feeId));

  // Inserir as novas marcas e tipos de produto
  if (feeData.feeBrand) {
    await insertBrandsWithProductTypes(feeData.feeBrand, feeId);
  }
}

// Função para salvar uma taxa (inserir nova ou atualizar existente)
export async function saveFee(feeData: FeeNewSchema): Promise<FeeNewSchema> {
  try {
    console.log("Iniciando saveFee com dados:", {
      id: feeData.id?.toString(),
      mcc: feeData.mcc,
      cnae: feeData.cnae,
    });

    // Verificar se é uma atualização ou inserção nova
    if (feeData.id) {
      // Atualizar taxa existente
      await updateFee(feeData);
      console.log("Taxa atualizada com sucesso:", {
        id: feeData.id.toString(),
        mcc: feeData.mcc,
        cnae: feeData.cnae,
      });
      return feeData;
    } else {
      // Inserir nova taxa
      const newId = await insertFee(feeData);
      const result = {
        ...feeData,
        id: BigInt(newId),
      };
      console.log("Nova taxa inserida com sucesso:", {
        id: newId.toString(),
        mcc: result.mcc,
        cnae: result.cnae,
      });
      return result;
    }
  } catch (error) {
    console.error("Erro ao salvar taxa:", error);
    throw error;
  }
}

// Tipagem para feeCredit
export interface FeeCredit {
  id: number;
  installmentNumber: number;
  compulsoryAnticipation: string | null;
  noCardCompulsoryAnticipation: string | null;
  idFeeBrandProductType: number;
}

// Buscar feeCredit por ids de feeBrandProductType
export async function getFeeCreditsByFeeBrandProductTypeIds(
  ids: number[]
): Promise<FeeCredit[]> {
  if (!ids.length) return [];
  const { feeCredit } = await import("../../../../drizzle/schema");
  const { inArray } = await import("drizzle-orm");
  const { db } = await import("@/server/db");
  const result = await db
    .select({
      id: feeCredit.id,
      installmentNumber: feeCredit.installmentNumber,
      compulsoryAnticipation: feeCredit.compulsoryAnticipation,
      noCardCompulsoryAnticipation: feeCredit.noCardCompulsoryAnticipation,
      idFeeBrandProductType: feeCredit.idFeeBrandProductType,
    })
    .from(feeCredit)
    .where(inArray(feeCredit.idFeeBrandProductType, ids));
  // Filtrar para garantir que idFeeBrandProductType não é null
  return result.filter((r): r is FeeCredit => r.idFeeBrandProductType !== null);
}

// Função para buscar categorias (MCC/CNAE) da tabela categories
export async function getCategories(): Promise<
  { mcc: string; cnae: string }[]
> {
  try {
    // Busca apenas os campos necessários
    const result = await db
      .select({ mcc: categories.mcc, cnae: categories.cnae })
      .from(categories);
    // Garante que não haja null
    return result.map((r) => ({ mcc: r.mcc ?? "", cnae: r.cnae ?? "" }));
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
}

// Server action para buscar feeAdmin por cnae e mcc
export async function getFeeAdminByCnaeMccAction(cnae: string, mcc: string) {
  console.log("Buscando feeAdmin com CNAE:", cnae, "e MCC:", mcc);

  // Verifica se algum dos parâmetros está vazio
  if (!cnae || !mcc) {
    console.log("CNAE ou MCC vazios, não é possível buscar feeAdmin");
    return {};
  }

  try {
    // Busca a solicitationfee mais recente para o par cnae/mcc com status COMPLETED
    const result = await db.execute(sql`
      WITH latest_solicitation AS (
        SELECT id
        FROM solicitation_fee
        WHERE cnae = ${cnae} 
        AND mcc = ${mcc}
        AND status = 'COMPLETED'
        ORDER BY dtinsert DESC
        LIMIT 1
      )
      SELECT
        sf.id,
        sf.status,
        sf.cnae,
        sf.mcc,
        sf.dtinsert,
        sfb.id as brand_id,
        sfb.brand,
        sbpt.id as product_type_id,
        sbpt.product_type,
        sbpt.fee_admin,
        sbpt.no_card_fee_admin
      FROM solicitation_fee sf
      JOIN latest_solicitation ls ON sf.id = ls.id
      LEFT JOIN solicitation_fee_brand sfb ON sf.id = sfb.solicitation_fee_id
      LEFT JOIN solicitation_brand_product_type sbpt ON sfb.id = sbpt.solicitation_fee_brand_id
    `);

    console.log(
      "Resultado da busca de feeAdmin:",
      result.rows.length,
      "linhas encontradas",
      "para CNAE:",
      cnae,
      "e MCC:",
      mcc
    );

    // Se não houver resultados, registra isso no log
    if (result.rows.length === 0) {
      console.log(
        "Nenhuma solicitação COMPLETED encontrada para este CNAE/MCC"
      );
      return {};
    }

    // Exibe os primeiros resultados para depuração
    if (result.rows.length > 0) {
      console.log(
        "Solicitação encontrada com ID:",
        result.rows[0].id,
        "inserida em:",
        result.rows[0].dtinsert
      );
      console.log("Amostra de resultados:", result.rows.slice(0, 2));
    }

    // Retorna um map: { [brand]: { [productType]: feeAdmin } }
    const feeAdminMap: Record<string, Record<string, number>> = {};
    for (const row of result.rows) {
      const brand = row.brand as string;
      const productType = row.product_type as string;
      if (!brand || !productType) continue;

      if (!feeAdminMap[brand]) feeAdminMap[brand] = {};

      // Usamos fee_admin para validações de campos card
      feeAdminMap[brand][productType] = Number(row.fee_admin);

      // Para nocard, usamos no_card_fee_admin se disponível, ou recorremos ao fee_admin
      if (row.no_card_fee_admin !== null) {
        const nocardKey = `nocard_${productType}`;
        feeAdminMap[brand][nocardKey] = Number(row.no_card_fee_admin);
      }
    }

    console.log("FeeAdmin mapeado:", feeAdminMap);
    return feeAdminMap;
  } catch (error) {
    console.error("Erro ao buscar fee_admin:", error);
    console.error("Erro detalhado:", error);
    return {};
  }
}
