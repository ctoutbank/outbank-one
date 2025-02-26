"use server"

import { MerchantPriceGroupSchema } from "../schema/merchant-pricegroup-schema";
import { 
    MerchantPriceGroupInsert, 
    MerchantPriceGroupUpdate,
    insertMerchantPriceGroup,
    updateMerchantPriceGroup 
} from "../server/merchantpricegroup";

export async function insertMerchantPriceGroupFormAction(data: MerchantPriceGroupSchema) {
    const priceGroupInsert: MerchantPriceGroupInsert = {
        slug: data.slug || "",
        active: data.active ?? true,
        brand: data.brand || "",
        idGroup: data.idGroup || 0,
        idMerchantPrice: data.idMerchantPrice || 0,
    };

    const result = await insertMerchantPriceGroup(priceGroupInsert);
    return result;
}

export async function updateMerchantPriceGroupFormAction(data: MerchantPriceGroupSchema) {
    if (!data.id) {
        throw new Error("Cannot update price group without an ID");
    }

    const priceGroupUpdate: MerchantPriceGroupUpdate = {
        id: data.id,
        slug: data.slug || "",
        active: data.active ?? true,
        brand: data.brand || "",
        idGroup: data.idGroup || 0,
        idMerchantPrice: data.idMerchantPrice || 0,
        dtinsert: data.dtinsert?.toISOString() || new Date().toISOString(),
        dtupdate: new Date().toISOString(),
    };

    await updateMerchantPriceGroup(priceGroupUpdate);
} 