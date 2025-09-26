"use client";

import { validateUserAccessBySubdomain } from "@/app/actions/validateSubdomain";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearAllSessions, clearClerkSession } from "@/lib/session-cleanup";
import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff, LockIcon, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = useState("");
  const [sessionCleared, setSessionCleared] = useState(false);

  useEffect(() => {
    const clearExistingSessions = async () => {
      try {
        await clearClerkSession();
        setSessionCleared(true);
      } catch (error) {
        console.warn("Error clearing existing sessions:", error);
        setSessionCleared(true);
      }
    };

    if (!sessionCleared) {
      clearExistingSessions();
    }
  }, [sessionCleared]);

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
        case "session_exists":
          return "Sessão já existe. Limpando cache...";
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

        await fetch("/api/disable-first-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: checkData.userId }),
        });

        localStorage.setItem("id_clerk", checkData.userId);
        window.location.href = "/password-create";
      } else {
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
      
      if (err?.errors?.[0]?.code === "session_exists" || 
          err?.message?.includes("session") || 
          err?.message?.includes("Session already exists")) {
        console.log("Session exists error detected, clearing all sessions...");
        try {
          await clearAllSessions();
          setError("Sessão limpa. Por favor, tente fazer login novamente.");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (clearError) {
          console.error("Error clearing sessions:", clearError);
          setError("Erro ao limpar sessão. Por favor, limpe o cache do navegador e tente novamente.");
        }
      } else {
        const portugueseError = getPortugueseErrorMessage(err);
        setError(portugueseError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">Email</Label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3 text-muted-foreground" size={18} />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="pl-10 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/80"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password"  className="text-gray-300">Senha</Label>
        <div className="relative flex items-center">
          <LockIcon className="absolute left-3 text-muted-foreground" size={18} />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
            className="pl-10 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/80"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
          <Label htmlFor="remember" className="text-sm font-medium leading-none text-gray-300/80">
            Manter conectado
          </Label>
        </div>
        <Link href="/forgot-password" className="text-sm text-gray-300/80 hover:text-primary/80">
          Esqueceu a senha?
        </Link>
      </div>

      {error && (
        <div className="text-destructive text-sm mt-2">
          {error}
          {error.includes("Sessão limpa") && (
            <div className="mt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => window.location.reload()} className="text-xs">
                Recarregar página
              </Button>
            </div>
          )}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading || !isLoaded}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}