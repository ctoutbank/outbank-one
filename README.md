# Outbank One

Plataforma completa de adquirência e gestão de pagamentos para empresas que buscam soluções robustas e escaláveis.

## Funcionalidades

- **Gestão de Comerciantes**: Cadastro e gerenciamento completo de merchants
- **Processamento de Transações**: Sistema robusto para processamento de pagamentos
- **Relatórios Avançados**: Analytics e relatórios detalhados de performance
- **Integração com APIs**: Conectividade com principais provedores de pagamento
- **Dashboard Administrativo**: Interface completa para gestão operacional

## Tecnologias

- **Frontend**: Next.js 15.2.3, TypeScript, React, Shadcn UI, Tailwind CSS
- **Backend**: Next.js API Routes, Drizzle ORM
- **Banco de Dados**: PostgreSQL (Neon)
- **Autenticação**: Clerk
- **Integrações**: Dock API, AWS S3, Resend

## Pré-requisitos

- Node.js 18+
- npm (recomendado sobre yarn)
- Conta no Neon (PostgreSQL)
- Conta no Clerk (autenticação)
- Chaves de API (Dock, Resend, AWS)

## Configuração do Ambiente

### 1. Clone o repositório
```bash
git clone https://github.com/ctoutbank/outbank-one.git
cd outbank-one
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

#### Banco de Dados (Neon)
- **DATABASE_URL**: String de conexão do Neon Postgres
  - Acesse: https://console.neon.tech/
  - Vá para seu projeto → Connection Details
  - Formato: `postgresql://username:password@hostname:port/database?sslmode=require`

#### Autenticação (Clerk)
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: Chave pública do Clerk
- **CLERK_SECRET_KEY**: Chave secreta do Clerk
  - Acesse: https://dashboard.clerk.com/
  - Vá para seu app → API Keys

#### Integração Dock API
- **DOCK_API_KEY**: Token JWT da API Dock
  - Solicite ao time de integração da Dock
- **DOCK_API_URL_***: URLs das APIs (já configuradas)

#### Email (Resend)
- **RESEND_API_KEY**: Chave da API Resend
  - Acesse: https://resend.com/api-keys

#### AWS S3
- **AWS_ACCESS_KEY_ID**: ID da chave de acesso AWS
- **AWS_SECRET_ACCESS_KEY**: Chave secreta AWS
- **AWS_BUCKET_NAME**: Nome do bucket S3
  - Acesse: AWS Console → IAM → Users → Security Credentials

### 4. Teste a conexão com o banco
```bash
npm run db:test
```

### 5. Execute as migrações (se necessário)
```bash
npm run db:push
```

### 6. Popule o banco com dados de exemplo (opcional)
```bash
npm run db:seed
```

### 7. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

O servidor estará disponível em: http://localhost:3000

## Scripts Disponíveis

### Desenvolvimento
- `npm run dev`: Servidor de desenvolvimento
- `npm run build`: Build de produção
- `npm run start`: Servidor de produção
- `npm run lint`: Verificação de código
- `npm run type-check`: Verificação de tipos TypeScript

### Banco de Dados
- `npm run db:test`: Testa conexão com o banco
- `npm run db:generate`: Gera migrações Drizzle
- `npm run db:migrate`: Aplica migrações
- `npm run db:push`: Sincroniza schema com o banco
- `npm run db:studio`: Interface visual do banco
- `npm run db:seed`: Popula banco com dados de exemplo

### Manutenção
- `npm run audit:fix`: Corrige vulnerabilidades
- `npm run format`: Formata código
- `npm run format:check`: Verifica formatação

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
│   ├── integrations/     # Integrações externas (Dock API)
│   └── db/              # Configuração do banco
├── features/             # Funcionalidades por domínio
├── locales/              # Traduções (pt/en)
└── utils/                # Utilitários
drizzle/                  # Schema e migrações do banco
scripts/                  # Scripts de manutenção
```

## Solução de Problemas

### Erro de conexão com banco
- Verifique se DATABASE_URL está correto no .env.local
- Confirme que o banco Neon está ativo
- Execute `npm run db:test` para diagnosticar
- Verifique se seu IP está na whitelist do Neon

### Erro de autenticação Clerk
- Verifique as chaves CLERK_SECRET_KEY e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- Confirme o domínio configurado no Clerk
- Verifique se as chaves são do ambiente correto (test/prod)

### Dependências desatualizadas
- Execute `npm audit` para verificar vulnerabilidades
- Use `npm run audit:fix` para correções seguras
- Evite `npm audit fix --force` para não quebrar dependências

### Problemas de build
- Execute `npm run type-check` para verificar erros TypeScript
- Execute `npm run lint` para verificar problemas de código
- Limpe cache: `rm -rf .next node_modules package-lock.json && npm install`

### Problemas com Dock API
- Verifique se DOCK_API_KEY é um JWT válido
- Confirme se as URLs da API estão corretas
- Teste conectividade com as APIs Dock

## Desenvolvimento

### Workflow recomendado
1. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
2. Configure ambiente: `cp .env.example .env.local` e preencha variáveis
3. Teste conexões: `npm run db:test`
4. Inicie desenvolvimento: `npm run dev`
5. Execute testes: `npm run lint && npm run type-check`
6. Commit: `git commit -m "feat: nova funcionalidade"`
7. Push: `git push origin feature/nova-funcionalidade`
8. Abra um Pull Request

### Comandos úteis para desenvolvimento
```bash
# Verificar saúde do projeto
npm run db:test && npm run lint && npm run type-check && npm run build

# Reset completo do ambiente
rm -rf .next node_modules package-lock.json
npm install
npm run db:test

# Visualizar banco de dados
npm run db:studio
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Faça suas alterações seguindo os padrões do projeto
4. Execute todos os testes e verificações
5. Abra um Pull Request com descrição detalhada

## Licença

Este projeto é propriedade da Outbank. Todos os direitos reservados.
