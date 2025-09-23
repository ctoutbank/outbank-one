import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import LegalNatureForm from "@/features/legalNature/_components/legalNature-form";
import { getLegalNatureById } from "@/features/legalNature/server/legalNature-db";

export const revalidate = 300;

export default async function LegalNaturesDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const legalNature = await getLegalNatureById(parseInt(resolvedParams.id));

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Formatos Jurídicos", url: "/portal/legalNatures" },
        ]}
      />
      <BaseBody
        title="Formato Jurídico"
        subtitle={
          legalNature?.id
            ? "Editar Formato Jurídico"
            : "Adicionar Formato Jurídico"
        }
      >
        <LegalNatureForm
          legalNature={{
            id: legalNature?.id,
            name: legalNature?.name || "",
            slug: legalNature?.slug || "",
            code: legalNature?.code || "",
            active: legalNature?.active ?? true,
            dtinsert: legalNature?.dtinsert
              ? new Date(legalNature.dtinsert)
              : new Date(),
            dtupdate: legalNature?.dtupdate
              ? new Date(legalNature.dtupdate)
              : new Date(),
          }}
        />
      </BaseBody>
    </>
  );
}
