import Image from "next/image";
import { t } from '../../utils/i18n'

export default function ConsignedCardSection() {
    return (
      <div className="bg-gradient-to-t from-[#030303] to-[#101010] p-12 mb-16 border-2 border-gray-500/20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 text-center sm:text-left">{t('Consigned Card')}</h2>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl text-center sm:text-left mx-auto sm:mx-0">
            {t('Imagine offering your customers an innovative credit card, where payment of the invoice is automatically deducted from your payrolls.')}
          </p>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-y-0 gap-x-2 mb-10">
          {/* Left Column - Bullet Points */}
          <div className="lg:col-span-4 h-full flex">
            <div className="bg-[#020202] p-6 sm:p-8 w-full h-[200px] flex items-center">
              <ul className="space-y-4">
                {[t("White or Private Label"), t("Physical and Virtual Cards"), t("Access to the main brands on the market")].map(
                  (item, index) => (
                    <li key={index} className="flex items-start gap-4 text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-pink-600 mt-2 flex-shrink-0" />
                      <span className="text-md">{item}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
  
          {/* Center Column - Card Image */}
          <div className="lg:col-span-4 h-full flex">
            <div className="relative w-full h-[200px] bg-contain bg-no-repeat">
              <Image
                src="/pink-card.svg" 
                alt="Consigned credit card"
                fill
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>
  
          {/* Right Column - Bullet Points */}
          <div className="lg:col-span-4 h-full flex">
            <div className="bg-[#020202] p-6 sm:p-8 w-full h-[200px] flex items-center">
              <ul className="space-y-4">
                {[t("White or Private Label"), t("Physical and Virtual Cards"), t("Access to the main brands on the market")].map(
                  (item, index) => (
                    <li key={index} className="flex items-start gap-4 text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-pink-600 mt-2 flex-shrink-0" />
                      <span className="text-md">{item}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
  
        {/* Bottom Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-8 [&>*:last-child:nth-child(2n+1)]:col-span-2 [&>*:last-child:nth-child(2n+1)]:place-self-center sm:[&>*:last-child:nth-child(2n+1)]:col-span-1 sm:[&>*:last-child:nth-child(2n+1)]:place-self-auto">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-[#030303]/100 p-4 sm:p-8 flex flex-col items-center w-full min-h-[160px] sm:h-[200px]">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#030303] to-[#242424] border border-[#1A1A1A] mb-4" />
                  <p className="text-center text-xs sm:text-sm text-gray-400">
                    {t('Issuance and processing of cards')}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  }
  
  