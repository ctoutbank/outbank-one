import { Download } from "lucide-react"
import React from "react"
import ReactExport from "react-data-export"
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;




const exportToExccelButton = (props: any) => {
  
  
  const exportButtonElement = (
    <div className="flex rounded-[30] bg-[#f5f5f5] w-40 h-12 items-center text-[18] font-medium coursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,.1),0_2px_4px_-1px_rgba(0,0,0,.06)] justify-evenly   ">
      <Download className="h-4 w-4" /> Exportar

    </div>
  );
  return(
    <ExcelFile element={exportButtonElement} filename="merchants">
      <ExcelSheet data={props.data} name="Merchants">
        <ExcelColumn label="Nome Fantasia" value="name"/>
        <ExcelColumn label="Localidade" value="location"/>
        <ExcelColumn label="Status KYC" value="kycStatus"/>
        <ExcelColumn label="Antecipação CP" value="advanceCP"/>
        <ExcelColumn label="Antecipação CNP" value="advanceCNP"/>
        <ExcelColumn label="Consultor" value="consultant"/>
        <ExcelColumn label="Ativo" value="active"/>
      </ExcelSheet>
    </ExcelFile>
    
  )
}

export default exportToExccelButton