"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConfigurationOperationsSchema, schemaConfigurationOperations } from "@/features/configuration/schema/configurations-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Settings } from "lucide-react"
import {  useForm } from "react-hook-form"
import { configurations } from "../../../../drizzle/schema"
import { insertConfigurationFormAction } from "@/features/configuration/_actions/configuration-formActions"
import { updateConfigurationFormAction } from "@/features/configuration/_actions/configuration-formActions"


interface MerchantProps {
    Configuration: typeof configurations.$inferSelect; hasTaf: boolean,hastop: boolean,hasPix: boolean,merhcnatSlug: string,timerzone: string;
    
  }

export default function MerchantFormOperations({ Configuration,hasTaf,hastop,hasPix,merhcnatSlug,timerzone }: MerchantProps) {
  const form = useForm<ConfigurationOperationsSchema>({
    resolver: zodResolver(schemaConfigurationOperations),
    defaultValues: {
      id: Configuration?.id || undefined,
      slug: Configuration?.slug || "",
      active: Configuration?.active || false,
      lockCpAnticipationOrder: Configuration?.lockCpAnticipationOrder || false,
      lockCnpAnticipationOrder: Configuration?.lockCnpAnticipationOrder || false,
      url: Configuration?.url || "",
      dtinsert: Configuration?.dtinsert ? new Date(Configuration.dtinsert) : new Date(),
      dtupdate: Configuration?.dtupdate ? new Date(Configuration.dtupdate) : new Date(),
      hasTaf: hasTaf,
      hastop: hastop,
      hasPix: hasPix,
      merhcnatSlug: merhcnatSlug,
      cardPresent: false,
      cardNotPresent: false,
      timerzone: timerzone,
      theme: "SYSTEM DEFAULT",
      accessProfile: "merchant-cp",


    },
  });

  const onSubmit = async (data: ConfigurationOperationsSchema) => {
    try {
      if (data?.id) {
        await updateConfigurationFormAction(data);
      } else {
        await insertConfigurationFormAction(data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  return (
    
    <div className="grid gap-6" >
       <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center space-x-2">
          <Settings className="w-5 h-5" />
          <CardTitle>CAPTURE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
         
          <FormField
            control={form.control}
            name="cardPresent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none ml-2">
                  <FormLabel>Card Present</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasTaf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  TEF Terminal <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value?.toString()} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="tef-yes" />
                      <Label htmlFor="tef-yes">yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="tef-no" />
                      <Label htmlFor="tef-no">no</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hastop"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Terminal Tap On Phone <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value?.toString()} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="tap-sim" />
                      <Label htmlFor="tap-sim">sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="tap-nao" />
                      <Label htmlFor="tap-nao">não</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardNotPresent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="ml-2">Card Not Present</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Url <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://dock.tech/" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasPix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  PIX <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value?.toString()} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="pix-yes" />
                      <Label htmlFor="pix-yes">yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="pix-no" />
                      <Label htmlFor="pix-no">no</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
        </CardContent>
      </Card>
    

      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center space-x-2">
          <Settings className="w-5 h-5" />
          <CardTitle>OPERATIONAL DATA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="timerzone" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Terminal&apos;s timezone <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value === "-0300" ? "UTC-03:00" : field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="UTC-03:00">(UTC-03:00) Brasilia</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="merhcnatSlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Customer <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="DOCK" value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Merchant Theme <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="SYSTEM DEFAULT" disabled value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accessProfile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Access Profile <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select profile" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="merchant-cp">Merchant CP sem Antecipação</SelectItem>
                    <SelectItem value="teste-default">Teste Default</SelectItem>
                    <SelectItem value="perfil-padrao">Perfil Padrão de EC</SelectItem>
                    <SelectItem value="role-default">Role Default</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      </form>
      </Form>
     
    </div>
   
  )
}


