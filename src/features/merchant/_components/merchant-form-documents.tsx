"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UploadIcon as FileUpload } from "lucide-react"

interface UploadSectionProps {
  title: string
  description?: string
  accept?: string
  name: string
  form: any
}

const UploadSection = ({
  title,
  description,
  accept = "application/pdf,image/jpeg,image/jpg",
  name,
  form,
}: UploadSectionProps) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4 hover:border-primary cursor-pointer">
              <FileUpload className="w-8 h-8 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">ARRASTE UM ARQUIVO</p>
                <p className="text-sm text-muted-foreground">ou clique para fazer o upload</p>
              </div>
              <p className="text-xs text-muted-foreground">PDF, JPEG, JPG</p>
              <Input
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  field.onChange(file)
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
)

export default function MerchantFormDocuments({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <UploadSection
            title="CNH DIGITAL"
            description="Documento de Identificação - O documento de identificação é obrigatório para o KYC do Acquiring e PIX. É obrigatória a inserção do documento de identificação de todos os sócios da empresa. Para esse tipo de identificação os documentos válidos são: CNH, RG e RNE"
            name="cnh"
            form={form}
          />

          <UploadSection
            title="SELFIE"
            description="Obrigatório para todos os cadastros. Para empresas com mais de um sócio a SELFIE é obrigatória apenas para o sócio majoritário."
            name="selfie"
            form={form}
          />

          <UploadSection
            title="TERMO DE ADESÃO"
            description="Sempre a última versão disponibilizada no DocSales. Aceitaremos apenas assinatura digital."
            name="termoAdesao"
            form={form}
          />

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">LINK/PRINT CNP</h3>
              <p className="text-sm text-muted-foreground">
                Link da URL ou print de alguma rede social do PJ. Obrigatório para CNP
              </p>
            </div>
            <FormField
              control={form.control}
              name="socialMediaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="https://" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <UploadSection
            title="CARTÃO CNPJ DA RECEITA"
            description="Retirado pela pessoa que esta realizando o cadastro no momento da execução da tarefa."
            name="cartaoCnpj"
            form={form}
          />

          <UploadSection
            title="ESTATUTOS DA EMPRESA"
            description="Constando nome do responsável legal, quadro societário e atividades exercidas. Contrato Social, Estatuto, etc. Obrigatório para empresas S/A e LTDA."
            name="estatutos"
            form={form}
          />
        </CardContent>
      </Card>
    </div>
  )
}

