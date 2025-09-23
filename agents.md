# Outbank One - Guia de Configuração para Agentes

## Visão Geral

O Outbank One é uma plataforma completa de gestão financeira e processamento de pagamentos construída com Next.js 14, TypeScript e PostgreSQL. Este guia fornece instruções detalhadas para configurar e executar o projeto.

## Dependências Necessárias

### Requisitos do Sistema
- **Node.js**: versão 18 ou superior
- **npm**: gerenciador de pacotes (incluído com Node.js)
- **PostgreSQL**: banco de dados (pode ser local ou remoto)
- **Git**: controle de versão

### Verificar Instalações
```bash
node --version    # deve ser >= 18.0.0
npm --version     # qualquer versão recente
git --version     # qualquer versão recente
```

## Configuração do Ambiente

### 1. Clone e Instalação
```bash
# Clone o repositório
git clone https://github.com/ctoutbank/outbank-one.git
cd outbank-one

# Instale as dependências
npm install
```

### 2. Configuração das Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo .env.local com suas credenciais
nano .env.local  # ou use seu editor preferido
```

### Variáveis de Ambiente Necessárias:
- `DATABASE_URL`: String de conexão PostgreSQL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Chave pública do Clerk
- `CLERK_SECRET_KEY`: Chave secreta do Clerk
- `DOCK_API_URL_*`: URLs das APIs do Dock
- `DOCK_API_KEY`: Chave de API do Dock
- `RESEND_API_KEY`: Chave para envio de emails
- `AWS_*`: Credenciais AWS para upload de arquivos

### 3. Configuração do Banco de Dados
```bash
# Execute as migrações (se necessário)
npx drizzle-kit push:pg
```

## Comandos de Desenvolvimento

### Desenvolvimento Local
```bash
# Inicia o servidor de desenvolvimento
npm run dev

# Acesse: http://localhost:3000
```

### Build e Produção
```bash
# Gera build de produção
npm run build

# Inicia servidor de produção
npm run start
```

### Verificações de Qualidade
```bash
# Executa linting
npm run lint

# Verifica tipos TypeScript
npx tsc --noEmit
```

## Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── portal/            # Portal de adquirência
│   ├── auth/              # Páginas de autenticação
│   ├── acquiring/         # Página de adquirência
│   ├── banking/           # Página de banking
│   ├── cards/             # Página de cartões
│   └── page.tsx           # Página inicial
├── components/            # Componentes React reutilizáveis
│   ├── LandingPage/       # Componentes da landing page
│   ├── acquiring/         # Componentes de adquirência
│   ├── banking/           # Componentes de banking
│   ├── cards/             # Componentes de cartões
│   └── ui/                # Componentes base (Shadcn UI)
├── features/              # Funcionalidades por domínio
│   ├── transactions/      # Gestão de transações
│   ├── merchants/         # Gestão de comerciantes
│   └── reports/           # Relatórios
├── server/                # Lógica do servidor
│   ├── db/                # Configuração do banco
│   └── integrations/      # Integrações externas
└── lib/                   # Utilitários e configurações
```

## Funcionalidades Principais

### Portal de Adquirência (`/portal`)
- Dashboard com métricas
- Gestão de comerciantes
- Transações e liquidações
- Relatórios e exportações
- Antecipação de recebíveis
- Links de pagamento

### Website Institucional
- Página inicial com informações da empresa
- Seções: Banking, Adquirência, Cards & Credit
- Formulário de contato
- Informações sobre produtos e serviços

## Testes

### Executar Testes
```bash
# Atualmente não há testes configurados
# Para adicionar testes, considere:
# - Jest para testes unitários
# - Cypress ou Playwright para testes E2E
```

### Verificação Manual
1. **Build**: `npm run build` deve completar sem erros
2. **Desenvolvimento**: `npm run dev` deve iniciar sem erros
3. **Portal**: Acesse `/portal/dashboard` após autenticação
4. **Website**: Navegue pelas páginas principais

## Integrações Externas

### Dock API
- Sincronização de transações
- Gestão de comerciantes
- Processamento de pagamentos

### Clerk (Autenticação)
- Login/logout de usuários
- Gestão de sessões
- Proteção de rotas

### Resend (Email)
- Envio de emails do formulário de contato
- Notificações do sistema

### AWS S3
- Upload e armazenamento de arquivos
- Documentos e imagens

## Solução de Problemas

### Problemas Comuns

1. **Erro de build TypeScript**
   ```bash
   npm run lint
   npx tsc --noEmit
   ```

2. **Erro de conexão com banco**
   - Verifique `DATABASE_URL` no `.env.local`
   - Confirme se o PostgreSQL está rodando

3. **Erro de autenticação Clerk**
   - Verifique as chaves do Clerk no `.env.local`
   - Confirme se as URLs de callback estão corretas

4. **Erro "Session already exists"**
   - Limpe cookies do navegador
   - Verifique configuração do `IdleLogout`

### Logs e Debug
```bash
# Logs do desenvolvimento
npm run dev

# Verificar erros de build
npm run build 2>&1 | tee build.log
```

## Deployment

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outros Provedores
- Configure as variáveis de ambiente
- Execute `npm run build`
- Sirva os arquivos da pasta `.next`

## Contato e Suporte

Para dúvidas sobre o projeto:
- Repositório: https://github.com/ctoutbank/outbank-one
- Email: cto@outbank.com.br

## Notas Importantes

- Sempre execute `npm run build` antes de fazer deploy
- Mantenha as variáveis de ambiente seguras
- Use branches para novas funcionalidades
- Teste localmente antes de fazer push
