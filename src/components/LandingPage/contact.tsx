"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight } from "lucide-react"
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern"

export default function ContactForm() {
  return (
    <section id="contact" className="relative bg-black text-white py-16 px-4 md:px-8 overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
        <InteractiveGridPattern 
          width={80}
          height={80}
          squares={[24, 24]}
          className="border-none"
          squaresClassName="stroke-gray-500/20 hover:fill-gray-500/20"
        />
      </div>

      {/* Main Content - Add relative and z-20 to appear above the background */}
      <div className="container mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Updated structure */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block ">
              CONTACT US
            </div>
            <h2 className="text-4xl md:text-5xl font-light leading-tight">
              Contact us to schedule a completely free personalized virtual consultation
            </h2>
            {/* Added description text */}
            <p className="text-gray-400 text-lg">
              Let us understand your business needs and help you transform your digital presence.
            </p>
          </div>

          {/* Right Column - Form with updated layout */}
          <div className="bg-[#080808] p-8 rounded-lg">
            <form className="space-y-6">
              {/* Two-column layout for shorter forms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" className="bg-[#1C1C1C] border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Corporate Email</Label>
                  <Input id="email" type="email" placeholder="name@enterprise.com" className="bg-[#1C1C1C] border-0" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select>
                    <SelectTrigger className="bg-[#1C1C1C] border-0">
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Company name" className="bg-[#1C1C1C] border-0" />
                </div>
              </div>

              {/* Phone number in its own row */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-[100px] bg-[#1C1C1C] border-0">
                      <SelectValue placeholder="🇧🇷 +1" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">🇧🇷 +1</SelectItem>
                      <SelectItem value="44">🇬🇧 +44</SelectItem>
                      <SelectItem value="55">🇧🇷 +55</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="phone" type="tel" placeholder="Phone number" className="bg-[#1C1C1C] border-0" />
                </div>
              </div>

              {/* Message area */}
              <div className="space-y-2">
                <Label htmlFor="case">How can we help?</Label>
                <Textarea
                  id="case"
                  placeholder="Tell us about your needs..."
                  className="bg-[#1C1C1C] border-0 min-h-[100px]"
                />
              </div>

              {/* Updated checkbox section */}
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Additional Options</p>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="value1" />
                    <Label htmlFor="value1" className="text-sm">Newsletter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="value2" />
                    <Label htmlFor="value2" className="text-sm">Terms & Conditions</Label>
                  </div>
                </div>
              </div>

              {/* Updated button */}
              <Button className="w-full bg-white text-black hover:bg-white/90 rounded-md py-6 text-lg font-medium">
                Schedule Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

