"use client";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { TaxEditForm } from "@/features/taxes/tax-edit-form";
import { useRouter } from "next/navigation";

export default function TaxesFormPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const cnae = decodeURIComponent(params.id);

  function handleSubmit() {
    // Here you would save the data, for now just redirect
    router.push("/portal/taxes");
  }

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Solicitação de Taxas", url: "/portal/taxes" },
          { title: cnae, url: `/portal/taxes/${encodeURIComponent(cnae)}` },
        ]}
      />
      <BaseBody
        title="Solicitação de Taxas"
        subtitle="Preencha os dados para solicitar taxas"
      >
        <TaxEditForm cnae={cnae} onSubmit={handleSubmit} />
      </BaseBody>
    </>
  );
}
