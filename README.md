# Outbank One

Plataforma de gestão financeira e de pagamentos.

## Visão Geral

O Outbank One é uma plataforma completa para gestão financeira e processamento de pagamentos, oferecendo:

- Gestão de comerciantes
- Processamento de transações
- Geração de links de pagamento
- Antecipação de recebíveis
- Liquidações
- Relatórios e exportação de dados

## Tecnologias

- **Frontend**: Next.js 14, TypeScript, React, Shadcn UI, Tailwind CSS
- **Backend**: Next.js API Routes, Drizzle ORM
- **Banco de Dados**: PostgreSQL
- **Integrações**: Dock API

## Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── portal/            # Interface administrativa
│   ├── auth/              # Autenticação
│   └── ...
├── components/            # Componentes React
├── server/               # Lógica do servidor
│   ├── integrations/     # Integrações externas
│   └── db/              # Banco de dados
└── ...
```

## Cron Jobs

O sistema utiliza cron jobs para sincronização automática de dados:

- Sincronização de pagamentos
- Sincronização de comerciantes
- Sincronização de transações
- Sincronização de links de pagamento
- Geração de relatórios

## Documentação

- [Visão Geral do Projeto](docs/project-overview.md)
- [Cron Jobs](docs/cron-jobs.md)
- [Sugestões de Melhorias](docs/improvements.md)

## Requisitos

- Node.js 18+
- PostgreSQL
- Yarn ou npm

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   yarn install
   ```
3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```
4. Execute as migrações do banco de dados:
   ```bash
   yarn drizzle-kit push:pg
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   yarn dev
   ```

## Scripts Disponíveis

- `yarn dev`: Inicia o servidor de desenvolvimento
- `yarn build`: Gera a build de produção
- `yarn start`: Inicia o servidor de produção
- `yarn lint`: Executa o linter
- `yarn type-check`: Verifica tipos TypeScript
- `yarn drizzle-kit push:pg`: Executa migrações do banco de dados

## Contribuição

Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre nosso código de conduta e processo de submissão de pull requests.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
