import CustomerCarousel from "@/components/LandingPage/customer-carousel";
import Depoiments from "@/components/LandingPage/depoiments";
import HeroLandingPage from "@/components/LandingPage/hero";
import NumbersSection from "@/components/LandingPage/numbers-section";
import ProductsSection from "@/components/LandingPage/products";
import ServicesSection from "@/components/LandingPage/services";
import SuccessStories from "@/components/LandingPage/success-stories";
import DockSection from "@/components/LandingPage/dock";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/LandingPage/contact";
import Footer from "@/components/LandingPage/footer";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="w-full bg-[#080808] border-b border-gray-800/60">
        <div className="h-16 flex items-center container mx-auto px-4 md:px-12">
          <Link className="flex items-center justify-center" href="#">
            <Image
              src="/box-logo.svg"
              alt="Logo Outbank"
              width={120}
              height={27}
              className="h-8 w-auto"
              priority
            />
            <span className="sr-only">Outbank</span>
          </Link>
          <nav className="hidden md:flex mx-auto gap-8 items-center justify-center">
            <Link
              className="text-sm font-semibold hover:underline underline-offset-4 text-white transition-colors hover:scale-105 duration-300"
              href="#"
            >
              Outbank
            </Link>
            <Link
              className="text-sm font-semibold hover:underline underline-offset-4 text-muted-foreground hover:text-white transition-colors hover:scale-105 duration-300"
              href="#"
            >
              Banking
            </Link>
            <Link
              className="text-sm font-semibold hover:underline underline-offset-4 text-muted-foreground hover:text-white transition-colors hover:scale-105 duration-300"
              href="#"
            >
              Acquiring
            </Link>
            <Link
              className="text-sm font-semibold hover:underline underline-offset-4 text-muted-foreground hover:text-white transition-colors hover:scale-105 duration-300"
              href="#"
            >
              Cards & Credit
            </Link>
          </nav>
          <div className="ml-auto flex items-center">
            <button className="text-white mr-4 hover:text-gray-300 hover:scale-105 transition-all duration-300">Support</button>
            <SignedIn>
              <Link href="/portal/dashboard">
                <Button className="bg-white text-black rounded-none hover:bg-white/90 hover:scale-105 transition-all duration-300">Portal</Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button>Entrar</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>
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
