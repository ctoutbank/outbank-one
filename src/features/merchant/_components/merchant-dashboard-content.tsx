"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileCheck, HomeIcon, Wallet } from "lucide-react"

type MerchantDashboardContentProps = {
  totalMerchants: number
  activeMerchants: number
  inactiveMerchants: number
  pendingKyc: number
  approvedKyc: number
  rejectedKyc: number
  totalCpAnticipation: number
  totalCnpAnticipation: number
}

export function MerchantDashboardContent({
  totalMerchants,
  activeMerchants,
  inactiveMerchants,
  pendingKyc,
  approvedKyc,
  rejectedKyc,
  totalCpAnticipation,
  totalCnpAnticipation,
}: MerchantDashboardContentProps) {
  return (
    <div className="w-full mt-4 mb-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Merchants Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">Total de Estabelecimentos</span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900">{totalMerchants}</span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">Ativos</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{activeMerchants}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-zinc-600">Inativos</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{inactiveMerchants}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Status Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">Status KYC</span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900">{approvedKyc + pendingKyc + rejectedKyc}</span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">Aprovados</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{approvedKyc}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-medium text-zinc-600">Pendentes</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{pendingKyc}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-zinc-600">Rejeitados</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{rejectedKyc}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anticipation Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">Antecipações</span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900">{totalCpAnticipation + totalCnpAnticipation}</span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">CP Ativos</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{totalCpAnticipation}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">CNP Ativos</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{totalCnpAnticipation}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

