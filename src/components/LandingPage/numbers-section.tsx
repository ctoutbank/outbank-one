"use client"

import { CreditCard, Globe, Landmark, Wallet } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { t } from "../../utils/i18n"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0
  }
}

export default function NumbersSection() {
  return (
    <section className="bg-black text-white py-8 md:py-16 px-3 md:px-8 overflow-hidden">
      <motion.div 
        className="container mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div 
          className="mb-8 md:mb-14 text-center md:text-left"
          variants={cardVariants}
        >
          <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6 mx-auto md:mx-0">
            NÚMEROS CUSTODIANTE
          </div>
          <p className="text-xl md:text-2xl lg:text-5xl font-light max-w-5xl leading-tight mx-auto md:mx-0">
            {t('Rely on over 20 years of experience from the true one-stop shop in financial services')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-6">
          {/* R$ 1,4T Card */}
          <motion.div 
            className="bg-[#080808] p-6 md:p-8 flex flex-col justify-between lg:col-span-2 rounded-lg hover:bg-[#101010] transition-colors"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <div className="mb-6 flex flex-row gap-2">
                <CreditCard className="w-5 h-5" />
                <p className="font-light text-sm">CARDS</p>
              </div>
              <div className="text-4xl font-light mb-4">R$ 1,4T</div>
            </div>
            <div className="text-xs text-muted-foreground tracking-wide">PROCESSADOS POR ANO</div>
          </motion.div>

          {/* Issuer Card */}
          <motion.div 
            className="bg-[#080808] p-6 md:p-8 lg:col-span-2 rounded-lg hover:bg-[#101010] transition-colors"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="mb-6 flex flex-row gap-2">
              <CreditCard className="w-5 h-5" />
              <p className=" font-light text-sm">CARDS</p>
            </div>
            <div className="text-2xl font-light mb-4">Emissor de cartões crédito, débito e pré-pago</div>
          </motion.div>

          {/* R$ 2,1B Card */}
          <motion.div 
            className="bg-[#080808] p-6 md:p-8 flex flex-col justify-between lg:col-span-2 rounded-lg hover:bg-[#101010] transition-colors"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <div className="mb-6 flex flex-row gap-2">
                <Image src="/pix-icon.svg" alt="PIX" width={20} height={20} className="w-5 h-5" quality={100} />
                <p className="font-light text-sm">PIX</p>
              </div>
              <div className="text-4xl font-light mb-4">R$ 2,1B</div>
            </div>
            <div className="text-xs text-muted-foreground tracking-wide">EM PIX REALIZADOS NOS ÚLTIMOS 12 MESES</div>
          </motion.div>

          {/* +75M Card */}
          <motion.div 
            className="bg-[#080808] p-6 md:p-8 flex flex-col justify-between lg:col-span-2 rounded-lg hover:bg-[#101010] transition-colors"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <div className="mb-6 flex flex-row gap-2">
                <Image src="/digital-banking-icon.svg" alt="Digital Banking" width={20} height={20} className="w-5 h-5" quality={100} />
                <p className="font-light text-sm">DIGITAL BANKING</p>
              </div>
              <div className="text-4xl font-light mb-4">+75M</div>
            </div>
            <div className="text-xs text-muted-foreground tracking-wide">DE CONTAS</div>
          </motion.div>

          {/* 8.6% Card */}
          <motion.div 
            className="bg-[#080808] p-6 md:p-8 flex flex-col justify-between lg:col-span-2 rounded-lg hover:bg-[#101010] transition-colors"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <div className="mb-6 flex flex-row gap-2">
                <CreditCard className="w-5 h-5" />
                <p className="font-light text-sm">CARDS</p>
              </div>
              <div className="text-4xl font-light mb-4">8,6 %</div>
            </div>
            <div className="text-xs text-muted-foreground tracking-wide">DE MARKET SHARE EM CARTÕES DE BANDEIRA NO BRASIL</div>
          </motion.div>

          {/* +400 Card */}
          <motion.div 
            className="bg-[#080808] p-6 md:p-8 lg:col-span-2 flex flex-col justify-between rounded-lg hover:bg-[#101010] transition-colors"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <div className="mb-6 flex flex-row gap-2">
                <Image src="/dock-icon.svg" alt="Dock" width={20} height={20} className="w-5 h-5" quality={100} />
                <p className="font-light text-sm">CLIENTES</p>
              </div>
              <div className="text-4xl font-light mb-4">+400</div>
            </div>
            <div className="text-xs text-muted-foreground tracking-wide">APROXIMADAMENTE +400 CLIENTES</div>
          </motion.div>

          {/* Networks Card */}
          <motion.div 
            className="bg-[#080808] p-6 md:p-8 lg:col-span-3 flex flex-col justify-between rounded-lg hover:bg-[#101010] transition-colors"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <div className="mb-4 md:mb-6 flex flex-row gap-2">
                <Wallet className="w-5 h-5" /> 
                <p className="font-light text-sm">ADQUIRÊNCIA</p>
              </div>
              <div className="text-xl md:text-2xl font-light mb-4 md:mb-6">+30 REDES CERTIFICADAS</div>
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Image src="/visa.svg" alt="Visa" width={40} quality={100} height={40} className="h-7 w-7 md:h-8 md:w-8 border bg-white border-gray-600/40 rounded-md" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Image src="/mastercard.svg" alt="Mastercard" width={40} quality={100} height={40} className="h-7 w-7 md:h-8 md:w-8 border bg-white border-gray-600/40 rounded-md" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Image src="/elo.svg" alt="Elo" width={40} quality={100} height={40} className="h-7 w-7 md:h-8 md:w-8 border bg-white border-gray-600/40 rounded-md" />
                </motion.div>
                <p className="bg-gray-600/20 text-muted-foreground px-3 md:px-4 py-1.5 md:py-2 border border-gray-600/40 text-sm rounded-2xl inline-block">+27 networks</p>
              </div>
            </div>
          </motion.div>

          {/* Provider Card */}
          <motion.div 
            className="bg-[#080808] p-6 md:p-8 lg:col-span-3 flex flex-col justify-between rounded-lg hover:bg-[#101010] transition-colors"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <div className="mb-4 md:mb-6 flex flex-row gap-2">
                <Landmark className="w-5 h-5" />
                <p className="font-light text-sm">BANKING</p>
              </div>
              <div className="text-xl md:text-2xl font-light">Provider – Dock</div>
              <p className="text-sm text-gray-400 mt-2">
                Acesse o BACEN e digite Dock em Instituição. 
                <a href="https://www.bcb.gov.br/meubc/encontreinstituicao" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 ml-1 text-blue-400 hover:text-blue-300">
                  <Globe className="w-4 h-4" />
                </a>
              </p>
            </div>
            <div className="text-xs text-muted-foreground tracking-wide">FORNECEDOR DE INFRAESTRUTURA PARA PAGAMENTOS E BANKING</div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

