"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function ProductsSection() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">    
          <div className="max-w-2xl">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">PRODUCTS</div>
            <h1 className="text-4xl md:text-5xl font-light mb-6">Spread financial power</h1>
            <p className="text-gray-200 text-lg max-w-xl">
              Be part of the greatest transformation ever seen in financial services and boost your business by
              spreading financial power around the world.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4 mt-20">
            <div className="flex flex-col gap-2">
                <div className="flex justify-end">
                  <Image src="/product-avatars.svg" alt="avatars" width={180} height={180} />
                </div>
                <div className="text-right">
              <h3 className="text-lg font-medium mb-1">Unlock new possibilities</h3>
              <p className="text-sm text-muted-foreground">Boost your business with Outbank</p>
            </div>
            
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Top Two Cards Side by Side */}
          <div className="bg-[#080808] hover:bg-[#CFC8B8] text-white hover:text-black p-8 transition-all duration-300 group">
            <h2 className="text-2xl font-semibold mb-4">Dock One Platform</h2>
            <p className="text-muted-foreground group-hover:text-black mb-8">
              Explore our cloud-native platform, the largest and most comprehensive in Latin America, and discover our
              solutions.
            </p>
            <Button variant="ghost" className="rounded-none text-white group-hover:text-black hover:bg-transparent group-hover:bg-transparent hover:scale-105 transition-all duration-100">
              Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-[#080808] hover:bg-[#CFC8B8] text-white hover:text-black p-8 transition-all duration-300 group">
            <h2 className="text-2xl font-semibold mb-4">Banking</h2>
            <p className="text-muted-foreground group-hover:text-black mb-8">
              Elevate the customer experience your profitability with financial solutions integrated into your core
              business.
            </p>
            <Button variant="ghost" className="rounded-none text-white group-hover:text-black hover:bg-transparent group-hover:bg-transparent hover:scale-105 transition-all duration-100">
              Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Three Cards Below */}
          <div className="col-span-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Cards & Credit",
                  description:
                    "Offer personalized cards with your brand from major networks, while we take care of the entire operation.",
                },
                {
                  title: "Acquiring",
                  description:
                    "Have your own white-label acquiring solution using our technology to ensuresimplicity and speed in your go-to-market.",
                },
                {
                  title: "Fraud Prevention",
                  description:
                    "Reduce end-to-end risk in your banking, cards, or acquiring business model through solutions that cover everything - from customer onboarding to transaction monitoring.",
                },
              ].map((product, index) => (
                <div key={index} className="bg-[#080808] hover:bg-[#CFC8B8] text-white hover:text-black p-8 flex flex-col h-full transition-all duration-300 group">
                  <h2 className="text-2xl font-semibold mb-4">{product.title}</h2>
                  <p className="text-muted-foreground group-hover:text-black mb-8 flex-grow">{product.description}</p>
                  <div>
                    <Button variant="ghost" className="rounded-none text-white group-hover:text-black hover:bg-transparent group-hover:bg-transparent hover:scale-105 transition-all duration-100">
                      Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

