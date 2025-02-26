"use client"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import * as React from "react"

export default function CustomerCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  return (
    <div className="w-full bg-[#080808] py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8">
          <p className="text-gray-300 text-md font-medium whitespace-nowrap self-center">
            /Our main customers<br />around the world/
          </p>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full max-w-5xl"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {/* Replace the placeholder.svg with your actual logo URLs */}
              {[
                { name: "Cloudly", src: "cloudly.svg" },
                { name: "Camera", src: "camera.svg" },
                { name: "Startup", src: "startup.svg" },
                { name: "Apply", src: "apply.svg" },
                { name: "Software", src: "software.svg" },
                { name: "Techlify", src: "techlify.svg" },
                { name: "Blockly", src: "blockly.svg" },
                { name: "Codelify", src: "codelify.svg" },
                { name: "Restaurant", src: "restaurant.svg" },
                { name: "Apply", src: "apply.svg" },
                { name: "Natural", src: "natural.svg" },
                { name: "Realtor", src: "realtor.svg" },



                // Duplicate items to ensure smooth infinite loop
                { name: "Cloudly", src: "cloudly.svg" },
                { name: "Camera", src: "camera.svg" },
                { name: "Startup", src: "startup.svg" },
                { name: "Apply", src: "apply.svg" },
                { name: "Software", src: "software.svg" },
                { name: "Techlify", src: "techlify.svg" },
                { name: "Blockly", src: "blockly.svg" },
                { name: "Codelify", src: "codelify.svg" },
                { name: "Restaurant", src: "restaurant.svg" },
                { name: "Apply", src: "apply.svg" },
                { name: "Natural", src: "natural.svg" },
              ].map((logo, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 lg:basis-1/4">
                  <div className="p-4">
                    <div className="flex items-center justify-center h-20">
                      <Image
                        src={logo.src || "/placeholder.svg"}
                        alt={`${logo.name} logo`}
                        width={160}
                        height={80}
                        className="w-auto h-8 object-contain opacity-70 hover:opacity-100 transition-opacity grayscale brightness-200 contrast-75"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
          </Carousel>
        </div>
      </div>
    </div>
  )
}
