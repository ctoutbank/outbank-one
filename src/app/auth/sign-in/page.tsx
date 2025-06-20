import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "../../../components/sign-in/sign-in-form";
import { cookies } from "next/headers";
import { getNameByTenant, getThemeByTenant } from "@/lib/getThemeByTenant";

export default async function SignInPage({

                                         }: {
  searchParams: { company?: string };
}) {
  const cookieStore = cookies();
  const tenant = cookieStore.get("tenant")?.value;

  const nameTenant = tenant ? await getNameByTenant(tenant) : null;
  const themeData = tenant ? await getThemeByTenant(tenant) : null;

  if (!themeData || !nameTenant) {
    return <div>Empresa não encontrada</div>;

  }

  console.log("Cor principal", themeData.primary)

  return (
      <div className="min-h-screen flex">
        {/* Left Section - Full Image */}
        <div
            className="hidden lg:block w-2/3 relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${themeData.primary}, ${themeData.secondary})`,
            }}
        >
          {/* Logo */}
          <Link href="/" className="absolute top-8 left-8 z-10">
            <div className="relative p-3 rounded-lg bg-black/40 backdrop-blur-sm shadow-xl">

            </div>
          </Link>

          {/* Full-size background image */}
          <Image
              src="/bancoprisma_login.svg" // fallback se não tiver imagem principal
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
              background: `hsl(${themeData.primary})`,
            }}
        >
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 flex justify-center lg:justify-start">
              <Link href="/">
                <div className="relative p-2 rounded-lg bg-black/30 backdrop-blur-sm shadow-xl">
                  <Image
                      src={themeData.imageUrl}
                      alt={`Logo ${nameTenant.slug}`}
                      width={160}
                      height={60}
                      className="h-12 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                      quality={100}
                  />
                </div>
              </Link>
            </div>

              <div className="flex justify-center">
                  <Image
                      src={themeData.imageUrl}
                      alt={`Logo ${nameTenant.slug}`}
                      width={200}
                      height={100}
                      className="h-16 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                      quality={100}
                  />
              </div>

            {/* Header */}
            <div className="mb-8 text-center sm:text-center">

              <h1 className="text-3xl font-bold-light text-white mb-2">
                Entrar na sua conta
              </h1>
              <p className="text-gray-300/80">
                  Acesse o sistema para gerenciar suas cobranças
              </p>
            </div>

            <SignInForm />
          </div>
        </div>
      </div>
  );
}
