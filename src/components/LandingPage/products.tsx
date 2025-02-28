"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export default function ProductsSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} className="bg-black text-white py-12 md:py-16 px-4 md:px-8 overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12 gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerChildren}
        >    
          <motion.div 
            className="max-w-2xl text-center md:text-left"
            variants={fadeInUp}
          >
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
              PRODUCTS
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">Spread financial power</h1>
            <p className="text-gray-200 text-base md:text-lg max-w-xl">
              Be part of the greatest transformation ever seen in financial services and boost your business by
              spreading financial power around the world.
            </p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="md:flex items-center gap-4 mt-0 md:mt-20"
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-center md:justify-end">
                <Image src="/product-avatars.svg" alt="avatars" width={180} height={180} quality={100} />
              </div>
              <div className="text-center md:text-right">
                <h3 className="text-lg font-medium mb-1">Unlock new possibilities</h3>
                <p className="text-sm text-muted-foreground">Boost your business with Outbank</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerChildren}
        >
          {/* Top Two Cards Side by Side */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            className="bg-[#080808] text-white p-6 md:p-8 transition-all duration-300 group md:hover:bg-[#CFC8B8] md:hover:text-black"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Dock One Platform</h2>
            <p className="text-muted-foreground md:group-hover:text-black mb-8 text-sm md:text-base">
              Explore our cloud-native platform, the largest and most comprehensive in Latin America, and discover our
              solutions.
            </p>
            <Button variant="ghost" className="rounded-none text-white md:group-hover:text-black hover:bg-transparent md:group-hover:bg-transparent hover:scale-105 transition-all duration-100">
              Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            className="bg-[#080808] text-white p-6 md:p-8 transition-all duration-300 group md:hover:bg-[#CFC8B8] md:hover:text-black"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Banking</h2>
            <p className="text-muted-foreground md:group-hover:text-black mb-8 text-sm md:text-base">
              Elevate the customer experience your profitability with financial solutions integrated into your core
              business.
            </p>
            <Button variant="ghost" className="rounded-none text-white md:group-hover:text-black hover:bg-transparent md:group-hover:bg-transparent hover:scale-105 transition-all duration-100">
              Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Three Cards Below */}
          <motion.div 
            className="col-span-full mt-4 md:mt-6"
            variants={fadeInUp}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  title: "Cards & Credit",
                  description:
                    "Offer personalized cards with your brand from major networks, while we take care of the entire operation.",
                },
                {
                  title: "Acquiring",
                  description:
                    "Have your own white-label acquiring solution using our technology to ensure simplicity and speed in your go-to-market.",
                },
                {
                  title: "Fraud Prevention",
                  description:
                    "Reduce end-to-end risk in your banking, cards, or acquiring business model through solutions that cover everything.",
                },
              ].map((product, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#080808] text-white p-6 md:p-8 flex flex-col h-full transition-all duration-300 group md:hover:bg-[#CFC8B8] md:hover:text-black"
                >
                  <h2 className="text-xl md:text-2xl font-semibold mb-4">{product.title}</h2>
                  <p className="text-muted-foreground md:group-hover:text-black mb-8 flex-grow text-sm md:text-base">
                    {product.description}
                  </p>
                  <div>
                    <Button variant="ghost" className="rounded-none text-white md:group-hover:text-black hover:bg-transparent md:group-hover:bg-transparent hover:scale-105 transition-all duration-100">
                      Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

