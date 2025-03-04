"use client"

import Image from "next/image"

interface DualCardSectionProps {
  title?: string
  subtitle?: string
  leftCardImage?: string
  rightCardImage?: string
}

export default function DualCardSection({
  title = "Prepaid and Debit Card",
  subtitle = "Discover the ideal solution to retain your customers, offering prepaid cards, physical and virtual, for Individuals or Legal Entities!",
  leftCardImage = "/orange-card.svg",
  rightCardImage = "/blue-card.svg",
}: DualCardSectionProps) {
  return (
    <div className=" bg-gradient-to-t from-[#030303] to-[#101010] p-8 rounded-xl mb-10">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-[40px] font-light text-white mb-3">{title}</h2>
        <p className="text-gray-300 text-lg max-w-2xl">{subtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-x-4  min-h-[300px]">
        {/* Left Card */}
        <div className="flex justify-center h-full">
          <div className="relative w-full aspect-[5/3] transform -translate-y-20">
            <Image
              src={leftCardImage || "/placeholder.svg"}
              alt="Prepaid card"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Center Text */}
        <div className="bg-[#020202] px-8 py-12 w-full h-[200px] mt-2 flex flex-col justify-center p-4">
            <h3 className="text-2xl font-light text-white mb-6">Your customer is <br /> increasingly yours</h3>
            <p className="text-gray-400 text-md leading-relaxed">
              Count on the experience of those who issued <span className="text-white">more than 100 million cards</span>{" "}
              in the last 12 months.
            </p>
        </div>

        {/* Right Card */}
        <div className="flex justify-center h-full">
          <div className="relative w-full aspect-[5/3] transform -translate-y-20">
            <Image
              src={rightCardImage || "/placeholder.svg"}
              alt="Debit card"
              fill
              className="object-contain"
              priority
            />
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

