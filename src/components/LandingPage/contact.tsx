"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight } from "lucide-react"

export default function ContactForm() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column */}
          <div>
            <div className="bg-gray-600/20 text-muted-foreground px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
              CONTACT US
            </div>
            <h2 className="text-4xl md:text-5xl font-light leading-tight">
              Contact us to schedule a completely free personalized virtual consultation
            </h2>
          </div>

          {/* Right Column - Form */}
          <div className="bg-[#080808] p-8 rounded-lg">
            <h3 className="text-2xl font-medium mb-8">Input Form</h3>

            <form className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Doe" className="bg-[#1C1C1C] border-0" />
              </div>

              {/* Corporate Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Corporate Email</Label>
                <Input id="email" type="email" placeholder="name@enterprise.com" className="bg-[#1C1C1C] border-0" />
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select>
                  <SelectTrigger className="bg-[#1C1C1C] border-0">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Phone Number */}
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

              {/* Company Information */}
              <div className="space-y-2">
                <Label htmlFor="company">Company Information</Label>
                <Input id="company" placeholder="Company name" className="bg-[#1C1C1C] border-0" />
              </div>

              {/* Describe your case */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2" htmlFor="case">
                  Describe your case
                </Label>
                <Textarea
                  id="case"
                  placeholder="Tell us about your use case..."
                  className="bg-[#1C1C1C] border-0 min-h-[120px]"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox id="value1" />
                  <Label htmlFor="value1">Value 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="value2" />
                  <Label htmlFor="value2">Value 2</Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button className="w-full bg-white text-black hover:bg-white/90 rounded-none">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

