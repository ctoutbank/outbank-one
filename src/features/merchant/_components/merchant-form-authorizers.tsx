"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

export default function MerchantFormAuthorizers() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Autorizadores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* DOCK | POSTILION Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">DOCK | POSTILION</h3>
            <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600">
              Remover
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Conciliar transações <span className="text-red-500">*</span></Label>
            <RadioGroup defaultValue="nao" className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="dock-sim" />
                <Label htmlFor="dock-sim">sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="dock-nao" />
                <Label htmlFor="dock-nao">não</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Merchant ID:</Label>
            <Input />
          </div>

          <div className="space-y-2">
            <Label>Token CNP no autorizador:</Label>
            <Input />
          </div>

          <div className="space-y-2">
            <Label>Terminal ID:</Label>
            <Input />
          </div>
        </div>

        {/* GLOBAL PAYMENTS Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">GLOBAL PAYMENTS</h3>
            <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600">
              Remover
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Conciliar transações <span className="text-red-500">*</span></Label>
            <RadioGroup defaultValue="nao" className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="global-sim" />
                <Label htmlFor="global-sim">sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="global-nao" />
                <Label htmlFor="global-nao">não</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Merchant ID:</Label>
            <Input />
          </div>

          <div className="space-y-2">
            <Label>Token CNP no autorizador:</Label>
            <Input />
          </div>

          <div className="space-y-2">
            <Label>Terminal ID:</Label>
            <Input />
          </div>
        </div>

        {/* AUTORIZADOR DOCK PIX Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">AUTORIZADOR DOCK PIX</h3>
            <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600">
              Remover
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Conciliar transações <span className="text-red-500">*</span></Label>
            <RadioGroup defaultValue="nao" className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="pix-sim" />
                <Label htmlFor="pix-sim">sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="pix-nao" />
                <Label htmlFor="pix-nao">não</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>ID Conta:</Label>
            <Input />
          </div>

          <div className="space-y-2">
            <Label>Chave PIX:</Label>
            <Input />
          </div>

          <div className="space-y-2">
            <Label>Terminal ID:</Label>
            <Input />
          </div>
        </div>

        <Button variant="outline" className="w-full">
          Adicionar Autorizador
        </Button>
      </CardContent>
    </Card>
  )
}