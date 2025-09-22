"use client";

import { validateUserAccessBySubdomain } from "@/app/actions/validateSubdomain";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff, LockIcon, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = useState("");

  const getPortugueseErrorMessage = (error: any) => {
    if (error?.errors?.[0]) {
      const clerkError = error.errors[0];
      switch (clerkError.code) {
        case "user_not_found":
          return "Nenhum usuário encontrado com este e-mail";
        case "form_password_incorrect":
          return "Senha incorreta";
        case "form_identifier_not_found":
          return "E-mail não encontrado";
        case "form_param_format_invalid":
          return "Formato de e-mail inválido";
        case "network_error":
          return "Erro de conexão. Por favor, verifique sua internet";
        default:
          return clerkError.message
            ? clerkError.message
            : "Ocorreu um erro. Por favor, tente novamente";
      }
    }
    return "Ocorreu um erro. Por favor, tente novamente";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setError("");
      setIsLoading(true);

      const host = window.location.hostname;
      const subdomain = host.split(".")[0];

      const validation = await validateUserAccessBySubdomain(email, subdomain);

      if (!validation.authorized) {
        setError(validation.reason || "Credenciais inválidas");
        return;
      }

      // Passo 1: Verificar se é o primeiro login
      const checkResponse = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        setError(checkData.error || "Credenciais inválidas");
        return;
      }

      if (checkData.firstLogin) {
        // Primeiro login: autenticar via banco
        const bancoLoginResponse = await fetch("/api/login-db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const bancoLogin = await bancoLoginResponse.json();

        if (!bancoLoginResponse.ok) {
          setError(bancoLogin.error || "Credenciais inválidas");
          return;
        }

        // Sucesso! Atualiza metadado no Clerk para first_login = false
        await fetch("/api/disable-first-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: checkData.userId }),
        });

        localStorage.setItem("id_clerk", checkData.userId);
        // Redireciona para a tela de criar senha no Clerk
        window.location.href = "/password-create";
      } else {
        // Login normal via Clerk
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete") {
          window.location.href = "/portal/dashboard";
        } else {
          setError("Algo deu errado durante o login");
        }
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
      const portugueseError = getPortugueseErrorMessage(err);
      setError(portugueseError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-1 relative">
        <Mail
          className="absolute left-3 top-11 -translate-y-1/2 text-white"
          size={18}
        />
        <label
          className="text-sm font-medium ml-2 text-gray-300"
          htmlFor="email"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          className="bg-[#1C1C1C] border-0 text-white focus:ring-1 focus:ring-[#c79d61]/50 pl-10"
        />
      </div>

      <div className="space-y-1">
        <label
          className="text-sm font-medium ml-2 text-gray-300"
          htmlFor="password"
        >
          Senha
        </label>
        <div className="relative">
          <LockIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
            size={18}
          />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
            className="bg-[#1C1C1C] border-0 text-white focus:ring-1 focus:ring-[#c79d61]/50 pl-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            className="border-gray-600 data-[state=checked]:bg-[#000000] data-[state=checked]:border-[#f2f2f2]"
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none text-gray-300/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Manter conectado
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-gray-300/80 hover:text-[#c79d61]/80"
        >
          Esqueceu a senha?
        </Link>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <Button
        type="submit"
        className="w-full bg-white text-black hover:bg-white/90 rounded-2"
        disabled={isLoading || !isLoaded}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
