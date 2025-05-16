"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

export default function CriarSenhaPage() {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [passwordError, setPasswordError] = useState("")
    const router = useRouter()
    const [success, setSuccess] = useState(false)

    // Recupera o userId salvo no localstorage
    const userId = typeof window !== "undefined" ? localStorage.getItem("id_clerk") : null

    const validatePassword = () => {
        if (newPassword !== confirmPassword) {
            setPasswordError("As senhas não coincidem")
            return false
        }
        setPasswordError("")
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validatePassword()) {
            return
        }

        if (!newPassword || !userId) {
            setPasswordError("Senha inválida ou usuário não autenticado.")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/disable-first-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, newPassword }),
            })

            if (!res.ok) {
                throw new Error("Erro ao definir senha.")
            }

            // Mostrar mensagem de sucesso
            setSuccess(true)
            setPasswordError("")

            // Aguardar 3 segundos antes de redirecionar
            setTimeout(() => {
                router.push("/auth/sign-in")
            }, 4000)
        } catch (error) {
            console.error(error)
            setPasswordError("Erro ao definir a senha. Tente novamente.")
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main content */}
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    <h1 className="text-2xl font-semibold">Definir Nova Senha</h1>
                </div>

                <div className="bg-white rounded-lg border p-6 shadow-sm">
                    <div className="flex items-center mb-6">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Lock className="h-5 w-5" />
                        </div>
                        <h2 className="ml-3 text-lg font-medium">Informações de Segurança</h2>
                    </div>

                    {passwordError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                            {passwordError}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                            Sucesso, você definiu sua senha, faça login novamente para acessar sua conta
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                                Nova Senha <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                placeholder="Digite sua nova senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                                Confirmar Senha <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirme sua nova senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                            >
                                {loading ? "Processando..." : "Confirmar Nova Senha"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
