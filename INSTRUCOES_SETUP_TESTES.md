# Guia de Configuração do Ambiente de Testes com Jest

Este documento fornece um guia passo a passo para configurar o ambiente de testes (Jest e React Testing Library) para este projeto do zero.

---

### Passo 1: Instalar Dependências de Desenvolvimento

Execute o seguinte comando no terminal para instalar todas as dependências necessárias para os testes:

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest ts-jest ts-node
```

### Passo 2: Criar Arquivos de Configuração do Jest

Dois arquivos de configuração precisam ser criados na raiz do projeto.

**1. Crie o arquivo `jest.config.ts` com o seguinte conteúdo:**

```typescript
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Fornece o caminho para o seu aplicativo Next.js para carregar next.config.js e arquivos .env em seu ambiente de teste
  dir: './',
});

// Adicione qualquer configuração personalizada a ser passada para o Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Adicione mais opções de configuração antes de cada teste ser executado
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Lidar com aliases de módulo (isso será configurado automaticamente para você em breve)
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/features/(.*)$': '<rootDir>/src/features/$1',
  },
  preset: 'ts-jest',
};

// createJestConfig é exportado desta forma para garantir que next/jest possa carregar a configuração do Next.js que é assíncrona
export default createJestConfig(config);
```

**2. Crie o arquivo `jest.setup.ts` com o seguinte conteúdo:**

```typescript
// Opcional: configure ou configure um framework de teste antes de cada teste.
// Se você excluir este arquivo, remova `setupFilesAfterEnv` de `jest.config.ts`

// Usado para __tests__/testing-library.js
// Saiba mais: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
```

### Passo 3: Adicionar Script de Teste ao package.json

Abra o arquivo `package.json` e adicione o script `test` na seção `scripts`:

```json
{
  "name": "outbank-one",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "db:generate": "drizzle-kit generate",
    // ... outros scripts
  },
  // ... resto do arquivo
}
```

### Passo 4: Criar os Primeiros Arquivos de Teste

**1. Teste do Componente Badge:**

- Crie o diretório: `src/components/ui/__tests__`
- Dentro dele, crie o arquivo `badge.test.tsx` com o seguinte conteúdo:

```typescript
import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge Component', () => {
  it('should render the badge with the provided text', () => {
    render(<Badge>Test Badge</Badge>);
    const badgeElement = screen.getByText('Test Badge');
    expect(badgeElement).toBeInTheDocument();
  });
});
```

**2. Teste do Componente FilterForm:**

- Crie o diretório: `src/features/reports/filter/__tests__`
- Dentro dele, crie o arquivo `filter-form.test.tsx` com o seguinte conteúdo:

```typescript
import { render, screen } from '@testing-library/react';
import FilterForm from '../filter-form';
import { ReportFilterSchema } from '../schema';
import { ReportFilterParamDetail } from '../filter-Actions';
import { ReportTypeDD } from '../../server/reports';

// Mock das actions para evitar chamadas reais ao servidor durante os testes
jest.mock('../filter-Actions', () => ({
  getAllBrands: jest.fn().mockResolvedValue([]),
  getFilterFormData: jest.fn().mockResolvedValue({ reportType: 'VN' }),
  searchMerchants: jest.fn().mockResolvedValue([]),
  searchTerminals: jest.fn().mockResolvedValue([]),
  insertReportFilter: jest.fn().mockResolvedValue({}),
  updateReportFilter: jest.fn().mockResolvedValue({}),
}));

describe('FilterForm Component', () => {
  // Define props mockadas para o teste
  const mockFilter: ReportFilterSchema = {
    id: undefined,
    idReport: 1,
    idReportFilterParam: 1,
    value: '',
    dtinsert: new Date().toISOString(),
    dtupdate: new Date().toISOString(),
    typeName: 'Vendas',
  };

  const mockReportFilterParams: ReportFilterParamDetail[] = [
    { id: 1, name: 'Bandeira', type: 'VN' },
    { id: 2, name: 'Data', type: 'VN' },
    { id: 3, name: 'Status', type: 'AL' },
  ];

  const mockReportTypeDD: ReportTypeDD[] = [
    { code: 'VN', name: 'Vendas' },
    { code: 'AL', name: 'Agenda dos Logistas' },
  ];

  const mockCloseDialog = jest.fn();

  it('should render the form with initial elements', async () => {
    render(
      <FilterForm
        filter={mockFilter}
        reportId={1}
        reportFilterParams={mockReportFilterParams}
        closeDialog={mockCloseDialog}
        reportTypeDD={mockReportTypeDD}
      />
    );

    // Aguarda a renderização de elementos assíncronos (efeitos, etc.)
    // e verifica se o label principal é renderizado
    const labelElement = await screen.findByText('Parâmetro de Filtro');
    expect(labelElement).toBeInTheDocument();

    // Verifica se o dropdown de seleção de parâmetro está presente
    const selectTrigger = await screen.findByRole('combobox');
    expect(selectTrigger).toBeInTheDocument();
  });
});
```

### Passo 5: Verificar a Instalação

Após completar todos os passos acima, execute o seguinte comando para rodar os testes e verificar se a configuração está correta:

```bash
npm test
```

A saída esperada é que todos os testes passem com sucesso. A configuração do ambiente de testes está concluída.
