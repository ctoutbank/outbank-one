# Documentação dos Cron Jobs

## Visão Geral

O sistema utiliza cron jobs para sincronizar dados com a Dock e outros serviços externos. Os jobs são executados diariamente e são responsáveis por manter os dados atualizados.

## Lista de Cron Jobs

### 1. Sincronização de Pagamentos

- **Endpoint**: `/api/cron/sync-payouts`
- **Frequência**: Diária
- **Responsabilidades**:
  - Sincronizar pagamentos
  - Sincronizar antecipações
  - Sincronizar liquidações
- **Dependências**: Dock API
- **Logs**: Registra início e fim da execução

### 2. Sincronização de Comerciantes

- **Endpoint**: `/api/cron/sync-merchants`
- **Frequência**: Diária
- **Responsabilidades**:
  - Sincronizar dados cadastrais
  - Sincronizar preços
  - Sincronizar grupos de preços
- **Dependências**: Dock API
- **Logs**: Registra início e fim da execução

### 3. Sincronização de Transações

- **Endpoint**: `/api/cron/sync-transactions`
- **Frequência**: Diária
- **Responsabilidades**:
  - Sincronizar transações
  - Sincronizar terminais
- **Dependências**: Dock API
- **Logs**: Registra início e fim da execução

### 4. Sincronização de Links de Pagamento

- **Endpoint**: `/api/cron/sync-paymentLinks`
- **Frequência**: Diária
- **Responsabilidades**:
  - Sincronizar links de pagamento
  - Atualizar status dos links
- **Dependências**: Dock API
- **Logs**: Registra início e fim da execução

### 5. Relatórios

- **Agendamento**: `/api/cron/report-schedule`
- **Execução**: `/api/cron/report-execution`
- **Frequência**: Diária
- **Responsabilidades**:
  - Agendar geração de relatórios
  - Executar geração de relatórios
  - Exportar para Excel e PDF
- **Dependências**: Nenhuma
- **Logs**: Registra início e fim da execução

## Monitoramento

- Todos os cron jobs registram logs de execução
- Erros são registrados e notificados
- Status de execução é armazenado no banco de dados

## Tratamento de Erros

- Tentativas de retry em caso de falha
- Notificações em caso de falha persistente
- Logs detalhados para debugging

## Próximas Melhorias

1. Implementar sistema de retry com backoff exponencial
2. Adicionar métricas de performance
3. Implementar monitoramento em tempo real
4. Adicionar testes automatizados
5. Melhorar logging e alertas
