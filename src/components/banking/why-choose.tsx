"use client"

import { useState } from "react"
import { Circle, Square, Triangle } from "lucide-react"
import { t } from '../../utils/i18n'

export default function WhyChooseSection() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const features = [
    {
      icon: <Circle className="w-12 h-12 stroke-2 transition-all duration-300 ease-in-out" />,
      title: t("Transparency"),
      description: t("Test before hiring! Our team specialized in digital banks combines experience, qualification and mastery of trends, standards and best practices in the sector. We deliver robust, innovative solutions in full regulatory compliance."),
    },
    {
      icon: <Triangle className="w-12 h-12 stroke-2 transition-all duration-300 ease-in-out" />,
      title: t("Security"),
      description: t("By choosing a company specialized in digital banks, your organization gains more efficiency. With advanced tools, we accelerate development and enable agile and strategic launches."),
    },
    {
      icon: <Square className="w-12 h-12 stroke-2 transition-all duration-300 ease-in-out" />,
      title: t("Agility"),
      description: t("With Outbank Cloud, your company gains agility to launch new products. While you direct resources to what is strategic, we guarantee a complete, efficient and compliant infrastructure to accelerate your growth."),
    },
  ]

  return (
    <section className="bg-black text-white py-16">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center md:text-left">{t('Why Choose Us?')}</h2>
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

