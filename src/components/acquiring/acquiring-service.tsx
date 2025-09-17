import { Check } from "lucide-react"
import Image from "next/image"
import { t } from '../../utils/i18n'

export default function AcquiringService() {
  return (
    <div className="bg-black py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
          {/* Left Column - Cards */}
          <div className="hidden md:block relative h-[800px] md:h-[880px] -mt-20">
            <Image
              src="/service-dual-card.svg" 
              alt="Banking cards"
              fill
              className="object-contain scale-125 md:scale-150 md:translate-x-[15%]"
              priority
            />
          </div>

          {/* Right Column - Content */}
          <div className="mb-0 mt-8 md:mt-0 text-center md:text-left">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
              {t('ACQUIRING AS A SERVICE')}
            </div>

            <h2 className="text-4xl md:text-5xl font-light text-gray-100 mb-6">
              {t('Technology for you to be your own acquirer')}
            </h2>

            <p className="text-gray-300/80 text-lg mb-8">
              {t('Offer acquiring services with a white-label platform. Discover how your own acquiring operation can transform your business.')}
            </p>

            <div className="max-w-4xl mx-auto mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            </div>

            {/* Feature List */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-[#2c2c2c] to-[#080808] p-6 rounded relative">
                  <div className="rounded-full border border-green-500 p-1 absolute top-4 right-4">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-gray-300/80 pr-12">{t('Offer the acquisition service and expand your service portfolio.')}</p>
                </div>

                <div className="bg-gradient-to-r from-[#2c2c2c] to-[#080808] p-6 rounded relative">
                  <div className="rounded-full border border-green-500 p-1 absolute top-4 right-4">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-gray-300/80 pr-12">{t('Use it as a monetization strategy and reinforce your brand.')}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#2c2c2c] to-[#080808] p-6 rounded relative">
                <div className="rounded-full border border-green-500 p-1 absolute top-4 right-4">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-gray-300/80 pr-12">
                  {t('No intermediaries. Become a White label acquirer, adding new revenue to your company.')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="-mt-20 md:-mt-40">
          <h2 className="text-4xl md:text-5xl font-light text-gray-100 mb-8">
            {t('Count on our complete solution')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Provider Box */}
            <div className="bg-gradient-to-r from-[#2c2c2c] to-[#080808] p-8 rounded-lg">
              <p className="text-gray-300 text-lg mb-6">
                {t('POS, TEF, Pix, Tap On Phone, Payment Link, APIs, and Pix Checkout.')}
              </p>
              <span className="text-sm text-gray-400/80">PROVIDER</span>
            </div>

            {/* Acquiring Box */}
            <div className="bg-gradient-to-r from-[#2c2c2c] to-[#080808] p-8 rounded-lg">
              <p className="text-gray-300 text-lg mb-6">{t('Acquiring processing and transactions settlement')}</p>
              <div className="flex items-center gap-4">
                <div className="h-[40px] w-[50px] bg-white rounded-md p-2 flex items-center justify-center">
                  <Image src="/visa.svg" alt="Visa" width={40} height={20} className="object-contain" />
                </div>
                <div className="h-[40px] w-[50px] bg-white rounded-md p-2 flex items-center justify-center">
                  <Image src="/mastercard.svg" alt="Mastercard" width={40} height={20} className="object-contain" />
                </div>
                <div className="h-[40px] w-[50px] bg-white rounded-md p-2 flex items-center justify-center">
                  <Image src="/elo.svg" alt="Elo" width={40} height={20} className="object-contain" />
                </div> 
                <span className="text-sm text-gray-400/80">+27 networks</span>
              </div>
            </div>

            {/* Back-office Box */}
            <div className="bg-gradient-to-r from-[#2c2c2c] to-[#080808] p-8 rounded-lg">
              <p className="text-gray-300 text-lg mb-6">{t('Back-office structure for operation management')}</p>
              <p className="text-sm text-gray-400/80">
                RECEIVABLES IN ADVANCE AND RECONCILIATION, CHARGEBACKS, AND REPORTS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

