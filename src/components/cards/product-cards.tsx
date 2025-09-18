"use client"

import Image from "next/image"
import { t } from '../../utils/i18n'

const ProductCards = () => {
  

  

  return (
    <div className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] bg-black overflow-hidden px-4 sm:px-0">
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 sm:gap-6 lg:gap-0">
          {/* Left Column - Text and Buttons */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-4 sm:mb-6 lg:mb-0 lg:mt-10">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
              {t('PRODUCTS')}
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-5xl font-light text-white mb-4 sm:mb-6 leading-tight">
              {t('For all moments, security from end to end. Only with Outbank!')}
            </h1>

            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 max-w-lg mx-auto lg:mx-0">
              {t('Personalized cards using the brands your customers trust. You focus on relationship, we take care of the operational aspect.')}
            </p>

            <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
              Lorem ipsum dolor sit amet consectetur. Vulputate lectus blandit nunc morbi amet ut. Scelerisque porta id
              sit hendrerit laoreet egestas sodales massa.
            </p>

            <button 
              onClick={() => {
                document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-gray-400/10 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-600/40 font-medium hover:bg-gray-700/30 transition-all duration-300 hover:scale-[0.98] md:mt-4"
            >
              {t('Check the comparison')}
            </button>
          </div>

          {/* Right Column - Stacked Cards */}
          <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[350px] md:h-[500px]">
            {/* Stacked Cards Image */}
            <div className="absolute right-0 top-0 w-full h-full">
              <Image
                src="/stacked-cards.svg"
                alt="Stacked Cards"
                fill
                className="object-contain object-center lg:object-right"
                priority
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCards

