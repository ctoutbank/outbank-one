import BoostSection from "@/components/banking/boost";
import CTASection from "@/components/banking/cta-section";
import HeroBanking from "@/components/banking/hero-banking";
import ProductFeatures from "@/components/banking/products-features";
import ReasonsSection from "@/components/banking/reasons";
import SectorsSection from "@/components/banking/sectors";
import WhyChooseSection from "@/components/banking/why-choose";
import Footer from "@/components/footer";
import CustomerCarousel from "@/components/LandingPage/customer-carousel";
import ContactForm from "@/components/LandingPage/contact";
import { Navbar } from "@/components/navbar";

export default function BankingPage() { 
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
        <main className="flex-1">
          <section className="container mx-auto">
            <HeroBanking />
          </section>
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
          <section className="w-full mx-auto">
            <WhyChooseSection /> 
          </section>
          <section className="w-full max-w-7xl mx-auto">
            <SectorsSection />
          </section>
          <section className="w-full">
            <ContactForm />
          </section>
          <section className="w-full max-w-7xl mx-auto">
            <Footer />
          </section>
        </main>
      </div>
    );
  }
  