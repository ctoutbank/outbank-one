"use server";

import { syncMerchantPriceGroup } from "./service";


export async function fetchMerchantPriceGroups(slugMerchant: string, slugMerchantPrice: string) {
  try {
    const response = await fetch(
      `https://merchant.acquiring.dock.tech/v1/merchants/${slugMerchant}/merchant_prices/${slugMerchantPrice}/merchant_price_groups`,
      {
        headers: {
          Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IjUwQUYxMDdFMTRERDQ2RTJCQjg5RkE5OEYxNTI2M0RBIn0.7OLleTv9B-68LXORK4FOOgk7L6zl1-NZmh6GZ86V9Dk_4PhmT63qikAivP3ftCA9pKqyJt2v2J2Ds6HDGTb5ug`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    await syncMerchantPriceGroup(data);

  } catch (error) {
    console.error("Erro ao buscar e sincronizar dados:", error);
    throw error;
  }
}

