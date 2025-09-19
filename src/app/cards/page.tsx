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


export default function CardsPage() {

  const cards = [
    {
      title: "Cartão de crédito",
      subtitle: "Transforme seu negócio com uma operação própria de cartão de crédito, personalizada com suas cores e características.",
      bullets: [
        "Marca Própria ou White Label",
        "Cartões Físicos e Virtuais", 
        "Acesso às principais bandeiras do mercado"
      ],
      finalText: {
        title: "Seu cliente, cada vez mais fiel e conectado ao seu negócio.",
        description: "Conte com a experiência de quem emitiu mais de 100 milhões de cartões nos últimos 12 meses."
      },
      bottomIndicators: [
        "Gerenciamento de cartões",
        "Escopo regulatório e licenças",
        "Tecnologia por meio de APIs escaláveis", 
        "Segurança e Prevenção a Fraude",
        "Suporte em tesouraria e conciliação"
      ],
      cardImage: "/black-card.svg", 
      dotColor: "bg-gray-600",
    },
    {
      title: "Cartão Private Label",
      subtitle: "Fidelize seus clientes com um cartão private label para uso exclusivo em sua rede de estabelecimentos.",
      bullets: [
        "White ou Private Label",
        "Cartões físicos e virtuais",
        "Acesso às principais bandeiras do mercado"
      ],
      finalText: {
        title: "Conecte seus clientes à sua marca com benefícios únicos.",
        description: "Ofereça cartões exclusivos que fortalecem sua marca e criam um vínculo direto com o consumidor."
      },
      bottomIndicators: [
        "White Label ou Private Label",
        "Cartões físicos e virtuais",
        "Fortalece laços com seus clientes",
        "Principais bandeiras do mercado",
        "Ideal para varejo e grandes marcas"
      ],
      cardImage: "/purple-card.svg", 
      dotColor: "bg-purple-600",
    },
    {
      title: "Cartão Multibeneficios",
      subtitle: "Centralize todos os benefícios dos seus clientes em um único cartão de crédito com a sua marca.",
      bullets: [
        "Marca Própria ou White Label",
        "Cartões Físicos e Virtuais",
        "Acesso às principais bandeiras do mercado"
      ],
      finalText: {
        title: "Um cartão, múltiplas vantagens.",
        description: "Simplifique a gestão de benefícios e aumente a adesão com soluções completas em um único cartão."
      },
      bottomIndicators: [
        "Parceiros para desenvolver seu APP",
        "Rendimento da agenda bandeira",
        "Rendimento do saldo em conta",
        "Licenças via Outbank Cloud",
        "Parceiros para criar seu Portal RH"
      ],
      cardImage: "/red-card.svg", 
      dotColor: "bg-red-600",
    },
    {
      title: "Cartão Global",
      subtitle: "O Cartão Global garante praticidade e segurança em transações internacionais, oferecendo aos seus clientes uma experiência fluida e sem fronteiras.",
      bullets: [
        "Marca Própria ou White Label",
        "Cartões Físicos e Virtuais",
        "Acesso às principais bandeiras do mercado"
      ],
      finalText: {
        title: "Sua marca além das fronteiras.",
        description: "Garanta presença internacional e fidelização com um cartão seguro, prático e aceito por todo o mundo."
      },
      bottomIndicators: [
        "Compra de moeda estrangeira",
        "Ampliação do portfólio e receita",
        "Fidelização de clientes Globais",
        "Benefícios exclusivos ao portador",
        "Cartão internacional aceito no mundo todo"
      ],
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
