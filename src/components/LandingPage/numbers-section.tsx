"use client"

import { CreditCard, Building2, Wallet, BanknoteIcon as Bank, PieChart, Landmark } from "lucide-react"
import Image from "next/image"

export default function NumbersSection() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-14">
          <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
            NUMBERS
          </div>
          <p className="text-2xl md:text-5xl font-light max-w-5xl">
            Rely on over 20 years of experience <br />from the true one-stop shop in financial services
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {/* R$ 1,4T Card */}
          <div className="bg-[#080808] p-8 flex flex-col justify-between lg:col-span-2">
            <div>
              <div className="mb-6 flex flex-row gap-2">
                <CreditCard className="w-5 h-5" />
                <p className="font-light text-sm">CARDS</p>
              </div>
              <div className="text-4xl font-light mb-4">R$ 1,4T</div>
            </div>
            <div className="text-xs text-muted-foreground tracking-wide">PROCESSED ANNUALLY</div>
          </div>

          {/* Issuer Card */}
          <div className="bg-[#080808] p-8 lg:col-span-2">
            <div className="mb-6 flex flex-row gap-2">
              <CreditCard className="w-5 h-5" />
              <p className=" font-light text-sm">CARDS</p>
            </div>
            <div className="text-2xl font-light mb-4">Issuer of credit, debit and prepaid cards</div>
          </div>

          {/* R$ 2,1B Card */}
          <div className="bg-[#080808] p-8 flex flex-col justify-between lg:col-span-2">
            <div>
              <div className="mb-6 flex flex-row gap-2">
                <img src="/pix-icon.svg" alt="PIX" className="w-5 h-5" />
                <p className="font-light text-sm">PIX</p>
              </div>
              <div className="text-4xl font-light mb-4">R$ 2,1B</div>
            </div>
            <div className="text-xs text-muted-foreground tracking-wide">PIX CARRIED OUT IN THE LAST 12 MONTHS</div>
          </div>

          {/* +75M Card */}
          <div className="bg-[#080808] p-8 flex flex-col justify-between lg:col-span-2">
            <div>
              <div className="mb-6 flex flex-row gap-2">
              <img src="/digital-banking-icon.svg" alt="Digital Banking" className="w-5 h-5" />
                <p className="font-light text-sm">DIGITAL BANKING</p>
              </div>
              <div className="text-4xl font-light mb-4">+75M</div>
            </div>
            <div className="text-xs text-muted-foreground tracking-wide">MILLIONS ACCOUNT IN THE LAST 30 DAYS</div>
          </div>

          {/* 8.6% Card */}
          <div className="bg-[#080808] p-8 flex flex-col justify-between lg:col-span-2">
            <div>
              <div className="mb-6 flex flex-row gap-2">
                <CreditCard className="w-5 h-5" />
                <p className="font-light text-sm">CARDS</p>
              </div>
              <div className="text-4xl font-light mb-4">8,6 %</div>
            </div>
            <div className="text-xs text-muted-foreground tracking-wide">MARKET SHARE IN BRANDED CARDS IN BRAZIL</div>
          </div>

          {/* +400 Card */}
          <div className="bg-[#080808] p-8 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="mb-6 flex flex-row gap-2">
                <img src="/dock-icon.svg" alt="Dock" className="w-5 h-5" />
                <p className=" font-light text-sm">DOCK</p>
              </div>
              <div className="text-4xl font-light mb-4">+400</div>
            </div>
            <div className="text-xs text-muted-foreground tracking-wide">CUSTOMERS APPROXIMATELY</div>
          </div>

          {/* Networks Card */}
          <div className="bg-[#080808] p-8 lg:col-span-3 flex flex-col justify-between">
            <div>
              <div className="mb-6 flex flex-row gap-2">
                <Wallet className="w-5 h-5 " /> 
                <p className=" font-light text-sm">ACQUIRING</p>
              </div>
              <div className="text-2xl font-light mb-6">+ 30 Certified Networks</div>
              <div className="flex items-center gap-4">
                <Image src="/visa.svg" alt="Visa" width={36} height={36} className="h-8 w-8 border bg-white border-gray-600/40 rounded-md" />
                <Image src="/mastercard.svg" alt="Mastercard" width={40} height={40} className="h-8 w-8 border bg-white border-gray-600/40 rounded-md" />
                <Image src="/elo.svg" alt="Elo" width={40} height={40} className="h-8 w-8 border bg-white border-gray-600/40 rounded-md" />
                <p className="bg-gray-600/20 text-muted-foreground px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block ">+27 networks</p>
              </div>
            </div>
          </div>

          {/* Provider Card */}
          <div className="bg-[#080808] p-8 lg:col-span-3 flex flex-col justify-between">
            <div>
              <div className="mb-8 flex flex-row gap-2">
                <Landmark className="w-5 h-5" />
                <p className="font-light text-sm">BANKING</p>
              </div>
              <div className="text-2xl font-light">Provider</div>
            </div>
            <div className="text-xs text-muted-foreground tracking-wide">INFRASTRUCTURE PROVIDER FOR PAYMENTS AND BANKING</div>
          </div>
        </div>
      </div>
    </section>
  )
}

