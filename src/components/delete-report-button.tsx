"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteReport } from "@/features/reports/server/reports";

export default function DeleteReportButton({ reportId }: { reportId: number }) {
    const router = useRouter();

    const handleDeleteReport = async () => {
        const confirmDelete = window.confirm("Você deseja excluir esse relatório?");
        if (confirmDelete) {
            await deleteReport(reportId);
            router.push("/portal/reports");
        }
    };

    return (
        <div className="w-full flex justify-end mb-4">
            <Button variant="destructive" onClick={handleDeleteReport}>
                Excluir Relatório
            </Button>
        </div>
    );
}
