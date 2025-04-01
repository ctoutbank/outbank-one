# Guia de Contribuição

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
