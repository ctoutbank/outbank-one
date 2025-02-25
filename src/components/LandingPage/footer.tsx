import { Facebook, Instagram, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#CFC8B8] text-black py-8 mb-10 px-4 md:px-8 rounded-md">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Logo and Contact Info */}
            <div className="md:col-span-4">
              <Image 
                src="/box-logo.svg" 
                alt="Outbank" 
                width={140} 
                height={32} 
                className="mb-6 brightness-0" 
              />
              <div className="space-y-2 text-sm">
                <p>42.244.879/0001-67</p>
                <p>contact@outbank.com</p>
                <p>+0 (123) 456-789</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-8 md:justify-self-end">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company Links */}
                <div>
                  <h3 className="font-semibold mb-2">Company</h3>
                  <ul className="space-y-2">
                    {["Outbank", "Acquiring", "Banking", "Cards & Credit"].map((item) => (
                      <li key={item}>
                        <Link href="#" className="text-black/70 hover:text-black transition-colors">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Navigation Links */}
                <div>
                  <h3 className="font-semibold mb-2">Navigation</h3>
                  <ul className="space-y-2">
                    {["Documentation", "Papers", "Press Conferences"].map((item) => (
                      <li key={item}>
                        <Link href="#" className="text-black/70 hover:text-black transition-colors">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Links */}
                <div>
                  <h3 className="font-semibold mb-2">Legal</h3>
                  <ul className="space-y-2">
                    {["Terms of Service", "Privacy Policy", "Cookies Policy"].map((item) => (
                      <li key={item}>
                        <Link href="#" className="text-black/70 hover:text-black transition-colors">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div> 
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-black/70">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            <div className="flex gap-6">
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

