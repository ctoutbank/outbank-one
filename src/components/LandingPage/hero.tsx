"use client"

import Image from 'next/image'

const HeroLandingPage = () => {
  return (
    <div className="relative min-h-[600px] md:min-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/img-hero.svg"
          alt="Hero background"
          fill
          className="object-cover md:object-contain md:translate-x-[5%] md:translate-y-[5%]"
          priority
        />
        {/* Dark overlay - darker on mobile, lighter on desktop */}
        <div className="absolute inset-0 bg-black/60 lg:bg-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-32">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Column - Text and Buttons */}
          <div className="w-full lg:max-w-md text-center lg:text-left">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
              OUTBANK CLOUD
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              The most complete financial services infrastructure for your business
            </h1>
            
            <p className="text-gray-300 text-base md:text-lg mb-8">
              Offer digital accounts, branded cards, and innovate in payment services with Pix and acquiring solutions. All with security and fraud prevention.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-white text-gray-900 px-8 py-3 font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-[0.98]"
              >
                Button CTA
              </button>
              <button className="w-full sm:w-auto bg-gray-400/10 text-white px-8 py-3 border border-gray-600/40 font-medium hover:bg-gray-700/30 transition-all duration-300 hover:scale-[0.98]">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroLandingPage
