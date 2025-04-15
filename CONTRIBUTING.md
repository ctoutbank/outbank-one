# Guia de Contribuição

## Visão Geral

Este documento fornece diretrizes para contribuir com o projeto Outbank One. Por favor, leia atentamente antes de submeter qualquer pull request.

## Código de Conduta

- Seja respeitoso e profissional
- Mantenha discussões focadas no código
- Aceite críticas construtivas
- Ajude outros contribuidores

## Processo de Desenvolvimento

### 1. Configuração do Ambiente

1. Fork o repositório
2. Clone seu fork:
   ```bash
   git clone https://github.com/seu-usuario/outbank-one.git
   ```
3. Instale as dependências:
   ```bash
   yarn install
   ```
4. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```

### 2. Fluxo de Trabalho

1. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/nome-da-feature
   ```
2. Faça suas alterações
3. Execute os testes:
   ```bash
   yarn test
   ```
4. Verifique os tipos:
   ```bash
   yarn type-check
   ```
5. Execute o linter:
   ```bash
   yarn lint
   ```
6. Commit suas alterações:
   ```bash
   git commit -m "feat: descrição da feature"
   ```
7. Push para sua branch:
   ```bash
   git push origin feature/nome-da-feature
   ```
8. Abra um pull request

## Padrões de Código

### TypeScript

- Use TypeScript para todo o código
- Prefira interfaces sobre types
- Evite any
- Use tipos explícitos para retornos de função

### React

- Use componentes funcionais
- Use hooks personalizados para lógica reutilizável
- Implemente React Server Components quando possível
- Use Suspense para loading states

### Estilização

- Use Tailwind CSS para estilos
- Siga o design system do Shadcn UI
- Mantenha consistência visual

### Nomenclatura

- Use camelCase para variáveis e funções
- Use PascalCase para componentes
- Use kebab-case para arquivos
- Use nomes descritivos e significativos

## Commits

Use o formato convencional de commits:

- `feat:` para novas features
- `fix:` para correções de bugs
- `docs:` para documentação
- `style:` para formatação
- `refactor:` para refatoração
- `test:` para testes
- `chore:` para tarefas de manutenção

## Pull Requests

1. Descreva claramente as mudanças
2. Inclua testes quando apropriado
3. Atualize a documentação
4. Verifique se os testes passam
5. Solicite revisão de pelo menos um mantenedor

## Revisão de Código

- Seja construtivo
- Foque no código, não na pessoa
- Sugira melhorias específicas
- Verifique se o código segue os padrões

## Testes

- Escreva testes unitários para novas features
- Mantenha a cobertura de testes alta
- Teste casos de erro e edge cases
- Use mocks para dependências externas

## Documentação

- Atualize a documentação quando necessário
- Use comentários para código complexo
- Documente APIs e integrações
- Mantenha o README atualizado

## Dúvidas?

Se tiver dúvidas, abra uma issue ou entre em contato com os mantenedores.

## Estrutura do Projeto

### Banco de Dados

Todas as importações relacionadas ao banco de dados devem ser feitas através do arquivo de barril em `@/lib/db`:

```typescript
import { db, terminals, customers /* outras tabelas */ } from "@/lib/db";
```

Não importe diretamente do schema do Drizzle ou de outras localizações para manter a consistência.

### Organização de Features

Cada feature deve seguir a seguinte estrutura:

```
src/features/[nome-da-feature]/
  ├── _components/      # Componentes específicos da feature
  ├── serverActions/    # Ações do servidor
  └── types/           # Tipos e interfaces
```

### Convenções de Importação

- Use sempre importações absolutas com o alias `@/`
- Evite importações relativas com `../`
- Mantenha as importações organizadas por tipo:
  1. Importações do React/Next.js
  2. Importações de componentes
  3. Importações de utils/helpers
  4. Importações de tipos
