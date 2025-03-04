"use client"

import Image from "next/image"

interface CardSectionProps {
  title: string
  subtitle: string
  cardImage: string
  dotColor: string
}

export default function CardSection({ title, subtitle, cardImage, dotColor }: CardSectionProps) {
  return (
    <div className="bg-gradient-to-t from-[#030303] to-[#101010] p-12  mb-24 border-2 border-gray-400/20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-light text-white mb-4">{title}</h2>
        <p className="text-gray-300 text-xl max-w-2xl">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-2 ">
        {/* Left Column - Bullet Points */}
        <div className="lg:col-span-4 h-full flex">
          <div className="bg-[#020202] p-8 w-full h-[200px] flex items-center">
            <ul className="space-y-4">
              {["White or Private Label", "Physical and Virtual Cards", "Access to the main brands on the market"].map(
                (item, index) => (
                  <li key={index} className="flex items-start gap-4 text-gray-400">
                    <div className={`w-2 h-2 rounded-full ${dotColor} mt-2 flex-shrink-0`} />
                    <span className="text-md">{item}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* Center Column - Card Image */}
        <div className="lg:col-span-4 h-full flex">
          <div className="relative w-full h-[280px] bg-contain bg-center bg-no-repeat -top-[75px]">
            <Image 
              src={cardImage || "/placeholder.svg"} 
              alt="Credit card" 
              fill 
              className="object-cover w-full h-full" 
              priority 
            />
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="lg:col-span-4 h-full flex">
          <div className="bg-[#020202] px-8 py-12 w-full h-[200px] flex flex-col justify-center">
            <h3 className="text-2xl font-light text-white mb-6">Your customer is <br /> increasingly yours</h3>
            <p className="text-gray-400 text-md leading-relaxed">
              Count on the experience of those who issued <span className="text-white">more than 100 million cards</span>{" "}
              in the last 12 months.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Indicators */}
      <div className="grid grid-cols-5 gap-8">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-[#030303]/100 p-8 flex flex-col items-center w-full h-[200px]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#030303] to-[#242424] border border-[#1A1A1A] mb-4" />
                <p className="text-center text-sm text-gray-400">
                  Issuance and
                  <br />
                  processing of cards
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

