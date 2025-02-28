"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, DollarSign, Check } from "lucide-react"
import Image from "next/image"

export default function BoostSection() {
  return (
    <section className="relative min-h-[400px] sm:min-h-[600px] md:min-h-[700px] overflow-hidden w-full">
      {/* Background Image */}
      <div className="absolute inset-0 w-screen h-full bg-black">
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black from-5% via-transparent via-50% to-black to-95% z-10 sm:opacity-100 opacity-0" />
        {/* Side fade effects - Desktop only */}
        <div className="absolute inset-0 z-10 hidden sm:block">
          <div className="absolute inset-y-0 left-0 w-[400px] bg-gradient-to-r from-black via-black to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[500px] bg-gradient-to-l from-black via-black via-60% to-transparent" />
        </div>
        {/* Mobile gradient */}
        <div className="absolute inset-0 z-10 sm:hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black from-15% via-black/60 via-50% to-black to-65%" />
        </div>
        <div className="relative w-full h-full">
          <Image
            src="/boost-img.svg"
            alt="Background"
            fill
            className="object-contain w-full opacity-80 sm:opacity-80"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 md:pt-32">
        <div className="grid grid-cols-12 gap-4 sm:gap-8 items-start">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-6 space-y-4 sm:space-y-6 flex flex-col items-center sm:items-start text-center sm:text-left md:mt-16">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
              BOOST YOUR BUSINESS
            </div>
            <h1 className="text-3xl sm:text-5xl font-light text-white leading-tight max-w-[300px] sm:max-w-none">
              Thinking about
              opening your digital
              bank or migrating
              your BAAS operation?
            </h1>
            <Button
              variant="outline"
              className="bg-gray-100 text-black hover:bg-white/90 rounded-none py-2 sm:py-6 px-3 sm:px-8  text-xs sm:text-base mt-2 sm:mt-4 max-w-[240px] w-full sm:w-auto"
            >
              <span className="flex-1">Button CTA</span>
              <ArrowRight className="h-2.5 w-2.5 sm:h-4 sm:w-4 ml-2 sm:ml-4" />
            </Button>
          </div>

          {/* Right Column - Floating Notifications */}
          <div className="col-span-12 lg:col-span-6 relative hidden sm:block" style={{ height: "400px", minHeight: "300px" }}>
            {/* Sale Approved Notifications */}
            <div className="absolute right-0 top-0 bg-[#1C1C1C]/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 w-64 sm:w-72 border border-gray-400/20">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r from-black to-[#282828] flex items-center justify-center border border-gray-400/20">
                  <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                </div>
                <div>
                  <div className="font-medium text-gray-200 text-sm sm:text-base">Sale Approved</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Available amount: $2,000</div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-20 sm:top-24 bg-[#1C1C1C]/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 w-64 sm:w-72 border border-gray-400/20 opacity-70">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r from-black to-[#282828] flex items-center justify-center border border-gray-400/20">
                  <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                </div>
                <div>
                  <div className="font-medium text-white text-sm sm:text-base">Sale Approved</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Available amount: $1,500</div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-40 sm:top-48 bg-[#1C1C1C]/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 w-64 sm:w-72 border border-gray-400/20 opacity-50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r from-black to-[#282828] flex items-center justify-center border border-gray-400/20">
                  <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                </div>
                <div>
                  <div className="font-medium text-white text-sm sm:text-base">Sale Approved</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Available amount: $5,000</div>
                </div>
              </div>
            </div>

            {/* Transfer Received Notification */}
            <div className="absolute right-[100px] sm:right-[150px] top-[260px] sm:top-[320px] bg-[#1C1C1C]/20 backdrop-blur-sm rounded-lg p-6 sm:p-8 w-56 sm:w-60 border border-gray-400/20">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-black to-[#282828] flex items-center justify-center mb-3 sm:mb-4 border border-gray-400/20">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
                <div>
                  <div className="font-medium text-white mb-2 text-sm sm:text-base">Transfer Received</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Your transfer worth $50,000 has been completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

