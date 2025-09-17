"use client"

import { HelpCircle } from "lucide-react"
import { t } from "../../utils/i18n"

export default function DockSection() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16 text-center md:text-left">
          <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
            OUTBANK
          </div>
          <h2 className="text-4xl md:text-5xl font-light">{t('Explore questions about the Dock')}</h2>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          {/* Question 1 */}
          <div className="space-y-4 max-w-[550px]">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-9 h-9 mt-1 border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-500/10" />
              <h3 className="text-xl font-medium">{t('Why choose Dock?')}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-10">
              Realizamos a conexão com concessionárias e bancos custodiantes, integrando mais de 3000 convênios, processando transações e fornecendo o retorno com o status de cada operação. Aceleramos a inovação, satisfazemos seus clientes e transformamos seu negócio.
            </p>
          </div>

          {/* Question 2 */}
          <div className="space-y-4 max-w-[550px]">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-9 h-9 mt-1 border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-500/10" />
              <h3 className="text-xl font-medium">{t('What is Embedded Finance?')}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-10">
              {t('Imagine your company not only offering its usual products but also integrated financial services. Your platform becomes a financial hub, providing everything from payments to loans, all within the digital environment.')}
            </p>
          </div>

          {/* Question 3 */}
          <div className="space-y-4 max-w-[550px]">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-9 h-9 mt-1 border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-500/10" />
              <h3 className="text-xl font-medium">{t('How does Dock drive this transformation?')}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-10">
              Fornecemos a infraestrutura completa para empresas expandirem seus negócios no setor financeiro. Nossa plataforma integrada e personalizada (White-Label) com a sua marca permite lançar soluções financeiras sob medida com integração fluida e implementação ágil.
            </p>
          </div>

          {/* Question 4 */}
            <div className="space-y-4 max-w-[550px]">
            <div className="flex items-start gap-4">
            <HelpCircle className="w-9 h-9 mt-1 border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-500/10" />
              <h3 className="text-xl font-medium">O que é uma solução White Label?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-10">
              White Label é um modelo de negócio onde uma empresa comercializa produtos ou serviços desenvolvidos por terceiros sob sua própria marca. Oferece personalização e redução de custos de desenvolvimento, permitindo rápida expansão de portfólio sem necessidade de criação interna ou aquisição de licenças proprietárias.
            </p>
          </div>

          {/* Question 5 */}
          <div className="space-y-4 max-w-[550px]">
            <div className="flex items-start gap-4">
            <HelpCircle className="w-9 h-9 mt-1 border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-500/10" />
              <h3 className="text-xl font-medium">Qual a diferença entre Adquirente e Subadquirente?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-10">
              Adquirentes processam pagamentos diretamente com bandeiras e bancos. Subadquirentes facilitam essa operação, oferecendo soluções prontas aos lojistas através da infraestrutura de uma adquirente, eliminando a necessidade de credenciamento direto.
            </p>
          </div>

          {/* Question 6 */}
          <div className="space-y-4 max-w-[550px]">
            <div className="flex items-start gap-4">
            <HelpCircle className="w-9 h-9 mt-1 border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-500/10" />
              <h3 className="text-xl font-medium">O que é uma certificação PCI?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-10">
              A certificação PCI DSS (Payment Card Industry Data Security Standard) é um padrão internacional de segurança que protege dados de cartões durante transações financeiras. Empresas certificadas atendem a rigorosos requisitos de segurança, prevenindo fraudes e assegurando a proteção integral das informações dos portadores de cartão.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

