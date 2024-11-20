import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  Lock,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-12 lg:px-12 h-14 flex items-center container mx-auto mt-4">
        <Link className="flex items-center justify-center" href="#">
          <Image
            src="/outbank-logo.png"
            alt="Logo Outbank"
            width={120}
            height={27}
            className="h-8 w-auto"
            priority
          />
          <span className="sr-only">Outbank</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Recursos
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Preços
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Sobre
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Contato
          </Link>
          <SignedIn>
            <Link href="/portal/dashboard">
              <Button>Portal</Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button>Entrar</Button>
            </SignInButton>
          </SignedOut>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="mx-auto container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Soluções de Pagamento de Próxima Geração
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Transforme seu negócio com nossas soluções inovadoras de
                  processamento de pagamentos. Transações simples, seguras e sem
                  complicações para o comércio moderno.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50">
                  Comece Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">Saiba Mais</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32 mx-auto">
          <div className="mx-auto container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <CreditCard className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    Processamento de Pagamentos
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Aceite pagamentos em qualquer lugar, a qualquer momento, com
                    nossas soluções seguras e confiáveis de processamento de
                    pagamentos.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <Smartphone className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Soluções Móveis</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Transforme qualquer smartphone em um terminal de pagamento
                    com nossas soluções de pagamento móvel.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <Lock className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Transações Seguras</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Medidas de segurança de última geração para proteger cada
                    transação e manter a confiança do cliente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="mx-auto container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Por que escolher a Outbank para o seu negócio?
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Junte-se a milhares de empresas que confiam na Outbank para
                  suas necessidades de processamento de pagamentos.
                </p>
                <ul className="grid gap-4">
                  <li className="flex items-center gap-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span>Taxas de transação competitivas</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span>Suporte ao cliente 24/7</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span>Fácil integração com sistemas existentes</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span>Monitoramento de transações em tempo real</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur-2xl opacity-40" />
                  <Card className="relative">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold">
                          Pronto para começar?
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Entre em contato com nossa equipe de vendas hoje e
                          transforme suas capacidades de processamento de
                          pagamentos.
                        </p>
                        <Button className="w-full">Contatar Vendas</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Outbank. Todos os direitos reservados.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  );
}
