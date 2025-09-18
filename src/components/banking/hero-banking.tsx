"use client"

import Image from 'next/image'
import { motion } from 'framer-motion'
import { t } from '../../utils/i18n'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const HeroBanking = () => {
  return (
    <div className="relative min-h-[600px] md:min-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero-banking.svg"
          alt="Hero background"
          fill
          className="object-cover md:object-contain md:translate-x-[5%] "
          priority
          quality={100}
        />
        {/* Dark overlay - darker on mobile, lighter on desktop */}
        <div className="absolute inset-0 bg-black/60 md:bg-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-32">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Column - Text and Buttons */}
          <div className="w-full lg:max-w-md text-center lg:text-left">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
              {t('BANKING')}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {t('BAAS - Banking as a Service')}
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 px-4 sm:px-0">
              {t('Security and innovation in 100% compliance with sector regulatory requirements.')}
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
              <button className="w-full sm:w-auto bg-gray-400/10 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-600/40 font-medium hover:bg-gray-700/30 transition-all duration-300 hover:scale-[0.98] ">
                {t('Learn More')}
              </button>
            </div>

            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="md:flex items-center gap-4 mt-8 sm:mt-12 md:mt-16"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-center md:justify-start">
                  <Image 
                    src="/product-avatars.svg" 
                    alt="avatars" 
                    width={140} 
                    height={140} 
                    className="w-[140px] sm:w-[180px]"
                    quality={100} 
                  />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs sm:text-sm text-gray-300">{t('Boost your business with Outbank.')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanking
