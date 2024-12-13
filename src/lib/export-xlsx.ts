import * as XLSX from "xlsx";

const exportExcel = async (
  title?: string,
  worksheetname?: string,
  data?: any
) => {
  try {
    // Check if the action result contains data and if it's an array
    if (data && Array.isArray(data)) {
      // Create Excel workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils?.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, worksheetname);
      // Save the workbook as an Excel file
      XLSX.writeFile(workbook, `${title}.xlsx`);
      console.log(`Exported data to ${title}.xlsx`);
    } else {
      console.log("#==================Export Error invalida data");
    }
  } catch (error: any) {
    console.log("#==================Export Error", error.message);
  }
};

export default exportExcel;
