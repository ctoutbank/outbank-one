"use client"

import { Building, FileText, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export function CompanyForm() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <Building className="w-5 h-5" />
          <CardTitle>Informações da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="razaoSocial">
              Razão Social <span className="text-red-500">*</span>
            </Label>
            <Input id="razaoSocial" placeholder="Digite a razão social" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">
              CNPJ <span className="text-red-500">*</span>
            </Label>
            <Input id="cnpj" placeholder="00.000.000/0000-00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefoneEmpresa">
              Telefone da Empresa <span className="text-red-500">*</span>
            </Label>
            <Input id="telefoneEmpresa" placeholder="(00) 0000-0000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="segmento">
              Segmento de Negócio <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comercio">Comércio</SelectItem>
                <SelectItem value="servico">Serviço</SelectItem>
                <SelectItem value="industria">Indústria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <User className="w-5 h-5" />
          <CardTitle>Dados do Representante Legal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nomeCompleto">
              Nome Completo <span className="text-red-500">*</span>
            </Label>
            <Input id="nomeCompleto" placeholder="Digite o nome completo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">
              CPF <span className="text-red-500">*</span>
            </Label>
            <Input id="cpf" placeholder="000.000.000-00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataNascimento">
              Data de Nascimento <span className="text-red-500">*</span>
            </Label>
            <Input id="dataNascimento" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nomeMae">
              Nome da Mãe <span className="text-red-500">*</span>
            </Label>
            <Input id="nomeMae" placeholder="Digite o nome da mãe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contatoRepresentante">
              Contato do Representante <span className="text-red-500">*</span>
            </Label>
            <Input id="contatoRepresentante" placeholder="(00) 00000-0000" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <FileText className="w-5 h-5" />
          <CardTitle>Informações Adicionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>
              Representante Legal (Proprietário/Sócio){" "}
              <span className="text-red-500">*</span>
            </Label>
            <RadioGroup defaultValue="sim" className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="sim" />
                <Label htmlFor="sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="nao" />
                <Label htmlFor="nao">Não</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="pessoaPoliticamenteExposta">
                Pessoa Politicamente Exposta
              </Label>
              <Switch id="pessoaPoliticamenteExposta" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <FileText className="w-5 h-5" />
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input id="rg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataEmissao">Data de Emissão</Label>
              <Input id="dataEmissao" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgaoExpedidor">Órgão Expedidor</Label>
              <Input id="orgaoExpedidor" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uf">UF</Label>
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
    </div>
  )
}

