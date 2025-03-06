import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import HeroAcquiring from "@/components/acquiring/hero-acquiring";
import CustomerCarousel from "@/components/LandingPage/customer-carousel";

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
            <Footer />
          </section>
        </main>
      </div>
    );
  }
  