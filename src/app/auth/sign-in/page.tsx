import Image from "next/image"
import Link from "next/link"
import { SignInForm } from "../../../components/sign-in/sign-in-form"

const companies = [
  {
    name: "Outbank",
    logo: "/box-logo.svg",
    mainImage: "/logo-icon.svg",
  },
  {
    name: "Banco Prisma",
    logo: "/logo-prisma.svg",
    mainImage: "/sign-in-teste.png",
  },
]

export default function SignInPage({
  searchParams,
}: {
  searchParams: { company?: string }
}) {
  const currentCompany = companies.find(
    (c) => c.name.toLowerCase() === searchParams.company?.toLowerCase()
  ) || companies[0]

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Illustration */}
      <div className="hidden lg:flex w-2/3 bg-gradient-to-r from-[#080808] to-[#121212] relative p-8">
        {/* Logo */}
        <Link href="/" className="absolute top-8 left-8">
          <Image
            src={currentCompany.logo}
            alt={`Logo ${currentCompany.name}`}
            width={150}
            height={70}
            className="h-10 w-30"
            quality={100}
          />
        </Link>

        {/* Illustration */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-[600px] h-[600px]">
            <div className="absolute inset-0 bg-[#808080] blur-3xl opacity-10 rounded-full"></div>
            <Image
              src={currentCompany.mainImage}
              alt="Ilustração de autenticação"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/3 lg:px-12 xl:px-16 bg-gradient-to-r from-[#080808] to-[#121212]">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center lg:justify-start">
            <Link href="/">
              <Image
                src={currentCompany.logo}
                alt={`Logo ${currentCompany.name}`}
                width={120}
                height={40}
                className="h-8 w-auto"
                quality={100}
              />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-light text-white mb-2">
              Bem-vindo ao {currentCompany.name}!
            </h1>
            <p className="text-gray-300/80">Por favor, faça login na sua conta</p>
          </div>

          <SignInForm />
        </div>
      </div>
    </div>
  )
}

