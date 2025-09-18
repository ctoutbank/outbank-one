import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern"
import { BarChart3, Grid, Headset, RefreshCw, Rocket, Settings } from "lucide-react"
import { t } from '../../utils/i18n'

const benefits = [
  {
    icon: Rocket,
    title: t("Increase profits with competitive rates"),
    description: t("Maximize results with MDR and anticipation conditions, strengthening credibility and transparency of your brand."),
  },
  {
    icon: Settings,
    title: t("Efficiency and autonomy in operation"),
    description: t("Have autonomy to manage your operation with tools that optimize processes and boost performance."),
  },
  {
    icon: Grid,
    title: t("From POS to Portal with your brand"),
    description: t("Control your entire operation with tools that optimize processes, increase efficiency and guarantee autonomy."),
  },
  {
    icon: RefreshCw,
    title: t("Acquiring management with BackOffice"),
    description: t("Maximize results with MDR and anticipation rules, strengthening credibility and transparency of your brand."),
  },
  {
    icon: BarChart3,
    title: t("Stability in financial transactions"),
    description: t("Our infrastructure processes high volumes of transactions with maximum stability, constant performance and security."),
  },
  {
    icon: Headset,
    title: t("Technical support always dedicated to you"),
    description: t("Count on specialists who guarantee performance, continuous stability and security in all your daily operation."),
  },
]

export default function BenefitsSection() {
  return (
    <div className="relative bg-black py-16 px-4 md:px-8 overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
        <InteractiveGridPattern 
          width={140}
          height={140}
          squares={[8, 8]}
          className="border-none opacity-40"
          squaresClassName="stroke-gray-500/20 hover:fill-gray-500/20"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto relative z-20">
        {/* Header */}
        <div className="mb-16 text-center md:text-left">
          <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
            {t('Benefits')}
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-gray-100 mb-6">
            {t('Benefits of maximizing the efficiency of your payments')}
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto md:mx-0">
            {t('Customize your acquiring operation without sacrificing performance and fluidity throughout the entire cycle.')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="space-y-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#080808] to-gray-500/20 rounded group-hover:bg-white/10 transition-colors border border-gray-400/10 flex items-center justify-center">
                <benefit.icon className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-xl text-white font-light leading-tight">{benefit.title}</h3>
              <p className="text-gray-300/80">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

