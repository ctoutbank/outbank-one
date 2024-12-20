import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesAgentFull } from "@/server/db/salesAgent";
import SalesAgentsForm from "./form";





interface SalesAgentCardFrops {
    salesAgent: SalesAgentFull | null;
}

const SalesAgentCard: React.FC<SalesAgentCardFrops> = ({ salesAgent }) => {
    return (
        <main>
        <div className="card">
         <Card> <CardHeader className="px-7">
              <CardTitle>{salesAgent?.firstName}</CardTitle>
              <CardDescription>ID:{salesAgent?.id}</CardDescription>
            </CardHeader>
            <CardContent>

                <SalesAgentsForm salesAgent={salesAgent} />
                </CardContent>
                
            </Card>  
        </div>
        </main>
    )
}

export default SalesAgentCard;