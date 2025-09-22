"use client"

import { Facebook, Instagram, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { t } from '../utils/i18n'

export default function Footer() {
  return (
    <footer className="bg-[#c79d61] text-black py-6 sm:py-8 px-3 sm:px-4 md:px-8 rounded-md">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Main Footer Content */}
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-4">
            {/* Logo and Contact Info */}
            <div className="md:col-span-4 text-center md:text-left">
              <Image 
                src="/box-logo.svg" 
                alt="Outbank" 
                width={140} 
                height={32} 
                className="mb-4 sm:mb-6 brightness-0 mx-auto md:mx-0" 
              />
              <div className="space-y-1.5 sm:space-y-2 text-sm">
                <p>42.244.879/0001-67</p>
                <p>operacao@outbank.com.br</p>
                {/* <p>+0 (123) 456-789</p> */}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-8 md:justify-self-end w-full">
              <div className="grid grid-cols-3 gap-4 sm:gap-8">
                {/* Company Links */}
                <div className="col-span-1">
                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Estrutura</h3>
                  <ul className="space-y-1.5 sm:space-y-2 text-sm">
                    {[
                      { name: "Outbank", href: "/" },
                      { name: "Adquirência", href: "/acquiring" },
                      { name: "Banking", href: "/banking" },
                      { name: "Cards & Credit", href: "/cards" }
                    ].map((item) => (
                      <li key={item.name}>
                        <Link href={item.href} className="text-black/70 hover:text-black transition-colors">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Navigation Links */}
                <div className="col-span-1">
                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Docs</h3>
                  <ul className="space-y-1.5 sm:space-y-2 text-sm">
                    {[t("Documentation"), t("Papers"), t("Press Conferences")].map((item) => (
                      <li key={item}>
                        <span className="text-black/70">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Links */}
                <div className="col-span-1">
                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Legal</h3>
                  <ul className="space-y-1.5 sm:space-y-2 text-sm">
                    {[t("Termo de Serviço"), t("Privacy Policy"), t("Cookies Policy")].map((item) => (
                      <li key={item}>
                        <span className="text-black/70">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div> 
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/70">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6">
            {/* Social Links */}
            <div className="flex gap-6 mb-4 sm:mb-0">
              <Link href="#" className="text-black/70 hover:text-black transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-black/70 hover:text-black transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-black/70 hover:text-black transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-sm text-black/70">© 2025 Outbank.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

