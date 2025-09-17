import Footer from "@/components/footer";
import ContactForm from "@/components/LandingPage/contact";
import CustomerCarousel from "@/components/LandingPage/customer-carousel";
import DockSection from "@/components/LandingPage/dock";
import HeroLandingPage from "@/components/LandingPage/hero";
import NumbersSection from "@/components/LandingPage/numbers-section";
import Presence from "@/components/LandingPage/presence";
import ProductsSection from "@/components/LandingPage/products";
import ServicesSection from "@/components/LandingPage/services";
import { Navbar } from "@/components/navbar";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto ">
          <HeroLandingPage />
        </section>
        <section className="w-full">
          <CustomerCarousel />
        </section>
        <section className="max-w-7xl mx-auto ">
          <ProductsSection />
        </section>
        <section className="max-w-7xl mx-auto ">
          <NumbersSection />
        </section>
        <section className="max-w-7xl mx-auto ">
          <ServicesSection />
        </section>
        {/* <section className="w-full">
          <SuccessStories />
        </section> */}
        <section className="w-full">
          <Presence /> 
        </section>
        {/* <section className="w-full max-w-7xl mx-auto">
          <Depoiments />
        </section> */}
        <section className="w-full max-w-7xl mx-auto">
          <DockSection />
        </section>
        <section className="w-full max-w-7xl mx-auto">
          <ContactForm />
        </section>
        <section className="w-full max-w-7xl mx-auto">
          <Footer />
        </section>
      </main>
    </div>
  );
}
