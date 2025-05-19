"use client";

import FileUpload from "@/components/fileUpload";
import { createFileWithPricingSolicitation } from "@/server/upload";

interface DocumentUploadContentProps {
  solicitationId: number | null;
}

export function DocumentUploadContent({
  solicitationId,
}: DocumentUploadContentProps) {
  // Document types available for upload
  const documentTypes = [
    {
      title: "Documentos",
      description: "Importe os documentos necessários para a solicitação",
      fileType: "OUTROS",
    },
  ];

  // Handle document upload completion
  const handleUploadComplete = (fileData: {
    fileId: number;
    fileURL: string;
    fileName: string;
    fileExtension: string;
  }) => {
    console.log("Upload completo:", fileData);
  };

  // Custom FileUpload component for pricing solicitations
  function PricingSolicitationFileUpload({
    title,
    description,
    fileType,
    solicitationId,
  }: {
    title: string;
    description: string;
    fileType: string;
    solicitationId: number;
  }) {
    return (
      <FileUpload
        title={title}
        description={description}
        entityType="payment"
        entityId={solicitationId}
        fileType={fileType}
        onUploadComplete={handleUploadComplete}
        maxSizeMB={5}
        acceptedFileTypes="pdf,jpeg,jpg,png"
        customUploadHandler={async (file) => {
          if (!solicitationId) return null;

          const formData = new FormData();
          formData.append("File", file);
          formData.append("fileName", fileType);

          try {
            return await createFileWithPricingSolicitation(
              formData,
              solicitationId,
              fileType
            );
          } catch (error) {
            console.error("Error uploading file:", error);
            return null;
          }
        }}
      />
    );
  }

  return (
    <div>
      {documentTypes.map(
        (doc, index) =>
          solicitationId && (
            <PricingSolicitationFileUpload
              key={index}
              title={doc.title}
              description={doc.description}
              fileType={doc.fileType}
              solicitationId={solicitationId}
            />
          )
      )}
    </div>
  );
}
