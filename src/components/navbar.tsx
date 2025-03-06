"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, ChevronRight, Phone, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { href: "/", label: "Outbank" },
  { href: "/banking", label: "Banking" },
  { href: "/acquiring", label: "Acquiring" },
  { href: "/cards", label: "Cards & Credit" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <div className="relative z-[100]">
      <header
        className={cn(
          "fixed left-0 right-0 z-50 w-full bg-gray-200/20 backdrop-blur-sm border border-gray-400/20 md:rounded-sm transition-all duration-300 pointer-events-auto max-w-7xl mx-auto",
          !isOpen && "md:mt-6",
          scrolled && "bg-gray-200/10 backdrop-blur-md",
        )}
      >
        <div className="max-w-[1440px] mx-auto h-16 flex items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <div className="w-[150px]">
            <Link className="flex items-center justify-center" href="/">
              <Image 
                src="/box-logo.svg" 
                alt="Logo Outbank" 
                width={160} 
                height={44}
                className="w-auto h-11"
                priority
                quality={100}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold hover:underline underline-offset-4 transition-colors hover:scale-105 duration-300",
                  pathname === link.href ? "text-white underline" : "text-muted-foreground hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions - Desktop */}
          <div className="hidden md:flex w-[120px] items-center justify-end">
            <button className="text-white mr-4 hover:text-gray-300 hover:scale-105 transition-all duration-300">
              Support
            </button>
            <SignedIn>
              <Link href="/portal/dashboard">
                <Button className="bg-white text-black rounded-none hover:bg-white/90 hover:scale-105 transition-all duration-300">
                  Portal
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="/auth/sign-in">
                <Button className=" text-black rounded-none bg-gray-100 hover:bg-gray-300  hover:scale-105 transition-all duration-300">Entrar</Button>
              </Link>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 z-50 hover:bg-transparent rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={isOpen ? "close" : "open"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu - Enhanced */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 w-full h-[100dvh] bg-gradient-to-b from-[#1f1f1f] to-black z-40 md:hidden flex flex-col overflow-y-auto"
            >
              <div className="flex flex-col h-full p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mb-8"
                >
                  <Image 
                    src="/box-logo.svg" 
                    alt="Logo Outbank" 
                    width={120} 
                    height={27} 
                    className="h-8 w-auto"
                    priority
                    quality={100}
                  />
                </motion.div>

                {/* Navigation Links */}
                <nav className="w-full space-y-1 mb-8">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between w-full py-4 text-xl font-medium tracking-tight transition-all duration-200",
                          "hover:text-white group",
                          pathname === link.href ? "text-white" : "text-gray-400",
                        )}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Divider */}
                <motion.div
                  className="w-full h-px bg-gray-700 my-6"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 }}
                />

                {/* Support Section */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-400">
                      <Phone className="h-5 w-5 mr-3" />
                      <span>+1 (234) 567-890</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Mail className="h-5 w-5 mr-3" />
                      <span>support@outbank.com</span>
                    </div>
                  </div>
                </motion.div>

                {/* Auth Buttons */}
                <motion.div
                  className="w-full space-y-4 mt-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <SignedIn>
                    <Link href="/portal/dashboard" onClick={() => setIsOpen(false)} className="block w-full">
                      <Button
                        className="w-full bg-white text-black hover:bg-white/90 
                                 text-lg py-6 rounded-lg font-medium
                                 transition-all duration-200 hover:scale-[0.98]"
                      >
                        Portal
                      </Button>
                    </Link>
                  </SignedIn>
                  <SignedOut>
                    <Link href="/auth/sign-in" onClick={() => setIsOpen(false)} className="block w-full">
                      <Button
                        className="w-full bg-white text-black hover:bg-white/90 
                                 text-lg py-6 rounded-lg font-medium
                                 transition-all duration-200 hover:scale-[0.98]"
                      >
                        Entrar
                      </Button>
                    </Link>
                  </SignedOut>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  )
}

