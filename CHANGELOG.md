# Changelog - Outbank One

Este arquivo documenta todas as alterações realizadas no projeto Outbank One durante as sessões de desenvolvimento.

## Sessão Atual - Setembro 2025

### 🐛 Correções de Bugs

#### Dashboard Portal - Erro "Algo deu errado!"
- **Problema**: Erro de renderização no servidor ao acessar `/portal/dashboard`
- **Causa**: Inconsistência de tipos na função `getTotalMerchants`
- **Solução**: Alterado retorno de `0` para `[{ total: 0 }]` para manter consistência
- **Arquivo**: `src/features/transactions/serverActions/transaction.ts`
- **PR**: #122

### 📝 Documentação e Setup

#### Preparação para Jules
- **Criado**: `agents.md` - Guia completo de configuração
- **Criado**: `install.sh` - Script de instalação automatizada
- **Criado**: `CHANGELOG.md` - Este arquivo de histórico

## Sessões Anteriores - Histórico Completo

### 🎨 Melhorias Visuais e UX

#### Formulário de Contato
- **Correção**: Erro JavaScript após envio do formulário
- **Melhoria**: Adicionada mensagem de sucesso
- **Melhoria**: Refresh automático da página após envio
- **PR**: #110

#### Template de Email
- **Atualização**: Logo branca do Outbank no cabeçalho
- **Correção**: Textos atualizados para "Outbank Cloud"
- **Melhoria**: Cabeçalho preto com logo branca
- **Remoção**: Botão "Responder por Email"
- **Remoção**: Aspas desnecessárias no texto
- **PRs**: #111, #113, #116, #118

#### Cores e Hover Effects
- **Alteração**: Cor de hover de `#cfc8b8` para `#c79d61`
- **Reversão**: Cor de hover de volta para `#cfc8b8`
- **Aplicação**: Consistência em todo o site
- **PRs**: #113, #117

### 📄 Conteúdo e Textos

#### Página Inicial
- **Seção Números**: Alterado para "NÚMEROS DO CUSTODIANTE"
- **Banking Card**: Adicionado "Provider – Dock"
- **Link BACEN**: Texto atualizado para "Acesse o BACEN e digite Dock em Instituição"
- **Globe Component**: Reabilitado após correção
- **Header**: Imagem atualizada e flip horizontal aplicado
- **PRs**: #112, #115, #118

#### Página Banking
- **Agilidade**: Texto otimizado removendo "da empresa"
- **Header**: Nova imagem `header_banking.jpg`
- **PRs**: #112, #118

#### Página Adquirência
- **Benefícios**: Texto atualizado para "Gestão da adquirência — portal BackOffice personalizado"
- **Descrição**: Melhorado texto explicativo do portal
- **PR**: #112

#### Página Cards & Credit
- **Títulos**: Alternância entre "Licenciamento de Cartões" e "Bandeiras e Autorizações"
- **Textos**: Múltiplas otimizações nos cards de produtos
- **Flags**: Tradução para "Confira a disponibilidade da bandeira por solução"
- **Cards**: Textos mais concisos e impactantes
- **PRs**: #112, #114, #116

### 🔐 Portal de Adquirência

#### Autenticação e Sessão
- **Timeout**: Implementado logout automático após 2 minutos de inatividade
- **Componente**: `IdleLogout` configurado para portal
- **Erro "Session already exists"**: Resolvido com timeout
- **PRs**: #119

#### Interface de Login
- **Imagem**: Substituída por `bg_login.jpg` com logo Outbank
- **Layout**: Melhorada experiência visual de login
- **Múltiplas atualizações**: Diferentes versões da imagem conforme feedback
- **PRs**: #119, #121

#### Navegação
- **Botão Portal**: Link atualizado para `https://bancoprisma.outbank.cloud/auth/sign-in`
- **Localização**: Menu superior direito (desktop e mobile)
- **PR**: #120

### 🖼️ Assets e Imagens

#### Headers
- **Página Inicial**: `header_outbank.jpg`
- **Página Banking**: `header_banking.jpg`
- **Flip**: Aplicado flip horizontal nas imagens
- **PR**: #118

#### Logos e Ícones
- **Email**: Logo Outbank atualizada
- **Visa**: Tamanho dobrado na seção parceiros
- **Acquiring**: Logos centralizadas (Visa, Mastercard, Elo)
- **PRs**: #115, #118

#### Componentes Visuais
- **Globe**: Reabilitado após correção de erro
- **Ícones**: Adicionado ícone de globo com link para BACEN
- **PR**: #112

### 🏗️ Estrutura e Arquitetura

#### Repositórios
- **Principal**: `ctoutbank/outbank-one` (monolítico Next.js)
- **Portal**: Integrado em `/src/app/portal/`
- **Separado**: `ctoutbank/portal-outbank` (descontinuado)

#### Tecnologias
- **Frontend**: Next.js 14, TypeScript, React
- **UI**: Shadcn UI, Tailwind CSS
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Auth**: Clerk
- **Email**: Resend
- **Storage**: AWS S3

### 🔧 Configurações e Environment

#### Variáveis de Ambiente
- **Dock API**: URLs e chaves de integração
- **Database**: PostgreSQL connection string
- **Clerk**: Chaves de autenticação
- **AWS**: Credenciais para S3
- **Resend**: API key para emails

#### Scripts e Automação
- **Build**: `npm run build`
- **Dev**: `npm run dev`
- **Lint**: `npm run lint`
- **Deploy**: Vercel automático

### 📊 Funcionalidades do Portal

#### Dashboard
- **Métricas**: Cards com totais de merchants, transações, etc.
- **Gráficos**: Visualizações de dados financeiros
- **Erro Corrigido**: "Algo deu errado!" resolvido

#### Gestão
- **Merchants**: CRUD completo de comerciantes
- **Transactions**: Visualização e filtros
- **Reports**: Geração e exportação
- **Settlements**: Liquidações financeiras

### 🚀 Deploy e CI/CD

#### Vercel
- **Automático**: Deploy a cada push na main
- **Preview**: URLs de preview para PRs
- **Environment**: Variáveis configuradas

#### GitHub Actions
- **Lint**: Verificação automática de código
- **Build**: Teste de build em PRs
- **TypeScript**: Verificação de tipos

### 📈 Melhorias Futuras Identificadas

#### Performance
- **Otimização**: Componentes e queries
- **Cache**: Implementação de cache estratégico
- **Bundle**: Análise e otimização do bundle

#### Funcionalidades
- **Testes**: Implementação de testes automatizados
- **Monitoring**: Logs e métricas de produção
- **Security**: Auditoria de segurança

#### UX/UI
- **Mobile**: Melhorias na responsividade
- **Acessibilidade**: Conformidade WCAG
- **Loading**: Estados de carregamento

## Estatísticas da Sessão

- **PRs Criados**: 14
- **PRs Merged**: 13
- **Arquivos Modificados**: 45+
- **Linhas Alteradas**: 200+
- **Bugs Corrigidos**: 3 principais
- **Funcionalidades Adicionadas**: 5+

## Próximos Passos Recomendados

1. **Testes**: Implementar testes unitários e E2E
2. **Monitoring**: Adicionar logs e métricas
3. **Performance**: Otimizar queries e componentes
4. **Security**: Auditoria de segurança
5. **Documentation**: Expandir documentação técnica

---

*Este changelog é mantido automaticamente e reflete todas as alterações significativas no projeto.*
