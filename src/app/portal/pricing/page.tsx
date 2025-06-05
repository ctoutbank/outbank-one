import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { getFeesAction } from "@/features/newTax/server/fee-db";

import FeeList from "@/features/newTax/_components/new-tax-list";

export const revalidate = 0;

export default async function NewTaxPage() {
  // Buscar taxas no servidor usando a action
  const fees = await getFeesAction();
  console.log("fees", fees);

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Cadastro de Taxas de Cobrança", url: "/portal/pricing" },
        ]}
      />
      <BaseBody
        title="Cadastro de Taxas de Cobrança"
        subtitle={"Taxas de cobrança que serão aplicadas nas transações"}
      >
        <FeeList fees={fees} />
      </BaseBody>
    </>
  );
}
