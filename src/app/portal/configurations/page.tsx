import { Suspense } from "react";
import { ConfigurationsDataTable } from "@/features/configuration/components/configurations-data-table";
import { columns } from "@/features/configuration/components/configurations-columns";
import { getConfigurations } from "@/features/configuration/server/configuration";

interface ConfigurationsPageProps {
  searchParams: {
    search?: string;
    page?: string;
  };
}

export default async function ConfigurationsPage({
  searchParams,
}: ConfigurationsPageProps) {
  const search = searchParams.search || "";
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;

  const { configurations, totalCount } = await getConfigurations(
    search,
    page,
    pageSize
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Configurations</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ConfigurationsDataTable
          columns={columns}
          data={configurations.map((config) => ({
            ...config,
            url: config.url ?? undefined,
            slug: config.slug ?? undefined,
            active: config.active ?? undefined,
            lockCpAnticipationOrder:
              config.lockCpAnticipationOrder ?? undefined,
            lockCnpAnticipationOrder:
              config.lockCnpAnticipationOrder ?? undefined,
            dtinsert: config.dtinsert ?? undefined,
            dtupdate: config.dtupdate ?? undefined,
          }))}
          totalCount={totalCount}
          pageSize={pageSize}
          page={page}
        />
      </Suspense>
    </div>
  );
}
