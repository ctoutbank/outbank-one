"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

export default function MerchantFormAuthorizers({ form }: { form: any }) {
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

          <FormField
            control={form.control}
            name="dockPostilion.reconcileTransactions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Conciliar transações <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="dock-sim" />
                      <Label htmlFor="dock-sim">sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="dock-nao" />
                      <Label htmlFor="dock-nao">não</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dockPostilion.merchantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merchant ID:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dockPostilion.tokenCnp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token CNP no autorizador:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dockPostilion.terminalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terminal ID:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* GLOBAL PAYMENTS Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">GLOBAL PAYMENTS</h3>
            <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600">
              Remover
            </Button>
          </div>

          <FormField
            control={form.control}
            name="globalPayments.reconcileTransactions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Conciliar transações <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="global-sim" />
                      <Label htmlFor="global-sim">sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="global-nao" />
                      <Label htmlFor="global-nao">não</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="globalPayments.merchantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merchant ID:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="globalPayments.tokenCnp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token CNP no autorizador:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="globalPayments.terminalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terminal ID:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* AUTORIZADOR DOCK PIX Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">AUTORIZADOR DOCK PIX</h3>
            <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600">
              Remover
            </Button>
          </div>

          <FormField
            control={form.control}
            name="dockPix.reconcileTransactions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Conciliar transações <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="pix-sim" />
                      <Label htmlFor="pix-sim">sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="pix-nao" />
                      <Label htmlFor="pix-nao">não</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dockPix.accountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Conta:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dockPix.pixKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chave PIX:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dockPix.terminalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terminal ID:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button variant="outline" className="w-full">
          Adicionar Autorizador
        </Button>
      </CardContent>
    </Card>
  )
}

