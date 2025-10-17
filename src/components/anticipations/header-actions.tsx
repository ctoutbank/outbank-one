"use client";

import { MerchantDD } from "@/features/anticipations/server/anticipation";

// Note: server functions can't be called directly from client components.
// We'll fetch them via a lightweight API route.
import { Search, Plus, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";



type Props = {
  search: string;
  merchantSlug: string;

  merchantDD?: MerchantDD[];
 // ajuste tipo conforme retorno real
  type: string;
  status: string;
  startDate: string;
  endDate: string;
};


 

export default function HeaderActions({
  search: initialSearch,
  merchantSlug,
  merchantDD: merchantDDProp,
  type,
  status,
  startDate,
  endDate,
}: Props) {
  const router = useRouter();
  const [q, setQ] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  type MerchantDD = {
    slug: string;
    name: string;
  };

  const [merchants, setMerchants] = useState<MerchantDD[]>(merchantDDProp ?? []);
  const [merchantsLoading, setMerchantsLoading] = useState(false);
  const [merchantsError, setMerchantsError] = useState<string | null>(null);

  useEffect(() => {
    async function buscarMerchant() {
      setMerchantsLoading(true);
      setMerchantsError(null);
      try {
        const res = await fetch("/api/merchants");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
          const data: MerchantDD[] = await res.json();
          setMerchants(data || []);
      } catch (error: any) {
        console.error("Erro ao buscar Merchants: ", error);
        setMerchantsError(error?.message || "Erro ao buscar merchants");
      } finally {
        setMerchantsLoading(false);
      }
    }

    buscarMerchant();
  }, []);



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (merchantSlug) params.set("merchantSlug", merchantSlug);
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    router.push(`/portal/anticipations?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Campo de busca */}
        <form
          onSubmit={handleSearch}
          className="relative flex-1 max-w-md rounded-md shadow-sm"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={q}
            onChange={(q) => setQ(q.target.value)}
            placeholder="Buscar por ID, merchant, valor..."
            className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </form>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter size={16} />
            Filtros
          </button>

          <button
            onClick={() => router.push("/portal/anticipations/new")}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> Nova Solicitação
          </button>
        </div>
      </div>

      {/* Painel de filtros (collapse) */}
      {showFilters && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Merchant
            </label>
            <select
              className="w-full rounded-md border-gray-300 text-sm"
              defaultValue={merchantSlug}
              onChange={(e) => {
                const params = new URLSearchParams(window.location.search);
                params.set("merchantSlug", e.target.value);
                router.push(`?${params.toString()}`);
              }}
            >
              <option value="">Todos</option>
              {merchantsLoading && <option value="">Carregando...</option>}
              {merchantsError && (
                <option value="">Erro ao carregar merchants</option>
              )}
              {merchants.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
            <select className="w-full rounded-md border-gray-300 text-sm" defaultValue={type}>
              <option value="">Todos</option>
              <option value="automatic">Automático</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select className="w-full rounded-md border-gray-300 text-sm" defaultValue={status}>
              <option value="">Todos</option>
              <option value="approved">Aprovado</option>
              <option value="pending">Pendente</option>
              <option value="rejected">Negado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Período</label>
            <input
              type="date"
              className="w-full rounded-md border-gray-300 text-sm"
              defaultValue={startDate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
