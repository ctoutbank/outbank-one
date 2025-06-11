"use server";

import { FeeNewSchema } from "@/features/newTax/schema/fee-new-Schema";
import { saveFee } from "@/features/newTax/server/fee-db";
import { db } from "@/server/db";
import { and, eq, sql } from "drizzle-orm";
import {
  fee,
  feeBrand,
  feeBrandProductType,
  feeCredit,
} from "../../../../drizzle/schema";

/**
 * Salva as configurações de pricing para uma taxa
 */
export async function saveMerchantPricingAction(
  feeId: string,
  groups: {
    id: string;
    selectedCards: string[];
    modes: Record<string, any>;
  }[]
) {
  try {
    // Validar feeId
    if (!feeId || feeId === "0") {
      throw new Error("ID da taxa inválido");
    }

    // Converter feeId para número
    const feeIdNumber = parseInt(feeId);

    // Processar cada grupo de bandeiras
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
      const group = groups[groupIndex];
      if (group.selectedCards.length > 0) {
        await processCardBrandGroup(
          feeIdNumber,
          group.selectedCards,
          group.modes,
          groupIndex + 1 // idGroup correto
        );
      }
    }

    // Atualizar a data de atualização da taxa
    await db
      .update(fee)
      .set({
        dtupdate: new Date().toISOString(),
      })
      .where(eq(fee.id, feeIdNumber));

    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar configurações de pricing:", error);
    throw error;
  }
}

/**
 * Atualiza as configurações de PIX para uma taxa
 */
export async function updatePixConfigAction(
  feeId: string,
  pixConfig: {
    mdrPresent: string;
    mdrNotPresent: string;
    minCostPresent: string;
    minCostNotPresent: string;
    maxCostPresent: string;
    maxCostNotPresent: string;
    anticipationRatePresent?: string;
    anticipationRateNotPresent?: string;
  }
) {
  try {
    // Validar feeId
    if (!feeId || feeId === "0") {
      throw new Error("ID da taxa inválido");
    }

    // Converter feeId para número
    const feeIdNumber = parseInt(feeId);

    // Converter valores de string para número
    const pixData: any = {
      cardPixMdr: parseFloat(pixConfig.mdrPresent || "0"),
      nonCardPixMdr: parseFloat(pixConfig.mdrNotPresent || "0"),
      cardPixMinimumCostFee: parseFloat(pixConfig.minCostPresent || "0"),
      nonCardPixMinimumCostFee: parseFloat(pixConfig.minCostNotPresent || "0"),
      cardPixCeilingFee: parseFloat(pixConfig.maxCostPresent || "0"),
      nonCardPixCeilingFee: parseFloat(pixConfig.maxCostNotPresent || "0"),
      dtupdate: new Date().toISOString(),
    };

    // Se a antecipação eventual estiver definida, incluir as taxas de antecipação
    if (pixConfig.anticipationRatePresent !== undefined) {
      pixData.eventualAnticipationFee = parseFloat(
        pixConfig.anticipationRatePresent || "0"
      );
    }

    // Atualizar as configurações de PIX
    await db.update(fee).set(pixData).where(eq(fee.id, feeIdNumber));

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar configurações de PIX:", error);
    throw error;
  }
}

/**
 * Processa um grupo de bandeiras e seus produtos
 */
async function processCardBrandGroup(
  feeId: number,
  selectedBrands: string[],
  modeData: Record<string, any>,
  idGroup: number
) {
  try {
    // Para cada bandeira selecionada, processar os dados
    for (const brandName of selectedBrands) {
      // Buscar ou criar a bandeira
      let brandId;
      const existingBrands = await db
        .select()
        .from(feeBrand)
        .where(
          and(
            eq(feeBrand.idFee, feeId),
            eq(feeBrand.brand, brandName.toUpperCase()),
            eq(feeBrand.idGroup, idGroup)
          )
        );

      if (existingBrands.length > 0) {
        brandId = existingBrands[0].id;
      } else {
        // Criar nova bandeira
        const [newBrand] = await db
          .insert(feeBrand)
          .values({
            slug: `${brandName.toLowerCase()}-${Date.now()}`,
            active: true,
            dtinsert: new Date().toISOString(),
            dtupdate: new Date().toISOString(),
            brand: brandName.toUpperCase(),
            idGroup,
            idFee: feeId,
          })
          .returning({ id: feeBrand.id });

        brandId = newBrand.id;
      }

      // Para cada modo de pagamento, processar os dados
      for (const [modeId, mode] of Object.entries(modeData)) {
        const { productType, installmentStart, installmentEnd } =
          mapModeIdToProductType(modeId);

        // Se tem parcelamento e installments
        if (installmentStart && installmentEnd && mode.installments) {
          if (mode.expanded) {
            // Se expandido, salva cada parcela individualmente
            for (let i = installmentStart; i <= installmentEnd; i++) {
              if (mode.installments[i]) {
                await processProductType(
                  Number(brandId),
                  productType,
                  i,
                  i,
                  mode.installments[i]
                );
              }
            }
          } else {
            // Se NÃO expandido, salva uma linha única para o range
            await processProductType(
              Number(brandId),
              productType,
              installmentStart,
              installmentEnd,
              mode
            );
          }
        } else {
          // Processar modo sem parcelamento
          await processProductType(
            Number(brandId),
            productType,
            installmentStart,
            installmentEnd,
            mode
          );
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao processar grupo de bandeiras:", error);
    throw error;
  }
}

/**
 * Mapeia o ID do modo para o tipo de produto
 */
function mapModeIdToProductType(modeId: string): {
  productType: string;
  installmentStart?: number;
  installmentEnd?: number;
} {
  switch (modeId) {
    case "CREDIT":
      return { productType: "credit", installmentStart: 1, installmentEnd: 1 };
    case "CREDIT_INSTALLMENTS_2_TO_6":
      return { productType: "credit", installmentStart: 2, installmentEnd: 6 };
    case "CREDIT_INSTALLMENTS_7_TO_12":
      return { productType: "credit", installmentStart: 7, installmentEnd: 12 };
    case "DEBIT":
      return { productType: "debit" };
    case "VOUCHER":
      return { productType: "voucher" };
    case "PREPAID_CREDIT":
      return { productType: "prepaid" };
    default:
      return { productType: "credit", installmentStart: 1, installmentEnd: 1 };
  }
}

/**
 * Processa um tipo de produto
 */
async function processProductType(
  brandId: number,
  productType: string,
  installmentStart?: number,
  installmentEnd?: number,
  modeData?: any
) {
  try {
    if (!modeData) return { success: false };

    // Log detalhado dos valores recebidos
    console.log(
      "[DEBUG] processProductType - modeData recebido:",
      JSON.stringify(
        {
          brandId,
          productType,
          installmentStart,
          installmentEnd,
          modeData,
        },
        null,
        2
      )
    );

    // Buscar tipo de produto existente
    const existingProductTypes = await db
      .select()
      .from(feeBrandProductType)
      .where(
        and(
          eq(feeBrandProductType.idFeeBrand, brandId),
          eq(feeBrandProductType.producttype, productType),
          installmentStart
            ? eq(
                feeBrandProductType.installmentTransactionFeeStart,
                installmentStart
              )
            : undefined,
          installmentEnd
            ? eq(
                feeBrandProductType.installmentTransactionFeeEnd,
                installmentEnd
              )
            : undefined
        )
      );

    // Função para converter valores com vírgula para float
    const parseDecimalValue = (value: string | number | undefined): number => {
      if (value === undefined || value === "") return 0;

      // Se já for um número, retorna
      if (typeof value === "number") return value;

      // Converte string para número, substituindo vírgula por ponto
      return parseFloat(value.toString().replace(",", "."));
    };

    // Extrair e converter valores das taxas
    const presentIntermediation = parseDecimalValue(
      modeData.presentIntermediation
    );
    const notPresentIntermediation = parseDecimalValue(
      modeData.notPresentIntermediation
    );
    const presentTransaction = parseDecimalValue(modeData.presentTransaction);
    const notPresentTransaction = parseDecimalValue(
      modeData.notPresentTransaction
    );

    console.log("[DEBUG] Valores convertidos:", {
      presentIntermediation,
      notPresentIntermediation,
      presentTransaction,
      notPresentTransaction,
    });

    // Preparar dados para inserção/atualização
    const productTypeData = {
      slug: `${productType}-${Date.now()}`,
      active: true,
      dtupdate: new Date().toISOString(),
      producttype: productType,
      installmentTransactionFeeStart: installmentStart || 0,
      installmentTransactionFeeEnd: installmentEnd || 0,
      cardTransactionFee: presentTransaction || 0,
      cardTransactionMdr: sql`${presentIntermediation.toFixed(2)}`,
      nonCardTransactionFee: notPresentTransaction || 0,
      nonCardTransactionMdr: sql`${notPresentIntermediation.toFixed(2)}`,
      idFeeBrand: brandId,
    };

    console.log(
      "[DEBUG] Dados preparados para inserção/atualização:",
      productTypeData
    );

    let productTypeId: number | undefined;
    if (existingProductTypes.length > 0) {
      productTypeId = existingProductTypes[0].id;
      await db
        .update(feeBrandProductType)
        .set(productTypeData)
        .where(eq(feeBrandProductType.id, productTypeId));
    } else {
      const inserted = await db
        .insert(feeBrandProductType)
        .values({
          ...productTypeData,
          dtinsert: new Date().toISOString(),
        })
        .returning({ id: feeBrandProductType.id });
      productTypeId = inserted[0]?.id;
    }

    // Salvar/atualizar feeCredit para antecipação compulsória
    if (productTypeId) {
      // Buscar se já existe feeCredit para este feeBrandProductType e installment
      const existingFeeCredit = await db
        .select()
        .from(feeCredit)
        .where(
          and(
            eq(feeCredit.idFeeBrandProductType, productTypeId),
            eq(feeCredit.installmentNumber, installmentStart || 0)
          )
        );

      // Converte para string ou null
      const compulsoryAnticipation = modeData.presentAnticipation
        ? parseDecimalValue(modeData.presentAnticipation).toFixed(2)
        : null;
      const noCardCompulsoryAnticipation = modeData.notPresentAnticipation
        ? parseDecimalValue(modeData.notPresentAnticipation).toFixed(2)
        : null;

      if (existingFeeCredit.length > 0) {
        await db
          .update(feeCredit)
          .set({
            compulsoryAnticipation,
            noCardCompulsoryAnticipation,
            dtupdate: new Date().toISOString(),
          })
          .where(eq(feeCredit.id, existingFeeCredit[0].id));
      } else {
        await db.insert(feeCredit).values({
          installmentNumber: installmentStart || 0,
          compulsoryAnticipation,
          noCardCompulsoryAnticipation,
          idFeeBrandProductType: productTypeId,
          dtinsert: new Date().toISOString(),
          dtupdate: new Date().toISOString(),
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao processar tipo de produto:", error);
    throw error;
  }
}

export async function SaveFeeform(data: FeeNewSchema) {
  try {
    // Convertemos campos específicos para os tipos esperados pela função saveFee
    const feeData = {
      ...data,
      // Convertemos id para bigint se existir
      id: data.id ? BigInt(data.id.toString()) : undefined,

      // Campos numéricos devem ser convertidos para number
      compulsoryAnticipationConfig:
        data.compulsoryAnticipationConfig !== undefined
          ? Number(data.compulsoryAnticipationConfig)
          : undefined,

      eventualAnticipationFee:
        data.eventualAnticipationFee !== undefined
          ? Number(data.eventualAnticipationFee)
          : undefined,

      cardPixMdr:
        data.cardPixMdr !== undefined ? Number(data.cardPixMdr) : undefined,

      cardPixCeilingFee:
        data.cardPixCeilingFee !== undefined
          ? Number(data.cardPixCeilingFee)
          : undefined,

      cardPixMinimumCostFee:
        data.cardPixMinimumCostFee !== undefined
          ? Number(data.cardPixMinimumCostFee)
          : undefined,

      nonCardPixMdr:
        data.nonCardPixMdr !== undefined
          ? Number(data.nonCardPixMdr)
          : undefined,

      nonCardPixCeilingFee:
        data.nonCardPixCeilingFee !== undefined
          ? Number(data.nonCardPixCeilingFee)
          : undefined,

      nonCardPixMinimumCostFee:
        data.nonCardPixMinimumCostFee !== undefined
          ? Number(data.nonCardPixMinimumCostFee)
          : undefined,

      // Não incluímos feeBrand na conversão inicial, pois o saveFee vai cuidar disso
      feeBrand: undefined,
    };

    // Chamar saveFee apenas com os dados básicos da taxa
    // saveFee já tem lógica para tratar os feeBrand separadamente
    const savedFee = await saveFee(feeData);

    return { success: true, feeId: savedFee.id };
  } catch (error) {
    console.error("Erro ao salvar taxa:", error);
    throw error;
  }
}

export interface SaveFeeFullInput {
  fee: FeeNewSchema;
  pixConfig: any;
  groups: any[];
}

export async function saveOrUpdateFeeAction(data: SaveFeeFullInput) {
  // 1. Salva ou atualiza a fee
  const feeResult = await SaveFeeform(data.fee);
  const feeId = feeResult.feeId?.toString();
  if (!feeId) throw new Error("Falha ao obter ID da taxa");

  // 2. Atualiza Pix
  if (data.pixConfig) await updatePixConfigAction(feeId, data.pixConfig);

  // 3. Salva/atualiza feeBrand e feeBrandProductType
  if (data.groups) await saveMerchantPricingAction(feeId, data.groups);

  return { success: true, feeId };
}
