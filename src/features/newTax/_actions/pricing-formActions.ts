"use server";

import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";
import { fee, feeBrand, feeBrandProductType } from "../../../../drizzle/schema";

// Função para salvar as configurações de pricing para uma taxa
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
    for (const group of groups) {
      if (group.selectedCards.length > 0) {
        await processCardBrandGroup(
          feeIdNumber,
          group.selectedCards,
          group.modes
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

// Função para atualizar as configurações de PIX
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

// Função para buscar as configurações de bandeiras de um merchant
export async function getMerchantBrandsByFeeIdAction(feeId: string) {
  try {
    if (!feeId || feeId === "0") {
      return [];
    }

    return await getMerchantBrandsByFeeId(parseInt(feeId));
  } catch (error) {
    console.error("Erro ao buscar bandeiras do merchant:", error);
    return [];
  }
}

// Função para buscar todas as bandeiras associadas a um merchant
async function getMerchantBrandsByFeeId(feeId: number) {
  try {
    const brands = await db
      .select()
      .from(feeBrand)
      .where(eq(feeBrand.idFee, feeId));

    return brands;
  } catch (error) {
    console.error("Erro ao buscar bandeiras do merchant:", error);
    return [];
  }
}

// Função para processar um grupo de bandeiras e seus produtos
async function processCardBrandGroup(
  feeId: number,
  selectedBrands: string[],
  modeData: Record<string, any>
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
            eq(feeBrand.brand, brandName.toUpperCase())
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
            idGroup: 1, // Valor padrão
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
          // Processar cada parcelamento
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

// Função para mapear o ID do modo para o tipo de produto
function mapModeIdToProductType(modeId: string): {
  productType: string;
  installmentStart?: number;
  installmentEnd?: number;
} {
  switch (modeId) {
    case "creditoAVista":
      return { productType: "credit", installmentStart: 1, installmentEnd: 1 };
    case "creditoParcelado2a6":
      return { productType: "credit", installmentStart: 2, installmentEnd: 6 };
    case "creditoParcelado7a12":
      return { productType: "credit", installmentStart: 7, installmentEnd: 12 };
    case "debito":
      return { productType: "debit" };
    case "voucher":
      return { productType: "voucher" };
    case "prePago":
      return { productType: "prepaid" };
    default:
      return { productType: "other" };
  }
}

// Função para processar um tipo de produto
async function processProductType(
  brandId: number,
  productType: string,
  installmentStart?: number,
  installmentEnd?: number,
  modeData?: any
) {
  try {
    if (!modeData) return { success: false };

    // Verificar se o tipo de produto já existe
    const existingProductTypes = await db
      .select()
      .from(feeBrandProductType)
      .where(
        and(
          eq(feeBrandProductType.idFeeBrand, brandId),
          eq(feeBrandProductType.producttype, productType)
        )
      );

    // Filtrar por parcelamento se necessário
    const filteredProductType = existingProductTypes.filter((pt: any) => {
      if (installmentStart === undefined || installmentEnd === undefined) {
        return true;
      }
      return (
        pt.installmentTransactionFeeStart === installmentStart &&
        pt.installmentTransactionFeeEnd === installmentEnd
      );
    });

    if (filteredProductType.length > 0) {
      // Atualizar tipo de produto existente
      const updateData: any = {
        dtupdate: new Date().toISOString(),
      };

      if (modeData.presentIntermediation) {
        updateData.cardTransactionMdr = modeData.presentIntermediation;
      }

      if (modeData.notPresentIntermediation) {
        updateData.nonCardTransactionMdr = modeData.notPresentIntermediation;
      }

      if (modeData.presentTransaction) {
        updateData.cardTransactionFee = modeData.presentTransaction;
      }

      if (modeData.notPresentTransaction) {
        updateData.nonCardTransactionFee = modeData.notPresentTransaction;
      }

      await db
        .update(feeBrandProductType)
        .set(updateData)
        .where(eq(feeBrandProductType.id, filteredProductType[0].id));
    } else {
      // Criar novo tipo de produto
      const newProductType: any = {
        slug: `${productType}-${Date.now()}`,
        active: true,
        dtinsert: new Date().toISOString(),
        dtupdate: new Date().toISOString(),
        producttype: productType,
        idFeeBrand: brandId,
      };

      if (installmentStart !== undefined) {
        newProductType.installmentTransactionFeeStart = installmentStart;
      }

      if (installmentEnd !== undefined) {
        newProductType.installmentTransactionFeeEnd = installmentEnd;
      }

      if (modeData.presentIntermediation) {
        newProductType.cardTransactionMdr = modeData.presentIntermediation;
      }

      if (modeData.notPresentIntermediation) {
        newProductType.nonCardTransactionMdr =
          modeData.notPresentIntermediation;
      }

      if (modeData.presentTransaction) {
        newProductType.cardTransactionFee = modeData.presentTransaction;
      }

      if (modeData.notPresentTransaction) {
        newProductType.nonCardTransactionFee = modeData.notPresentTransaction;
      }

      await db.insert(feeBrandProductType).values(newProductType);
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao processar tipo de produto:", error);
    throw error;
  }
}
