"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { uploadFile } from "@/server/upload"
import { UploadIcon as FileUpload } from "lucide-react"
import React from "react"

const UploadSection = ({
  title,
  description,
  
  accept = "application/pdf,image/jpeg,image/jpg",
 
  onFileSelect,
}: {
  title: string
  description?: string
  accept?: string
  merchantId: number
  onFileSelect: (file: File) => Promise<{ success: boolean; key: string } | undefined>
}) => {
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
        const result = await onFileSelect(file)
        setUploadedFile(file.name)
        // Construir a URL do arquivo no S3
        if (result?.success && result?.key) {
          const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || 'file-upload-outbank'}.s3.${process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-2'}.amazonaws.com/${result.key}`
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
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (extension === 'pdf') {
      return (
        <svg className="w-8 h-8 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      )
    } else if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
      return (
        <svg className="w-8 h-8 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      )
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500 mb-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      )
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3rem]">
            {description}
          </p>
        )}
      </div>
      <div 
        className={`flex-1 border-2 border-dashed rounded-lg p-6 text-center 
          ${isUploading ? 'bg-gray-50' : 'hover:border-primary cursor-pointer'} 
          ${error ? 'border-red-500' : ''} 
          ${uploadedFile ? 'border-green-500' : ''}
          flex flex-col items-center justify-center min-h-[200px]`}
        onClick={handleClick}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-medium">Enviando arquivo...</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center">
            {getFileIcon(uploadedFile)}
            <p className="font-medium">Arquivo enviado</p>
            <p className="text-sm text-muted-foreground mb-2">{uploadedFile}</p>
            
            <div className="flex space-x-2">
              {fileUrl && (
                <a 
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Visualizar
                </a>
              )}
              
              {fileUrl && (
                <a 
                  href={fileUrl}
                  download={uploadedFile}
                  className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download
                </a>
              )}
              
              <button 
                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded flex items-center"
                onClick={(e) => {
                  e.stopPropagation()
                  setUploadedFile(null)
                  setFileUrl(null)
                }}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Trocar
              </button>
            </div>
          </div>
        ) : (
          <>
            <FileUpload className="w-8 h-8 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="font-medium">ARRASTE UM ARQUIVO</p>
              <p className="text-sm text-muted-foreground">ou clique para fazer o upload</p>
              <p className="text-xs text-muted-foreground">PDF, JPEG, JPG</p>
              <p className="text-xs text-muted-foreground">Tamanho máximo: 2MB</p>
              {error && <p className="text-xs text-red-500">{error}</p>}
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
  const handleFileUpload = async (file: File): Promise<{ success: boolean; key: string } | undefined> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("merchantId", merchantId)
    
    try {
      const result = await uploadFile(formData)
      console.log("Upload realizado com sucesso:", result)
      return result
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error)
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Documentos de Identificação */}
            <div className="lg:col-span-3 mb-6">
              <h2 className="text-xl font-semibold mb-4">Documentos de Identificação</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <UploadSection
                  title="CNH DIGITAL"
                  description="Documento de Identificação - O documento de identificação é obrigatório para o KYC de Acquiring e PIX. É obrigatória a inserção do documento de identificação de todos os sócios da empresa."
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                />

                <UploadSection
                  title="CNH FRENTE"
                  description="Documento de Identificação - O documento de identificação é obrigatório para o KYC de Acquiring e PIX. É obrigatória a inserção do documento de identificação de todos os sócios da empresa."
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                />

                <UploadSection
                  title="CNH VERSO"
                  description="Documento de Identificação - O documento de identificação é obrigatório para o KYC de Acquiring e PIX. É obrigatória a inserção do documento de identificação de todos os sócios da empresa."
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                />
              </div>
            </div>

            {/* Documentos Pessoais */}
            <div className="lg:col-span-3 mb-6">
              <h2 className="text-xl font-semibold mb-4">Documentos Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <UploadSection
                  title="SELFIE"
                  description="Obrigatório para todos os cadastros. Para empresas com mais de um sócio a SELFIE é obrigatória apenas para o sócio majoritário."
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                />

                <UploadSection
                  title="CARTA DE EMANCIPAÇÃO"
                  description="Para cadastros cujo responsável legal tenha no mínimo 16 e no máximo 17 anos."
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                />

                <UploadSection
                  title="PROCURAÇÃO"
                  description="Para quando o responsável legal não for sócio majoritário."
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                />
              </div>
            </div>

            {/* Documentos da Empresa */}
            <div className="lg:col-span-3 mb-6">
              <h2 className="text-xl font-semibold mb-4">Documentos da Empresa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <UploadSection
                  title="CARTÃO CNPJ DA RECEITA"
                  description="Retirado pela pessoa que está realizando o cadastro no momento da execução da tarefa."
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                />

                <UploadSection
                  title="ESTATUTOS DA EMPRESA"
                  description="Constando nome do responsável legal, quadro societário e atividades exercidas. Contrato Social, Estatuto, etc. Obrigatório para empresas S/A e LTDA."
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                />

                <UploadSection
                  title="TERMO DE ADESÃO"
                  description="Este documento não é obrigatório! Todo o processo de assinatura de termo de adesão é feito pelo Estabelecimento no primeiro login no Portal. Utilize esse espaço caso tenha algum termo em fluxo específico."
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                />
              </div>
            </div>

            {/* Documentos de Validação */}
            <div className="lg:col-span-3 mb-6">
              <h2 className="text-xl font-semibold mb-4">Documentos de Validação</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <UploadSection
                  title="PESQUISA BIGBOOST"
                  description="PDF com a pesquisa de KYC feita no BigBoost no momento do onboarding."
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                />

                <UploadSection
                  title="MATCH - MASTERCARD"
                  description="Validação de Match da MasterCard para onboarding de Estabelecimentos Comerciais"
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                />

                <div className="h-full flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">LINK/PRINT CNP</h3>
                    <p className="text-sm text-muted-foreground min-h-[3rem]">
                      Link da URL ou print de alguma rede social do PJ. Obrigatório para CNP
                    </p>
                  </div>
                  <div className="flex-1 flex items-center">
                    <Input placeholder="https://" className="w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Outros Documentos */}
            <div className="lg:col-span-3">
              <h2 className="text-xl font-semibold mb-4">Outros</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <UploadSection
                  title="OUTROS DOCUMENTOS"
                  description="Preenchimento não obrigatório. Utilize essa seção para inserir documentos pertinentes à sua operação."
                  merchantId={Number(merchantId)}
                  onFileSelect={handleFileUpload}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

