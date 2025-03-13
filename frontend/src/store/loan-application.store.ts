import { defineStore } from 'pinia';
import type { ILoanApplication } from '@/interfaces/loan-application.interface';
import apiService from '@/services/api-service';
import type { LoanApplicationSortableField } from '@/types/loan-application-sortable-field.type';
import type { DocsWithType } from '@/types/docs-with-total.type';
import { useToastStore } from './toast.store';
import { useSpinnerStore } from './spinner.store';

export const useLoanApplicationStore = defineStore('loanApplication', {
  state: () => ({
    loanApplications: [] as ILoanApplication[],
    totalDocs: 0,
    submittedLoanApplication: undefined as ILoanApplication | undefined,
  }),
  actions: {
    async fetchLoanApplications(
      params: {
        sortBy?: LoanApplicationSortableField;
        order?: 'asc' | 'desc';
        skip?: number;
        take?: number;
      } = {},
    ) {
      const toastStore = useToastStore();
      const spinnerStore = useSpinnerStore();

      spinnerStore.show();
      try {
        const response = await apiService.get<DocsWithType<ILoanApplication>>('/loan-applications', { params });
        if (!response?.data?.docs || !response.data.total) {
          console.error('Received invalid response when fetching loan application', response);
          throw new Error('Received invalid response when fetching oan application');
        }
        this.loanApplications = response.data.docs;
        this.totalDocs = response.data.total;
      } catch (error) {
        toastStore.show({ message: 'Failed to fetch loan applications', type: 'failure' });
      } finally {
        spinnerStore.hide();
      }
    },
    async submitLoanApplication(loanApplication: Partial<ILoanApplication>) {
      const toastStore = useToastStore();
      const spinnerStore = useSpinnerStore();

      spinnerStore.show();
      try {
        const response = await apiService.post<ILoanApplication>('/loan-applications', loanApplication);
        if (!response?.data?.id) {
          console.error('Received invalid response when submitting loan application', response);
          throw new Error('Received invalid response when submitting loan application');
        }
        toastStore.show({ message: 'Loan application submitted successfully!', type: 'success' });
        this.submittedLoanApplication = response.data;
        this.loanApplications.push(response.data);
      } catch (error) {
        toastStore.show({ message: 'Failed to submit loan application', type: 'failure' });
      } finally {
        spinnerStore.hide();
      }
    },
  },
});
