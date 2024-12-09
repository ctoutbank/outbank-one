'use client'

import { useState } from 'react'
import { Building2, Filter, Search, Trash2, Download, Plus, MoreVertical, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Merchantlist } from '@/server/db/merchant'
import router from 'next/router'



export default function MerchantList({list}:{list:Merchantlist}) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())

  const toggleSelection = (index: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleRowClick = (id: bigint) => {
    router.push(`/portal/merchant/"+ ${id}"`);
  };

  const toggleAllSelection = () => {
    setSelectedItems(prev => 
      prev.size === list.merchants.length ? new Set() : new Set(list.merchants.map((_, i) => i))
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-8">
        
        <h1 className="text-2xl font-bold">Lista de Estabelecimentos</h1>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Buscar estabelecimentos..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
        <Button 
          variant="outline" 
          className="gap-2" 
          disabled={selectedItems.size === 0}
        >
          <Trash2 className="h-4 w-4" />
          Deletar
        </Button>
        <Button 
          variant="outline" 
          className="gap-2" 
          disabled={selectedItems.size === 0}
        >
          <Download className="h-4 w-4" />
          Exportar
        </Button>
        <Button 
          className="gap-2 bg-black text-white hover:bg-black/90"
          onClick={() => router.push('/portal/merchants/0')}
        >
          <Plus className="h-4 w-4" />
          Novo Estabelecimento
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedItems.size === list.merchants.length}
                  onCheckedChange={toggleAllSelection}
                />
              </TableHead>
              <TableHead>
                Nome Fantasia
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Localidade
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Status KYC</TableHead>
              <TableHead>Antecipação CP</TableHead>
              <TableHead>Antecipação CNP</TableHead>
              <TableHead>
                Consultor
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Ativo desde
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.merchants.map((merchant, i) => (
              <TableRow key={merchant.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedItems.has(i)}
                    onCheckedChange={() => toggleSelection(i)}
                  />
                </TableCell>
                <TableCell>{merchant.name}</TableCell>
                <TableCell>{merchant.addressname}</TableCell>
                <TableCell>
                <Badge className={`bg-${merchant.kic_status === 'Aprovado' ? 'emerald' : 'red'}-500`}>
                    {merchant.kic_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    Ativo
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-red-500 hover:bg-red-600">{merchant.active}</Badge>
                </TableCell>
                <TableCell>{merchant.kic_status}</TableCell>
                <TableCell>{merchant.phone_type}</TableCell>
                <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleRowClick(merchant.id)}>
                    <MoreVertical className="h-4 w-4" />
                      </Button>
                   
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

