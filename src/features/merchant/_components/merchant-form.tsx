"use client"

import { useState } from 'react'
import { Building2, MapPin, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { merchants } from '../../../../drizzle/schema'
import TransactionFees from './merchantedittaxa'


export function CompanyyForm() {
  const [formData, setFormData] = useState({
    // Company Data
    cnpj: '',
    email: '',
    isAffiliate: false,
    businessName: '',
    tradeName: '',
    socialReason: '',
    cnae: '',
    mcc: '',
    openingDate: '',
    operatingDays: [] as string[],
    openingTime: '',
    closingTime: '',
    municipalRegistration: '',
    stateRegistration: '',
    legalNature: '',
    legalForm: '',
    revenue: '',
    address: {
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'Brasil'
    },
    // Personal Data
    isOwner: 'yes',
    isPep: 'no',
    cpf: '',
    rg: {
      number: '',
      issueDate: '',
      issuingAgency: '',
      issuingState: ''
    },
    fullName: '',
    birthDate: '',
    motherName: '',
    personalEmail: '',
    phone: {
      areaCode: '',
      number: ''
    },
    personalAddress: {
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'Brasil'
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }))
  }

  const handlePersonalAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      personalAddress: { ...prev.personalAddress, [name]: value }
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)
  }

  console.log(merchants)

  return (
    <form onSubmit={handleSubmit} className="mx-auto ">
     <Tabs defaultValue="company" className="mb-6">
        <TabsList >
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="transaction">Transações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company" className="space-y-6">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <CardTitle>Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">
                    CNPJ <span className="text-red-500">*</span>
                  </Label>
                  <Input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    E-mail <span className="text-red-500">*</span>
                  </Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isAffiliate" 
                  checked={formData.isAffiliate}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAffiliate: checked as boolean }))}
                />
                <Label htmlFor="isAffiliate">É uma filial?</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialReason">
                  Razão Social <span className="text-red-500">*</span>
                </Label>
                <Input id="socialReason" name="socialReason" value={formData.socialReason} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tradeName">
                  Nome Fantasia <span className="text-red-500">*</span>
                </Label>
                <Input id="tradeName" name="tradeName" value={formData.tradeName} onChange={handleInputChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnae">
                    CNAE <span className="text-red-500">*</span>
                  </Label>
                  <Input id="cnae" name="cnae" value={formData.cnae} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mcc">
                    MCC <span className="text-red-500">*</span>
                  </Label>
                  <Input id="mcc" name="mcc" value={formData.mcc} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openingDate">
                  Data de Abertura <span className="text-red-500">*</span>
                </Label>
                <Input id="openingDate" name="openingDate" type="date" value={formData.openingDate} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>
                  Dias de Funcionamento <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox 
                        id={day} 
                        checked={formData.operatingDays.includes(day)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({ ...prev, operatingDays: [...prev.operatingDays, day] }))
                          } else {
                            setFormData(prev => ({ ...prev, operatingDays: prev.operatingDays.filter(d => d !== day) }))
                          }
                        }}
                      />
                      <Label htmlFor={day}>{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingTime">
                    Horário de Abertura <span className="text-red-500">*</span>
                  </Label>
                  <Input id="openingTime" name="openingTime" type="time" value={formData.openingTime} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closingTime">
                    Horário de Fechamento <span className="text-red-500">*</span>
                  </Label>
                  <Input id="closingTime" name="closingTime" type="time" value={formData.closingTime} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipalRegistration">
                  Inscrição Municipal
                </Label>
                <Input id="municipalRegistration" name="municipalRegistration" value={formData.municipalRegistration} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stateRegistration">
                  Inscrição Estadual
                </Label>
                <Input id="stateRegistration" name="stateRegistration" value={formData.stateRegistration} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="legalNature">
                  Natureza Jurídica <span className="text-red-500">*</span>
                </Label>
                <Textarea id="legalNature" name="legalNature" value={formData.legalNature} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="legalForm">
                  Formato Jurídico <span className="text-red-500">*</span>
                </Label>
                <Select name="legalForm" value={formData.legalForm} onValueChange={(value) => setFormData(prev => ({ ...prev, legalForm: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ltda">LTDA</SelectItem>
                    <SelectItem value="mei">MEI</SelectItem>
                    <SelectItem value="eireli">EIRELI</SelectItem>
                    <SelectItem value="sa">S.A.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenue">
                  Receita <span className="text-red-500">*</span>
                </Label>
                <Input id="revenue" name="revenue" type="number" value={formData.revenue} onChange={handleInputChange} required />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-row items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">
                  CEP <span className="text-red-500">*</span>
                </Label>
                <Input id="zipCode" name="zipCode" value={formData.address.zipCode} onChange={handleAddressChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">
                  Rua <span className="text-red-500">*</span>
                </Label>
                <Input id="street" name="street" value={formData.address.street} onChange={handleAddressChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">
                    Número <span className="text-red-500">*</span>
                  </Label>
                  <Input id="number" name="number" value={formData.address.number} onChange={handleAddressChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input id="complement" name="complement" value={formData.address.complement} onChange={handleAddressChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">
                  Bairro <span className="text-red-500">*</span>
                </Label>
                <Input id="neighborhood" name="neighborhood" value={formData.address.neighborhood} onChange={handleAddressChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    Cidade <span className="text-red-500">*</span>
                  </Label>
                  <Input id="city" name="city" value={formData.address.city} onChange={handleAddressChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">
                    Estado <span className="text-red-500">*</span>
                  </Label>
                  <Select name="state" value={formData.address.state} onValueChange={(value) => setFormData(prev => ({ ...prev, address: { ...prev.address, state: value } }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PR">PR</SelectItem>
                      <SelectItem value="SP">SP</SelectItem>
                      <SelectItem value="RJ">RJ</SelectItem>
                      {/* Add more states as needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">
                  País <span className="text-red-500">*</span>
                </Label>
                <Input id="country" name="country" value={formData.address.country} onChange={handleAddressChange} required disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center space-x-2">
              <User className="w-5 h-5" />
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Sócio ou Proprietário <span className="text-red-500">*</span></Label>
                  <RadioGroup
                    name="isOwner"
                    value={formData.isOwner}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, isOwner: value }))}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="owner-yes" />
                      <Label htmlFor="owner-yes">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="owner-no" />
                      <Label htmlFor="owner-no">Não</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Se considera PEP (Pessoa Exposta Politicamente)? <span className="text-red-500">*</span></Label>
                  <RadioGroup
                    name="isPep"
                    value={formData.isPep}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, isPep: value }))}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="pep-yes" />
                      <Label htmlFor="pep-yes">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="pep-no" />
                      <Label htmlFor="pep-no">Não</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">
                    CPF <span className="text-red-500">*</span>
                  </Label>
                  <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleInputChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rgNumber">
                      Número do RG <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="rgNumber"
                      name="rg.number"
                      value={formData.rg.number}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rg: { ...prev.rg, number: e.target.value }
                      }))}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rgIssueDate">
                      Data de emissão <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="rgIssueDate"
                      name="rg.issueDate"
                      type="date"
                      value={formData.rg.issueDate}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rg: { ...prev.rg, issueDate: e.target.value }
                      }))}
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rgIssuingAgency">
                      Órgão expedidor <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="rgIssuingAgency"
                      name="rg.issuingAgency"
                      value={formData.rg.issuingAgency}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rg: { ...prev.rg, issuingAgency: e.target.value }
                      }))}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rgIssuingState">
                      UF <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.rg.issuingState}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        rg: { ...prev.rg, issuingState: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PR">PR</SelectItem>
                        <SelectItem value="SP">SP</SelectItem>
                        <SelectItem value="RJ">RJ</SelectItem>
                        {/* Add other states as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    Data de Nascimento <span className="text-red-500">*</span>
                  </Label>
                  <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherName">
                    Nome da mãe <span className="text-red-500">*</span>
                  </Label>
                  <Input id="motherName" name="motherName" value={formData.motherName} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalEmail">
                    E-mail <span className="text-red-500">*</span>
                  </Label>
                  <Input id="personalEmail" name="personalEmail" type="email" value={formData.personalEmail} onChange={handleInputChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneAreaCode">
                      Telefone (DDD) <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="phoneAreaCode"
                      name="phone.areaCode"
                      value={formData.phone.areaCode}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        phone: { ...prev.phone, areaCode: e.target.value }
                      }))}
                      required 
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      Número <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="phoneNumber"
                      name="phone.number"
                      value={formData.phone.number}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        phone: { ...prev.phone, number: e.target.value }
                      }))}
                      required 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-row items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <CardTitle>Endereço Pessoal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="personalZipCode">
                  CEP <span className="text-red-500">*</span>
                </Label>
                <Input id="personalZipCode" name="personalAddress.zipCode" value={formData.personalAddress.zipCode} onChange={handlePersonalAddressChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="personalStreet">
                  Rua <span className="text-red-500">*</span>
                </Label>
                <Input id="personalStreet" name="personalAddress.street" value={formData.personalAddress.street} onChange={handlePersonalAddressChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personalNumber">
                    Número <span className="text-red-500">*</span>
                  </Label>
                  <Input id="personalNumber" name="personalAddress.number" value={formData.personalAddress.number} onChange={handlePersonalAddressChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personalComplement">Complemento</Label>
                  <Input id="personalComplement" name="personalAddress.complement" value={formData.personalAddress.complement} onChange={handlePersonalAddressChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="personalNeighborhood">
                  Bairro <span className="text-red-500">*</span>
                </Label>
                <Input id="personalNeighborhood" name="personalAddress.neighborhood" value={formData.personalAddress.neighborhood} onChange={handlePersonalAddressChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personalCity">
                    Cidade <span className="text-red-500">*</span>
                  </Label>
                  <Input id="personalCity" name="personalAddress.city" value={formData.personalAddress.city} onChange={handlePersonalAddressChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personalState">
                    Estado <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.personalAddress.state}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      personalAddress: { ...prev.personalAddress, state: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PR">PR</SelectItem>
                      <SelectItem value="SP">SP</SelectItem>
                      <SelectItem value="RJ">RJ</SelectItem>
                      {/* Add other states as needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="personalCountry">
                  País <span className="text-red-500">*</span>
                </Label>
                <Input id="personalCountry" name="personalAddress.country" value={formData.personalAddress.country} onChange={handlePersonalAddressChange} required disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transaction" className="space-y-6">
        <Card className="w-full">
          
          <TransactionFees />
          
        </Card>
        </TabsContent>

      </Tabs>

      <div className="flex justify-end mt-6">
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  )
}

