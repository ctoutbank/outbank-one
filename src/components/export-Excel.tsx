import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const exportToExccelButton = (props: any) => {
  const exportButtonElement = (
    <Button>
      <Download className="h-4 w-4" /> Exportar
    </Button>
  );
  return (
    <ExcelFile element={exportButtonElement} filename="merchants">
      <ExcelSheet data={props.data} name="Merchants">
        <ExcelColumn label="Nome Fantasia" value="name" />
        <ExcelColumn label="Localidade" value="location" />
        <ExcelColumn label="Status KYC" value="kycStatus" />
        <ExcelColumn label="Antecipação CP" value="advanceCP" />
        <ExcelColumn label="Antecipação CNP" value="advanceCNP" />
        <ExcelColumn label="Consultor" value="consultant" />
        <ExcelColumn label="Ativo" value="active" />
      </ExcelSheet>
    </ExcelFile>
  );
};

export default exportToExccelButton;
