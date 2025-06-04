"use server";

import { FeeNewSchema } from "@/features/newTax/schema/fee-new-Schema";
import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm";
import { fee, feeBrand, feeBrandProductType } from "../../../../drizzle/schema";

export async function getFeeByIdAction(id: string): Promise<FeeData | null> {
  try {
    return await getFeeById(id);
  } catch (error) {
    console.error(`Erro ao buscar taxa com ID ${id}:`, error);
    return null;
  }
}

export async function getFeesAction(): Promise<FeeData[]> {
  try {
    return await getFees();
  } catch (error) {
    console.error("Erro ao buscar taxas:", error);
    return [];
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

// Definição dos tipos necessários para corresponder com o schema
export interface FeeData {
  id: string;
  active: boolean;
  dtinsert: string;
  dtupdate: string;
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

// Função auxiliar para mapear dados do DB para o formato da FeeData
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
    compulsoryAnticipationConfig:
      feeData.compulsoryAnticipationConfig?.toString() || "0",
    eventualAnticipationFee: feeData.eventualAnticipationFee?.toString() || "0",
    anticipationType: feeData.anticipationType || "none",
    cardPixMdr: feeData.cardPixMdr?.toString() || "0",
    cardPixCeilingFee: feeData.cardPixCeilingFee?.toString() || "0",
    cardPixMinimumCostFee: feeData.cardPixMinimumCostFee?.toString() || "0",
    nonCardPixMdr: feeData.nonCardPixMdr?.toString() || "0",
    nonCardPixCeilingFee: feeData.nonCardPixCeilingFee?.toString() || "0",
    nonCardPixMinimumCostFee:
      feeData.nonCardPixMinimumCostFee?.toString() || "0",
    feeBrand: brandDetails,
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
export async function getFees(): Promise<FeeData[]> {
  try {
    console.log("Buscando todas as taxas disponíveis");

    // Buscar todas as taxas no banco de dados
    const fees = await db.select().from(fee);

    // Para cada taxa, buscar as marcas e tipos de produto associados
    const feeDataList: FeeData[] = [];

    for (const f of fees) {
      const brands = await db
        .select()
        .from(feeBrand)
        .where(eq(feeBrand.idFee, f.id));

      const brandIds = brands.map((b) => b.id);

      // Se não houver marcas, continua para a próxima taxa
      if (brandIds.length === 0) {
        feeDataList.push(mapDbDataToFeeData(f, [], []));
        continue;
      }

      const productTypes = await db
        .select()
        .from(feeBrandProductType)
        .where(
          sql`${feeBrandProductType.idFeeBrand} IN (${brandIds.join(",")})`
        );

      feeDataList.push(mapDbDataToFeeData(f, brands, productTypes));
    }

    console.log(`Encontradas ${feeDataList.length} taxas`);
    return feeDataList;
  } catch (error) {
    console.error("Erro ao buscar taxas:", error);
    return [];
  }
}

// Função para buscar uma taxa específica pelo ID
export async function getFeeById(id: string): Promise<FeeData | null> {
  try {
    console.log(`Buscando taxa com ID ${id}`);

    // Se for ID 0, retorna um objeto padrão para nova taxa
    if (id === "0") {
      console.log("Criando objeto padrão para nova taxa");
      return createEmptyFee();
    }

    // Buscar a taxa específica
    const [feeData] = await db
      .select()
      .from(fee)
      .where(eq(fee.id, parseInt(id)));

    if (!feeData) {
      console.log(`Taxa com ID ${id} não encontrada, retornando null`);
      return null;
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
      .where(sql`${feeBrandProductType.idFeeBrand} IN (${brandIds.join(",")})`);

    return mapDbDataToFeeData(feeData, brands, productTypes);
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
    name: "Nova Taxa",
    tableType: "SIMPLE",
    compulsoryAnticipationConfig: "0",
    eventualAnticipationFee: "0",
    anticipationType: "none",
    cardPixMdr: "0",
    cardPixCeilingFee: "0",
    cardPixMinimumCostFee: "0",
    nonCardPixMdr: "0",
    nonCardPixCeilingFee: "0",
    nonCardPixMinimumCostFee: "0",
    feeBrand: [],
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
    console.log("Iniciando inserção de nova taxa");

    // Converter datas para ISO string
    const now = new Date().toISOString();

    // Preparar dados para inserção
    const insertData = {
      slug: feeData.slug || "",
      active: feeData.active !== undefined ? feeData.active : true,
      dtinsert: now,
      dtupdate: now,
      name: feeData.name || "Nova Taxa",
      tableType: feeData.tableType || "SIMPLE",
      compulsoryAnticipationConfig: sql`${feeData.compulsoryAnticipationConfig || 0}`,
      eventualAnticipationFee: sql`${feeData.eventualAnticipationFee || 0}`,
      anticipationType: feeData.anticipationType || "none",
      cardPixMdr: sql`${feeData.cardPixMdr || 0}`,
      cardPixCeilingFee: sql`${feeData.cardPixCeilingFee || 0}`,
      cardPixMinimumCostFee: sql`${feeData.cardPixMinimumCostFee || 0}`,
      nonCardPixMdr: sql`${feeData.nonCardPixMdr || 0}`,
      nonCardPixCeilingFee: sql`${feeData.nonCardPixCeilingFee || 0}`,
      nonCardPixMinimumCostFee: sql`${feeData.nonCardPixMinimumCostFee || 0}`,
    };

    // Inserir a nova taxa
    const result = await db
      .insert(fee)
      .values(insertData)
      .returning({ id: fee.id });

    if (!result[0]?.id) {
      throw new Error("Falha ao inserir taxa: ID não retornado");
    }

    const newFeeId = result[0].id;
    console.log(`Nova taxa inserida com ID ${newFeeId}`);

    // Inserir as marcas (feeBrand) se fornecidas
    if (feeData.feeBrand && feeData.feeBrand.length > 0) {
      for (const brand of feeData.feeBrand) {
        // Inserir a marca
        const brandInsertData = {
          slug: brand.slug || "",
          active: brand.active !== undefined ? brand.active : true,
          dtinsert: now,
          dtupdate: now,
          brand: brand.brand || "",
          idGroup: brand.idGroup || 0,
          idFee: newFeeId,
        };

        const brandResult = await db
          .insert(feeBrand)
          .values(brandInsertData)
          .returning({ id: feeBrand.id });

        if (!brandResult[0]?.id) {
          console.warn(`Falha ao inserir marca para taxa ${newFeeId}`);
          continue;
        }

        const newBrandId = brandResult[0].id;

        // Inserir os tipos de produto (feeBrandProductType) se fornecidos
        if (brand.feeBrandProductType && brand.feeBrandProductType.length > 0) {
          for (const productType of brand.feeBrandProductType) {
            const productTypeInsertData = {
              slug: productType.slug || "",
              active:
                productType.active !== undefined ? productType.active : true,
              dtinsert: now,
              dtupdate: now,
              installmentTransactionFeeStart: sql`${productType.installmentTransactionFeeStart || 0}`,
              installmentTransactionFeeEnd: sql`${productType.installmentTransactionFeeEnd || 0}`,
              cardTransactionFee: sql`${productType.cardTransactionFee || 0}`,
              cardTransactionMdr: sql`${productType.cardTransactionMdr || 0}`,
              nonCardTransactionFee: sql`${productType.nonCardTransactionFee || 0}`,
              nonCardTransactionMdr: sql`${productType.nonCardTransactionMdr || 0}`,
              producttype: productType.producttype || "",
              idFeeBrand: newBrandId,
            };

            await db.insert(feeBrandProductType).values(productTypeInsertData);
          }
        }
      }
    }

    return newFeeId;
  } catch (error) {
    console.error("Erro ao inserir taxa:", error);
    throw error;
  }
}

// Função para atualizar uma taxa existente
export async function updateFee(feeData: FeeNewSchema): Promise<void> {
  try {
    console.log(`Iniciando atualização da taxa ID ${feeData.id}`);

    if (!feeData.id) {
      throw new Error("ID da taxa não fornecido para atualização");
    }

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
      anticipationType: feeData.anticipationType || "none",
      cardPixMdr: sql`${feeData.cardPixMdr || 0}`,
      cardPixCeilingFee: sql`${feeData.cardPixCeilingFee || 0}`,
      cardPixMinimumCostFee: sql`${feeData.cardPixMinimumCostFee || 0}`,
      nonCardPixMdr: sql`${feeData.nonCardPixMdr || 0}`,
      nonCardPixCeilingFee: sql`${feeData.nonCardPixCeilingFee || 0}`,
      nonCardPixMinimumCostFee: sql`${feeData.nonCardPixMinimumCostFee || 0}`,
    };

    // Atualizar a taxa
    await db
      .update(fee)
      .set(updateData)
      .where(eq(fee.id, Number(feeData.id)));

    console.log(`Taxa ID ${feeData.id} atualizada com sucesso`);

    // Atualizar as marcas (feeBrand) - estratégia de remover e recriar
    if (feeData.feeBrand && feeData.feeBrand.length > 0) {
      // Primeiro, buscar todas as marcas existentes para essa taxa
      const existingBrands = await db
        .select()
        .from(feeBrand)
        .where(eq(feeBrand.idFee, Number(feeData.id)));

      // Para cada marca existente, excluir seus tipos de produto
      for (const brand of existingBrands) {
        await db
          .delete(feeBrandProductType)
          .where(eq(feeBrandProductType.idFeeBrand, brand.id));
      }

      // Excluir todas as marcas existentes para essa taxa
      await db.delete(feeBrand).where(eq(feeBrand.idFee, Number(feeData.id)));

      // Inserir as novas marcas e tipos de produto
      for (const brand of feeData.feeBrand) {
        // Inserir a marca
        const brandInsertData = {
          slug: brand.slug || "",
          active: brand.active !== undefined ? brand.active : true,
          dtinsert: now,
          dtupdate: now,
          brand: brand.brand || "",
          idGroup: brand.idGroup || 0,
          idFee: Number(feeData.id),
        };

        const brandResult = await db
          .insert(feeBrand)
          .values(brandInsertData)
          .returning({ id: feeBrand.id });

        if (!brandResult[0]?.id) {
          console.warn(`Falha ao inserir marca para taxa ${feeData.id}`);
          continue;
        }

        const newBrandId = brandResult[0].id;

        // Inserir os tipos de produto (feeBrandProductType) se fornecidos
        if (brand.feeBrandProductType && brand.feeBrandProductType.length > 0) {
          for (const productType of brand.feeBrandProductType) {
            const productTypeInsertData = {
              slug: productType.slug || "",
              active:
                productType.active !== undefined ? productType.active : true,
              dtinsert: now,
              dtupdate: now,
              installmentTransactionFeeStart: sql`${productType.installmentTransactionFeeStart || 0}`,
              installmentTransactionFeeEnd: sql`${productType.installmentTransactionFeeEnd || 0}`,
              cardTransactionFee: sql`${productType.cardTransactionFee || 0}`,
              cardTransactionMdr: sql`${productType.cardTransactionMdr || 0}`,
              nonCardTransactionFee: sql`${productType.nonCardTransactionFee || 0}`,
              nonCardTransactionMdr: sql`${productType.nonCardTransactionMdr || 0}`,
              producttype: productType.producttype || "",
              idFeeBrand: newBrandId,
            };

            await db.insert(feeBrandProductType).values(productTypeInsertData);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Erro ao atualizar taxa ID ${feeData.id}:`, error);
    throw error;
  }
}

// Função para salvar uma taxa (inserir nova ou atualizar existente)
export async function saveFee(feeData: FeeNewSchema): Promise<FeeNewSchema> {
  try {
    console.log("Iniciando salvamento de taxa");

    if (feeData.id) {
      // Atualizar taxa existente
      await updateFee(feeData);
    } else {
      // Inserir nova taxa
      const newId = await insertFee(feeData);
      feeData.id = BigInt(newId);
    }

    return feeData;
  } catch (error) {
    console.error("Erro ao salvar taxa:", error);
    throw error;
  }
}
