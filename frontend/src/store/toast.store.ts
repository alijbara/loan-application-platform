import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: '',
    isVisible: false,
    type: 'success' as 'success' | 'failure',
  }),
  actions: {
    show(params: { message: string; duration?: number; type?: 'success' | 'failure' }) {
      const { message, duration, type } = params;
      this.message = message;
      this.type = type || 'failure';
      this.isVisible = true;
      setTimeout(() => {
        this.isVisible = false;
      }, duration || 10000);
    },
    hide() {
      this.isVisible = false;
    },
  },
});
