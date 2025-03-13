import { defineStore } from 'pinia';
import type { ILoanApplication } from '@/interfaces/loan-application.interface';
import apiService from '@/services/api-service';
import type { LoanApplicationSortableField } from '@/types/loan-application-sortable-field.type';
import type { DocsWithType } from '@/types/docs-with-total.type';

export const useLoanApplicationStore = defineStore('loanApplication', {
  state: () => ({
    loanApplications: [] as ILoanApplication[],
    totalDocs: 0,
    isLoading: false,
    error: null as string | null,
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
      this.isLoading = true;
      this.error = null;

      try {
        const response = await apiService.get<DocsWithType<ILoanApplication>>('/loan-applications', { params });
        this.loanApplications = response.data.docs;
        this.totalDocs = response.data.total;
      } catch (error) {
        this.error = 'Failed to fetch loan applications';
      } finally {
        this.isLoading = false;
      }
    },
    async submitLoanApplication(loanApplication: Partial<ILoanApplication>) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await apiService.post<ILoanApplication>('/loan-applications', loanApplication);
        this.submittedLoanApplication = response.data;
        this.loanApplications.push(response.data);
      } catch (error) {
        this.error = 'Failed to submit loan application';
      } finally {
        this.isLoading = false;
      }
    },
  },
});
