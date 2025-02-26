import { ChevronRight } from "lucide-react"

const features = [
  {
    title: "Digital Account",
    items: [
      "Opening a Personal and Corporate Account",
      "Biometrics, KYC, AIM and anti-fraud",
      "TED Transfer, P2P",
      "Payment and billing Bill",
      "PIX keys",
      "PIX Payment and Billing",
      "QR Code PIX",
      "Security Code + OTP + TOPT",
    ],
  },
  {
    title: "Backoffice & CRM",
    items: [
      "Complete Account Management",
      "Complete Transaction Management",
      "Dashboard Onboarding",
      "Transactional Dashboard",
      "Fare Management",
      "Feature Flag Management",
      "Parameterization and Configuration",
    ],
  },
  {
    title: "PJ Module",
    items: [
      "Payment Management",
      "Billing Management",
      "Transactional Limit Management",
      "Reading and Issuing CNAB 240",
      "Payment Workflow",
      "Reading and Issuance of Conciliation File",
    ],
  },
  {
    title: "Cards",
    items: [
      "Prepaid Credit Card",
      "Complete Transaction Management",
      "Dashboard Onboarding",
      "Transactional Dashboard",
      "Fare Management",
      "Feature Flag Management",
      "Parameterization and Configuration",
    ],
  },
  {
    title: "mPOS",
    items: [
      "Abertura de Conta PF e PJ",
      "Biometrics, KYC, AIM and anti-fraud",
      "TED Transfer, P2P",
      "Payment and billing Bill",
      "PIX keys",
      "PIX Payment and Billing",
      "QR Code PIX",
      "Security Code + OTP + TOPT",
    ],
  },
  {
    title: "Cashback & Loyalty",
    items: [
      "Complete Account Management",
      "Complete Transaction Management",
      "Dashboard Onboarding",
      "Transactional Dashboard",
      "Fare Management",
      "Feature Flag Management",
      "Parameterization and Configuration",
    ],
  },
]

export default function ProductFeatures() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
            PRODUCTS
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-6">Your digital bank, plug & play</h2>
          <p className="text-gray-200 text-lg max-w-3xl">
            A complete banking platform for your company to create and offer innovative financial services.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#080808] p-8">
              <div className="flex items-center gap-2 mb-6">
                <ChevronRight className="w-6 h-6" />
                <ChevronRight className="w-6 h-6 -ml-6" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {feature.items.map((item, itemIndex) => (
                  <p
                    key={itemIndex}
                    className="inline-flex px-4 py-2 bg-gradient-to-r from-black via-[#080808] to-[#080808] border border-gray-400/10 text-sm text-muted-foreground rounded-full hover:bg-gradient-to-r hover:from-gray-400/10 hover:via-gray-400/10 hover:to-gray-400/10 hover:text-gray-200 transition-colors"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

