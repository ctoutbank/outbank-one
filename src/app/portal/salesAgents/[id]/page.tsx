import { getSalesAgentById } from "@/server/db/salesAgent";
import SalesAgentsForm from "./form";


export default async function SalesAgentsDetail({
    params,
}: { params: { id: string } }) {
    const agent = await getSalesAgentById(parseInt(params.id));
    return (
        <div>
            <SalesAgentsForm salesAgent={agent} />
        </div>
    )
}