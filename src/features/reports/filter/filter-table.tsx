"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { ReportTypeDD } from "../server/reports";
import { deleteReportFilter, getReportFilterById, ReportFilterDetail, ReportFilterParamDetail } from "./filter-Actions";
import FilterForm from "./filter-form";
import { ReportFilterSchema } from "./schema";

interface FilterTableAndFormProps {
    filter: ReportFilterDetail[];
    reportId: number;
    reportFilterParams: ReportFilterParamDetail[];
    reportTypeDD: ReportTypeDD[];
}

export default function FilterTableAndForm({ filter, reportId, reportFilterParams, reportTypeDD }: FilterTableAndFormProps) {
    const [record, setRecord] = useState<ReportFilterSchema | null>(null);
    const [open, setOpen] = useState(false);

    const closeDialog = () => {
        setOpen(false);
    }

    function handleNewReportFilter() {
        setRecord(null);
        setOpen(true);
    }

    async function handleEditReportFilter(record: ReportFilterDetail) {
        const currentRecord = await getReportFilterById(record.id);
        if (currentRecord) {
            setRecord({
                idReportFilterParam: currentRecord.idReportFilterParam,
                value: currentRecord.value,
                id: currentRecord.id,
                idReport: currentRecord.idReport,
                dtinsert: currentRecord.dtinsert ? new Date(currentRecord.dtinsert) : undefined,
                dtupdate: currentRecord.dtupdate ? new Date(currentRecord.dtupdate) : undefined
            });
        }
        setOpen(true);
    }

    async function handleDeleteReportFilter(record: ReportFilterDetail) {
        if (confirm("Tem certeza que deseja excluir este filtro?")) {
            await deleteReportFilter(record.id);
        }
    }

    return (
        <div>
            <div className="basis-1/2 text-right px-7">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger onClick={handleNewReportFilter}>
                        <div className="h-8 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90">
                            Novo Filtro
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo Filtro</DialogTitle>
                             
                                <FilterForm
                                    filter={record || {
                                        idReport: reportId,
                                        idReportFilterParam: reportFilterParams[0].id,
                                        value: ''
                                    }}
                                    reportId={reportId}
                                    reportFilterParams={reportFilterParams}
                                    closeDialog={closeDialog}
                                    reportTypeDD={reportTypeDD}
                                />
                            
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Parâmetro</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data de Inserção</TableHead>
                        <TableHead>Data de Atualização</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filter?.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell>{record.id}</TableCell>
                            <TableCell>{reportFilterParams.find(p => p.id === record.idReportFilterParam)?.name}</TableCell>
                            <TableCell>{record.value}</TableCell>
                            <TableCell>
                                {record.dtinsert ? new Date(record.dtinsert).toLocaleDateString() : '-'}
                            </TableCell>
                            <TableCell>
                                {record.dtupdate ? new Date(record.dtupdate).toLocaleDateString() : '-'}
                            </TableCell>
                            <TableCell className="flex justify-end gap-4">
                                <Button
                                    onClick={() => handleEditReportFilter(record)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant={"destructive"}
                                    onClick={() => handleDeleteReportFilter(record)}
                                >
                                    Excluir
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
