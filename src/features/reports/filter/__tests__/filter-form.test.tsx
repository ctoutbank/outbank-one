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