import { defineStore } from 'pinia';

export const useSpinnerStore = defineStore('spinner', {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    show() {
      this.isLoading = true;
    },
    hide() {
      this.isLoading = false;
    },
  },
});
