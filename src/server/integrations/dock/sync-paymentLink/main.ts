"use server";
import { insertPaymentLinkAndRelations } from "./paymentLink";
import { PaymentLinkObject, PaymentLinkResponse } from "./types";

async function fetchPaymentLink() {
  let offset = 0;
  const limit = 1000;
  let hasMoreData = true;
  const allData: PaymentLinkObject[] = [];

  while (hasMoreData) {
    const response = await fetch(
      `https://serviceorder.acquiring.dock.tech/v1/external_payment_links?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IjUwQUYxMDdFMTRERDQ2RTJCQjg5RkE5OEYxNTI2M0RBIn0.7OLleTv9B-68LXORK4FOOgk7L6zl1-NZmh6GZ86V9Dk_4PhmT63qikAivP3ftCA9pKqyJt2v2J2Ds6HDGTb5ug`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse a resposta JSON e defina os tipos
    const data: PaymentLinkResponse = await response.json();

    // Combine os objetos retornados ao array final
    allData.push(...data.objects);

    // Atualize o offset e verifique se ainda há mais dados
    offset += limit;
    hasMoreData = offset < data.meta.total_count;
  }

  return allData;
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

export async function main() {
  try {
    console.log("Buscando payment links...");

    const response = await fetchPaymentLink(); // Obtém a resposta inicial
    const paymentLinks: PaymentLinkObject[] = response || [];

    // Divida a lista em pedaços de 1000 itens
    const chunkedPaymentLinks = chunkArray(paymentLinks, 1000);
    // Envie cada pedaço para a função de insert
    for (const chunk of chunkedPaymentLinks) {
      await insertPaymentLinkAndRelations(chunk);
    }
  } catch (error) {
    console.error("Erro ao processar payment link:", error);
  } finally {
  }
}
