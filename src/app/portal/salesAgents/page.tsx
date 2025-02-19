import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationRecords from "@/components/pagination-Records";
import { getSalesAgents } from "@/features/salesAgents/server/salesAgent";
import SalesAgentlist from "../../../features/salesAgents/_components/salesAgents-list";
import FilterSalesAgents from "@/features/salesAgents/_components/filterSalesAgents";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import SalesAgentOverview from "@/features/salesAgents/_components/salesAgents-overview"

export const revalidate = 0;

type SalesAgentProps = {
    page?: string;
    pageSize?: string;
    name?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    email?: string;
};

export default async function SalesAgentsPage({
    searchParams,
}: {
    searchParams: SalesAgentProps;
}) {
    const page = parseInt(searchParams.page || "1");
    const pageSize = parseInt(searchParams.pageSize || "10");
    
    const salesAgents = await getSalesAgents(
        searchParams.name || "",
        page,
        pageSize,
        searchParams.status,
        searchParams.dateFrom,
        searchParams.dateTo,
        searchParams.email
    );
    const totalRecords = salesAgents.totalCount;

    return (
        <>
            <BaseHeader
                breadcrumbItems={[{ title: "Consultores", url: "/portal/salesAgents" }]}
            />

            <BaseBody
                title="Consultores"
                subtitle={`Visualização de todos os Consultores`}
            >
                <div className="flex justify-between w-full">
                    <FilterSalesAgents
                        nameIn={searchParams.name}
                        statusIn={searchParams.status}
                        dateFromIn={searchParams.dateFrom ? new Date(searchParams.dateFrom) : undefined}
                        dateToIn={searchParams.dateTo ? new Date(searchParams.dateTo) : undefined}
                    />
                </div>

                <div className="mb-4 -mt-2">
                    <div className="flex items-center mb-4 gap-4">
                        <div className="flex-1">
                            <SalesAgentOverview
                                totalAgents={salesAgents.totalCount}
                                date={new Date()}
                                activeAgents={salesAgents.salesAgents.filter(a => a.active).length}
                                inactiveAgents={salesAgents.salesAgents.filter(a => !a.active).length}
                                totalMerchants={salesAgents.salesAgents.reduce((acc, agent) => acc + (agent.totalMerchants || 0), 0)}
                                pendingMerchants={salesAgents.salesAgents.reduce((acc, agent) => acc + (agent.pendingMerchants || 0), 0)}
                                approvedMerchants={salesAgents.salesAgents.reduce((acc, agent) => acc + (agent.approvedMerchants || 0), 0)}
                                rejectedMerchants={salesAgents.salesAgents.reduce((acc, agent) => acc + (agent.rejectedMerchants || 0), 0)}
                            />
                        </div>
                        <Button variant="default" asChild className="shrink-0">
                            <Link href="/portal/salesAgents/0">
                                <Plus className="h-4 w-4 mr-2" />
                                Novo Consultor
                            </Link>
                        </Button>
                    </div>
                </div>

                <SalesAgentlist SalesAgents={salesAgents} />
                {totalRecords > 0 && (
                    <PaginationRecords
                        totalRecords={totalRecords}
                        currentPage={page}
                        pageSize={pageSize}
                        pageName="portal/salesAgents"
                    />
                )}
            </BaseBody>
        </>
    );
}
