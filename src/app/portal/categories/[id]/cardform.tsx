import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryDetail } from "@/server/db/category";
import Categoriesform from "./form";



interface CategoryCardFrops {
    category: CategoryDetail | null;
}


const CategoryCard: React.FC<CategoryCardFrops> = ({ category }) => {
    return (
        <main>
        <div className="card">
         <Card> <CardHeader className="px-7">
              <CardTitle>{category?.name}</CardTitle>
              <CardDescription>ID:{category?.id}</CardDescription>
            </CardHeader>
            <CardContent>

                <Categoriesform categories={category} />
                </CardContent>
                
            </Card>  
        </div>
        </main>
    )
}

export default CategoryCard;