import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import { NewTaxForm1 } from "@/features/newTax/_components/new-tax-form1";
import {
  getCategories,
  getFeeByIdAction,
} from "@/features/newTax/server/fee-db";

export const revalidate = 0;

export default async function FeeDetail({
  params,
}: {
  params: { id: string };
}) {
  console.log("Renderizando página com ID:", params.id);

  // Buscar dados da taxa pelo ID usando as actions
  const feeById = await getFeeByIdAction(params.id);
  // Buscar categorias MCC/CNAE
  const categories = await getCategories();
  console.log("Dados da taxa:", feeById ? "Encontrados" : "Não encontrados");
  console.log("Dados completos da taxa:", JSON.stringify(feeById, null, 2));

  // Buscar o tipo de antecipação

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Cadastro de Taxas de Cobrança", url: "/portal/pricing" },
        ]}
      />
      <BaseBody
        title="Cadastro de Taxas de Cobrança"
        subtitle={
          feeById?.id && feeById.id !== "0"
            ? "Editar Taxa"
            : "Adicionar Nova Taxa"
        }
      >
        {feeById && <NewTaxForm1 fee={feeById} categories={categories} />}
      </BaseBody>
    </>
  );
}
