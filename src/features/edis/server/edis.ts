// Tipo para os dados de EDIS
type EdisFile = {
  id: number;
  name: string;
  type: string;
  status: string;
  date: string;
  size: string;
};

type EdisListResponse = {
  data: EdisFile[];
  totalCount: number;
  active_count: number;
  inactive_count: number;
  pending_count: number;
  processed_count: number;
  error_count: number;
};

// Função para buscar dados de EDIS (simulado com dados dummy)
export async function getEdis(
  search?: string,
  page: number = 1,
  pageSize: number = 12,
  type?: string,
  status?: string,
  date?: string
): Promise<EdisListResponse> {
  // Simulação de delay de rede
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Dados dummy para simulação
  const totalCount = 50;

  // Criação de dados fictícios
  let data = Array(Math.min(pageSize, totalCount))
    .fill(null)
    .map((_, index) => {
      const itemIndex = (page - 1) * pageSize + index + 1;
      const fileType = type || (itemIndex % 2 === 0 ? "Remessa" : "Retorno");

      let fileStatus = status;
      if (!fileStatus) {
        if (itemIndex % 3 === 0) fileStatus = "Processado";
        else if (itemIndex % 3 === 1) fileStatus = "Pendente";
        else fileStatus = "Erro";
      }

      const fileDate = date || new Date().toISOString();

      return {
        id: itemIndex,
        name: `Arquivo EDIS ${itemIndex.toString().padStart(3, "0")}`,
        type: fileType,
        status: fileStatus,
        date: fileDate,
        size: `${Math.floor(Math.random() * 1000)}KB`,
      };
    });

  // Aplicar filtro de busca se existir
  if (search) {
    data = data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return {
    data,
    totalCount,
    active_count: 30,
    inactive_count: 20,
    pending_count: 15,
    processed_count: 25,
    error_count: 10,
  };
}
