import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "../../../components/sign-in/sign-in-form";

const companies = [
  {
    name: "Banco Prisma",
    logo: "/logo-prisma.svg",
    mainImage: "/bancoprisma_login.svg",
    bgColors: {
      from: "#080808",
      to: "#121212",
    },
  },
];

export default function SignInPage({
  searchParams,
}: {
  searchParams: { company?: string };
}) {
  const currentCompany =
    companies.find(
      (c) => c.name.toLowerCase() === searchParams.company?.toLowerCase()
    ) || companies[0];

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Full Image */}
      <div
        className="hidden lg:block w-2/3 relative overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${currentCompany.bgColors.from}, ${currentCompany.bgColors.to})`,
        }}
      >
        {/* Logo */}
        <Link href="/" className="absolute top-8 left-8 z-10">
          <div className="relative p-3 rounded-lg bg-black/40 backdrop-blur-sm shadow-xl">
            <Image
              src={currentCompany.logo}
              alt={`Logo ${currentCompany.name}`}
              width={200}
              height={100}
              className="h-16 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              quality={100}
            />
          </div>
        </Link>

        {/* Full-size background image */}
        <Image
          src={currentCompany.mainImage}
          alt="Ilustração de autenticação"
          fill
          className="object-cover z-0"
          priority
          sizes="66vw"
        />
      </div>

      {/* Right Section - Form */}
      <div
        className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/3 lg:px-12 xl:px-16"
        style={{
          background: `linear-gradient(to right, ${currentCompany.bgColors.from}, ${currentCompany.bgColors.to})`,
        }}
      >
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center lg:justify-start">
            <Link href="/">
              <div className="relative p-2 rounded-lg bg-black/30 backdrop-blur-sm shadow-xl">
                <Image
                  src={currentCompany.logo}
                  alt={`Logo ${currentCompany.name}`}
                  width={160}
                  height={60}
                  className="h-12 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  quality={100}
                />
              </div>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-light text-white mb-2">
              Bem-vindo ao {currentCompany.name}!
            </h1>
            <p className="text-gray-300/80">
              Por favor, faça login na sua conta
            </p>
          </div>

          <SignInForm />
        </div>
      </div>
    </div>
  );
}
