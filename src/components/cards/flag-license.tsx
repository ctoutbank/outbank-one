"use client"

import { Check, ChevronRight, SquareCheck } from "lucide-react"
import Image from "next/image"

export default function FlagLicense() {
  const dockFeatures = [
    "Obtain more attractive costs with the brand due to the high processing volume from Dock.",
    "We have the infrastructure to settle transactions without your company needing a settlement bank.",
    "We manage the delivery of regulatory files to the BCB related to the issuance of cards and all flag reports.",
    "Maintain the brand's incentives and remuneration for the operation with BIN Sponsor Dock.",
  ]

  const ownFeatures = [
    "Exclusive BIN Sponsor for your company with your own credit card issuer or debit in a personalized way, all of this is possible with the Dock infrastructure",
  ]

  return (
    <section className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
            PRODUCTS
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-6">Flag License</h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Don&apos;t worry about regulatory issues, Dock takes care of it for you!
            <br />
            Enjoy the Flexibility in hiring our solution according to your business strategy
          </p>
        </div>

        {/* License Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Dock Flag License */}
          <div className="bg-[#080808] p-8 rounded-lg">
            <div className="flex items-center gap-2 mb-8">
              <div className="flex">
                <ChevronRight className="w-6 h-6" />
                <ChevronRight className="w-6 h-6 -ml-4" />
              </div>
              <h3 className="text-2xl font-light">Dock Flag License</h3>
            </div>
            <ul className="space-y-6 ml-12">
              {dockFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-4 pt-4 last:pb-6 border-t border-gray-400/20 last:border-b">
                  <SquareCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-300/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Own Flag License */}
          <div>
            <div className="bg-[#080808] p-8 rounded-lg">
              <div className="flex items-center gap-2 mb-8">
                <ChevronRight className="w-6 h-6" />
                <ChevronRight className="w-6 h-6 -ml-6" />
                <h3 className="text-2xl font-light">Own Flag License</h3>
              </div>
              <ul className="space-y-6 ml-12">
                {ownFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4 pt-4 last:pb-6 border-t border-gray-400/20 last:border-b">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-300/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Updated Wallets and Flags section */}
            <div className="mt-16">
              <h4 className="text-2xl font-light mb-8">Integrate with the main wallets on the market</h4>

              {/* Wallets */}
              <div className="hidden md:flex items-center gap-12 mb-12">
                <div className="h-[58px] w-[176px] relative bg-[#080808] p-4 flex items-center justify-center">
                  <Image src="/samsung-pay-logo.svg" alt="Samsung Pay" width={86} height={26} className="object-contain" />
                </div>
                <div className="h-[58px] w-[176px] relative bg-[#080808] p-4 flex items-center justify-center">
                  <Image src="/apple-pay-logo.svg" alt="Apple Pay" width={56} height={22} className="object-contain" />
                </div>
                <div className="h-[58px] w-[176px] relative bg-[#080808] p-4 flex items-center justify-center">
                  <Image src="/google-wallet-icon.svg" alt="Google Wallet" width={114} height={16} className="object-contain" />
                </div>
              </div>

              {/* Mobile Wallets */}
              <div className="flex flex-col gap-4 mb-12 md:hidden">
                <div className="h-[58px] relative bg-[#080808] p-4 flex items-center justify-center">
                  <Image src="/samsung-pay-logo.svg" alt="Samsung Pay" width={86} height={26} className="object-contain" />
                </div>
                <div className="h-[58px] relative bg-[#080808] p-4 flex items-center justify-center">
                  <Image src="/apple-pay-logo.svg" alt="Apple Pay" width={56} height={22} className="object-contain" />
                </div>
                <div className="h-[58px] relative bg-[#080808] p-4 flex items-center justify-center">
                  <Image src="/google-wallet-icon.svg" alt="Google Wallet" width={114} height={16} className="object-contain" />
                </div>
              </div>

              {/* Flags */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <span className="text-xl font-light">Flags</span>
                  <div className="flex items-center gap-4">
                    <div className="h-[60px] w-[80px] relative bg-[#080808] p-2 flex items-center justify-center">
                      <div className="h-[40px] w-[50px] bg-white rounded-md p-2 flex items-center justify-center">
                        <Image src="/visa.svg" alt="Visa" width={40} height={20} className="object-contain" />
                      </div>
                    </div>
                    <div className="h-[60px] w-[80px] relative bg-[#080808] p-2 flex items-center justify-center">
                      <div className="h-[40px] w-[50px] bg-white rounded-md p-2 flex items-center justify-center">
                        <Image src="/mastercard.svg" alt="Mastercard" width={40} height={20} className="object-contain" />
                      </div>
                    </div>
                    <div className="h-[60px] w-[80px] relative bg-[#080808] p-2 flex items-center justify-center">
                      <div className="h-[40px] w-[50px] bg-white rounded-md p-2 flex items-center justify-center">
                        <Image src="/elo.svg" alt="Elo" width={40} height={20} className="object-contain" />
                      </div>
                    </div>
                    <div className="h-[60px] w-[80px] relative bg-[#080808] p-2 flex items-center justify-center">
                      <div className="h-[40px] w-[50px] bg-white rounded-md p-2 flex items-center justify-center">
                        <Image src="/american-express.svg" alt="American Express" width={40} height={20} className="object-contain" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">*CHECK FLAG <br /> AVAILABILITY <br /> BY SOLUTION.</span>
                  </div>
                </div>
              </div>

              {/* Mobile Flags */}
              <div className="md:hidden">
                <span className="text-xl font-light block mb-4">Flags</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-[60px] relative bg-[#080808] p-2 flex items-center justify-center">
                    <div className="h-[40px] w-[50px] bg-white rounded-md p-2 flex items-center justify-center">
                      <Image src="/visa.svg" alt="Visa" width={40} height={20} className="object-contain" />
                    </div>
                  </div>
                  <div className="h-[60px] relative bg-[#080808] p-2 flex items-center justify-center">
                    <div className="h-[40px] w-[50px] bg-white rounded-md p-2 flex items-center justify-center">
                      <Image src="/mastercard.svg" alt="Mastercard" width={40} height={20} className="object-contain" />
                    </div>
                  </div>
                  <div className="h-[60px] relative bg-[#080808] p-2 flex items-center justify-center">
                    <div className="h-[40px] w-[50px] bg-white rounded-md p-2 flex items-center justify-center">
                      <Image src="/elo.svg" alt="Elo" width={40} height={20} className="object-contain" />
                    </div>
                  </div>
                  <div className="h-[60px] relative bg-[#080808] p-2 flex items-center justify-center">
                    <div className="h-[40px] w-[50px] bg-white rounded-md p-2 flex items-center justify-center">
                      <Image src="/american-express.svg" alt="American Express" width={40} height={20} className="object-contain" />
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-400 block mt-4 text-center">
                  *CHECK FLAG AVAILABILITY BY SOLUTION.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

