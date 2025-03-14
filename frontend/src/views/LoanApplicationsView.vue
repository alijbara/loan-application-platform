<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useLoanApplicationStore } from '@/store/loan-application.store';
import { useRouter } from 'vue-router';
import type { LoanApplicationSortableField } from '@/types/loan-application-sortable-field.type';

const router = useRouter();

// Stores
const loanApplicationStore = useLoanApplicationStore();

// Sorting state
const sortField = ref<LoanApplicationSortableField>('submissionDate'); // Default sorting field
const sortOrder = ref<'asc' | 'desc'>('desc'); // Default sorting order
const currentPage = ref(1);
const pageSize = ref(10);

// Loan applications list
const loanApplications = computed(() => {
  return loanApplicationStore.loanApplications;
});

// Total number of documents
const totalLoanApplications = computed(() => {
  return loanApplicationStore.totalDocs;
});

// Calculate total number of pages
const totalPages = computed(() => {
  return Math.ceil(totalLoanApplications.value / pageSize.value);
});

// Generate an array of page numbers
const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

// Fetch loan applications on mount
onMounted(() => {
  fetchLoanApplications();
});

// Watch for sorting or pagination changes and refetch data
watch([sortField, sortOrder, currentPage], () => {
  fetchLoanApplications();
});

// Fetch loan applications with sorting and pagination
const fetchLoanApplications = async () => {
  await loanApplicationStore.fetchLoanApplications({
    sortBy: sortField.value,
    order: sortOrder.value,
    skip: (currentPage.value - 1) * pageSize.value,
    take: pageSize.value,
  });
};

// Toggle sorting order
const sortData = (field: LoanApplicationSortableField) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
  fetchLoanApplications();
};

// Navigate to loan details
const goToLoanDetails = (id: string) => router.push(`/loan-applications/${id}`);

// Sorting indicator
const getSortIndicator = (field: LoanApplicationSortableField) => {
  if (sortField.value === field) {
    return sortOrder.value === 'asc' ? '↑' : '↓';
  }
  return ''; // No icon if the field is not currently sorted
};

// Navigate to a specific page
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

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
    month: 'short',
    year: 'numeric',
  });
};
</script>

<template>
  <section class="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 dark:text-gray-100 h-[calc(100vh-60px)]">
    <h2 class="text-2xl sm:text-3xl text-center font-semibold mb-4 sm:mb-6">Loan Applications</h2>

    <!-- Responsive table container -->
    <div class="overflow-x-auto rounded-lg shadow-md">
      <table class="w-full bg-gray-800 border-collapse">
        <thead class="bg-gray-700 text-gray-200">
          <tr class="border-b border-gray-600">
            <th class="px-4 py-3 text-left font-medium text-sm">Name</th>
            <th
              @click="sortData('loanTerm')"
              class="px-4 py-3 text-left font-medium text-sm cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <div class="flex items-center space-x-1">
                <span>Loan Term</span>
                <div class="flex flex-col ml-1">
                  <span v-if="sortField === 'loanTerm'" class="ml-2">{{ getSortIndicator('loanTerm') }}</span>
                </div>
              </div>
            </th>
            <th
              @click="sortData('loanAmount')"
              class="px-4 py-3 text-left font-medium text-sm cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <div class="flex items-center space-x-1">
                <span>Loan Amount</span>
                <div class="flex flex-col ml-1">
                  <span v-if="sortField === 'loanAmount'" class="ml-2">{{ getSortIndicator('loanAmount') }}</span>
                </div>
              </div>
            </th>
            <th class="px-4 py-3 text-left font-medium text-sm hidden sm:table-cell">Currency</th>
            <th class="px-4 py-3 text-left font-medium text-sm hidden md:table-cell">Loan Value in GBP</th>
            <th
              @click="sortData('submissionDate')"
              class="px-4 py-3 text-left font-medium text-sm cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <div class="flex items-center space-x-1">
                <span>Submission Date</span>
                <div class="flex flex-col ml-1">
                  <span v-if="sortField === 'submissionDate'" class="ml-2">{{
                    getSortIndicator('submissionDate')
                  }}</span>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="loan in loanApplications"
            :key="loan.id"
            @click="goToLoanDetails(loan.id)"
            class="border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <td class="px-4 py-3 text-sm">{{ loan.name }}</td>
            <td class="px-4 py-3 text-sm">{{ loan.loanTerm }} months</td>
            <td class="px-4 py-3 text-sm">{{ formatCurrency(loan.loanAmount, loan.currency) }}</td>
            <td class="px-4 py-3 text-sm hidden sm:table-cell">{{ loan.currency }}</td>
            <td class="px-4 py-3 text-sm hidden md:table-cell">
              {{ formatCurrency(loan.convertedLoanAmount.GBP, 'GBP') }}
            </td>
            <td class="px-4 py-3 text-sm">{{ formatDate(loan.submissionDate) }}</td>
          </tr>
          <tr v-if="loanApplications.length === 0">
            <td colspan="6" class="px-4 py-6 text-center text-gray-400">No loan applications found</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div class="text-sm text-gray-400">
        Showing {{ Math.min((currentPage - 1) * pageSize + 1, totalLoanApplications) }} to
        {{ Math.min(currentPage * pageSize, totalLoanApplications) }} of {{ totalLoanApplications }} entries
      </div>
      <div class="flex items-center">
        <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path
                fill-rule="evenodd"
                d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <template v-for="(page, index) in pageNumbers" :key="index">
            <button
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                currentPage === page
                  ? 'z-10 bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700',
              ]"
            >
              {{ page }}
            </button>
          </template>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path
                fill-rule="evenodd"
                d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </section>
</template>
