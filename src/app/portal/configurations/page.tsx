import { PageHeader } from "@/components/layout/portal/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { columns } from "@/features/configuration/components/configurations-columns";
import { ConfigurationsDataTable } from "@/features/configuration/components/configurations-data-table";
import { getConfigurations } from "@/features/configuration/server/configuration";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface ConfigurationsPageProps {
  searchParams: {
    search?: string;
    page?: string;
  };
}

function ConfigurationsSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-muted rounded w-full mb-6"></div>
          <div className="space-y-2">
            <div className="h-12 bg-muted rounded w-full"></div>
            <div className="h-12 bg-muted rounded w-full"></div>
            <div className="h-12 bg-muted rounded w-full"></div>
            <div className="h-12 bg-muted rounded w-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ConfigurationsPage({
  searchParams,
}: ConfigurationsPageProps) {
  const permissions = await checkPagePermission("Configurações");

  const search = searchParams.search || "";
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;

  const { configurations, totalCount } = await getConfigurations(
    search,
    page,
    pageSize
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações gerais do sistema."
      >
        <Button asChild>
          <Link href="/portal/configurations/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Configuração
          </Link>
        </Button>
      </PageHeader>
      <Suspense fallback={<ConfigurationsSkeleton />}>
        <Card>
          <CardContent className="p-0">
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
              permissions={permissions}
            />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}