import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { getLegalNatures } from "@/features/legalNature/server/legalNature";
import PaginationRecords from "@/components/pagination-Records";
import ListFilter from "@/components/filter";
import LegalNaturelist from "@/features/legalNature/_components/legalNatures-list";

export const revalidate = 0;

type LegalNatureProps = {
  page: string;
  pageSize: string;
  search: string;
};

export default async function LegalNaturesPage({
  searchParams,
}: {
  searchParams: LegalNatureProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const search = searchParams.search || "";
  const legalNatures = await getLegalNatures(search, page, pageSize);
  const totalRecords = legalNatures.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Natureza Jurídica", url: "/portal/legalNatures" },
        ]}
      />

      <BaseBody
        title="Natureza Jurídica"
        subtitle={`visualização de todas Natureza Jurídica`}
      >
        <ListFilter
          pageName="portal/legalNatures"
          search={search}
          linkHref={"/portal/legalNatures/0"}
          linkText={"Nova Natureza Jurídica"}
        />

        <LegalNaturelist LegalNatures={legalNatures} />
        {totalRecords > 0 && (
          <PaginationRecords
            totalRecords={totalRecords}
            currentPage={page}
            pageSize={pageSize}
            pageName="portal/legalNatures"
          ></PaginationRecords>
        )}
      </BaseBody>
    </>
  );
}
