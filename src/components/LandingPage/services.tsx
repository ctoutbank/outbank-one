"use client"

import Image from "next/image"

export default function ServicesSection() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
            SERVICES
          </div>
          <h2 className="text-4xl md:text-5xl font-light max-w-7xl">Reliability and security for your transactions</h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            {[
              {
                title: <>Regulated Pix <br/>Participant</>,
                description:
                  "Peace of mind knowing your payments are in good hands, with full security and legal backing.",
              },
              {
                title: <>VISA, MasterCard,<br/> Elo Licenses</>,
                description: "Accept the leading card networks in the market and offer more options to your customers.",
              },
              {
                title: <>Adaptable Global<br/> Payment Platform</>,
                description: "Reach customers worldwide and tailor the experience to meet their needs in the market.",
              },
            ].map((service, index) => (
              <div 
                key={index} 
                className="flex flex-col gap-4 bg-[#080808] p-4 h-[182px]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">{service.title}</h3>
                  <Image
                    src="/logo-icon.svg"
                    alt="Logo icon"
                    width={40}
                    height={40}
                    className="border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-600/20"
                  />
                </div>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>

          {/* Center Column with Phone */}
          <div className="relative flex items-center justify-center">
            <div className="relative rounded-3xl w-full max-w-sm mx-auto">
              <Image
                src="/phone.svg"
                alt="Outbank App Interface"
                width={400}
                height={800}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            {[
              {
                title: <>Comprehensive<br/>Infrastructure</>,
                description:
                  "A complete solution for online payments, including gateway, fraud prevention, and risk management.",
              },
              {
                title: <>Recognized<br/> Certifications</>,
                description: "Commitment to security, quality, and international compliance across all our operations.",
              },
              {
                title: <>Fraud Prevention<br/> Security</>,
                description: "Data and transactions protected with the best tools on the market.",
              },
            ].map((service, index) => (
              <div 
                key={index} 
                className="flex flex-col gap-4 bg-[#080808] p-4 h-[182px]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">{service.title}</h3>
                  <Image
                    src="/logo-icon.svg"
                    alt="Logo icon"
                    width={40}
                    height={40}
                    className="border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-600/20"
                  />
                </div>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

