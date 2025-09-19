"use client"

import Image from "next/image"
import { t } from '../../utils/i18n'

interface DualCardSectionProps {
  title?: string
  subtitle?: string
  leftCardImage?: string
  rightCardImage?: string
}

export default function DualCardSection({
  title = "Cartão Pré-Pago e Débito",
  subtitle = "A solução ideal para controle de gastos e gestão financeira, com cartões pré-pagos (físicos e virtuais) para Pessoas Físicas ou Jurídicas.",
  leftCardImage = "/orange-card.svg",
  rightCardImage = "/blue-card.svg",
}: DualCardSectionProps) {
  return (
    <div className="bg-gradient-to-t from-[#030303] to-[#101010] p-12  mb-24 border-2 border-gray-500/20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-[40px] font-light text-white mb-3">{title}</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto md:mx-0">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-x-4 mb-10">
        {/* Left Card */}
        <div className="flex justify-center h-full order-1 md:order-none">
          <div className="relative w-full h-[200px] md:h-auto">
            <Image
              src={leftCardImage || "/placeholder.svg"}
              alt="Prepaid card"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Center Text */}
        <div className="bg-[#020202] px-8 w-full flex flex-col justify-center p-4 order-2 md:order-none">
            <h3 className="text-2xl font-light text-white mb-6">Mais autonomia, controle e praticidade.</h3>
            <p className="text-gray-400 text-md leading-relaxed">
              Ofereça praticidade no dia a dia com cartões pré-pagos e débito que fortalecem a relação com seus clientes.
            </p>
        </div>

        {/* Right Card */}
        <div className="flex justify-center h-full order-3 md:order-none">
          <div className="relative w-full h-[200px] md:h-auto">
            <Image
              src={rightCardImage || "/placeholder.svg"}
              alt="Debit card"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bottom Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-8 [&>*:last-child:nth-child(2n+1)]:col-span-2 [&>*:last-child:nth-child(2n+1)]:place-self-center sm:[&>*:last-child:nth-child(2n+1)]:col-span-1 sm:[&>*:last-child:nth-child(2n+1)]:place-self-auto">
        {[
          "Pagamento prático e mais seguro",
          "Cartões com sua marca", 
          "Solicitação simples e fluida via API",
          "Entenda o perfil dos seus clientes",
          "Crie programas de fidelização via API"
        ].map((indicator, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="bg-[#030303]/100 p-4 sm:p-8 flex flex-col items-center w-full min-h-[160px] sm:h-[200px]">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#030303] to-[#242424] border border-[#1A1A1A] mb-4" />
              <p className="text-center text-xs sm:text-sm text-gray-400">
                {indicator}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

