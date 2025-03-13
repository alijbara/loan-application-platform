<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useLoanApplicationStore } from '@/store/loan-application-store';
import { useToastStore } from '@/store/toast.store';
import { Currency } from '@/enums/currency.enum';
import { useSpinnerStore } from '@/store/spinner.store';

const router = useRouter();

// Stores
const loanApplicationStore = useLoanApplicationStore();
const toastStore = useToastStore();
const spinnerStore = useSpinnerStore();

// Loan application state
const name = ref('');
const loanAmount = ref(0);
const loanTerm = ref(12);
const currency = ref(Currency.GBP);

const currencies = Object.values(Currency);

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

// When submitted loan is returned, redirect to the new loan application details page
const submittedLoanApplication = computed(() => loanApplicationStore.submittedLoanApplication);
watch(submittedLoanApplication, (newValue) => {
  if (newValue?.id) {
    toastStore.show({ message: 'Loan application submitted successfully!', type: 'success' });
    router.push(`/loan-applications/${newValue.id}`);
  }
});

// Prevent negative numbers
watch(loanTerm, (newValue) => {
  if (newValue < 0) {
    loanTerm.value = 0;
  }
});
watch(loanAmount, (newValue) => {
  if (newValue < 0) {
    loanAmount.value = 0;
  }
});

// Submit handler
const submitForm = async () => {
  if (!name.value || loanAmount.value <= 0) return;
  await loanApplicationStore.submitLoanApplication({
    name: name.value,
    loanAmount: loanAmount.value,
    loanTerm: loanTerm.value,
    currency: currency.value,
  });
};
</script>

<template>
  <section class="grow md:px-16 max-w-4xl mx-auto p-6 h-[calc(100vh-60px)] dark:text-gray-100">
    <h2 class="text-3xl text-center text-white font-semibold mb-6">Loan Application</h2>
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Name Field -->
      <div class="space-y-1">
        <label for="name" class="inline-block text-sm font-medium">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
          placeholder="Enter your full name"
          required
        />
      </div>

      <!-- Loan Amount Field -->
      <div>
        <label for="loanAmount" class="inline-block text-sm font-medium">Loan Amount</label>
        <input
          id="loanAmount"
          v-model="loanAmount"
          type="number"
          min="0"
          class="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
          placeholder="Enter loan amount"
          required
        />
      </div>

      <!-- Loan Term Field -->
      <div>
        <label for="loanTerm" class="inline-block text-sm font-medium">Loan Term (Months)</label>
        <input
          id="loanTerm"
          v-model="loanTerm"
          type="number"
          min="1"
          class="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
          placeholder="Enter loan term in months"
          required
        />
      </div>

      <!-- Currency Dropdown -->
      <label for="currency" class="inline-block text-sm font-medium">Currency</label>
      <div class="relative">
        <select
          id="currency"
          v-model="currency"
          class="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500 appearance-none pr-10"
          required
        >
          <option v-for="curr in currencies" :key="curr" :value="curr">
            {{ curr }}
          </option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 pb-0 text-gray-500 dark:text-gray-400"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mt-6 flex justify-center">
        <button
          type="submit"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg w-full hover:bg-blue-500 transition duration-300 cursor-pointer"
        >
          Apply for Loan
        </button>
      </div>
    </form>
  </section>
</template>
