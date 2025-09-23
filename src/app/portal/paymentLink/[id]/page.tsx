import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaymentLinkForm from "@/features/paymentLink/_components/paymentLink-form";
import { PaymentLinkNotFoundToast } from "@/features/paymentLink/_components/paymentLink-not-found-toast";
import {
  getMerchants,
  getPaymentLinkById,
} from "@/features/paymentLink/server/paymentLink";

export const revalidate = 300;

export default async function PaymentLinkDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  // Validar se o ID é um número válido (permitindo 0 para criação)
  const id = parseInt(resolvedParams.id);
  if (isNaN(id) || id < 0) {
    return <PaymentLinkNotFoundToast />;
  }

  const paymentLinkById = await getPaymentLinkById(id);
  const merchants = await getMerchants();

  if (!paymentLinkById) {
    return <PaymentLinkNotFoundToast />;
  }

  const isNew = id === 0;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Links de Pagamento", url: "/portal/paymentLink" },
        ]}
      />
      <BaseBody
        title="Link de Pagamento"
        subtitle={
          isNew
            ? "Adicionar Link de Pagamento"
            : "Editar Link de Pagamento"
        }
      >
        <PaymentLinkForm
          paymentLink={paymentLinkById}
          merchant={merchants}
        />
      </BaseBody>
    </>
  );
}
