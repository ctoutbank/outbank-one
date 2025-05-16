import { MerchantPixAccountSchema } from "../schema/merchant-pixaccount-schema";

import {
  insertMerchantPixAccount,
  MerchantPixAccountInsert,
  MerchantPixAccountUpdate,
  updateMerchantPixAccount,
} from "../server/merchantpixacount";

export async function insertMerchantPixAccountFormAction(
  data: MerchantPixAccountSchema
) {
  console.log("Dados recebidos no form:", data); // Debug

  const merchantPixAccountInsert: MerchantPixAccountInsert = {
    slug: data.slug || "",
    active: data.active || false,
    dtinsert: data.dtinsert?.toString() || new Date().toISOString(),
    dtupdate: data.dtupdate?.toString() || new Date().toISOString(),
    idRegistration: data.idRegistration || "",
    idAccount: data.idAccount || "",
    bankNumber: data.bankNumber, // Usar o valor do campo bank
    bankBranchNumber: data.bankBranchNumber,
    bankBranchDigit: data.bankBranchDigit || "",
    bankAccountNumber: data.bankAccountNumber,
    bankAccountDigit: data.bankAccountDigit || "",
    bankAccountType: data.bankAccountType, // Usar o valor do campo accountType
    bankAccountStatus: data.bankAccountStatus || "",
    onboardingPixStatus: data.onboardingPixStatus || "",
    message: data.message || "",
    bankName: data.bankName || "",
    idMerchant: data.idMerchant,
    slugMerchant: data.slugMerchant || "",
  };

  console.log("Dados para inserção:", merchantPixAccountInsert); // Debug
  const newId = await insertMerchantPixAccount(merchantPixAccountInsert);

  return newId;
}

export async function updateMerchantPixAccountFormAction(
  data: MerchantPixAccountSchema
) {
  const merchantPixAccountUpdate: MerchantPixAccountUpdate = {
    id: data.id || 0,
    slug: data.slug || "",
    active: data.active || false,
    dtinsert: (data.dtinsert || new Date()).toISOString(),
    dtupdate: (data.dtupdate || new Date()).toISOString(),
    idRegistration: data.idRegistration || "",
    idAccount: data.idAccount || "",
    bankNumber: data.bankNumber || "",
    bankBranchNumber: data.bankBranchNumber || "",
    bankBranchDigit: data.bankBranchDigit || "",
    bankAccountNumber: data.bankAccountNumber || "",
    bankAccountDigit: data.bankAccountDigit || "",
    bankAccountType: data.bankAccountType || "",
    bankAccountStatus: data.bankAccountStatus || "",
    onboardingPixStatus: data.onboardingPixStatus || "",
    message: data.message || "",
    bankName: data.bankName || "",
    idMerchant: data.idMerchant || 0,
    slugMerchant: data.slugMerchant || "",
  };

  await updateMerchantPixAccount(merchantPixAccountUpdate);
}
