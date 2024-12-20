import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LegalNatureDetail } from "@/server/db/legalNature";
import LegalNatureForm from "./form";




interface LegalNatureCardFrops {
    legalNature: LegalNatureDetail | null;
}


const LegalNatureCard: React.FC<LegalNatureCardFrops> = ({ legalNature }) => {
    return (
        <main>
        <div className="card">
         <Card> <CardHeader className="px-7">
              <CardTitle>{legalNature?.name}</CardTitle>
              <CardDescription>ID:{legalNature?.id}</CardDescription>
            </CardHeader>
            <CardContent>

                <LegalNatureForm legalNature={legalNature} />
                </CardContent>
                
            </Card>  
        </div>
        </main>
    )
}

export default LegalNatureCard;