"use server";

import { getFeeById } from "@/features/newTax/server/fee-db";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  merchantPrice,
  merchantPriceGroup,
  merchants,
  merchantTransactionPrice,
} from "../../../../drizzle/schema";

interface CreateMerchantPriceInput {
  feeId: string;
  merchantId: number;
}

export async function createMerchantPriceFromFeeAction(
  input: CreateMerchantPriceInput
) {
  try {
    const { feeId, merchantId } = input;

    console.log("=== DEBUG: Iniciando createMerchantPriceFromFeeAction ===");
    console.log("Input:", { feeId, merchantId });

    // 1. Buscar a fee completa
    const fee = await getFeeById(feeId);
    if (!fee) {
      console.log("ERROR: Taxa não encontrada para feeId:", feeId);
      return { success: false, error: "Taxa não encontrada" };
    }

    console.log("Fee encontrada:", {
      id: fee.id,
      name: fee.name,
      tableType: fee.tableType,
      feeBrandCount: fee.feeBrand?.length || 0,
    });

    // 2. Buscar o merchant
    const [merchant] = await db
      .select()
      .from(merchants)
      .where(eq(merchants.id, merchantId));

    if (!merchant) {
      console.log(
        "ERROR: Estabelecimento não encontrado para merchantId:",
        merchantId
      );
      return { success: false, error: "Estabelecimento não encontrado" };
    }

    console.log("Merchant encontrado:", {
      id: merchant.id,
      slug: merchant.slug,
      name: merchant.name,
      idMerchantPrice: merchant.idMerchantPrice,
    });

    // 3. Verificar se o merchant já possui uma taxa atribuída
    if (merchant.idMerchantPrice) {
      console.log(
        "ERROR: Merchant já possui taxa atribuída:",
        merchant.idMerchantPrice
      );
      return {
        success: false,
        error: "Estabelecimento já possui uma taxa atribuída",
      };
    }

    const now = new Date().toISOString();

    // Função helper para converter valores numéricos para string (formato do DB)
    const parseNumericValue = (
      value: string | number | null | undefined
    ): string | null => {
      if (value === null || value === undefined || value === "") return "0";
      if (typeof value === "number") return value.toString();

      // Remove % e espaços, substitui vírgula por ponto
      const cleanValue = value
        .toString()
        .replace(/[%\s]/g, "")
        .replace(",", ".");
      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? "0" : parsed.toString();
    };

    // Função helper para converter valores inteiros
    const parseIntegerValue = (
      value: string | number | null | undefined
    ): number => {
      if (value === null || value === undefined || value === "") return 0;
      if (typeof value === "number") return Math.floor(value);

      const parsed = parseInt(value.toString(), 10);
      return isNaN(parsed) ? 0 : parsed;
    };

    try {
      // 4.1. Criar merchantPrice baseado na fee
      const merchantPriceData = {
        slug: "",
        active: true,
        dtinsert: now,
        dtupdate: now,
        slugMerchant: merchant.slug || "",
        name: fee.name || null,
        tableType: fee.tableType || null,
        compulsoryAnticipationConfig: parseIntegerValue(
          fee.compulsoryAnticipationConfig
        ),
        eventualAnticipationFee: parseNumericValue(fee.eventualAnticipationFee),
        anticipationType: fee.anticipationType || null,
        cardPixMdr: parseNumericValue(fee.cardPixMdr),
        cardPixCeilingFee: parseNumericValue(fee.cardPixCeilingFee),
        cardPixMinimumCostFee: parseNumericValue(fee.cardPixMinimumCostFee),
        nonCardPixMdr: parseNumericValue(fee.nonCardPixMdr),
        nonCardPixCeilingFee: parseNumericValue(fee.nonCardPixCeilingFee),
        nonCardPixMinimumCostFee: parseNumericValue(
          fee.nonCardPixMinimumCostFee
        ),
      };

      console.log(
        "Dados do merchantPrice a serem inseridos:",
        merchantPriceData
      );

      const [newMerchantPrice] = await db
        .insert(merchantPrice)
        .values(merchantPriceData)
        .returning({ id: merchantPrice.id });

      console.log("MerchantPrice criado com ID:", newMerchantPrice.id);

      // 4.2. Atualizar o merchant com o novo idMerchantPrice
      await db
        .update(merchants)
        .set({
          idMerchantPrice: newMerchantPrice.id,
          dtupdate: now,
        })
        .where(eq(merchants.id, merchant.id));

      console.log(
        "Merchant atualizado com idMerchantPrice:",
        newMerchantPrice.id
      );

      // 4.3. Criar merchantPriceGroups e merchantTransactionPrices
      if (fee.feeBrand && fee.feeBrand.length > 0) {
        console.log("Criando", fee.feeBrand.length, "merchantPriceGroups");

        for (let index = 0; index < fee.feeBrand.length; index++) {
          const feeBrandItem = fee.feeBrand[index];
          console.log(
            `Processando feeBrand ${index + 1}/${fee.feeBrand.length}:`,
            {
              brand: feeBrandItem.brand,
              idGroup: feeBrandItem.idGroup,
              active: feeBrandItem.active,
              productTypeCount: feeBrandItem.feeBrandProductType?.length || 0,
            }
          );

          const merchantPriceGroupData = {
            slug: `mpg-${feeBrandItem.brand.toLowerCase()}-${Date.now()}-${index}`,
            active: feeBrandItem.active ?? true,
            dtinsert: now,
            dtupdate: now,
            brand: feeBrandItem.brand || null,
            idGroup: feeBrandItem.idGroup || null,
            idMerchantPrice: newMerchantPrice.id,
          };

          const [newMerchantPriceGroup] = await db
            .insert(merchantPriceGroup)
            .values(merchantPriceGroupData)
            .returning({ id: merchantPriceGroup.id });

          console.log(
            "MerchantPriceGroup criado com ID:",
            newMerchantPriceGroup.id
          );

          // 4.4. Criar merchantTransactionPrice baseados nos feeBrandProductTypes
          if (
            feeBrandItem.feeBrandProductType &&
            feeBrandItem.feeBrandProductType.length > 0
          ) {
            console.log(
              "Criando",
              feeBrandItem.feeBrandProductType.length,
              "merchantTransactionPrices"
            );

            const transactionPrices = feeBrandItem.feeBrandProductType.map(
              (productType: any, ptIndex: number) => {
                // Mapear o producttype descritivo para o valor correto do banco
                let dbProductType = productType.producttype;
                if (productType.producttype?.includes("Crédito")) {
                  dbProductType = "CREDIT";
                } else if (productType.producttype?.includes("Débito")) {
                  dbProductType = "DEBIT";
                } else if (productType.producttype?.includes("Pré-Pago")) {
                  dbProductType = "PREPAID";
                } else if (productType.producttype?.includes("Voucher")) {
                  dbProductType = "VOUCHER";
                }

                const transactionData = {
                  slug: `mtp-${dbProductType}-${Date.now()}-${index}-${ptIndex}`,
                  active: productType.active ?? true,
                  dtinsert: now,
                  dtupdate: now,
                  installmentTransactionFeeStart:
                    productType.installmentTransactionFeeStart || 1,
                  installmentTransactionFeeEnd:
                    productType.installmentTransactionFeeEnd || 1,
                  cardTransactionFee: productType.cardTransactionFee || 0,
                  cardTransactionMdr: parseNumericValue(
                    productType.cardTransactionMdr
                  ),
                  nonCardTransactionFee: productType.nonCardTransactionFee || 0,
                  nonCardTransactionMdr: parseNumericValue(
                    productType.nonCardTransactionMdr
                  ),
                  producttype: dbProductType,
                  idMerchantPriceGroup: newMerchantPriceGroup.id,
                };

                console.log(
                  `TransactionPrice ${ptIndex + 1}:`,
                  transactionData
                );
                return transactionData;
              }
            );

            await db.insert(merchantTransactionPrice).values(transactionPrices);
            console.log("MerchantTransactionPrices criados com sucesso");
          }
        }
      } else {
        console.log("Nenhuma feeBrand encontrada para processar");
      }

      console.log("=== SUCCESS: Taxa atribuída com sucesso ===");
      return {
        success: true,
        merchantPriceId: newMerchantPrice.id,
        message: "Taxa atribuída ao estabelecimento com sucesso!",
      };
    } catch (innerError) {
      console.error("=== ERROR: Erro durante a criação dos dados ===");
      console.error("Inner error details:", innerError);
      throw innerError;
    }
  } catch (error) {
    console.error("=== ERROR: Erro ao criar merchantPrice a partir da fee ===");
    console.error("Error details:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace available"
    );

    return {
      success: false,
      error: `Erro interno do servidor: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    };
  }
}
