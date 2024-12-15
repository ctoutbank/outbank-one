import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { getCategories } from "@/server/db/category";
import Categorylist from "./list";
import PaginationRecords from "@/components/pagination-Records";


type CategoryProps = {
    page:string
    pageSize:string
    search:string
    }
    
    export default async function CategoriesPage({
    searchParams,
    }: {
    searchParams: CategoryProps;
    }) {
    const page=parseInt(searchParams.page || "1");
    const pageSize=parseInt(searchParams.pageSize || "5");
    const search=searchParams.search || "";
    const categories = await getCategories(search,page, pageSize);
    const totalRecords = categories.totalCount;
    
    
    
    return(
        <>
        <BaseHeader
        breadcrumbItems={[{ title: "Categorias", url: "/portal/categories" }]}
        />
    
        <BaseBody
        title="Categorias"
        subtitle={`visualização de todos os Categorias`}
        >
        
        <ListFilter
        pageName="portal/categories" search={search} linkHref={"/portal/categories/0"  } linkText={"Nova Categoria"} />
        
        <Categorylist Categories={categories} />
        {totalRecords > 0 && (
            <PaginationRecords
            totalRecords={totalRecords}
            currentPage={page}
            pageSize={pageSize}
            pageName="portal/categories" >
            </PaginationRecords>
        )}
        
        </BaseBody>
    
        </>
        
    );
}