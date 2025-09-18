"use client"
import Image from "next/image"
import { Check, X } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { t } from '../../utils/i18n'

const cards = [
  {
    type: t("Credit"),
    image: "/black-card.svg",
    features: [
      { name: t("Individual"), included: true },
      { name: t("Legal Entity"), included: true },
      { name: t("Virtual Card"), included: true },
      { name: t("Additional Card"), included: true },
      { name: t("Digital Wallets"), included: true },
      { name: t("Dynamic CVV"), included: true },
      { name: t("24 Hour Withdrawal"), included: true },
      { name: t("Temporary blocking"), included: true },
      { name: t("Loyalty Program"), included: true },
      { name: t("3DS"), included: true },
    ],
  },
  {
    type: t("Prepaid and Debit"),
    image: "/orange-card.svg",
    features: [
      { name: t("Individual"), included: true },
      { name: t("Legal Entity"), included: true },
      { name: t("Virtual Card"), included: true },
      { name: t("Additional Card"), included: false },
      { name: t("Digital Wallets"), included: true },
      { name: t("Dynamic CVV"), included: true },
      { name: t("24 Hour Withdrawal"), included: true },
      { name: t("Temporary blocking"), included: true },
      { name: t("Loyalty Program"), included: true },
      { name: t("3DS"), included: true },
    ],
  },
  {
    type: t("Consigned Card"),
    image: "/pink-card.svg",
    features: [
      { name: t("Individual"), included: true },
      { name: t("Legal Entity"), included: true },
      { name: t("Virtual Card"), included: true },
      { name: t("Additional Card"), included: true },
      { name: t("Digital Wallets"), included: false },
      { name: t("Dynamic CVV"), included: false },
      { name: t("24 Hour Withdrawal"), included: true },
      { name: t("Temporary blocking"), included: true },
      { name: t("Loyalty Program"), included: false },
      { name: t("3DS"), included: true },
    ],
  },
  {
    type: t("Private Label"),
    image: "/purple-card.svg",
    features: [
      { name: t("Individual"), included: true },
      { name: t("Legal Entity"), included: true },
      { name: t("Virtual Card"), included: true },
      { name: t("Additional Card"), included: true },
      { name: t("Digital Wallets"), included: false },
      { name: t("Dynamic CVV"), included: false },
      { name: t("24 Hour Withdrawal"), included: true },
      { name: t("Temporary blocking"), included: true },
      { name: t("Loyalty Program"), included: false },
      { name: t("3DS"), included: true },
    ],
  },
]

export default function CardBenefitsCarousel() {
  return (
    <div className="bg-black px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16 text-center md:text-left">
          <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
            {t('BENEFITS')}
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            {t('Outbank is a card processor with the best solution for your company and its customer')}
          </h2>
          <p className="text-gray-400 text-lg">
            {t('For every need, Outbank has a solution for your company and your client.')}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full cursor-grab select-none"
          >
            {/* Mobile Navigation Buttons */}
            <div className="md:hidden flex justify-center gap-4 mb-6">
              <CarouselPrevious className="static translate-x-0 translate-y-0 bg-[#030303] text-gray-500/80 border-gray-500/20 hover:bg-white/10 hover:text-white" />
              <CarouselNext className="static translate-x-0 translate-y-0 bg-[#030303] text-gray-500/80 border-gray-500/20 hover:bg-white/10 hover:text-white" />
            </div>

            <CarouselContent className="-ml-2 md:-ml-4">
              {cards.map((card, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-gradient-to-t from-[#030303] to-[#101010] border border-gray-500/20 p-8 rounded-lg min-h-[600px]">
                    {/* Card Type */}
                    <h3 className="text-2xl font-light text-white mb-6">{card.type}</h3>

                    {/* Card Image */}
                    <div className="relative h-48 mb-8">
                      <Image
                        src={card.image || "/placeholder.svg"}
                        alt={`${card.type} card`}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Features List */}
                    <ul className="space-y-4">
                      {card.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-gray-400 border-b border-gray-600/40 pb-4 last:border-b-0">
                          {feature.included ? (
                            <Check className="w-4 h-4 text-green-500 border border-green-500 rounded-full" />
                          ) : (
                            <X className="w-4 h-4 text-red-500 border border-red-500 rounded-full" />
                          )}
                          <span className="text-sm">{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Desktop Navigation Buttons */}
            <CarouselPrevious className="hidden md:flex bg-[#030303] text-gray-500/80 border-gray-500/20 hover:bg-white/10 hover:text-white" />
            <CarouselNext className="hidden md:flex bg-[#030303] text-gray-500/80 border-gray-500/20 hover:bg-white/10 hover:text-white" />
          </Carousel>
        </div>
      </div>
    </div>
  )
}

