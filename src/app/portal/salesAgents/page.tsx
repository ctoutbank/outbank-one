import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationRecords from "@/components/pagination-Records";
import { getSalesAgents } from "@/server/db/salesAgent";
import SalesAgentlist from "./list";



type SalesAgentProps = {
    page:string
    pageSize:string
    search:string
    }

    export default async function SalesAgentsPage({
    searchParams,
    }: {
    searchParams: SalesAgentProps;
    }) {
    const page=parseInt(searchParams.page || "1");
    const pageSize=parseInt(searchParams.pageSize || "5");
    const search=searchParams.search || "";
    const salesAgents = await getSalesAgents(search,page, pageSize);
    const totalRecords = salesAgents.totalCount;



    return(
        <>
        <BaseHeader
        breadcrumbItems={[{ title: "Consultores", url: "/portal/salesAgents" }]}
        />

        <BaseBody
        title="Consultores"
        subtitle={`visualização de todos os Consultores`}
        >
        
        <ListFilter
        pageName="portal/salesAgents" search={search} linkHref={"/portal/salesAgents/0"  } linkText={"Novo Consultor"} />
        
        <SalesAgentlist SalesAgents={salesAgents} />
        {totalRecords > 0 && (
            <PaginationRecords
            totalRecords={totalRecords}
            currentPage={page}
            pageSize={pageSize}
            pageName="portal/salesAgents" >
            </PaginationRecords>
        )}
        
        </BaseBody>

        </>
        
    );
}