import Footer from "@/components/footer";
import ContactForm from "@/components/landingPage/contact";
import CustomerCarousel from "@/components/landingPage/customer-carousel";
import Depoiments from "@/components/landingPage/depoiments";
import DockSection from "@/components/landingPage/dock";
import HeroLandingPage from "@/components/landingPage/hero";
import NumbersSection from "@/components/landingPage/numbers-section";
import Presence from "@/components/landingPage/presence";
import ProductsSection from "@/components/landingPage/products";
import ServicesSection from "@/components/landingPage/services";
import SuccessStories from "@/components/landingPage/success-stories";
import { Navbar } from "@/components/navbar";

export default function Component() {
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
        <section className="w-full">
          <SuccessStories />
        </section>
        <section className="w-full">
          <Presence /> 
        </section>
        <section className="w-full max-w-7xl mx-auto">
          <Depoiments />
        </section>
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
