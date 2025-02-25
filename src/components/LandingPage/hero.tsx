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
          className="object-cover"
          priority
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Column - Text and Buttons */}
          <div className="max-w-md">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm  rounded-2xl inline-block mb-6">
              OUTBANK CLOUD
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              The most complete financial services infrastructure for your business
            </h1>
            
            <p className="text-gray-300 text-lg mb-8">
              Offer digital accounts, branded cards, and innovate in payment services with Pix and acquiring solutions. All with security and fraud prevention.
            </p>
            
            <div className="flex gap-4">
              <button className="bg-white text-gray-900 px-8 py-3 font-medium hover:bg-gray-100 transition-colors">
                Button CTA
              </button>
              <button className="bg-gray-600/30 text-white px-8 py-3 border border-gray-600/40  font-medium hover:bg-gray-800/60 transition-colors">
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
