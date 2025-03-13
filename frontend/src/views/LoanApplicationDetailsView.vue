<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useLoanApplicationStore } from '@/store/loan-application-store';
import { useRoute, useRouter } from 'vue-router';
import { useSpinnerStore } from '@/store/spinner.store';
import { useToastStore } from '@/store/toast.store';

const route = useRoute();
const router = useRouter();

// Stores
const loanApplicationStore = useLoanApplicationStore();
const toastStore = useToastStore();
const spinnerStore = useSpinnerStore();

// Get loan application from store
const loanApplication = computed(() => loanApplicationStore.loanApplications.find((l) => l.id === route.params.id));

// Show spinner when loading
const isLoading = computed(() => loanApplicationStore.isLoading);
watch(isLoading, (newValue) => (newValue ? spinnerStore.show() : spinnerStore.hide()));

// Show error toast on error
const errorMessage = computed(() => loanApplicationStore.error);
watch(errorMessage, (newValue) => {
  if (newValue) {
    toastStore.show({ message: newValue, type: 'failure' });
  }
});

// Fetch again if loan application not in store (on reload)
onMounted(() => {
  if (!loanApplication.value) loanApplicationStore.fetchLoanApplications();
});
</script>

<template>
  <div class="grow md:px-16 max-w-4xl mx-auto p-6 h-[calc(100vh-60px)] dark:text-gray-100">
    <section class="grow md:px-16 max-w-4xl mx-auto dark:text-gray-100">
      <h2 class="text-3xl text-center text-white font-semibold mb-6">Loan Application Details</h2>
      <div v-if="loanApplication" class="space-y-4 bg-gray-800 p-4 br-2 rounded-lg">
        <button
          @click="router.back()"
          class="absolute mx-4 mt-1 text-white bg-transparent rounded-full hover:bg-gray-700 transition-colors"
        >
          <span class="text-xl">←</span>
        </button>
        <div class="flex space-x-8 mt-4">
          <div class="w-1/3 text-right font-semibold">Name:</div>
          <div class="w-2/3">{{ loanApplication.name }}</div>
        </div>
        <div class="flex space-x-8">
          <div class="w-1/3 text-right font-semibold">Loan Amount:</div>
          <div class="w-2/3">{{ loanApplication.loanAmount }} {{ loanApplication.currency }}</div>
        </div>
        <div class="flex space-x-8">
          <div class="w-1/3 text-right font-semibold">Loan Amount (GBP):</div>
          <div class="w-2/3">{{ loanApplication.convertedLoanAmount.GBP }} GBP</div>
        </div>
        <div class="flex space-x-8">
          <div class="w-1/3 text-right font-semibold">Term:</div>
          <div class="w-2/3">{{ loanApplication.loanTerm }} months</div>
        </div>
        <div class="flex space-x-8 mb-4">
          <div class="w-1/3 text-right font-semibold">Submission Date:</div>
          <div class="w-2/3">{{ new Date(loanApplication.submissionDate).toLocaleDateString() }}</div>
        </div>
      </div>
      <h3 v-else class="text-xl text-center text-white font-semibold mb-6">Not Found</h3>
    </section>
  </div>
</template>
