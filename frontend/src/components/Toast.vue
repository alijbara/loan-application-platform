<script lang="ts" setup>
import { useToastStore } from '@/store/toast.store';
import { computed } from 'vue';

const toastStore = useToastStore();
const isVisible = computed(() => toastStore.isVisible);
const message = computed(() => toastStore.message);
const type = computed(() => toastStore.type);

const closeToast = () => (toastStore.isVisible = false);
</script>

<template>
  <transition name="fade-slide">
    <div
      v-if="isVisible"
      :class="[
        'fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center justify-between gap-4 transition-all duration-300 ease-in-out',
        type === 'success' ? 'bg-emerald-900' : 'bg-red-900',
      ]"
    >
      <span>{{ message }}</span>
      <button @click="closeToast" class="text-white hover:text-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </transition>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
