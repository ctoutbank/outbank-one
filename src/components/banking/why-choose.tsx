"use client"

import { useState } from "react"
import { Circle, Square, Triangle } from "lucide-react"

export default function WhyChooseSection() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const features = [
    {
      icon: <Circle className="w-12 h-12 stroke-2 transition-all duration-300 ease-in-out" />,
      title: "Transparency",
      description:
        "You will test before hiring! We are specialized in the development of digital banks, we have a team highly qualified and specialized. We have in-depth knowledge about the latest technological trends, financial regulations and best practices in the sector, ensuring that the final product is robust, innovative and complies with current regulations.",
    },
    {
      icon: <Triangle className="w-12 h-12 stroke-2 transition-all duration-300 ease-in-out" />,
      title: "Security",
      description:
        "By choosing a company dedicated to developing digital banks, organizations benefit from the efficiency in the construction process. Our frameworks, tools and optimized methodologies for solution development digital financial institutions, accelerate the cycle of development allowing our customers launch their products on the market in a shorter period.",
    },
    {
      icon: <Square className="w-12 h-12 stroke-2 transition-all duration-300 ease-in-out" />,
      title: "Agility",
      description:
        "Choose a company specializing in development of digital banks allows the organization to focus their resources and efforts in their main activities. Dedicating more attention to business strategies, marketing and customer service, while we take care of all the digital banking infrastructure, resulting in a more efficient and results-oriented.",
    },
  ]

  return (
    <section className="bg-black text-white py-16">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center md:text-left">Why choose Outbank?</h2>
      </div>

      <div className="w-full">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`w-full transition-all duration-300 ease-in-out ${
              hoveredItem === index ? "bg-[#CFC8B8]" : "bg-black"
            }`}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
              <div className="py-8 md:py-12 flex flex-col md:flex-row md:gap-20 gap-6">
                <div className="flex items-center gap-4 md:gap-8 md:w-[300px]">
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      hoveredItem === index 
                        ? "[&>svg]:stroke-black " 
                        : "[&>svg]:stroke-white "
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl md:text-2xl font-light transition-all duration-300 ease-in-out ${
                    hoveredItem === index ? "text-black" : "text-white"
                  }`}>
                    {feature.title}
                  </h3>
                </div>
                <p
                  className={`text-base md:text-lg leading-relaxed flex-1 transition-all duration-300 ease-in-out ${
                    hoveredItem === index ? "text-black/90" : "text-gray-300/80"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

