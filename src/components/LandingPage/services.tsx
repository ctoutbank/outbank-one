"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { t } from "../../utils/i18n"

export default function ServicesSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <section className="bg-black text-white py-12 md:py-16 px-4 md:px-8 overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-12 md:mb-16 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
            {t('SERVICES')}
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light max-w-7xl mx-auto md:mx-0">
            {t('Reliability and security for your transactions')}
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column */}
          <motion.div 
            className="flex flex-col gap-6 md:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: <>{t('Regulated Pix Participant').split(' ').slice(0, 2).join(' ')} <br/>{t('Regulated Pix Participant').split(' ').slice(2).join(' ')}</>,
                description: t("Peace of mind knowing your payments are in good hands, with full security and legal backing."),
              },
              {
                title: <>{t('VISA, MasterCard, Elo Licenses').split(',')[0]},<br/> {t('VISA, MasterCard, Elo Licenses').split(',').slice(1).join(',').trim()}</>,
                description: t("Accept the leading card networks in the market and offer more options to your customers."),
              },
              {
                title: <>{t('Adaptable Global Payment Platform').split(' ').slice(0, 2).join(' ')}<br/> {t('Adaptable Global Payment Platform').split(' ').slice(2).join(' ')}</>,
                description: t("Reach customers worldwide and tailor the experience to meet their needs in the market."),
              },
            ].map((service, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col gap-4 bg-[#080808] p-4 md:p-6 min-h-[160px] md:h-[182px] rounded-lg hover:bg-[#101010] transition-colors"
                variants={fadeInUp}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-medium">{service.title}</h3>
                  <Image
                    src="/logo-icon.svg"
                    alt="Logo icon"
                    width={40}
                    height={40}
                    className="border border-gray-700/20 p-1 rounded-sm bg-gradient-to-r from-[#080808] to-gray-600/20 w-8 h-8 md:w-10 md:h-10"
                    quality={100}
                  />
                </div>
                <p className="text-sm md:text-base text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Center Column with Phone */}
          <motion.div 
            className="relative flex items-center justify-center py-8 md:py-0"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="relative rounded-3xl w-full max-w-[280px] md:max-w-sm mx-auto"
              style={{
                perspective: "1500px",
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{
                  rotateY: [-15, 15, -15],
                  rotateX: [8, -8, 8],
                  y: [-10, 10, -10]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="relative shadow-2xl"
              >
                <motion.img
                  src="/phone.svg"
                  alt="Outbank App Interface"
                  className="w-full h-auto rounded-3xl"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 0,
                    y: 0,
                    transition: { 
                      duration: 0.4,
                      type: "spring",
                      stiffness: 300
                    }
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            className="flex flex-col gap-6 md:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: <>{t('Comprehensive Infrastructure').split(' ')[0]}<br/>{t('Comprehensive Infrastructure').split(' ')[1]}</>,
                description: t("A complete solution for online payments, including gateway, fraud prevention, and risk management."),
              },
              {
                title: <>{t('Recognized Certifications').split(' ')[0]}<br/> {t('Recognized Certifications').split(' ')[1]}</>,
                description: t("Commitment to security, quality, and international compliance across all our operations."),
              },
              {
                title: <>{t('Fraud Prevention Security').split(' ').slice(0, 2).join(' ')}<br/> {t('Fraud Prevention Security').split(' ')[2]}</>,
                description: t("Data and transactions protected with the best tools on the market."),
              },
            ].map((service, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col gap-4 bg-[#080808] p-4 md:p-6 min-h-[160px] md:h-[182px] rounded-lg hover:bg-[#101010] transition-colors"
                variants={fadeInUp}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-medium">{service.title}</h3>
                  <Image
                    src="/logo-icon.svg"
                    alt="Logo icon"
                    width={40}
                    height={40}
                    quality={100}
                    className="border border-gray-700/20 p-1 rounded-sm bg-gradient-to-r from-[#080808] to-gray-400/10 w-8 h-8 md:w-10 md:h-10"
                  />
                </div>
                <p className="text-sm md:text-base text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

