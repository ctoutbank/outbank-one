"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CreditCard } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { t } from "../../utils/i18n"

export default function SuccessStories() {
  const [currentSlide, setCurrentSlide] = useState(1)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <section className="w-full bg-[#c79d61] py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12 gap-6">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-light text-center sm:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t("Success stories")}
          </motion.h2>
          <div className="flex gap-2 sm:mr-28">
            {[1, 2, 3].map((num) => (
              <motion.button
                key={num}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setCurrentSlide(num)}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm
                  ${num === currentSlide ? "bg-black text-white" : "border border-black/20 bg-transparent text-black hover:bg-black/10"}`}
              >
                {num.toString().padStart(2, "0")}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quote Card */}
          <motion.div 
            className="bg-gradient-to-r from-[#625F57] to-[#080808] p-6 md:p-8 text-white flex flex-col justify-between"
            style={{ minHeight: "300px", height: "auto", maxHeight: "566px" }}
            {...fadeInUp}
          >
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light leading-tight">
                &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.&rdquo;
              </h3>
            </div>
            <div className="mt-6 md:mt-8">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-white text-black hover:bg-white/90 rounded-none px-4 md:px-6 py-4 md:py-6  text-base md:text-lg flex items-center justify-center"
                >
                  {t('Button CTA')} <ArrowRight className="ml-2 h-5 w-5 md:h-7 md:w-6" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Image Card */}
          <motion.div 
            className="relative w-full hidden md:block"
            style={{ minHeight: "300px", height: "auto", maxHeight: "566px" }}
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <Image
              src="/sucess-story.svg"
              alt="Success story"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Stats Cards */}
          <div className="flex flex-col gap-4 md:gap-6">
            <motion.div 
              className="bg-gradient-to-l from-[#625F57] to-[#080808] p-6 md:p-8 text-white flex flex-col justify-between w-full "
              style={{ minHeight: "200px", height: "auto" }}
              {...fadeInUp}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm uppercase tracking-wide">{t("Pass rate (%)")}</span>
              </div>
              <motion.div 
                className="text-4xl md:text-5xl font-light mt-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                98%
              </motion.div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-l from-[#625F57] to-[#080808] p-6 md:p-8 text-white flex flex-col justify-between w-full "
              style={{ minHeight: "200px", height: "auto" }}
              {...fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm uppercase tracking-wide">{t("Sales processed")}</span>
              </div>
              <motion.div 
                className="text-4xl md:text-5xl font-light mt-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                1K
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

