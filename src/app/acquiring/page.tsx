import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import HeroAcquiring from "@/components/acquiring/hero-acquiring";
import CustomerCarousel from "@/components/LandingPage/customer-carousel";
import AcquiringService from "@/components/acquiring/acquiring-service";
import BenefitsSection from "@/components/acquiring/acquiring-benefits";
import ConnectWithUsSection from "@/components/acquiring/connect-with-us";
import ContactForm from "@/components/LandingPage/contact";
import CaptureModelsSection from "@/components/acquiring/capture-models";
export default function AcquiringPage() { 
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
        <main className="flex-1">
          <section className="container mx-auto">
            <HeroAcquiring />
          </section>
          <section className="w-full">
            <CustomerCarousel />
          </section>
          <section className="w-full max-w-7xl mx-auto">
            <AcquiringService />
          </section>
          <section className="w-full max-w-7xl mx-auto">
            <BenefitsSection />
          </section>
          <section className="w-full  mx-auto">
            <ConnectWithUsSection />
          </section>
          <section className="w-full max-w-7xl mx-auto">
            <CaptureModelsSection />
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
  