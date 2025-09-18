import Image from "next/image"
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern"
import { t } from '../../utils/i18n'

export default function ReasonsSection() {
    const reasons = [
      {
        title: t("Agility in Transactions"),
        description: t("Your own digital bank provides greater agility in financial transactions, benefiting customers and partners commercial and optimizing internal processes of the company."),
       
      },
      {
        title: t("Strategic Data"),
        description: t("Access valuable data about customers' financial habits, personalizing offers and strategic decisions to maximize results and engagement."),

      },
      {
        title: t("Increase in Retention"),
        description: t("Integrated financial services such as digital accounts and payment cards strengthen customer relationships and reduce migration to competitors."),
  
      },
      {
        title: t("Full Brand Control"),
        description: t("Offers complete control over your brand identity, design and user experience, strengthening market presence and competitive differentiation."),
        
      },
      {
        title: t("Personalized Offers"),
        description: t("By managing your own digital bank, your company accesses valuable data about customers' financial habits, personalizing offers and strategic decisions."),
       
      },
      {
        title: t("New Sources of Revenue"),
        description: t("Multiply your revenues with integrated financial services: fees, interest and charges create additional revenue streams that grow with your business."),
        
      },
    ]
  
    return (
      <section className="relative bg-black text-white py-16 px-4 md:px-8 overflow-hidden">
        {/* Grid container with mask */}
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
  
        {/* Content container with higher z-index */}
        <div className="container mx-auto relative z-20">
          {/* Header */}
          <div className="max-w-4xl mb-16 text-center md:text-left">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
              REASONS
            </div>
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              {t('What are the reasons that lead a company to want to have its own Digital Bank?')}
            </h2>
            <p className="text-gray-200 text-lg">{t('There are several reasons among them, we list the main ones below:')}</p>
          </div>
  
          {/* Reasons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, index) => (
              <div 
                key={index} 
                className="bg-[#080808]/80 backdrop-blur-sm p-8 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{reason.title}</h3>
                  <Image
                    src="/logo-icon.svg"
                    alt="Logo icon"
                    width={40}
                    height={40}
                    className="border border-gray-700/20 p-1 rounded-sm bg-gradient-to-r from-[#080808] to-gray-400/10"
                  />
                </div>
                <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  