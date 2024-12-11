'use client'

import { useState,useMemo } from 'react'
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
import Link from 'next/link'
import { SearchBar } from './[id]/search-bar'




export default function MerchantList({list}:{list:Merchantlist}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filteredAndSortedMer = useMemo(() => {
    let result = [...list.merchants];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((merchant) => {
        const fullName = `${merchant.name ?? ""} ${merchant.cnpj ?? ""}`.toLowerCase();
        const email = merchant.email?.toLowerCase() ?? "";
        const phoneNumber = merchant.phone_type?.toLowerCase() ?? "";
        return fullName.includes(query) || email.includes(query) || phoneNumber.includes(query);
      });
    }
    return result;
  }, [list.merchants, searchQuery]);

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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };


  return (
    <div >
     

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-[850px] ">
        <SearchBar  
         value={searchQuery} onChange={handleSearchChange} />
         
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
        
          
         
        >
          <Link href="/portal/merchants/0
          "className="flex gap-2 items-center  ">
          <Plus className="h-4 w-4" />
          Novo Estabelecimento
          </Link>
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
                Ativo 
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedMer.map((merchant, i) => (
              <TableRow key={merchant.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedItems.has(i)}
                    onCheckedChange={() => toggleSelection(i)}
                  />
                </TableCell>
                <TableCell>
                  {merchant.name}
                    <div className="text-sm text-muted-foreground">
                    {merchant.cnpj.slice(0, 11) + '-' + merchant.cnpj.slice(11)}
                    </div>
                </TableCell>
                <TableCell>{merchant.addressname}
                  <div className="text-sm text-muted-foreground">
                    {merchant.state}
                  </div>
                </TableCell>
                <TableCell>
                <Badge variant={merchant.kic_status === 'APPROVED' ? 'success' : 'destructive'}>
                  {merchant.kic_status}
                </Badge>
                </TableCell>
                <TableCell>
                {merchant.anticipationRiskFactorCp}
</TableCell>
                <TableCell>
                {merchant.anticipationRiskFactorCnp}
                </TableCell>
                <TableCell>{merchant.sales_agent}</TableCell>
                <TableCell> <Badge variant={merchant.active ? 'success' : 'destructive'}>
                  {merchant.active ? 'ATIVO' : 'INATIVO'}
                </Badge></TableCell>
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

