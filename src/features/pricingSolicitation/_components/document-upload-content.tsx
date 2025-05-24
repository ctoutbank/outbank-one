"use client";

import FileUpload from "@/components/fileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileWithPricingSolicitation } from "@/server/upload";
import { useEffect, useState } from "react";
import { createPricingSolicitationForUpload } from "../server/create-solicitation";

interface DocumentUploadContentProps {
  solicitationId?: number | null;
  pricingSolicitationData?: any;
  formData?: any; // Dados do formulário atual
  onSolicitationCreated?: (id: number) => void; // Callback quando a solicitação é criada
}

export function DocumentUploadContent({
  solicitationId,
  pricingSolicitationData,
  formData,
  onSolicitationCreated,
}: DocumentUploadContentProps) {
  const [createdSolicitationId, setCreatedSolicitationId] = useState<
    number | null
  >(solicitationId || null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Document types available for upload
  const documentTypes = [
    {
      title: "Documento Principal",
      description:
        "Documento principal da solicitação (ex: contrato, proposta)",
      fileType: "PRINCIPAL",
      acceptedFileTypes: "pdf,PDF,jpeg,JPEG,jpg,JPG,png,PNG,XLS,xlsx",
      maxSizeMB: 5,
    },
  ];

  // Atualizar o ID da solicitação quando ele muda externamente
  useEffect(() => {
    if (solicitationId && solicitationId !== createdSolicitationId) {
      setCreatedSolicitationId(solicitationId);
    }
  }, [solicitationId]);

  // Handle document upload completion
  const handleUploadComplete = (fileData: {
    fileId: number;
    fileURL: string;
    fileName: string;
    fileExtension: string;
  }) => {
    console.log("Upload completo:", fileData);
  };

  // Hook de pré-upload para criar as entidades necessárias
  const createSolicitationIfNeeded = async (): Promise<number> => {
    // Limpar mensagens de erro anteriores
    setUploadError(null);

    // Se já temos um ID de solicitação, retorná-lo
    if (createdSolicitationId) {
      return createdSolicitationId;
    }

    try {
      // Preparar dados básicos da solicitação
      const baseData = {
        cnae: "00000000",
        mcc: "0000",
        cnpjQuantity: 1,
        monthlyPosFee: 0,
        averageTicket: 0,
        description: "Solicitação criada automaticamente",
        status: "SEND_SOLICITATION",
      };

      // Combinar dados do formulário com os dados padrão
      let combinedData = formData
        ? {
            ...baseData,
            ...formData,
            // Garantir que o status está definido como SEND_SOLICITATION
            status: "SEND_SOLICITATION",
          }
        : pricingSolicitationData || baseData;

      // Limpar e validar dados para evitar erros SQL
      combinedData = {
        ...combinedData,
        // Converter valores para números onde necessário
        cnpjQuantity: Number(combinedData.cnpjQuantity) || 1,
        monthlyPosFee: Number(combinedData.monthlyPosFee) || 0,
        averageTicket: Number(combinedData.averageTicket) || 0,
        // Se houver marcas, garantir que os dados estejam no formato correto
        brands: combinedData.brands
          ? combinedData.brands.map((brand: any) => ({
              name: brand.name || "Marca Padrão",
              productTypes: brand.productTypes
                ? brand.productTypes.map((pt: any) => ({
                    name: pt.name || "Tipo Padrão",
                    fee: Number(pt.fee) || 0,
                    feeAdmin: Number(pt.feeAdmin) || 0,
                    feeDock: Number(pt.feeDock) || 0,
                    transactionFeeStart: Number(pt.transactionFeeStart) || 0,
                    transactionFeeEnd: Number(pt.transactionFeeEnd) || 0,
                    noCardFee: Number(pt.noCardFee) || 0,
                    noCardFeeAdmin: Number(pt.noCardFeeAdmin) || 0,
                    noCardFeeDock: Number(pt.noCardFeeDock) || 0,
                    noCardTransactionAnticipationMdr:
                      Number(pt.noCardTransactionAnticipationMdr) || 0,
                    transactionAnticipationMdr:
                      Number(pt.transactionAnticipationMdr) || 0,
                  }))
                : [],
            }))
          : [],
      };

      console.log("Dados enviados para criação da solicitação:", combinedData);

      // Chamar a função de servidor para criar a solicitação
      const newSolicitationId =
        await createPricingSolicitationForUpload(combinedData);

      // Armazenar o ID da solicitação criada
      setCreatedSolicitationId(newSolicitationId);

      // Notificar o componente pai sobre a criação da solicitação
      if (onSolicitationCreated) {
        onSolicitationCreated(newSolicitationId);
      }

      return newSolicitationId;
    } catch (error) {
      console.error("Erro ao criar solicitação:", error);
      // Definir mensagem de erro amigável
      setUploadError(
        "Não foi possível criar a solicitação. Verifique se todos os dados foram preenchidos corretamente."
      );
      throw new Error(
        "Não foi possível criar a solicitação necessária para o upload"
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Documentos da Solicitação</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {uploadError}
            </div>
          )}
          <div className="grid grid-cols-1  gap-8">
            {documentTypes.map((doc, index) => (
              <FileUpload
                key={index}
                title={doc.title}
                description={doc.description}
                entityType="pricingSolicitation"
                entityId={createdSolicitationId || undefined}
                fileType={doc.fileType}
                onUploadComplete={handleUploadComplete}
                maxSizeMB={doc.maxSizeMB}
                acceptedFileTypes={doc.acceptedFileTypes}
                preUploadHook={createSolicitationIfNeeded}
                customUploadHandler={async (file) => {
                  // Se não temos ID de solicitação e o hook não foi executado ainda
                  if (!createdSolicitationId && !solicitationId) {
                    const newId = await createSolicitationIfNeeded();
                    if (!newId) {
                      throw new Error("Falha ao criar solicitação");
                    }
                  }

                  const targetId = createdSolicitationId || solicitationId;
                  if (!targetId) {
                    throw new Error("ID de solicitação não disponível");
                  }

                  const formData = new FormData();
                  formData.append("File", file);
                  formData.append("fileName", doc.fileType);

                  try {
                    return await createFileWithPricingSolicitation(
                      formData,
                      targetId,
                      doc.fileType
                    );
                  } catch (error) {
                    console.error("Erro ao fazer upload do arquivo:", error);
                    return null;
                  }
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
