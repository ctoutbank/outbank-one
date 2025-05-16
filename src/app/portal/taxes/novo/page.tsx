"use client";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { TaxesForm } from "@/features/taxes/taxes-form";
import { useRouter } from "next/navigation";

export default function TaxesNovoPage() {
  const router = useRouter();

  function handleSubmit() {
    router.push("/portal/taxes");
  }

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Solicitação de Taxas", url: "/portal/taxes" },
          { title: "Novo", url: "/portal/taxes/novo" },
        ]}
      />
      <BaseBody
        title="Solicitação de Taxas"
        subtitle="Preencha os dados para solicitar taxas"
      >
        <TaxesForm onSubmit={handleSubmit} />
      </BaseBody>
    </>
  );
}
