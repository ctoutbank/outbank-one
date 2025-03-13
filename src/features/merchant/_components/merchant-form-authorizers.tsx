"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Plus, Trash2 } from "lucide-react"
import { useRef, useState } from "react"

// Tipos de autorizadores disponíveis
const AUTHORIZER_TYPES = [
  "GLOBAL PAYMENTS",
  "AUTORIZADOR DOCK PIX",
  "DOCK | POSTILION",
  "GLOBAL PAYMENTS ECOMMERCE"
]

// Interface para os dados do autorizador
interface AuthorizerData {
  id: number
  type: string
  conciliarTransacoes: string
  merchantId?: string
  tokenCnp?: string
  terminalId?: string
  idConta?: string
  chavePix?: string
  
}

// Componente para um único autorizador
function AuthorizerFormItem({
  id,
  initialData,
  
}: {
  id: number
  initialData: AuthorizerData
  onRemove: (id: number) => void
  isRemovable: boolean
}) {
  // Determinar quais campos mostrar com base no tipo de autorizador
  const showMerchantId = initialData.type !== "AUTORIZADOR DOCK PIX"
  const showTokenCnp = initialData.type !== "AUTORIZADOR DOCK PIX"
  const showTerminalId = true
  const showIdConta = initialData.type === "AUTORIZADOR DOCK PIX"
  const showChavePix = initialData.type === "AUTORIZADOR DOCK PIX"

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Conciliar transações <span className="text-red-500">*</span></Label>
        <RadioGroup defaultValue={initialData.conciliarTransacoes || "nao"} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sim" id={`${id}-sim`} />
            <Label htmlFor={`${id}-sim`}>Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nao" id={`${id}-nao`} />
            <Label htmlFor={`${id}-nao`}>Não</Label>
          </div>
        </RadioGroup>
      </div>

      {showMerchantId && (
        <div className="space-y-2">
          <Label>Merchant ID:</Label>
          <Input defaultValue={initialData.merchantId || ""} />
        </div>
      )}

      {showTokenCnp && (
        <div className="space-y-2">
          <Label>Token CNP no autorizador:</Label>
          <Input defaultValue={initialData.tokenCnp || ""} />
        </div>
      )}

      {showIdConta && (
        <div className="space-y-2">
          <Label>ID Conta:</Label>
          <Input defaultValue={initialData.idConta || ""} />
        </div>
      )}

      {showChavePix && (
        <div className="space-y-2">
          <Label>Chave PIX:</Label>
          <Input defaultValue={initialData.chavePix || ""} />
        </div>
      )}

      {showTerminalId && (
        <div className="space-y-2">
          <Label>Terminal ID:</Label>
          <Input defaultValue={initialData.terminalId || ""} />
        </div>
      )}
    </div>
  )
}

export default function MerchantFormAuthorizers() {
  // Estado para armazenar os autorizadores
  const [authorizers, setAuthorizers] = useState<AuthorizerData[]>([])
  const [nextId, setNextId] = useState(1)
  const [selectedType, setSelectedType] = useState<string>("")
  const [showTypeSelector, setShowTypeSelector] = useState(false)

  // Referência para armazenar os dados dos formulários
  const formRefs = useRef<{
    [key: number]: AuthorizerData
  }>({})

  // Função para adicionar um novo autorizador
  const addNewAuthorizer = (type: string) => {
    const newAuthorizer: AuthorizerData = {
      id: nextId,
      type,
      conciliarTransacoes: "nao",
    }

    setAuthorizers([...authorizers, newAuthorizer])
    setNextId(nextId + 1)
    setShowTypeSelector(false)
    setSelectedType("")
  }

  // Função para remover um autorizador
  const removeAuthorizer = (id: number) => {
    setAuthorizers(authorizers.filter(auth => auth.id !== id))
    delete formRefs.current[id]
  }

  // Função para salvar os dados
  const onSubmit = () => {
    console.log("Dados dos autorizadores:", authorizers)
    // Aqui você implementaria a lógica para salvar os dados
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold mb-4">Autorizadores</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {authorizers.map((authorizer) => (
          <Card key={authorizer.id} className="w-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 py-3">
              <div className="flex flex-row items-center space-x-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">
                  {authorizer.type}
                </CardTitle>
              </div>
              {authorizers.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAuthorizer(authorizer.id)}
                  title="Remover autorizador"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <AuthorizerFormItem
                id={authorizer.id}
                initialData={authorizer}
                onRemove={removeAuthorizer}
                isRemovable={authorizers.length > 1}
              />
            </CardContent>
          </Card>
        ))}
        
        {showTypeSelector && (
          <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center bg-gray-50 py-3">
              <div className="flex flex-row items-center space-x-2">
                <Plus className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">
                  Novo Autorizador
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Autorizador</Label>
                  <Select
                    value={selectedType}
                    onValueChange={setSelectedType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um autorizador" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUTHORIZER_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTypeSelector(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => selectedType && addNewAuthorizer(selectedType)}
                    disabled={!selectedType}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {!showTypeSelector && (
        <div className="flex justify-center mt-6">
          <Button
            type="button"
            onClick={() => setShowTypeSelector(true)}
            className="flex items-center space-x-2"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Autorizador</span>
          </Button>
        </div>
      )}

      {authorizers.length > 0 && (
        <div className="flex justify-end mt-8">
          <Button type="submit" onClick={onSubmit} className="px-6">
            Avançar
          </Button>
        </div>
      )}
    </div>
  )
}