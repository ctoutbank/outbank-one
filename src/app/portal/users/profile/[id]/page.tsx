import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { getPaymentLinkById } from "@/features/paymentLink/server/paymentLink";
import ProfilesForm from "@/features/users/_components/profiles-form";
import { getModules, Module } from "@/features/users/server/profiles";

export const revalidate = 0;

export default async function PaymentLinkDetail({
  params,
}: {
  params: { id: string };
}) {
  const paymentLinkById = await getPaymentLinkById(parseInt(params.id));


  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Perfil", url: "/portal/users" }]}
      />
      <BaseBody
        title="Perfis"
        subtitle={paymentLinkById?.id ? "Editar Perfil" : "Adicionar Perfil"}
      >
        <ProfilesForm></ProfilesForm>
      </BaseBody>
    </>
  );
}
