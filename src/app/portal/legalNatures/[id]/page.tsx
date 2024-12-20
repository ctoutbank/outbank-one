import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { getLegalNatureById } from "@/features/legalNature/server/legalNature";
import LegalNatureForm from "@/features/legalNature/_components/legalNature-form";

export const revalidate = 0;

export default async function LegalNaturesDetail({
  params,
}: {
  params: { id: string };
}) {
  const legalNature = await getLegalNatureById(parseInt(params.id));

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Naturezas Jurídicas", url: "/portal/legalNatures" },
        ]}
      />
      <BaseBody
        title="New Naturezas Jurídicas"
        subtitle={`Adicionar ou editar Naturezas Jurídicas`}
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
