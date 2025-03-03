"use client"



import FileUploadTest from "@/components/fileUpload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { uploadFile } from "@/server/upload"
import { UploadIcon as FileUpload, Eye, Download, RefreshCw } from "lucide-react"
import React, { useState } from "react"


const UploadSection = ({
  title,
  description,
  accept = "application/pdf,image/jpeg,image/jpg",
  fileType,
  merchantId,
  onFileSelect,
}: {
  title: string
  description?: string
  accept?: string
  fileType?: string
  merchantId: number
  onFileSelect: (file: File, fileType: string) => Promise<{ success: boolean; key: string } | undefined>
}) => {
  // Group all state variables together for better readability
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadedFile, setUploadedFile] = React.useState<string | null>(null)
  const [fileUrl, setFileUrl] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const handleClick = () => {
    if (isUploading) return
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setError(null)

      try {
        const result = await onFileSelect(file, fileType || "")
        setUploadedFile(file.name)
        // Construir a URL do arquivo no S3
        if (result?.success && result?.key) {
          const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || "file-upload-outbank"}.s3.${process.env.NEXT_PUBLIC_AWS_REGION || "us-east-2"}.amazonaws.com/${result.key}`
          setFileUrl(fileUrl)

        }
      } catch (err) {
        setError("Falha ao fazer upload. Tente novamente.")
        console.error("Erro no upload:", err)
      } finally {
        setIsUploading(false)
      }
    }
  }

  // Função para determinar o ícone com base no tipo de arquivo
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (extension === "pdf") {
      return (
        <svg
          className="w-8 h-8 text-red-500 mb-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      )
    } else if (["jpg", "jpeg", "png"].includes(extension || "")) {
      return (
        <svg
          className="w-8 h-8 text-blue-500 mb-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      )
    } else {
      return (
        <svg
          className="w-8 h-8 text-gray-500 mb-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      )
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Document header section with improved spacing */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1 line-clamp-3 min-h-[3rem]">{description}</p>}
      </div>

      {/* Upload area with better visual states */}
      <div
        className={`
          flex-1 border-2 border-dashed rounded-lg p-6 
          transition-colors duration-200
          ${isUploading ? "bg-gray-50" : "hover:border-primary hover:bg-gray-50/50 cursor-pointer"} 
          ${error ? "border-red-500 bg-red-50/30" : ""} 
          ${uploadedFile ? "border-green-500 bg-green-50/30" : ""}
          flex flex-col items-center justify-center min-h-[200px]
        `}
        onClick={handleClick}
      >
        {isUploading ? (
          // Upload in progress state
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-gray-700">Enviando arquivo...</p>
          </div>
        ) : uploadedFile ? (
          // File uploaded successfully state
          <div className="flex flex-col items-center">
            {getFileIcon(uploadedFile)}
            <p className="font-medium text-gray-800">Arquivo enviado</p>
            <p className="text-sm text-muted-foreground mb-3 max-w-full truncate">{uploadedFile}</p>

            <div className="flex space-x-2">
              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded flex items-center transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Visualizar
                </a>
              )}

              {fileUrl && (
                <a
                  href={fileUrl}
                  download={uploadedFile}
                  className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded flex items-center transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </a>
              )}

              <button
                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded flex items-center transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setUploadedFile(null)
                  setFileUrl(null)
                }}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Trocar
              </button>
            </div>
          </div>
        ) : (
          // Initial upload state
          <>
            <FileUpload className="w-10 h-10 text-muted-foreground mb-4" />
            <div className="space-y-2 text-center">
              <p className="font-medium text-gray-800">ARRASTE UM ARQUIVO</p>
              <p className="text-sm text-muted-foreground">ou clique para fazer o upload</p>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">PDF, JPEG, JPG</p>
                <p className="text-xs text-muted-foreground">Tamanho máximo: 2MB</p>
              </div>
              {error && <p className="text-xs text-red-500 font-medium mt-2">{error}</p>}
            </div>
          </>
        )}
        <Input
          ref={fileInputRef}
          type="file"
          name="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
    </div>
  )
}

interface MerchantFormDocumentsProps {
  merchantId: string
}

export default function MerchantFormDocuments({ merchantId }: MerchantFormDocumentsProps) {
  



  const handleFileUpload = async (file: File, fileType: string): Promise<{ success: boolean; key: string } | undefined> => {
    const formData = new FormData()
    formData.append("File", file)
    formData.append("fileName", file.name)

    try {
      const result = await uploadFile({
        formData,
        path: `merchants/${merchantId}`,
        fileName: file.name,
        fileType: fileType
      })
      console.log("Upload realizado com sucesso:", result)
      if (!result) return undefined
      return {
        success: true,
        key: result.fileURL
      }
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error)
      throw error
    }
  }

  // Função compatível com o onUploadComplete do FileUploader
  const handleUploadComplete = (fileData: {
    fileId: number;
    fileURL: string;
    fileName: string;
    fileExtension: string;
  }) => {
    console.log("Upload completo:", fileData);
    // Aqui você pode adicionar qualquer lógica adicional necessária após o upload
  };

  // Section component to improve visual hierarchy
  const DocumentSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="lg:col-span-3 pb-12 border-b border-gray-200">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
        <div className="w-0.5 h-5 bg-primary/40 rounded-full mr-3"></div>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{children}</div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Documentos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Documentos de Identificação */}
            <DocumentSection title="Documentos de Identificação">
              <UploadSection
                title="CNH DIGITAL"
                description="Documento de Identificação - O documento de identificação é obrigatório para o KYC de Acquiring e PIX. É obrigatória a inserção do documento de identificação de todos os sócios da empresa."
                merchantId={Number(merchantId)}
                onFileSelect={handleFileUpload}
                fileType="CNHDIGITAL"
              />

              <UploadSection
                title="CNH FRENTE"
                description="Documento de Identificação - O documento de identificação é obrigatório para o KYC de Acquiring e PIX. É obrigatória a inserção do documento de identificação de todos os sócios da empresa."
                merchantId={Number(merchantId)}
                onFileSelect={handleFileUpload}
                fileType="CNHFRENTE"
              />

              <UploadSection
                title="CNH VERSO"
                description="Documento de Identificação - O documento de identificação é obrigatório para o KYC de Acquiring e PIX. É obrigatória a inserção do documento de identificação de todos os sócios da empresa."
                merchantId={Number(merchantId)}
                onFileSelect={handleFileUpload}
                fileType="CNHVERSO"
              />
            </DocumentSection>

            {/* Documentos Pessoais */}
            <DocumentSection title="Documentos Pessoais">
              <UploadSection
                title="SELFIE"
                description="Obrigatório para todos os cadastros. Para empresas com mais de um sócio a SELFIE é obrigatória apenas para o sócio majoritário."
                merchantId={Number(merchantId)}
                onFileSelect={handleFileUpload}
                fileType="SELFIE"
              />

              <UploadSection
                title="CARTA DE EMANCIPAÇÃO"
                description="Para cadastros cujo responsável legal tenha no mínimo 16 e no máximo 17 anos."
                merchantId={Number(merchantId)}
                onFileSelect={handleFileUpload}
                fileType="CARTAEMANCIPACAO"
              />

              <UploadSection
                title="PROCURAÇÃO"
                description="Para quando o responsável legal não for sócio majoritário."
                merchantId={Number(merchantId)}
                onFileSelect={handleFileUpload}
                fileType="PROCURACAO"
              />
            </DocumentSection>

            {/* Documentos da Empresa */}
            <DocumentSection title="Documentos da Empresa">
              <UploadSection
                title="CARTÃO CNPJ DA RECEITA"
                description="Retirado pela pessoa que está realizando o cadastro no momento da execução da tarefa."
                merchantId={Number(merchantId)}
                onFileSelect={handleFileUpload}
                fileType="CARTAOCNPJ"
              />

              <UploadSection
                title="ESTATUTOS DA EMPRESA"
                description="Constando nome do responsável legal, quadro societário e atividades exercidas. Contrato Social, Estatuto, etc. Obrigatório para empresas S/A e LTDA."
                merchantId={Number(merchantId)}
                onFileSelect={handleFileUpload}
                fileType="ESTATUTO"
              />

              <UploadSection
                title="TERMO DE ADESÃO"
                description="Este documento não é obrigatório! Todo o processo de assinatura de termo de adesão é feito pelo Estabelecimento no primeiro login no Portal. Utilize esse espaço caso tenha algum termo em fluxo específico."
                merchantId={Number(merchantId)}
                onFileSelect={handleFileUpload}
                fileType="TERMOADESAO"
              />
            </DocumentSection>

            {/* Documentos de Validação */}
            <DocumentSection title="Documentos de Validação">
              <UploadSection
                title="PESQUISA BIGBOOST"
                description="PDF com a pesquisa de KYC feita no BigBoost no momento do onboarding."
                merchantId={Number(merchantId)}
                onFileSelect={handleFileUpload}
                fileType="BIGBOOST"
              />

              <UploadSection
                title="MATCH - MASTERCARD"
                description="Validação de Match da MasterCard para onboarding de Estabelecimentos Comerciais"
                merchantId={Number(merchantId)}
                onFileSelect={handleFileUpload}
                fileType="MATCHMASTERCARD"
              />

              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">LINK/PRINT CNP</h3>
                  <p className="text-sm text-muted-foreground mt-1 min-h-[3rem]">
                    Link da URL ou print de alguma rede social do PJ. Obrigatório para CNP
                  </p>
                </div>
                <div className="flex-1 flex items-center mt-2">
                  <Input placeholder="https://" className="w-full" />
                </div>
              </div>
            </DocumentSection>

            {/* Outros Documentos */}
            <div className="lg:col-span-3 pt-0">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <div className="w-0.5 h-5 bg-primary/40 rounded-full mr-3"></div>
                Outros
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <UploadSection
                  title="OUTROS DOCUMENTOS"
                  description="Preenchimento não obrigatório. Utilize essa seção para inserir documentos pertinentes à sua operação."
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                  fileType="OUTROS"
                />
              </div>
             
            <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Upload de Documentos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FileUploadTest
          title="CNH Digital"
          description="Documento de Identificação"
          entityType="merchant"
          fileType="CNHDIGITAL"
          entityId={Number(merchantId)}
          onUploadComplete={handleUploadComplete}
          acceptedFileTypes="application/pdf,image/jpeg,image/jpg"
        />

        <FileUploadTest
          title="Comprovante de Residência"
          description="Conta de luz, água ou telefone"
          entityType="merchant"
          fileType="COMPROVANTERESIDENCIA"
          entityId={Number(merchantId)}
          onUploadComplete={handleUploadComplete}
          acceptedFileTypes="application/pdf,image/jpeg,image/jpg"
        />

        <FileUploadTest
          title=""
          description=""
          entityType="merchant"
          entityId={Number(merchantId)}
          onUploadComplete={handleUploadComplete}
          acceptedFileTypes="video/mp4"
          maxSizeMB={50}
        />
      </div>
    </div>
            </div>

            
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

