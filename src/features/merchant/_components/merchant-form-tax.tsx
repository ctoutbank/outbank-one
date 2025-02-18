'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import { ChevronDown } from 'lucide-react'
import Image from "next/image"

interface FeeData {
  method: string
  logo: string
  creditoAVista: string
  creditoParcelado: string
  creditoParceladoLoja: string
  debito: string
  preVenda: string
}

interface PixFees {
  mdr: string
  custoMinimo: string
  custoMaximo: string
  antecipacao: string
}

export default function Transactionrate() {
  const [isEditing, setIsEditing] = useState(false)
  const [feeData, setFeeData] = useState<FeeData[]>([
    {
      method: "Visa",
      logo: "/placeholder.svg?height=24&width=40",
      creditoAVista: "1,99",
      creditoParcelado: "1,99",
      creditoParceladoLoja: "1,99",
      debito: "1,99",
      preVenda: "1,99"
    },
    {
      method: "Mastercard",
      logo: "/placeholder.svg?height=24&width=40",
      creditoAVista: "1,99",
      creditoParcelado: "1,99",
      creditoParceladoLoja: "1,99",
      debito: "1,99",
      preVenda: "1,99"
    },
    {
      method: "Elo",
      logo: "/placeholder.svg?height=24&width=40",
      creditoAVista: "1,99",
      creditoParcelado: "1,99",
      creditoParceladoLoja: "1,99",
      debito: "1,99",
      preVenda: "1,99"
    },
    {
      method: "American Express",
      logo: "/placeholder.svg?height=24&width=40",
      creditoAVista: "1,99",
      creditoParcelado: "1,99",
      creditoParceladoLoja: "1,99",
      debito: "1,99",
      preVenda: "1,99"
    },
    {
      method: "Hipercard",
      logo: "/placeholder.svg?height=24&width=40",
      creditoAVista: "1,99",
      creditoParcelado: "1,99",
      creditoParceladoLoja: "1,99",
      debito: "1,99",
      preVenda: "1,99"
    },
    {
      method: "Cabal",
      logo: "/placeholder.svg?height=24&width=40",
      creditoAVista: "1,99",
      creditoParcelado: "1,99",
      creditoParceladoLoja: "1,99",
      debito: "1,99",
      preVenda: "1,99"
    },
  ])

  const [pixFees, setPixFees] = useState<PixFees>({
    mdr: "0,01",
    custoMinimo: "0,09",
    custoMaximo: "0,09",
    antecipacao: "1,67"
  })

  const handleFeeChange = (index: number, field: keyof FeeData, value: string) => {
    const newFeeData = [...feeData]
    newFeeData[index] = { ...newFeeData[index], [field]: value }
    setFeeData(newFeeData)
  }

  const handlePixFeeChange = (field: keyof PixFees, value: string) => {
    setPixFees(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
     

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-6 bg-black rounded flex items-center justify-center text-white text-sm">$</div>
        <h1 className="text-xl font-semibold">Taxas de Transação</h1>
      </div>

      <Tabs defaultValue="todas" className="w-full">
        <TabsList className='flex gap-4 mb-2'>
          <TabsTrigger value="todas" >
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Todas as Transações
            </span>
          </TabsTrigger>
          <TabsTrigger value="pos" className="data-[state=active]:bg-white rounded-md">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth="2"/>
                <path d="M8 12h8" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Transações no POS
            </span>
          </TabsTrigger>
          <TabsTrigger value="online" className="data-[state=active]:bg-white rounded-md">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeWidth="2"/>
              </svg>
              Transações Online
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Última Atualização: 11/12/2024 - 15h30
          </div>
          <div className="flex items-center gap-2">
           
            {isEditing ? (
              <>
                <Button 
                  variant="outline"
                  className="bg-white text-black"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  
                  onClick={handleSave}
                >
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <Button 
                
                onClick={() => setIsEditing(true)}
              >
                Alterar Taxas
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1">
                      Bandeiras
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1">
                      Crédito (à vista)
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1">
                      Crédito (2-6x)
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1">
                      Crédito (7-12)
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1">
                      Débito
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1">
                      Pré-pago
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {feeData.map((item, index) => (
                  <tr key={item.method}>
                    <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                        <Image
                          src={`/placeholder.svg?height=24&width=40`}
                          alt={item.method}
                          width={40}
                          height={24}
                          className="object-contain"
                        />
                        <span className="text-sm">{item.method}</span>
                        </div>
                    </td>
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={item.creditoAVista}
                          onChange={(e) => handleFeeChange(index, 'creditoAVista', e.target.value)}
                          className="w-24 h-8 text-sm"
                        />
                      ) : (
                        <div className="bg-gray-100 rounded px-3 py-1 text-sm w-24">
                          {item.creditoAVista}%
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={item.creditoParcelado}
                          onChange={(e) => handleFeeChange(index, 'creditoParcelado', e.target.value)}
                          className="w-24 h-8 text-sm"
                        />
                      ) : (
                        <div className="bg-gray-100 rounded px-3 py-1 text-sm w-24">
                          {item.creditoParcelado}%
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={item.creditoParceladoLoja}
                          onChange={(e) => handleFeeChange(index, 'creditoParceladoLoja', e.target.value)}
                          className="w-24 h-8 text-sm"
                        />
                      ) : (
                        <div className="bg-gray-100 rounded px-3 py-1 text-sm w-24">
                          {item.creditoParceladoLoja}%
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={item.debito}
                          onChange={(e) => handleFeeChange(index, 'debito', e.target.value)}
                          className="w-24 h-8 text-sm"
                        />
                      ) : (
                        <div className="bg-gray-100 rounded px-3 py-1 text-sm w-24">
                          {item.debito}%
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={item.preVenda}
                          onChange={(e) => handleFeeChange(index, 'preVenda', e.target.value)}
                          className="w-24 h-8 text-sm"
                        />
                      ) : (
                        <div className="bg-gray-100 rounded px-3 py-1 text-sm w-24">
                          {item.preVenda}%
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-4 ">
  <h2 className="text-lg font-semibold mb-6 text-gray-800">Taxa Pix</h2>
  <div className="flex gap-10">
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-600 mb-2">MDR</p>
      {isEditing ? (
        <Input
          value={pixFees.mdr}
          onChange={(e) => handlePixFeeChange('mdr', e.target.value)}
          className="w-24 h-8 text-sm border rounded px-2"
        />
      ) : (
        <div className="bg-gray-100 rounded px-3 py-1 text-sm w-24">
          {pixFees.mdr}%
        </div>
      )}
    </div>
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-600 mb-2">Custo Mínimo</p>
      {isEditing ? (
        <Input
          value={pixFees.custoMinimo}
          onChange={(e) => handlePixFeeChange('custoMinimo', e.target.value)}
          className="w-24 h-8 text-sm border rounded px-2"
        />
      ) : (
        <div className="bg-gray-100 rounded px-3 py-1 text-sm w-24">
          R$ {pixFees.custoMinimo}
        </div>
      )}
    </div>
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-600 mb-2">Custo Máximo</p>
      {isEditing ? (
        <Input
          value={pixFees.custoMaximo}
          onChange={(e) => handlePixFeeChange('custoMaximo', e.target.value)}
          className="w-24 h-8 text-sm border rounded px-2"
        />
      ) : (
        <div className="bg-gray-100 rounded px-3 py-1 text-sm w-24">
          R$ {pixFees.custoMaximo}
        </div>
      )}
    </div>
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-600 mb-2">Antecipação</p>
      {isEditing ? (
        <Input
          value={pixFees.antecipacao}
          onChange={(e) => handlePixFeeChange('antecipacao', e.target.value)}
          className="w-24 h-8 text-sm border rounded px-2"
        />
      ) : (
        <div className="bg-gray-100 rounded px-3 py-1 text-sm w-24">
          {pixFees.antecipacao}% ao mês
        </div>
      )}
    </div>





            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

