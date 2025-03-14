<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useLoanApplicationStore } from '@/store/loan-application.store';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Stores
const loanApplicationStore = useLoanApplicationStore();

// Get loan application from store
const loanApplication = computed(() => loanApplicationStore.loanApplications.find((l) => l.id === route.params.id));

// Fetch again if loan application not in store (on reload)
onMounted(() => {
  if (!loanApplication.value) loanApplicationStore.fetchLoanApplications();
});

// Format currency
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date
const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};
</script>

<template>
  <div class="w-full max-w-4xl mx-auto p-4 sm:p-6 min-h-[calc(100vh-60px)] dark:text-gray-100">
    <h2 class="text-2xl sm:text-3xl text-center font-semibold mb-4 sm:mb-6">Loan Application Details</h2>
    <!-- Not found -->
    <div v-if="!loanApplication" class="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
      <h3 class="text-xl font-medium text-gray-300">Application Not Found</h3>
      <p class="mt-2 text-gray-400">The loan application you're looking for doesn't exist or has been removed.</p>
      <button
        @click="router.back()"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
      >
        Go Back
      </button>
    </div>
    <!-- Application details -->
    <div v-else class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gray-700 p-4 sm:p-6 border-b border-gray-600">
        <h3 class="text-xl font-medium text-white">{{ loanApplication.name }}</h3>
        <p class="text-sm text-gray-400 mt-1">
          Application submitted on {{ formatDate(loanApplication.submissionDate) }}
        </p>
      </div>
      <div class="p-4 sm:p-6 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div class="bg-gray-750 rounded-lg p-4">
            <p class="text-sm text-gray-400 mb-1">Loan Amount</p>
            <p class="text-2xl font-semibold">
              {{ formatCurrency(loanApplication.loanAmount, loanApplication.currency) }}
            </p>
          </div>
          <div class="bg-gray-750 rounded-lg p-4">
            <p class="text-sm text-gray-400 mb-1">Loan Amount (GBP)</p>
            <p class="text-2xl font-semibold">
              {{ formatCurrency(loanApplication.convertedLoanAmount.GBP, 'GBP') }}
            </p>
          </div>
        </div>
        <div class="border-t border-gray-700 pt-4">
          <dl class="divide-y divide-gray-700">
            <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-400">Loan Term</dt>
              <dd class="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">{{ loanApplication.loanTerm }} months</dd>
            </div>
            <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-400">Currency</dt>
              <dd class="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                {{ loanApplication.currency }}
              </dd>
            </div>
            <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-400">Monthly Payment (est.)</dt>
              <dd class="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                {{ formatCurrency(loanApplication.loanAmount / loanApplication.loanTerm, loanApplication.currency) }}
              </dd>
            </div>
            <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-400">Application ID</dt>
              <dd class="mt-1 text-sm font-mono text-gray-300 sm:col-span-2 sm:mt-0">
                {{ loanApplication.id }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div class="bg-gray-750 px-4 py-4 sm:px-6 border-t border-gray-700 flex flex-wrap gap-3 justify-end">
        <button
          @click="router.back()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>
