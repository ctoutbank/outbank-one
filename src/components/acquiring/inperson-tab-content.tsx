import Image from "next/image"
import { t } from '../../utils/i18n'

export default function InpersonTabContent() {
  return (
    <div className="bg-gradient-to-r from-[#2D2D2D] to-[#101010] border-2 border-[#585858] p-4 sm:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl text-gray-100 font-normal mb-2 sm:mb-3">{t('Complete end-to-end solutions with OutBank')}</h2>
        <p className="text-base sm:text-lg text-gray-300/90">
          {t('Count on purchasing features that will make your day-to-day operations even more fluid')}
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - 2x3 Feature Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 auto-rows-fr lg:h-[600px]">
            {/* First Row */}
            <div className="bg-gradient-to-r from-[#4a4a4a] to-[#272727] hover:from-[#A0A0A0] hover:to-[#5D5D5D] p-4 sm:p-6 flex flex-col group h-full">
              <h3 className="text-xl text-gray-200 group-hover:text-[#080808] font-normal mb-4">{t('Automatic ERP reconciliation')}</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Direct ERP integration')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Fewer manual errors')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Real-time entries')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Time savings')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Reliable reports')}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#454545] to-[#202020] hover:from-[#A0A0A0] hover:to-[#5D5D5D] p-4 sm:p-6 flex flex-col group h-full">
              <h3 className="text-xl text-gray-200 group-hover:text-[#080808] font-normal mb-4">{t('Daily transaction extract')}</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Detailed view of the day')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Real-time monitoring')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Facilitated cash management')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Identification of discrepancies')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Data export')}</p>
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="bg-gradient-to-r from-[#4a4a4a] to-[#272727] hover:from-[#A0A0A0] hover:to-[#5D5D5D] p-4 sm:p-6 flex flex-col group h-full">
              <h3 className="text-xl text-gray-200 group-hover:text-[#080808] font-normal mb-4">{t('Transaction cancellation')}</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Fast and secure reversal')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Compliance with brands')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Fraud reduction')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Automatic registration')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Better customer experience')}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#454545] to-[#202020] hover:from-[#A0A0A0] hover:to-[#5D5D5D] p-4 sm:p-6 flex flex-col group h-full">
              <h3 className="text-xl text-gray-200 group-hover:text-[#080808] font-normal mb-4">{t('Sales receipt printing')}</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Immediate issuance')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Custom layout')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Secure registration')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Audit support')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('System integration')}</p>
                </div>
              </div>
            </div>

            {/* Third Row - Single item spanning both columns */}
            <div className="bg-gradient-to-r from-[#4a4a4a] to-[#272727] hover:from-[#A0A0A0] hover:to-[#5D5D5D] p-4 sm:p-6 flex flex-col group h-full sm:col-span-2">
              <h3 className="text-xl text-gray-200 group-hover:text-[#080808] font-normal mb-4">{t('Complete end-to-end solutions with OutBank')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Automatic ERP reconciliation')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Daily transaction extract')}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Transaction cancellation')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-gray-300/90 group-hover:text-[#080808] text-sm">{t('Sales receipt printing')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Cards Illustration */}
        <div className="lg:col-span-4">
          <div className="h-[300px] lg:h-[500px] bg-[#222] overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src="/inperson-img.svg"
                alt="Payment Solutions Illustration"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

