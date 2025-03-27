"use client"

import { useState } from "react"
import Image from "next/image"
import EcommerceTabContent from "./ecommerce-tab-content"
import InpersonTabContent from "./inperson-tab-content"

type Tab = "virtual" | "physical"

export default function CaptureModelsSection() {
  const [activeTab, setActiveTab] = useState<Tab>("virtual")

  return (
    <div className="bg-black py-8 sm:py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-center text-white">Discover our capture models</h2>
          </div>
          <p className="text-gray-400 text-base sm:text-lg text-center">
            Maximize your revenue and ensure robustness in your operation
            <br className="hidden sm:block" />
            with our white-label acquiring solution.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex flex-col sm:flex-row rounded-sm bg-gradient-to-r from-[#878787] to-[#404040] p-1 w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab("virtual")}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2 rounded-sm transition-colors ${
                activeTab === "virtual"
                  ? "bg-gradient-to-r from-[#707070] to-[#ABABAB] text-[#080808]"
                  : "text-[#080808] hover:text-black"
              }`}
            >
              <Image
                src="/logo-icon.svg"
                alt=""
                width={16}
                height={16}
                className="opacity-75 brightness-0 sm:w-5 sm:h-5"
                quality={100}
              />
              <span className="font-medium">E-Commerce</span>
            </button>
            <div className="h-[1px] mx-1 bg-[#5A5A5A] sm:hidden" />
            <button
              onClick={() => setActiveTab("physical")}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2 rounded-sm transition-colors ${
                activeTab === "physical"
                  ? "bg-gradient-to-r from-[#ABABAB] to-[#747474] text-[#080808]"
                  : "text-[#080808] hover:text-black"
              }`}
            >
              <Image
                src="/logo-icon.svg" 
                alt=""
                width={16}
                height={16}
                className="opacity-75 brightness-0 sm:w-5 sm:h-5"
                quality={100}
              />
              <span className="font-medium">In-Person Acquiring</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "virtual" ? <EcommerceTabContent /> : <InpersonTabContent />}
      </div>
    </div>
  )
}

