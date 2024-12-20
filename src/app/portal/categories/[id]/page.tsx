import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { getCategoryById } from "@/server/db/category";
import CategoryCard from "./cardform";





export default async function CategoryDetail({
    params,
}: { params: { id: string } }) {
    const category = await getCategoryById(parseInt(params.id));
    
    return (
        <>
         <BaseHeader
        breadcrumbItems={[{ title: "Categorias", url: "/portal/categories" }]}
        />
         <BaseBody
                title="Categorias"
                subtitle={`Adicionar ou editar Categorias`}   >
           
           
           <CategoryCard category={category} /> 
      
 

      
      </BaseBody>
            
             
        </>
    )
}