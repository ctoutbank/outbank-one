

export async function getIdBySlug(
  tableName: string,
  slug: string
): Promise<number | null> {
  console.log(`Buscando ID na tabela ${tableName} para slug ${slug}`);
  try {
    const result = await pool.query(
      `SELECT id FROM ${tableName} WHERE slug = $1`,
      [slug]
    );
    console.log(`Resultado da busca: ${result.rows[0]?.id}`);
    return result.rows[0]?.id || null;
  } catch (error) {
    console.error(
      `Erro ao buscar ID na tabela ${tableName} para slug ${slug}:`,
      error
    );
    return null;
  }
}
