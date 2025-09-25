import React from 'react';
import { render, screen } from '@testing-library/react';
import FilterForm from '../filter-form';
import { ReportFilterSchema } from '../schema';
import { ReportFilterParamDetail } from '../filter-Actions';
import { ReportTypeDD } from '../../server/reports';

jest.mock('../filter-Actions', () => ({
  getAllBrands: jest.fn().mockResolvedValue([]),
  getFilterFormData: jest.fn().mockResolvedValue({ reportType: 'VN' }),
  searchMerchants: jest.fn().mockResolvedValue([]),
  searchTerminals: jest.fn().mockResolvedValue([]),
  insertReportFilter: jest.fn().mockResolvedValue({}),
  updateReportFilter: jest.fn().mockResolvedValue({}),
}));

describe('FilterForm Component', () => {
  const mockFilter: ReportFilterSchema = {
    id: undefined,
    idReport: 1,
    idReportFilterParam: 1,
    value: '',
    dtinsert: new Date(),
    dtupdate: new Date(),
    typeName: 'Vendas',
  };

  const mockReportFilterParams: ReportFilterParamDetail[] = [
    { id: 1, name: 'Bandeira', type: 'VN', dtinsert: null, dtupdate: null, attributename: null },
    { id: 2, name: 'Data', type: 'VN', dtinsert: null, dtupdate: null, attributename: null },
    { id: 3, name: 'Status', type: 'AL', dtinsert: null, dtupdate: null, attributename: null },
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

    const labelElement = await screen.findByText('Parâmetro de Filtro');
    expect(labelElement).toBeInTheDocument();

    const selectTrigger = await screen.findByRole('combobox');
    expect(selectTrigger).toBeInTheDocument();
  });
});
