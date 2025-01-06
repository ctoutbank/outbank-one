'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function AsyncButtonsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleTableAction = async (tableName: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setResult(`Dados da tabela ${tableName} carregados com sucesso!`)
    } catch {
      setResult(`Erro ao carregar dados da tabela ${tableName}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Sincronização </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Button 
          onClick={() => handleTableAction('Usuários')}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Usuários
        </Button>

        <Button 
          onClick={() => handleTableAction('Produtos')}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600"
        >
          Produtos
        </Button>

        <Button 
          onClick={() => handleTableAction('Pedidos')}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Pedidos
        </Button>

        <Button 
          onClick={() => handleTableAction('Categorias')}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Categorias
        </Button>

        <Button 
          onClick={() => handleTableAction('Clientes')}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600"
        >
          Clientes
        </Button>

        <Button 
          onClick={() => handleTableAction('Fornecedores')}
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-600"
        >
          Fornecedores
        </Button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-700">{result}</p>
        </div>
      )}
    </div>
  )
}
