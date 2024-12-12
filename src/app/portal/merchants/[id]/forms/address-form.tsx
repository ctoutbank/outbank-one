"use client"

import { MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AddressForm() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <CardTitle>Endereço Pessoal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cepPessoal">
              CEP <span className="text-red-500">*</span>
            </Label>
            <Input id="cepPessoal" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ruaPessoal">
              Rua <span className="text-red-500">*</span>
            </Label>
            <Input id="ruaPessoal" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroPessoal">
                Número <span className="text-red-500">*</span>
              </Label>
              <Input id="numeroPessoal" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complementoPessoal">Complemento</Label>
              <Input id="complementoPessoal" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bairroPessoal">
              Bairro <span className="text-red-500">*</span>
            </Label>
            <Input id="bairroPessoal" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cidadePessoal">
                Cidade <span className="text-red-500">*</span>
              </Label>
              <Input id="cidadePessoal" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estadoPessoal">
                Estado <span className="text-red-500">*</span>
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sp">SP</SelectItem>
                  <SelectItem value="rj">RJ</SelectItem>
                  <SelectItem value="mg">MG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <CardTitle>Endereço da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cepEmpresa">
              CEP <span className="text-red-500">*</span>
            </Label>
            <Input id="cepEmpresa" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ruaEmpresa">
              Rua <span className="text-red-500">*</span>
            </Label>
            <Input id="ruaEmpresa" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroEmpresa">
                Número <span className="text-red-500">*</span>
              </Label>
              <Input id="numeroEmpresa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complementoEmpresa">Complemento</Label>
              <Input id="complementoEmpresa" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bairroEmpresa">
              Bairro <span className="text-red-500">*</span>
            </Label>
            <Input id="bairroEmpresa" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cidadeEmpresa">
                Cidade <span className="text-red-500">*</span>
              </Label>
              <Input id="cidadeEmpresa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estadoEmpresa">
                Estado <span className="text-red-500">*</span>
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sp">SP</SelectItem>
                  <SelectItem value="rj">RJ</SelectItem>
                  <SelectItem value="mg">MG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <Checkbox id="sameAddress" />
            <Label htmlFor="sameAddress">Usar O Mesmo Endereço Para Empresa</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

