import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import MerchantList from "./list";

import { getMerchants } from "@/server/db/merchant";

export default async function MerchantsPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const page = 1; // Altere conforme necessário
  const limit = 20;
  const merchants = await getMerchants(page, limit);

  console.log(merchants);
  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Merchants", url: "/portal/merchants" }]}
      />

      <BaseBody
        title="Estabelecimentos"
        subtitle={`visualização de todos os estabelecimentos`}
      >
        <MerchantList list={merchants} />
      </BaseBody>
    </>
  );
}
