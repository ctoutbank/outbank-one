"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { t } from "../../utils/i18n"

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
              {t("PRODUCTS")}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">{t("Spread financial power")}</h1>
            <p className="text-gray-200 text-base md:text-lg max-w-xl">
              {t("Be part of the greatest transformation ever seen in financial services and boost your business by spreading financial power around the world.")}
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
                <h3 className="text-lg font-medium mb-1">{t("Unlock new possibilities")}</h3>
                <p className="text-sm text-muted-foreground">{t("Boost your business with Outbank")}</p>
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
            className="bg-[#080808] text-white p-6 md:p-8 transition-all duration-300 group md:hover:bg-[#c79d61] md:hover:text-black"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-4">{t("Dock One Platform")}</h2>
            <p className="text-muted-foreground md:group-hover:text-black mb-8 text-sm md:text-base">
              {t("Explore our cloud-native platform, the largest and most comprehensive in Latin America, and discover our solutions.")}
            </p>
            <Button 
              variant="ghost" 
              className="rounded-none text-white md:group-hover:text-black hover:bg-transparent md:group-hover:bg-transparent hover:scale-105 transition-all duration-100"
              onClick={() => {
                const contactForm = document.getElementById('contact-form');
                contactForm?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('Learn More')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            className="bg-[#080808] text-white p-6 md:p-8 transition-all duration-300 group md:hover:bg-[#c79d61] md:hover:text-black"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-4">{t("Banking")}</h2>
            <p className="text-muted-foreground md:group-hover:text-black mb-8 text-sm md:text-base">
              {t("Elevate the customer experience and your profitability with financial solutions integrated into your core business")}
            </p>
            <Button 
              variant="ghost" 
              className="rounded-none text-white md:group-hover:text-black hover:bg-transparent md:group-hover:bg-transparent hover:scale-105 transition-all duration-100"
              onClick={() => window.location.href = '/banking'}
            >
              {t('Learn More')} <ArrowRight className="ml-2 h-4 w-4" />
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
                  title: t("Cards & Credit"),
                  description: t("Offer personalized cards with your brand from major networks, while we take care of the entire operation."),
                },
                {
                  title: t("Acquiring"),
                  description: t("Have your own white-label acquiring solution using our technology to ensure simplicity and speed in your go-to-market."),
                },
                {
                  title: t("Fraud Prevention"),
                  description: t("Reduce end-to-end risk in your banking, cards, or acquiring business model through solutions that cover everything."),
                },
              ].map((product, index) => {
                const getProductLink = (title: string) => {
                  if (title.includes('Cards & Credit')) return '/cards';
                  if (title.includes('Acquiring')) return '/acquiring';
                  if (title.includes('Fraud Prevention')) {
                    return () => {
                      const contactForm = document.getElementById('contact-form');
                      contactForm?.scrollIntoView({ behavior: 'smooth' });
                    };
                  }
                  return '#';
                };

                const handleClick = (title: string) => {
                  const link = getProductLink(title);
                  if (typeof link === 'function') {
                    link();
                  } else {
                    window.location.href = link;
                  }
                };

                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#080808] text-white p-6 md:p-8 flex flex-col h-full transition-all duration-300 group md:hover:bg-[#c79d61] md:hover:text-black"
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">{product.title}</h2>
                    <p className="text-muted-foreground md:group-hover:text-black mb-8 flex-grow text-sm md:text-base">
                      {product.description}
                    </p>
                    <div>
                      <Button 
                        variant="ghost" 
                        className="rounded-none text-white md:group-hover:text-black hover:bg-transparent md:group-hover:bg-transparent hover:scale-105 transition-all duration-100"
                        onClick={() => handleClick(product.title)}
                      >
                        {t('Learn More')} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

