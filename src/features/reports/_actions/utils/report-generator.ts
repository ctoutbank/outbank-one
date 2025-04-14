import { getTransactions } from "@/features/transactions/serverActions/transaction";
import reportsExecutionSalesGeneratePDF, {
  reportsExecutionSalesGenerateXLSX,
} from "../reports-execution-sales";

export async function generateSalesReport(
  report: any,
  dateFromBase: string,
  dateToBase: string
) {
  const status = undefined;
  const merchant = undefined;
  const productType = undefined;

  const transactions = await getTransactions(
    -1,
    -1,
    status,
    merchant,
    dateFromBase,
    dateToBase,
    productType
  );

  let excelBytes: Uint8Array<ArrayBufferLike> | null = null;

  if (report.formatCode === "PDF") {
    excelBytes = await reportsExecutionSalesGeneratePDF(
      transactions.transactions
    );
  } else if (report.formatCode === "EX") {
    excelBytes = await reportsExecutionSalesGenerateXLSX(
      transactions.transactions,
      dateFromBase,
      dateToBase
    );
  } else {
    throw new Error("Formato de relatório não suportado");
  }

  return excelBytes;
}
