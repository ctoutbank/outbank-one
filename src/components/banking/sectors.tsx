import { Phone, Store, GraduationCap, Heart, Zap, Home } from "lucide-react"

export default function SectorsSection() {
  const sectors = [
    {
      icon: Phone,
      title: "Telecommunications Sector",
      description:
        "Offer banking services integrated into insurance plans telecommunications, facilitate payments and transfers through mobile devices, increase customer retention through combined telecommunications and financial services packages.",
    },
    {
      icon: Store,
      title: "Retail",
      description:
        "Implement digital payment solutions in physical and online stores, offer financial loyalty programs linked to purchases, introduce credit and financing options for customers.",
    },
    {
      icon: GraduationCap,
      title: "Education",
      description:
        "Introduce online financial education programs, offer products banking adapted for students, collaborate with institutions educational programs for discounts or financial advantages.",
    },
    {
      icon: Heart,
      title: "Health",
      description:
        "Implement financial services specialized in medical expenses, introduce flexible payment plans for payment procedures healthcare, integrate insurance payments and reimbursements across platforms digital.",
    },
    {
      icon: Zap,
      title: "Energy",
      description:
        "Offer bill payment and service invoice solutions public, implement financing programs for efficiency energy, introduce financial rewards for customers who adopt sustainable practices.",
    },
    {
      icon: Home,
      title: "Real Estate",
      description:
        "Facilitate online real estate transactions, including payments and financing, offer specific banking services for owners and tenants, introduce loan options for real estate investments.",
    },
  ]

  return (
    <section className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
            SECTORS
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Which sectors can benefit from a Banking infrastructure?
          </h2>
          <p className="text-gray-200 text-lg">
            In addition to startups, subacquirers, fintechs, RetailTechs/EdTechs, IPs/SCDs/SEPs, finance companies,
            brokers, wallets, and traditional banks
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
          Regardless of the industry, success in creating a digital bank often involves understanding customer needs,
          offering convenient and secure solutions and effective technology integration. The diversification of digital
          financial services can strengthen relationships with customers and open new sources of revenue for the sectors
          involved.
        </p>

        {/* Bottom Decorative Line */}
        <div className="max-w-4xl mx-auto mt-8 pb-16">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}

