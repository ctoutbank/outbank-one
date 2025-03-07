import Image from "next/image"

export default function EcommerceTabContent() {
  return (
    <div className="bg-gradient-to-r from-[#2D2D2D] to-[#101010] border-2 border-[#585858] p-4 sm:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl text-gray-100 font-normal mb-2 sm:mb-3">Also have acquisition for the virtual world</h2>
        <p className="text-base sm:text-lg text-gray-300/90">
        Outbank provides ecommerce APIs and payment link solutions for you to receive transactions in your business.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - 2x2 Feature Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 auto-rows-fr lg:h-[500px]">
            {/* Top Row */}
            <div className="bg-gradient-to-r from-[#4a4a4a] to-[#272727] hover:from-[#A0A0A0] hover:to-[#5D5D5D] p-4 sm:p-6 flex flex-col group h-full">
              <h3 className="text-xl  text-gray-200 group-hover:text-[#080808] font-normal mb-4">Ecommerce Integration APIs</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808]">Sale</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808]">Pre-Authorization</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808]">Cancellation</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808]">Payment Split</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r  from-[#454545] to-[#202020] hover:from-[#A0A0A0] hover:to-[#5D5D5D] p-4 sm:p-6 flex flex-col group h-full">
              <h3 className="text-xl  text-gray-200 group-hover:text-[#080808] font-normal mb-4">Added Services</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808]">Tokenization</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808]">Anti-fraud</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808]">3DS</p>
                </div>
                
              </div>
            </div>

            {/* Bottom Row */}
            <div className="bg-gradient-to-r from-[#4a4a4a] to-[#272727] hover:from-[#A0A0A0] hover:to-[#5D5D5D] p-4 sm:p-6 flex flex-col group h-full">
              <h3 className="text-xl  text-gray-200 group-hover:text-[#080808] font-normal mb-4">Payment Link</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808]">Pix</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808]">Cash and installment credit</p>
                </div>
                
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#454545] to-[#202020] hover:from-[#A0A0A0] hover:to-[#5D5D5D] p-4 sm:p-6 flex flex-col group h-full">
              <h3 className="text-xl  text-gray-200 group-hover:text-[#080808] font-normal mb-4">Pix Checkout</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808]">QR Codes</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-300/90 group-hover:text-[#080808]">Copy and Paste for Billing</p>
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
                src="/ecommerce-img.svg"
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

