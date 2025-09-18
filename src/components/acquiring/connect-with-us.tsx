import Image from "next/image"
import { CreditCard, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { t } from '../../utils/i18n'

export default function ConnectWithUsSection() {
  return (
    <div className="bg-gradient-to-r from-[#969696] to-[#474747] py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#080808] mb-8 text-center md:text-left">
          {t('Connect with the most widely used payment method in Brazil!')}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col h-[450px]">
            {/* Main Card - Height is half of 450px */}
            <div className="bg-gradient-to-r from-[#C8C8C8] to-[#8E8E8E] p-6 h-[225px] flex flex-col">
              <div className="flex items-start justify-between mb-auto">
                <p className="text-[#080808] text-base max-w-[280px]">
                  {t('Our acquiring solution is already integrated with Pix, enabling instant')}
                </p>
                <Image src="/pix-icon.svg" alt="Pix Logo" width={50} height={50} className="opacity-75 brightness-0" />
              </div>
              <Button variant="outline" className="bg-white text-black border border-[#2f2f2f]/60 hover:bg-white/90 rounded-none px-6 py-3 text-lg w-fit shadow-md">
                Contact Us <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Small Cards - Height is half of 450px */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gradient-to-r from-[#C8C8C8] to-[#8E8E8E] p-4 h-[225px] flex flex-col justify-between">
                <CreditCard className="w-10 h-10 text-[#080808]" />
                <p className="text-[#080808] text-sm uppercase tracking-wide">{t('FOR DIGITAL PAYMENTS')}</p>
                <p className="text-[#080808] text-xs">{t('Nossa solução disponibiliza links para pagamentos com Pix.')}</p>
              </div>

              <div className="bg-gradient-to-r from-[#C8C8C8] to-[#8E8E8E] p-4 h-[225px] flex flex-col justify-between">
                <User className="w-10 h-10 text-[#080808]" />
                <p className="text-[#080808] text-sm uppercase tracking-wide">{t('FOR IN-PERSON PAYMENTS')}</p>
                <p className="text-[#080808] text-xs">{t('Nossa solução possibilita a geração de QR Code.')}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Brazil Map */}
          <div className="relative h-[450px] w-full">
            <Image
              src="/world-map.svg"
              alt="Brazil Map"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}

