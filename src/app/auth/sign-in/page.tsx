import Image from "next/image";
import { SignInForm } from "../../../components/sign-in/sign-in-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Section - Image */}
      <div className="hidden lg:block w-2/3 relative overflow-hidden">
        <Image
          src="/bg_login.jpg"
          alt="Ilustração de autenticação"
          fill
          className="object-cover z-0"
          priority
          sizes="66vw"
        />
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(to right, hsl(var(--background)), transparent)`,
          }}
        />
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/3 lg:px-12 xl:px-16">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <Image src="/logo.svg" alt="Logo" width={128} height={80} />
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Entrar na sua conta
            </h1>
            <p className="text-muted-foreground">
              Acesse o sistema para gerenciar suas cobranças
            </p>
          </div>

          <SignInForm />
        </div>
      </div>
    </div>
  );
}