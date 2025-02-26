import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import Categoriesform from "@/features/categories/_components/categories-form";
import { getCategoryById } from "@/features/categories/server/category";
import PaymentLinkForm from "@/features/paymentLink/_components/paymentLink-form";
import {
  getMerchants,
  getPaymentLinkById,
} from "@/features/paymentLink/server/paymentLink";

export const revalidate = 0;

export default async function CategoryDetail({
  params,
}: {
  params: { id: string };
}) {
  const paymentLinkById = await getPaymentLinkById(parseInt(params.id));
  const merchants = await getMerchants();

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
          paymentLinkById?.id
            ? "Editar Link de Pagamento"
            : "Adicionar Link de Pagamento"
        }
      >
        <PaymentLinkForm
          paymentLink={
            paymentLinkById ?? {
              id: 0,
              slug: null,
              active: null,
              dtinsert: null,
              dtupdate: null,
              linkName: null,
              dtExpiration: null,
              totalAmount: null,
              idMerchant: null,
              paymentLinkStatus: null,
              productType: null,
              installments: null,
              linkUrl: null,
              pixEnabled: null,
              transactionSlug: null,
            }
          }
          merchant={merchants}
        />
      </BaseBody>
    </>
  );
}
