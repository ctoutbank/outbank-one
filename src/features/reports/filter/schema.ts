import { z } from "zod";

export const SchemaReportFilter = z.object({
    id: z.number().optional(),
    idReport: z.number(),
    idReportFilterParam: z.number().min(1, "Parâmetro de filtro é obrigatório"),
    value: z.string().min(1, "Valor é obrigatório"),
    dtinsert: z.date().optional(),
    dtupdate: z.date().optional(),
  });
  
  export type ReportFilterSchema = z.infer<typeof SchemaReportFilter>; 