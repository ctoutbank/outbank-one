import BoostSection from "@/components/banking/boost";
import CTASection from "@/components/banking/cta-section";
import ProductFeatures from "@/components/banking/products-features";
import ReasonsSection from "@/components/banking/reasons";
import Footer from "@/components/footer";
import CustomerCarousel from "@/components/LandingPage/customer-carousel";
import { Navbar } from "@/components/navbar";

export default function BankingPage() { 
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
        <main className="flex-1">
          
          <section className="w-full">
            <CustomerCarousel />
          </section>
          <section className="w-full max-w-7xl mx-auto">
            <ReasonsSection />
          </section>
          <section className="w-full mx-auto">
            <CTASection />
          </section>
          <section className="w-full max-w-7xl mx-auto">
            <ProductFeatures />
          </section>
          <section className="w-full mx-auto">
            <BoostSection />
          </section>
          <section className="w-full max-w-7xl mx-auto">
            <Footer />
          </section>
        </main>
      </div>
    );
  }
  