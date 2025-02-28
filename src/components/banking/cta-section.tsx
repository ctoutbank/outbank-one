import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="relative bg-[#080808] text-gray-100 py-16 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-8">
          <h2 className="text-4xl md:text-5xl font-light max-w-2xl text-center md:text-left">
            Provide hundreds of financial products through our platform, with your brand.
          </h2>
          <Button
            variant="outline"
            className="bg-gray-100 text-black hover:bg-white/90 rounded-none py-6 px-8 justify-between mr-4"
          >
            Button CTA
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

