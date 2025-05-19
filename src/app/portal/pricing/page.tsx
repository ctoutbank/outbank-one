import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import FeeList from "@/features/newTax/_components/new-tax-list";

export const revalidate = 0;

export default async function NewTaxPage() {
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
        <FeeList />
      </BaseBody>
    </>
  );
}
