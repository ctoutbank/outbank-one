import { z } from "zod";

export const SchemaReport = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  recurrenceCode: z.string().optional(),
  shippingTime: z.string().optional(),
  periodCode: z.string().optional(),
  dayWeek: z.string().optional(),
  dayMonth: z.string()
    .optional()
    .refine(
      (val) => !val || (parseInt(val) >= 1 && parseInt(val) <= 31),
      { message: "O dia do mês deve ser um número entre 1 e 31" }
    ),
 
  emails: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  formatCode: z.string().optional(),
  reportType: z.string().min(1, "Tipo de relatório é obrigatório"),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
  filters: z.array(
    z.object({
      id: z.number().optional(),
      idReport: z.number().optional(),
      idReportFilterParam: z.number().min(1, "Parâmetro de filtro é obrigatório"),
      value: z.string().min(1, "Valor é obrigatório"),
    })
  ).optional(),
});

export type ReportSchema = z.infer<typeof SchemaReport>;

