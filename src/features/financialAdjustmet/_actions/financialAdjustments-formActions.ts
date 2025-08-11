import { FinancialAdjustmentSchema } from "../schema/schema";
import {
  addMerchantToFinancialAdjustment,
  FinancialAdjustmentDetail,
  FinancialAdjustmentInsert,
  getMerchantsForFinancialAdjustment,
  insertFinancialAdjustment,
  removeMerchantFromFinancialAdjustment,
  updateFinancialAdjustment,
} from "../server/financialAdjustments";

export async function insertFinancialAdjustmentFormAction(
  data: FinancialAdjustmentSchema
) {
  console.log("Dados recebidos no insertFinancialAdjustmentFormAction:", data);

  const adjustmentInsert: FinancialAdjustmentInsert = {
    externalId: data.externalId || null,
    slug: data.slug || null,
    active: data.active ?? true,
    expectedSettlementDate: data.expectedSettlementDate || null,
    reason: data.reason || null,
    title: data.title || null,
    description: data.description || null,
    rrn: data.rrn || null,
    grossValue: data.grossValue || null,
    recurrence: data.recurrence || null,
    type: data.type || null,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
  };

  console.log("Dados a serem inseridos:", adjustmentInsert);

  const newId = await insertFinancialAdjustment(adjustmentInsert);

  // Associar merchants se fornecidos
  if (data.merchants && data.merchants.length > 0) {
    for (const merchantId of data.merchants) {
      await addMerchantToFinancialAdjustment(newId, merchantId);
    }
  }

  return newId;
}

export async function updateFinancialAdjustmentFormAction(
  data: FinancialAdjustmentSchema
) {
  if (!data.id) {
    throw new Error("Cannot update financial adjustment without an ID");
  }

  console.log("Dados recebidos no updateFinancialAdjustmentFormAction:", data);

  const adjustmentUpdate: FinancialAdjustmentDetail = {
    id: data.id,
    externalId: data.externalId || null,
    slug: data.slug || null,
    active: data.active ?? true,
    expectedSettlementDate: data.expectedSettlementDate || null,
    reason: data.reason || null,
    title: data.title || null,
    description: data.description || null,
    rrn: data.rrn || null,
    grossValue: data.grossValue || null,
    recurrence: data.recurrence || null,
    type: data.type || null,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    dtinsert: new Date().toISOString(),
    dtupdate: new Date().toISOString(),
    idCustomer: Number(data.idCustomer),
  };

  console.log("Dados a serem atualizados:", adjustmentUpdate);

  await updateFinancialAdjustment(adjustmentUpdate);

  // Gerenciar merchants associados
  if (data.merchants !== undefined) {
    // Buscar merchants atuais
    const currentMerchants = await getMerchantsForFinancialAdjustment(data.id);
    const currentMerchantIds = currentMerchants.map((m) => m.id);
    const newMerchantIds = data.merchants;

    // Remover merchants que não estão mais na lista
    for (const merchantId of currentMerchantIds) {
      if (!newMerchantIds.includes(merchantId)) {
        await removeMerchantFromFinancialAdjustment(data.id, merchantId);
      }
    }

    // Adicionar novos merchants
    for (const merchantId of newMerchantIds) {
      if (!currentMerchantIds.includes(merchantId)) {
        await addMerchantToFinancialAdjustment(data.id, merchantId);
      }
    }
  }
}

export async function addMerchantToFinancialAdjustmentAction(
  idFinancialAdjustment: number,
  idMerchant: number
) {
  return await addMerchantToFinancialAdjustment(
    idFinancialAdjustment,
    idMerchant
  );
}

export async function removeMerchantFromFinancialAdjustmentAction(
  idFinancialAdjustment: number,
  idMerchant: number
) {
  await removeMerchantFromFinancialAdjustment(
    idFinancialAdjustment,
    idMerchant
  );
}

export async function deactivateFinancialAdjustmentFormAction(id: number) {
  if (!id)
    throw new Error("ID do ajuste financeiro é obrigatório para desativar");
  await updateFinancialAdjustment({ id, active: false } as any);
}

export async function toggleFinancialAdjustmentActiveFormAction(
  id: number,
  active: boolean
) {
  if (!id)
    throw new Error(
      "ID do ajuste financeiro é obrigatório para ativar/desativar"
    );
  await updateFinancialAdjustment({ id, active } as any);
}
