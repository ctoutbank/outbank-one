import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import FeeForm from "@/features/newTax/_components/new-tax-form";
import {
  getBandeiras,
  getFeeById,
  getModosPagamento,
} from "@/features/newTax/server/fee";

export const revalidate = 0;

export default async function FeeDetail({
  params,
}: {
  params: { id: string };
}) {
  // Buscar dados da taxa pelo ID
  const feeById = await getFeeById(params.id);

  // Buscar bandeiras e modos de pagamento disponíveis
  const bandeiras = await getBandeiras();
  const modosPagamento = await getModosPagamento();

  return (
    <>
      <BaseHeader breadcrumbItems={[{ title: "Cadastro de Taxas de Cobrança", url: "/portal/newTax" }]} />
      <BaseBody
        title="Cadastro de Taxas de Cobrança"
        subtitle={
          feeById?.id && feeById.id !== "0"
            ? "Editar Taxa"
            : "Adicionar Nova Taxa"
        }
      >
        <FeeForm
          fee={
            feeById ?? {
              id: "0",
              code: "",
              description: "",
              type: "Antecipação Compulsória",
              count: 0,
              feeDetails: [],
            }
          }
          bandeiras={bandeiras}
          modosPagamento={modosPagamento}
        />
      </BaseBody>
    </>
  );
}
