# Rastreamento de Progresso - Plano de Melhorias

Este documento rastreia a execução das tarefas definidas no `PLANO_DE_MELHORIAS.md`.

## ✅ 1. Fundamentos e Estabilidade

-   [x] **1.1. Correção de Vulnerabilidades de Segurança**
    -   [x] Auditar dependências com `npm audit`.
    -   [x] Substituir `xlsx` e `react-data-export` por `exceljs` para remover vulnerabilidades.
    -   [x] Rodar `npm audit fix --force` para corrigir as vulnerabilidades restantes.
    -   [x] Validar que o número de vulnerabilidades foi reduzido.

-   [x] **1.2. Resolução de Erros de Build e Linting**
    -   [x] Corrigir os erros de `exhaustive-deps` que causavam falhas no build.
    -   [x] Garantir que `npm run build` executa sem erros.

-   [ ] **1.3. Implantação de Testes Unitários e de Integração**
    -   [ ] Configurar Jest e React Testing Library.
    -   [ ] Escrever teste para um componente crítico (ex: `filter-form.tsx`).

## ⬜ 2. Otimização e Performance

-   [ ] **2.1. Otimização de Imagens**
    -   [ ] Substituir `<img>` por `<Image>` em todos os componentes.

-   [ ] **2.2. Refatoração de Componentes e Hooks**
    -   [ ] Identificar e refatorar componentes com renderizações excessivas.

## ⬜ 3. Arquitetura e Manutenibilidade

-   [ ] **3.1. Melhoria na Organização de Pastas**
    -   [ ] Propor e aplicar uma nova estrutura de pastas.

-   [ ] **3.2. Padronização de Configurações de Ambiente**
    -   [ ] Revisar e documentar as variáveis de ambiente.