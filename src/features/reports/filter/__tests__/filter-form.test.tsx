import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterForm from '../filter-form';
import { useFormState } from 'react-dom';
import { getAllBrands, getFilterFormData } from '../filter-Actions';
import userEvent from '@testing-library/user-event';

// Mocking external dependencies
jest.mock('../filter-Actions', () => ({
  getAllBrands: jest.fn(),
  getFilterFormData: jest.fn(),
}));

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock data for the component props
const mockReportTypeDD = [
  { code: 'VN', name: 'Vendas' },
  { code: 'AL', name: 'Agenda dos logistas' },
];

const mockReportFilterParams = [
  { id: 1, name: 'Data', type: 'VN' },
  { id: 2, name: 'Bandeira', type: 'VN' },
  { id: 3, name: 'Status', type: 'AL' },
];

describe('FilterForm', () => {
  beforeEach(() => {
    // Reset and provide mock implementations for each test
    (getAllBrands as jest.Mock).mockResolvedValue([
        { code: 'MASTERCARD', name: 'Mastercard' },
        { code: 'VISA', name: 'Visa' },
    ]);
    (getFilterFormData as jest.Mock).mockResolvedValue({
      reportType: 'VN',
    });
    (useFormState as jest.Mock).mockReturnValue([
      { success: false, message: '', errors: {} },
      jest.fn(),
    ]);
  });

  it('should display the correct input fields when a filter parameter is selected', async () => {
    const user = userEvent.setup();
    render(
      <FilterForm
        filter={{}} // empty filter for a new form
        reportId={1}
        reportFilterParams={mockReportFilterParams}
        closeDialog={jest.fn()}
        reportTypeDD={mockReportTypeDD}
      />
    );

    // 1. Wait for the loading indicator to disappear.
    await waitFor(() => {
      expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
    });

    // 2. Find and click the parameter dropdown trigger.
    const filterParamTrigger = screen.getByLabelText(/Parâmetro de Filtro/i);
    await user.click(filterParamTrigger);

    // 3. Find the "Bandeira" option by its role and name and click it.
    const bandeiraOption = await screen.findByRole('option', { name: /Bandeira/i });
    await user.click(bandeiraOption);

    // 4. Assert that the conditional UI for selecting brands is now visible.
    await waitFor(() => {
      expect(screen.getByText(/Selecione as Bandeiras/i)).toBeInTheDocument();
      expect(screen.getByLabelText('Mastercard')).toBeInTheDocument();
    });

    // 5. Assert that UI for other parameter types is NOT visible.
    expect(screen.queryByLabelText(/Selecione os Status/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Data Inicial/i)).not.toBeInTheDocument();
  });
});