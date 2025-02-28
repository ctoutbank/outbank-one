import Footer from "@/components/footer";
import HeroCards from "@/components/cards/hero-cards";
import { Navbar } from "@/components/navbar";

export default function CardsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto ">
          <HeroCards />
        </section>
        
        <section className="w-full max-w-7xl mx-auto">
          <Footer />
        </section>
      </main>
    </div>
  );
}
