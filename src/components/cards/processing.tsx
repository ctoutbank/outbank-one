"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import Image from "next/image"

export default function CardProcessing() {
  const [openItem, setOpenItem] = useState<number | null>(0)

  const items = [
    {
      title: "Embossing",
      content:
        "Lorem ipsum dolor sit amet consectetur. Congue imperdiet vitae nunc bibendum urna duis molestie. Duis adipiscing id felis metus dignissim dictum velit donec. Tortor tempor odio lobortis senectus. Tristique proin dignissim tincidunt ridiculus orci consectetur.",
    },
    {
      title: "Autorization",
      content:
        "Lorem ipsum dolor sit amet consectetur. Congue imperdiet vitae nunc bibendum urna duis molestie. Duis adipiscing id felis metus dignissim dictum velit donec. Tortor tempor odio lobortis senectus. Tristique proin dignissim tincidunt ridiculus orci consectetur.",
    },
    {
      title: "Liquidation",
      content:
        "Lorem ipsum dolor sit amet consectetur. Congue imperdiet vitae nunc bibendum urna duis molestie. Duis adipiscing id felis metus dignissim dictum velit donec. Tortor tempor odio lobortis senectus. Tristique proin dignissim tincidunt ridiculus orci consectetur.",
    },
    {
      title: "Chargeback",
      content:
        "Lorem ipsum dolor sit amet consectetur. Congue imperdiet vitae nunc bibendum urna duis molestie. Duis adipiscing id felis metus dignissim dictum velit donec. Tortor tempor odio lobortis senectus. Tristique proin dignissim tincidunt ridiculus orci consectetur.",
    },
    {
      title: "Conciliation",
      content:
        "Lorem ipsum dolor sit amet consectetur. Congue imperdiet vitae nunc bibendum urna duis molestie. Duis adipiscing id felis metus dignissim dictum velit donec. Tortor tempor odio lobortis senectus. Tristique proin dignissim tincidunt ridiculus orci consectetur.",
    },
    {
      title: "Account Management",
      content:
        "Lorem ipsum dolor sit amet consectetur. Congue imperdiet vitae nunc bibendum urna duis molestie. Duis adipiscing id felis metus dignissim dictum velit donec. Tortor tempor odio lobortis senectus. Tristique proin dignissim tincidunt ridiculus orci consectetur.",
    },
  ]

  return (
    <section className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block">
              PROCESSING
            </div>
            <h2 className="text-4xl md:text-5xl font-light">Card Processing</h2>
            <p className="text-gray-300 text-lg">
              Take advantage of the most complete and robust processing
              platform to create the best experiences with
              total flexibility, using Dock licenses or your own licenses.
            </p>
            <div className="relative aspect-video w-full lg:w-[550px] h-[355px] hidden lg:block">
              <Image src="/card-processing.svg" alt="Credit Card on Circuit Board" fill quality={100} className="object-cover" />
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="border-b border-white/10">
                <button
                  onClick={() => setOpenItem(openItem === index ? null : index)}
                  className="flex items-center justify-between w-full py-4 text-left group"
                >
                  <span className="text-xl font-semibold">{item.title}</span>
                  <span className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#080808] to-gray-500/20 rounded group-hover:bg-white/10 transition-colors">
                    {openItem === index ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </span>
                </button>
                {openItem === index && <div className="pb-4 text-muted-foreground leading-relaxed">{item.content}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

