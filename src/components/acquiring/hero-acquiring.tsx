"use client"

import Image from 'next/image'



const HeroAcquiring = () => {
  return (
    <div className="relative min-h-[600px] md:min-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero-acquiring.svg"
          alt="Hero background"
          fill
          className="object-cover md:object-contain md:translate-x-[10%] "
          priority
          quality={100}
        />
        {/* Dark overlay - darker on mobile, lighter on desktop */}
        <div className="absolute inset-0 bg-black/60 md:bg-transparent" />
        {/* Gradient fade on the right side */}
        <div className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-l from-black to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-32">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Column - Text and Buttons */}
          <div className="w-full lg:max-w-xl text-center lg:text-left">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
              ACQUIRING
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Become an acquirer and explore new revenue opportunities
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 px-4 sm:px-0">
            Count on Dock to access all the necessary infrastructure to have your own white-label acquiring platform.            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
              <button 
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-white text-gray-900 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-[0.98] "
              >
                Button CTA
              </button>
              <button className="w-full sm:w-auto bg-gray-400/10 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-600/40 font-medium hover:bg-gray-700/30 transition-all duration-300 hover:scale-[0.98] ">
                Learn More
              </button>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroAcquiring
