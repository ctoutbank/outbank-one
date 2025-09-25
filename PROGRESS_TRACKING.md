# Acompanhamento de Progresso e Diretrizes - Outbank One

Este documento é a fonte tática para o trabalho diário. Use-o para escolher sua próxima tarefa e para registrar o progresso.

## Diretrizes de Trabalho

1.  **Uma Tarefa por Vez:** Cada desenvolvedor deve se atribuir a apenas uma tarefa por vez para manter o foco.
2.  **Crie uma Branch:** Sempre crie uma nova branch a partir da `main` para sua tarefa. Ex: `feat/setup-jest`.
3.  **Marque ao Concluir:** Ao finalizar e ter sua Pull Request (PR) aprovada e integrada, marque o checkbox: `[x]`.
4.  **Adicione um Comentário:** Após marcar, adicione um breve comentário, a data e o link da PR. Ex: `- Concluído em 25/09/2025, veja a PR #123`.
5.  **Mantenha a `main` Limpa:** Nunca faça commits diretamente na `main`.

---

## Lista de Tarefas

### Fase 1: Fundação e Correções Críticas

#### Backend
- [x] **Tarefa 1.1 (Segurança):** Corrigir vulnerabilidades de baixo/médio impacto automaticamente.
  - *Comentário: Concluído em 24/09/2025. O comando `npm audit fix --force` foi executado com sucesso após a remoção dos pacotes bloqueadores (`xlsx`, `xlsx-style`, `react-data-export`). O número de vulnerabilidades foi reduzido de 15 para 4. As restantes estão relacionadas ao `drizzle-kit` e serão tratadas em uma tarefa futura.*
- [ ] **Tarefa 1.2 (Segurança):** Atualizar a dependência `next` para a versão mais recente e estável para corrigir vulnerabilidades.
  - *Comentário:*
- [ ] **Tarefa 1.3 (Segurança):** Investigar e substituir/atualizar a dependência `xlsx` que possui vulnerabilidade crítica sem correção automática.
  - *Comentário:*

#### Frontend
- [x] **Tarefa 1.4 (Qualidade):** Corrigir todos os avisos de `react-hooks/exhaustive-deps` no projeto.
  - *Comentário: Concluído em 24/09/2025. Todos os avisos de dependências de hooks foram corrigidos usando `useCallback`, movendo constantes para fora dos componentes ou removendo dependências desnecessárias. Isso melhora a estabilidade e a performance do frontend.*
- [ ] **Tarefa 1.5 (Qualidade):** Atualizar pacotes depreciados como `eslint`, `rimraf`, etc.
  - *Comentário:*

### Fase 2: Performance e Cultura de Testes

#### Backend
- [ ] **Tarefa 2.1 (Testes):** Instalar e configurar o Jest e o React Testing Library para testes unitários/integração.
  - *Comentário:*
- [ ] **Tarefa 2.2 (Testes):** Instalar e configurar o Playwright para testes de ponta-a-ponta (E2E).
  - *Comentário:*
- [ ] **Tarefa 2.3 (Testes):** Escrever o primeiro teste de backend para uma função utilitária em `src/lib`.
  - *Comentário:*

#### Frontend
- [ ] **Tarefa 2.4 (Performance):** Substituir todas as instâncias de `<img>` pelo componente `<Image>` do Next.js.
  - *Comentário:*
- [ ] **Tarefa 2.5 (Testes):** Escrever o primeiro teste de componente para um botão ou input em `src/components/ui`.
  - *Comentário:*
- [ ] **Tarefa 2.6 (Testes):** Escrever o primeiro teste E2E com Playwright para o fluxo de login.
  - *Comentário:*

### Fase 3: Refatoração e Excelência Técnica

#### Frontend
- [ ] **Tarefa 3.1 (Refatoração):** Criar o hook customizado `useClickOutside`.
  - *Comentário:*
- [ ] **Tarefa 3.2 (Refatoração):** Refatorar os componentes de filtro para utilizarem o novo hook `useClickOutside`.
  - *Comentário:*
- [ ] **Tarefa 3.3 (Refatoração):** Criar o componente abstrato `OptimizedImage`.
  - *Comentário:*
- [ ] **Tarefa 3.4 (Refatoração):** Refatorar o uso de imagens na aplicação para usar o `OptimizedImage`.
  - *Comentário:*
- [ ] **Tarefa 3.5 (Testes):** Aumentar a cobertura de testes para os principais componentes das `features`.
  - *Comentário:*