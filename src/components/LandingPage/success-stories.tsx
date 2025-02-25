"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CreditCard } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function SuccessStories() {
  const [currentSlide, setCurrentSlide] = useState(1)

  return (
    <section className="w-full bg-[#CFC8B8] py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light">Success stories</h2>
          <div className="flex gap-2 mr-28">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentSlide(num)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm
                  ${num === currentSlide ? "bg-black text-white" : "border border-black/20 bg-transparent text-black hover:bg-black/10"}`}
              >
                {num.toString().padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quote Card */}
          <div className="bg-gradient-to-r from-[#625F57]  to-[#080808] p-8 text-white flex flex-col justify-between" style={{ height: "566px" }}>
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-light leading-tight">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
              </h3>
            </div>
            <div className="mt-8">
              <Button variant="outline" className="bg-white text-black hover:bg-white/90 rounded-none px-6 py-6 h-10 text-lg flex items-center">
                Button CTA <ArrowRight className="ml-2 h-7 w-6" />
              </Button>
            </div>
          </div>

          {/* Image Card */}
          <div className="relative" style={{ height: "566px" }}>
            <Image
              src="/sucess-story.svg"
              alt="Success story"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Stats Cards */}
          <div className="flex flex-col gap-6" style={{ height: "566px" }}>
            <div className="bg-gradient-to-r from-[#625F57]  to-[#080808] p-8 text-white flex flex-col justify-between" style={{ height: "calc(300px - 0.75rem)", width: "280px" }}>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 " />
                <span className="text-sm  uppercase tracking-wide">Pass rate (%)</span>
              </div>
              <div className="text-5xl font-light mt-auto">98%</div>
            </div>

            <div className="bg-gradient-to-l from-[#625F57]  to-[#080808] p-8 text-white flex flex-col justify-between" style={{ height: "calc(300px - 0.75rem)", width: "280px" }}>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 " />
                <span className="text-sm  uppercase tracking-wide">Sales processed</span>
              </div>
              <div className="text-5xl font-light mt-auto">1K</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

