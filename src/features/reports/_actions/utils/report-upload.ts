import {
  uploadFile,
  UploadFileRequest,
  UploadFileResponse,
} from "@/server/upload";

export async function uploadReportFile(
  excelBytes: Uint8Array,
  fileName: string,
  fileType: string
): Promise<UploadFileResponse> {
  const fileObject = new File([Buffer.from(excelBytes)], fileName, {
    type: fileType,
  });

  const uploadFileRequest: UploadFileRequest = {
    file: fileObject,
    path: "reports",
    fileName: fileName,
    fileType: fileType,
  };

  const uploadResult = await uploadFile(uploadFileRequest);
  if (!uploadResult) {
    throw new Error("Erro ao fazer upload do relatório");
  }

  return uploadResult;
}
