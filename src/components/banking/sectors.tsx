import { Phone, Store, GraduationCap, Heart, Zap, Home } from "lucide-react"
import { t } from '../../utils/i18n'

export default function SectorsSection() {
  const sectors = [
    {
      icon: Phone,
      title: t("Telecommunications Sector"),
      description: t("Offer integrated banking services to telecommunications plans, simplify mobile payments and increase customer loyalty. With complete packages and innovative digital solutions, your company strengthens relationships and expands growth opportunities."),
    },
    {
      icon: Store,
      title: t("Retail"),
      description: t("Implement digital payment solutions in physical and online stores, offering convenience and security. Create attractive loyalty programs and provide credit and financing options, expanding the customer experience and strengthening your business results."),
    },
    {
      icon: GraduationCap,
      title: t("Education"),
      description: t("Offer accessible online financial education, provide exclusive banking products for students and establish strategic partnerships with educational institutions. Create financial advantages that stimulate learning, strengthen relationships and expand opportunities for new customers."),
    },
    {
      icon: Heart,
      title: t("Health"),
      description: t("Implement financial services focused on medical expenses, offering flexible payment plans and intelligent integration of reimbursements with digital insurance. Provide more convenience, security and accessibility, strengthening care and customer trust."),
    },
    {
      icon: Zap,
      title: t("Energy"),
      description: t("Offer solutions for paying bills and public service invoices, implement financing programs focused on energy efficiency and develop rewards that encourage sustainable practices, stimulating conscious consumption and strengthening positive impact."),
    },
    {
      icon: Home,
      title: t("Real Estate"),
      description: t("Offer complete banking services for owners and tenants, in addition to credit options directed to investments, strengthening the sector with innovation and practicality."),
    },
  ]

  return (
    <section className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
            {t('SETORES DO MERCADO')}
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            {t('Which sectors can benefit from a Banking infrastructure?')}
          </h2>
          <p className="text-gray-200 text-lg">
            {t('In addition to startups, subacquirers, fintechs, RetailTechs/EdTechs, IPs/SCDs/SEPs, finance companies, brokers, wallets, and traditional banks')}
          </p>
        </div>

        {/* Decorative Lines */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sectors.map((sector, index) => (
            <div key={index} className="bg-[#080808] p-8 rounded-lg">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 border-gray-700/20 p-1  rounded-full bg-gradient-to-r from-[#080808] to-gray-500/10 flex items-center justify-center flex-shrink-0">
                  <sector.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">{sector.title}</h3>
                  <p className="text-gray-300/80 leading-relaxed">{sector.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Decorative Lines */}
        <div className="max-w-4xl mx-auto mb-8 pt-16">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600/40 to-transparent" />
        </div>

        {/* Footer Text */}
        <p className="text-muted-foreground text-center text-lg max-w-4xl mx-auto italic">
          {t('Regardless of the industry, success in creating a digital bank is in understanding customer needs, offering safe and convenient solutions, in addition to integrating technology effectively. The diversification of financial services strengthens relationships and generates new revenues.')}
        </p>

        {/* Bottom Decorative Line */}
        <div className="max-w-4xl mx-auto mt-8 pb-16">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}

