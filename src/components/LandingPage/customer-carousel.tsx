"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { t } from "../../utils/i18n";

export default function CustomerCarousel() {
  return (
    <div className="w-full bg-[#080808] py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8">
          <p className="text-gray-300 text-md font-medium whitespace-nowrap self-center">
            /{t("Our main customers around the world")}/
          </p>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {[
                { name: "Dock", src: "partner-dock.png" },
                { name: "Visa", src: "partner-visa.png" },
                { name: "Mastercard", src: "partner-mastercard.png" },
                { name: "American Express", src: "partner-amex.png" },
                { name: "Hipercard", src: "partner-hipercard.png" },
                { name: "Elo", src: "partner-elo.png" },
                { name: "Pix", src: "partner-pix.png" },
                { name: "Bandeira", src: "partner-bandeira.png" },
                
                // Duplicate items to ensure smooth infinite loop
                { name: "Dock", src: "partner-dock.png" },
                { name: "Visa", src: "partner-visa.png" },
                { name: "Mastercard", src: "partner-mastercard.png" },
                { name: "American Express", src: "partner-amex.png" },
                { name: "Hipercard", src: "partner-hipercard.png" },
                { name: "Elo", src: "partner-elo.png" },
                { name: "Pix", src: "partner-pix.png" },
                { name: "Bandeira", src: "partner-bandeira.png" },
              ].map((logo, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 basis-1/2 lg:basis-1/4"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-center h-20">
                      <Image
                        src={`/${logo.src}`}
                        alt={`${logo.name} logo`}
                        width={160}
                        height={80}
                        className="w-auto h-12 object-contain opacity-80 hover:opacity-100 transition-opacity grayscale brightness-150 contrast-125 filter drop-shadow-sm"
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
  );
}
