"use server";

import { db } from "@/server/db";
import { asc, count, desc, eq, ilike, or, and } from "drizzle-orm";
import { taxas } from "../../../../drizzle/schema";

export interface TaxaList {
  taxas: {
    id: number;
    slug: string | null;
    nome: string | null;
    active: boolean | null;
    dtinsert: Date | null;
    dtupdate: Date | null;
    tipo: string | null;
    valor: number | null;
    descricao: string | null;
  }[];
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  avgValor: number;
}

export type TaxaInsert = typeof taxas.$inferInsert;
export type TaxaDetail = typeof taxas.$inferSelect;

export async function getTaxas(
  search: string,
  page: number,
  pageSize: number,
  sortField: string = "id",
  sortOrder: "asc" | "desc" = "desc",
  nome?: string,
  status?: string,
  tipo?: string,
  valor?: string
): Promise<TaxaList> {
  const offset = (page - 1) * pageSize;

  const result = await db
    .select({
      id: taxas.id,
      slug: taxas.slug,
      nome: taxas.nome,
      active: taxas.active,
      dtinsert: taxas.dtinsert,
      dtupdate: taxas.dtupdate,
      tipo: taxas.tipo,
      valor: taxas.valor,
      descricao: taxas.descricao,
    })
    .from(taxas)
    .where(
      and(
        or(
          ilike(taxas.nome, `%${search}%`),
          ilike(taxas.tipo, `%${search}%`),
          ilike(taxas.descricao, `%${search}%`)
        ),
        nome ? ilike(taxas.nome, `%${nome}%`) : undefined,
        status ? eq(taxas.active, status === "ACTIVE") : undefined,
        tipo ? ilike(taxas.tipo, `%${tipo}%`) : undefined,
        valor ? ilike(taxas.valor || "", `%${valor}%`) : undefined
      )
    )
    .orderBy(
      sortField === "nome"
        ? sortOrder === "asc"
          ? asc(taxas.nome)
          : desc(taxas.nome)
        : desc(taxas.id)
    )
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db.select({ count: count() }).from(taxas);
  const totalCount = totalCountResult[0]?.count || 0;

  const taxasList = result.map((taxa) => ({
    id: taxa.id,
    slug: taxa.slug || "",
    nome: taxa.nome || "",
    active: taxa.active || false,
    dtinsert: taxa.dtinsert ? new Date(taxa.dtinsert) : new Date(),
    dtupdate: taxa.dtupdate ? new Date(taxa.dtupdate) : new Date(),
    tipo: taxa.tipo || "",
    valor: Number(taxa.valor) || 0,
    descricao: taxa.descricao || "",
  }));

  return {
    taxas: taxasList,
    totalCount,
    activeCount: taxasList.filter((c) => c.active).length,
    inactiveCount: taxasList.filter((c) => !c.active).length,
    avgValor: calculateAverage(taxasList, "valor"),
  };
}

function calculateAverage(
  taxas: { valor: number | null }[],
  field: keyof (typeof taxas)[0]
): number {
  const values = taxas.map((c) => Number(c[field])).filter(Boolean);
  return values.length ? values.reduce((a, b) => a + b) / values.length : 0;
}

export async function getTaxaById(id: number): Promise<TaxaDetail | null> {
  const result = await db.select().from(taxas).where(eq(taxas.id, id));

  return result[0] || null;
}

export async function insertTaxa(taxa: TaxaInsert) {
  const result = await db
    .insert(taxas)
    .values(taxa)
    .returning({ id: taxas.id });

  return result[0].id;
}

export async function updateTaxa(taxa: TaxaDetail): Promise<void> {
  await db
    .update(taxas)
    .set({
      nome: taxa.nome,
      active: taxa.active,
      dtupdate: new Date().toISOString(),
      tipo: taxa.tipo,
      valor: taxa.valor,
      descricao: taxa.descricao,
    })
    .where(eq(taxas.id, taxa.id));
}

export async function deleteTaxa(id: number): Promise<void> {
  await db.delete(taxas).where(eq(taxas.id, id));
}
