"use client"

import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, isLoaded } = useSignIn()
  const [error, setError] = useState("")

  const getPortugueseErrorMessage = (error: any) => {
    if (error?.errors?.[0]) {
      const clerkError = error.errors[0]
      switch (clerkError.code) {
        case "user_not_found":
          return "Nenhum usuário encontrado com este e-mail"
        case "form_password_incorrect":
          return "Senha incorreta"
        case "form_identifier_not_found":
          return "E-mail não encontrado"
        case "form_param_format_invalid":
          return "Formato de e-mail inválido"
        case "network_error":
          return "Erro de conexão. Por favor, verifique sua internet"
        default:
          return clerkError.message ? 
            clerkError.message : "Ocorreu um erro. Por favor, tente novamente"
      }
    }
    return "Ocorreu um erro. Por favor, tente novamente"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    
    try {
      setError("")
      setIsLoading(true)
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === "complete") {
        window.location.href = "/"
      } else {
        setError("Algo deu errado durante o login")
      }
    } catch (err: any) {
      console.error("Error signing in:", err)
      const portugueseError = getPortugueseErrorMessage(err)
      setError(portugueseError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-1">
        <label className="text-sm font-medium ml-2 text-gray-300" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail ou nome de usuário"
          required
          className="bg-[#1C1C1C] border-0 text-white focus:ring-1 focus:ring-[#CFC8B8]/50"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium ml-2 text-gray-300" htmlFor="password">
          Senha
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="············"
            required
            className="bg-[#1C1C1C] border-0 text-white focus:ring-1 focus:ring-[#CFC8B8]/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
            Lembrar-me
          </label>
        </div>
        <Link href="/forgot-password" className="text-sm text-gray-300/80 hover:text-[#CFC8B8]/80">
          Esqueceu a senha?
        </Link>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-white text-black hover:bg-white/90 rounded-none"
        disabled={isLoading || !isLoaded}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  )
}