"use client"

import { Button } from "@/components/ui/button"
import { t } from '../../utils/i18n'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, CheckCircle } from "lucide-react"
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactFormSchema, type ContactFormData } from "@/lib/contact-form-schema"
import { useState } from "react"
import { toast } from "sonner"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      phone: "",
      industry: "",
      message: "",
    },
  });

  const watchedIndustry = watch("industry");
  const watchedPhone = watch("phone");

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setShowSuccess(false);
    
    try {
      const response = await fetch("/api/contact-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || "Mensagem enviada com sucesso! Entraremos em contato em breve.");
        setShowSuccess(true);
        
        reset({
          fullName: "",
          email: "",
          company: "",
          phone: "",
          industry: "",
          message: "",
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        
      } else {
        toast.error(result.error || "Erro ao enviar mensagem. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="relative bg-black text-white py-16 px-4 md:px-8 overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
        <InteractiveGridPattern 
          width={80}
          height={80}
          squares={[24, 24]}
          className="border-none"
          squaresClassName="stroke-gray-500/20 hover:fill-gray-500/20"
        />
      </div>

      {/* Main Content - Add relative and z-20 to appear above the background */}
      <div className="container mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Updated structure */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block ">
              {t('Contact us')}
            </div>
            <h2 className="text-4xl md:text-5xl font-light leading-tight">
              {t('Contact us to schedule a completely free personalized virtual consultation')}
            </h2>
            {/* Added description text */}
            <p className="text-gray-400 text-lg">
              {t('The first step for your company in the financial market.')}
            </p>
          </div>

          {/* Right Column - Form with updated layout */}
          <div className="bg-[#080808] p-8 rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Two-column layout for shorter forms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('Nome Completo')}</Label>
                  <Input 
                    id="fullName" 
                    {...register("fullName")}
                    placeholder={t('João Silva')} 
                    className="bg-[#1C1C1C] border-0" 
                    disabled={isSubmitting}
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-sm">{errors.fullName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('E-mail Corporativo')}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    {...register("email")}
                    placeholder={t('nome@empresa.com')} 
                    className="bg-[#1C1C1C] border-0" 
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">{t('Ramo de atuação')}</Label>
                  <Select
                    value={watchedIndustry}
                    onValueChange={(value) => setValue("industry", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-[#1C1C1C] border-0">
                      <SelectValue placeholder={t('Selecione o ramo')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agricultura">{t('Agricultura')}</SelectItem>
                      <SelectItem value="alimentacao">{t('Alimentação')}</SelectItem>
                      <SelectItem value="automotivo">{t('Automotivo')}</SelectItem>
                      <SelectItem value="servicos-financeiros">{t('Serviços Financeiros')}</SelectItem>
                      <SelectItem value="comercio">{t('Comércio')}</SelectItem>
                      <SelectItem value="construcao">{t('Construção')}</SelectItem>
                      <SelectItem value="educacao">{t('Educação')}</SelectItem>
                      <SelectItem value="energia">{t('Energia')}</SelectItem>
                      <SelectItem value="entretenimento">{t('Entretenimento')}</SelectItem>
                      <SelectItem value="governo">{t('Governo')}</SelectItem>
                      <SelectItem value="imobiliario">{t('Imobiliário')}</SelectItem>
                      <SelectItem value="industria">{t('Indústria')}</SelectItem>
                      <SelectItem value="logistica">{t('Logística')}</SelectItem>
                      <SelectItem value="saude">{t('Saúde')}</SelectItem>
                      <SelectItem value="seguros">{t('Seguros')}</SelectItem>
                      <SelectItem value="servicos">{t('Serviços')}</SelectItem>
                      <SelectItem value="tecnologia">{t('Tecnologia')}</SelectItem>
                      <SelectItem value="telecomunicacoes">{t('Telecomunicações')}</SelectItem>
                      <SelectItem value="turismo-hotelaria">{t('Turismo e Hotelaria')}</SelectItem>
                      <SelectItem value="outros">{t('Outros')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className="text-red-400 text-sm">{errors.industry.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">{t('Nome da Empresa')}</Label>
                  <Input 
                    id="company" 
                    {...register("company")}
                    placeholder={t('Nome da empresa')} 
                    className="bg-[#1C1C1C] border-0" 
                    disabled={isSubmitting}
                  />
                  {errors.company && (
                    <p className="text-red-400 text-sm">{errors.company.message}</p>
                  )}
                </div>
              </div>

              {/* Phone number in its own row */}
              <div className="space-y-2">
                <Label htmlFor="phone">{t('Número de telefone')}</Label>
                <div className="flex gap-2">
                  <Select defaultValue="55" disabled={isSubmitting}>
                    <SelectTrigger className="w-[100px] bg-[#1C1C1C] border-0">
                      <SelectValue placeholder="🇧🇷 +55" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="55">🇧🇷 +55</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={watchedPhone || ""}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        if (value.length <= 2) {
                          value = value;
                        } else if (value.length <= 7) {
                          value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                        } else {
                          value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
                        }
                        setValue("phone", value);
                      }
                    }}
                    placeholder={t('Número de telefone')} 
                    className="bg-[#1C1C1C] border-0"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-sm">{errors.phone.message}</p>
                )}
              </div>

              {/* Message area */}
              <div className="space-y-2">
                <Label htmlFor="message">{t('Conte-nos um pouco sobre a sua operação')}</Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  placeholder={t('Descreva suas necessidades...')}
                  className="bg-[#1C1C1C] border-0 min-h-[100px]"
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p className="text-red-400 text-sm">{errors.message.message}</p>
                )}
              </div>

              {/* Updated button */}
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-white/90 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md py-6 text-lg font-medium"
              >
                {isSubmitting ? "Enviando..." : t('Enviar')} 
                {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>

              {/* Success message */}
              {showSuccess && (
                <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 font-medium">Sucesso!</p>
                      <p className="text-green-300 text-sm mt-1">{successMessage}</p>
                      <p className="text-green-300/70 text-xs mt-2">A página será atualizada em alguns segundos...</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

