# Documentação do Projeto Outbank One

## Visão Geral

O Outbank One é uma plataforma de gestão financeira e de pagamentos que integra diversos serviços como:

- Gestão de comerciantes
- Processamento de transações
- Geração de links de pagamento
- Antecipação de recebíveis
- Liquidações
- Relatórios e exportação de dados

## Estrutura do Projeto

### Frontend

- Next.js 14 com App Router
- TypeScript
- Shadcn UI e Tailwind CSS
- Componentes React Server e Client

### Backend

- API Routes do Next.js
- Drizzle ORM para banco de dados
- Integrações com Dock e outros serviços

### Banco de Dados

- PostgreSQL
- Schema definido em `drizzle/schema.ts`
- Relações definidas em `drizzle/relations.ts`

## Cron Jobs e Sincronizações

### Sincronização de Pagamentos

- **Frequência**: Diária
- **Responsável**: `src/app/api/cron/sync-payouts/route.ts`
- **Integração**: Dock
- **Dados sincronizados**: Pagamentos, antecipações e liquidações

### Sincronização de Comerciantes

- **Frequência**: Diária
- **Responsável**: `src/app/api/cron/sync-merchants/route.ts`
- **Integração**: Dock
- **Dados sincronizados**: Dados cadastrais, preços e grupos de preços

### Sincronização de Transações

- **Frequência**: Diária
- **Responsável**: `src/app/api/cron/sync-transactions/route.ts`
- **Integração**: Dock
- **Dados sincronizados**: Transações e terminais

### Sincronização de Links de Pagamento

- **Frequência**: Diária
- **Responsável**: `src/app/api/cron/sync-paymentLinks/route.ts`
- **Integração**: Dock
- **Dados sincronizados**: Links de pagamento e status

### Relatórios

- **Agendamento**: `src/app/api/cron/report-schedule/route.ts`
- **Execução**: `src/app/api/cron/report-execution/route.ts`
- **Formatos**: Excel e PDF

## Estrutura de Diretórios

### `/src/app`

- **/api**: Endpoints da API
- **/portal**: Interface administrativa
- **/auth**: Autenticação
- **/dashboard**: Dashboard principal
- **/acquiring**: Módulo de adquirente
- **/banking**: Módulo bancário
- **/cards**: Gestão de cartões

### `/src/server`

- **/integrations**: Integrações com serviços externos
- **/db**: Configuração do banco de dados

### `/src/components`

- Componentes reutilizáveis
- Organização por funcionalidade

## Melhores Práticas e Sugestões

### 1. Organização do Código

- Implementar barrel exports (index.ts) para melhor organização
- Criar diretórios específicos para hooks e utilitários
- Separar lógica de negócio em serviços

### 2. Performance

- Implementar cache em endpoints críticos
- Otimizar queries do banco de dados
- Utilizar React Server Components quando possível

### 3. Segurança

- Implementar rate limiting em endpoints públicos
- Adicionar validação de entrada em todos os endpoints
- Revisar permissões e autenticação

### 4. Monitoramento

- Implementar logging centralizado
- Adicionar métricas de performance
- Monitorar erros e exceções

### 5. Testes

- Implementar testes unitários
- Adicionar testes de integração
- Criar testes automatizados para cron jobs

### 6. Documentação

- Manter documentação atualizada
- Adicionar comentários em código complexo
- Documentar APIs e integrações

### 7. CI/CD

- Implementar pipelines de deploy
- Adicionar verificações de qualidade de código
- Automatizar testes e builds

## Próximos Passos

1. Implementar sistema de monitoramento
2. Adicionar testes automatizados
3. Otimizar performance de queries
4. Melhorar documentação de APIs
5. Implementar cache em endpoints críticos
