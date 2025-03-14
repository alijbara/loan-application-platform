<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLoanApplicationStore } from '@/store/loan-application.store';
import { Currency } from '@/enums/currency.enum';
import { useCurrencyStore } from '@/store/currency.store';

const router = useRouter();

// Stores
const loanApplicationStore = useLoanApplicationStore();
const currencyStore = useCurrencyStore();

// Loan application state
const name = ref('');
const loanAmount = ref(0);
const loanTerm = ref(12);
const currency = ref(Currency.GBP);

// Form validation
const errors = ref({
  name: '',
  loanAmount: '',
});

// Currencies
const currencies = computed(() => {
  return currencyStore.currencies;
});

// Fetch currencies on mount
onMounted(async () => {
  await currencyStore.fetchCurrencies();
});

// When submitted loan is returned, redirect to the new loan application details page
const submittedLoanApplication = computed(() => loanApplicationStore.submittedLoanApplication);
watch(submittedLoanApplication, (newValue) => {
  if (newValue?.id) {
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

// Validate form
const validateForm = () => {
  let isValid = true;
  errors.value.name = '';
  errors.value.loanAmount = '';

  if (!name.value.trim()) {
    errors.value.name = 'Name is required';
    isValid = false;
  }

  if (!loanAmount.value || loanAmount.value <= 0) {
    errors.value.loanAmount = 'Please enter a valid loan amount';
    isValid = false;
  }

  return isValid;
};

// Submit handler
const submitForm = async () => {
  if (!validateForm()) return;

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
  <section class="grow flex items-center justify-center p-4 md:p-8 min-h-[calc(100vh-60px)] dark:text-gray-100">
    <div class="w-full max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-600">
      <div class="p-6">
        <h2 class="text-2xl md:text-3xl text-white font-semibold text-center mb-2">Loan Application</h2>
        <p class="text-gray-500 dark:text-gray-400 text-center mb-6">Fill out the form below to apply for a loan</p>

        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Name Field -->
          <div class="space-y-2">
            <label for="name" class="block text-sm font-medium">Full Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Enter your full name"
            />
            <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
          </div>

          <!-- Loan Amount Field -->
          <div class="space-y-2">
            <label for="loanAmount" class="block text-sm font-medium">Loan Amount</label>
            <input
              id="loanAmount"
              v-model="loanAmount"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.loanAmount }"
              placeholder="0.00"
            />
            <p v-if="errors.loanAmount" class="text-sm text-red-500">{{ errors.loanAmount }}</p>
          </div>

          <!-- Loan Term Field -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label for="loanTerm" class="block text-sm font-medium">Loan Term</label>
              <span class="text-sm text-gray-500">{{ loanTerm }} months</span>
            </div>
            <input
              id="loanTerm"
              v-model="loanTerm"
              type="range"
              min="1"
              max="60"
              step="1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div class="flex justify-between text-xs text-gray-500">
              <span>1 month</span>
              <span>60 months</span>
            </div>
          </div>
          <!-- Currency Dropdown -->
          <div class="space-y-2">
            <label for="currency" class="block text-sm font-medium">Currency</label>
            <div class="relative">
              <select
                id="currency"
                v-model="currency"
                class="w-full px-3 py-2 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              >
                <option v-for="curr in currencies" :key="curr" :value="curr">
                  {{ curr }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ 'Apply for Loan' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
