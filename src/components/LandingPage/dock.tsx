"use client"

import { HelpCircle } from "lucide-react"

export default function DockSection() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16 text-center md:text-left">
          <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">
            DOCK
          </div>
          <h2 className="text-4xl md:text-5xl font-light">Explore questions about the Dock</h2>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          {/* Question 1 */}
          <div className="space-y-4 max-w-[550px]">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-9 h-9 mt-1 border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-500/10" />
              <h3 className="text-xl font-medium">Why choose Dock?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-10">
              Our expertise and technology enable your company to{" "}
              <span className="text-gray-300">promote financial inclusion</span>, turning customers into active
              participants and empowering the global economy. We are ready to help{" "}
              <span className="text-gray-300">transform your business and make a positive impact</span>
            </p>
          </div>

          {/* Question 2 */}
          <div className="space-y-4 max-w-[550px]">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-9 h-9 mt-1 border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-500/10" />
              <h3 className="text-xl font-medium">What is Embedded Finance?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-10">
              Imagine your company not only offering its usual products but also{" "}
              <span className="text-gray-300">integrated financial services</span>. Your platform becomes a financial hub,
              providing everything from payments to loans,{" "}
              <span className="text-gray-300">all within the digital environment</span>.
            </p>
          </div>

          {/* Question 3 */}
          <div className="space-y-4 max-w-[550px]">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-9 h-9 mt-1 border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-500/10" />
              <h3 className="text-xl font-medium">How does Dock drive this transformation?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-10">
              Dock leads in financial services, providing the{" "}
              <span className="text-gray-300">infrastructure for companies to expand their business</span>. With our
              integrated and white-label platform, we help launch customized financial solutions, with seamless
              integration and agile deployment.
            </p>
          </div>

          {/* Question 4 */}
            <div className="space-y-4 max-w-[550px]">
            <div className="flex items-start gap-4">
            <HelpCircle className="w-9 h-9 mt-1 border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-500/10" />
              <h3 className="text-xl font-medium">What is the most searched question?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-10">
              Lorem ipsum dolor sit amet consectetur. Purus ut amet non urna neque consectetur magnis. Vulputate metus
              id proin sagittis. Lorem ipsum dolor sit amet consectetur. Purus ut amet non urna neque consectetur
              magnis. Vulputate metus id proin sagittis.
            </p>
          </div>

          {/* Question 5 */}
          <div className="space-y-4 max-w-[550px]">
            <div className="flex items-start gap-4">
            <HelpCircle className="w-9 h-9 mt-1 border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-500/10" />
              <h3 className="text-xl font-medium">What is the most searched question?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-10">
              Lorem ipsum dolor sit amet consectetur. Purus ut amet non urna neque consectetur magnis. Vulputate metus
              id proin sagittis. Lorem ipsum dolor sit amet consectetur. Purus ut amet non urna neque consectetur
              magnis. Vulputate metus id proin sagittis.
            </p>
          </div>

          {/* Question 6 */}
          <div className="space-y-4 max-w-[550px]">
            <div className="flex items-start gap-4">
            <HelpCircle className="w-9 h-9 mt-1 border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-500/10" />
              <h3 className="text-xl font-medium">What is the most searched question?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-10">
              Lorem ipsum dolor sit amet consectetur. Purus ut amet non urna neque consectetur magnis. Vulputate metus
              id proin sagittis. Lorem ipsum dolor sit amet consectetur. Purus ut amet non urna neque consectetur
              magnis. Vulputate metus id proin sagittis.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

