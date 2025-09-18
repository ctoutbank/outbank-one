import Footer from "@/components/footer";
import HeroCards from "@/components/cards/hero-cards";
import { Navbar } from "@/components/navbar";
import CustomerCarousel from "@/components/LandingPage/customer-carousel";
import ProductCards from "@/components/cards/product-cards";
import CardProcessing from "@/components/cards/processing";
import FlagLicense from "@/components/cards/flag-license";
import CardSection from "@/components/cards/card-section";
import DualCardSection from "@/components/cards/dual-card-section";
import ConsignedCardSection from "@/components/cards/consigned-card";
import ContactForm from "@/components/LandingPage/contact";
import CardBenefitsCarousel from "@/components/cards/card-benefits-carousel";
import { t } from '../../utils/i18n';


export default function CardsPage() {

  const cards = [
    {
      title: t("Credit Card"),
      subtitle: t("Transform your business with your own personalized credit card operation with its unique colors and characteristics."),
      cardImage: "/black-card.svg", 
      dotColor: "bg-gray-600",
    },
    {
      title: t("Private Label Card"),
      subtitle: t("Fidelize seus clientes com um cartão private label para uso exclusivo em sua rede de estabelecimentos."),
      cardImage: "/purple-card.svg", 
      dotColor: "bg-purple-600",
    },
    {
      title: t("Cartão Global"),
      subtitle: t("O Cartão Global garante praticidade e segurança em transações internacionais, oferecendo aos seus clientes uma experiência fluida e sem fronteiras."),
      cardImage: "/red-card.svg", 
      dotColor: "bg-red-600",
    },
    {
      title: t("Pré-pago e Débito"),
      subtitle: t("A solução ideal para controle de gastos e gestão financeira, com cartões pré-pagos (físicos e virtuais) para Pessoas Físicas ou Jurídicas."),
      cardImage: "/green-card.svg", 
      dotColor: "bg-green-600",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto ">
          <HeroCards />
        </section>
        <section className="w-full">
          <CustomerCarousel />
        </section>
        <section className="w-full max-w-7xl mx-auto">
          <ProductCards />
        </section>
        <section className="w-full max-w-7xl mx-auto">
          <CardProcessing />
        </section>
        <section className="w-full max-w-7xl mx-auto">
          <FlagLicense />
        </section>
        <section className="w-full max-w-7xl mx-auto">
          {cards.map((card, index) => (
            <CardSection key={index} {...card} />
          ))}
        </section>
        <section className="w-full max-w-7xl mx-auto">
          <DualCardSection />
        </section>
        <section className="w-full max-w-7xl mx-auto">
          <ConsignedCardSection />
        </section>
        <section className="w-full max-w-7xl mx-auto">
          <CardBenefitsCarousel />
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
