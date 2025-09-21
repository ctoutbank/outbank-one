"use client"

import Image from 'next/image'
import { t } from '../../utils/i18n'



const HeroCards = () => {
  return (
    <div className="relative min-h-[600px] md:min-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/header_cards_credit.jpg"
          alt="Cards and Credit header background"
          fill
          className="object-cover md:object-contain md:translate-x-[5%] "
          priority
          quality={100}
        />
        {/* Dark overlay - darker on mobile, lighter on desktop */}
        <div className="absolute inset-0 bg-black/60 md:bg-transparent" />
        {/* Blur gradients for better blending - desktop only */}
        <div className="absolute inset-y-0 left-0 w-0 md:w-32 bg-gradient-to-r from-black to-transparent" />
        <div className="absolute inset-y-0 right-0 w-0 md:w-[30rem] bg-gradient-to-l from-black to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-32">  
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Column - Text and Buttons */}
          <div className="w-full lg:max-w-md text-center lg:text-left">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
              {t('CARDS & CREDIT')}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {t('Launch your operation with the largest card processor in Latin America')}
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 px-4 sm:px-0">
              {t('Take advantage of the most complete and robust payment processing platform to create the best experiences with total flexibility, using Dock licenses or your own licenses.')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
              <button 
                onClick={() => {
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-white text-gray-900 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-[0.98] "
              >
                {t('Entre em Contato')}
              </button>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCards
