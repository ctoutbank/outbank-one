import { getSalesAgentById, SalesAgent } from "@/server/db/salesAgent";
import { salesAgents } from "../../../../../drizzle/schema";
import { db} from "@/server/db";
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