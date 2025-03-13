<script lang="ts" setup>
import { computed } from 'vue';
import { useSpinnerStore } from '@/store/spinner.store';

const spinnerStore = useSpinnerStore();
const isLoading = computed(() => spinnerStore.isLoading);
</script>

<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
  </div>
</template>
