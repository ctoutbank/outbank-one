"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, DollarSign, Check } from "lucide-react"
import Image from "next/image"

export default function BoostSection() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] overflow-hidden w-full">
      {/* Background Image */}
      <div className="absolute inset-0 w-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-black from-15% via-transparent via-50% to-black to-65% z-10 opacity-90" />
        <Image
          src="/boost-img.svg"
          alt="Background"
          fill
          className="object-contain w-full"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block">
              BOOST YOUR BUSINESS
            </div>
            <h1 className="text-5xl font-light text-white leading-tight">
              Thinking about<br />
              opening your digital<br />
              bank or migrating<br />
              your BAAS operation?
            </h1>
            <Button
              variant="outline"
              className="bg-gray-100 text-black hover:bg-white/90 rounded-none py-6 px-8 h-10 text-base mt-4"
            >
              <span className="flex-1">Button CTA</span>
              <ArrowRight className="h-4 w-4 ml-4" />
            </Button>
          </div>

          {/* Right Column - Floating Notifications */}
          <div className="col-span-12 lg:col-span-6 relative " style={{ height: "500px" }}>
            {/* Sale Approved Notifications */}
            <div className="absolute right-0 top-0 bg-[#1C1C1C]/20 backdrop-blur-sm rounded-lg p-3 w-72 border border-gray-400/20">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-black to-[#282828] flex items-center justify-center border border-gray-400/20">
                  <DollarSign className="w-3.5 h-3.5 text-green-500" />
                </div>
                <div>
                  <div className="font-medium text-gray-200">Sale Approved</div>
                  <div className="text-sm text-muted-foreground">Available amount: $2,000</div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-24 bg-[#1C1C1C]/20 backdrop-blur-sm rounded-lg p-3 w-72 border border-gray-400/20 opacity-70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-black to-[#282828] flex items-center justify-center border border-gray-400/20">
                  <DollarSign className="w-3.5 h-3.5 text-green-500" />
                </div>
                <div>
                  <div className="font-medium text-white">Sale Approved</div>
                  <div className="text-sm text-muted-foreground">Available amount: $1,500</div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-48 bg-[#1C1C1C]/20 backdrop-blur-sm rounded-lg p-3 w-72 border border-gray-400/20 opacity-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-black to-[#282828] flex items-center justify-center border border-gray-400/20">
                  <DollarSign className="w-3.5 h-3.5 text-green-500" />
                </div>
                <div>
                  <div className="font-medium text-white">Sale Approved</div>
                  <div className="text-sm text-muted-foreground">Available amount: $5,000</div>
                </div>
              </div>
            </div>

            {/* Transfer Received Notification */}
            <div className="absolute right-[150px] top-[320px] bg-[#1C1C1C]/20 backdrop-blur-sm rounded-lg p-8 w-60 border border-gray-400/20">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-black to-[#282828] flex items-center justify-center mb-4 border border-gray-400/20">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="font-medium text-white mb-2">Transfer Received</div>
                  <div className="text-sm text-muted-foreground">Your transfer worth $50,000 has been completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

