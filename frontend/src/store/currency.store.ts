import { defineStore } from 'pinia';
import type { ILoanApplication } from '@/interfaces/loan-application.interface';
import apiService from '@/services/api-service';
import { useToastStore } from './toast.store';
import { useSpinnerStore } from './spinner.store';

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currencies: [] as string[],
  }),
  actions: {
    async fetchCurrencies() {
      const toastStore = useToastStore();
      const spinnerStore = useSpinnerStore();

      spinnerStore.show();
      try {
        const response = await apiService.get<string[]>('/currencies');
        if (!response?.data?.length) {
          console.error('Received invalid response when fetching currencies', response);
          throw new Error('Received invalid response when fetching currencies');
        }
        this.currencies = response.data;
      } catch (error) {
        toastStore.show({ message: 'Failed to fetch currencies', type: 'failure' });
      } finally {
        spinnerStore.hide();
      }
    },
  },
});
