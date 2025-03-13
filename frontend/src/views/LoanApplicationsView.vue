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
</script>

<template>
  <section class="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 dark:text-gray-100 h-[calc(100vh-60px)]">
    <h2 class="text-2xl sm:text-3xl text-center font-semibold mb-4 sm:mb-6">Loan Applications</h2>
    <div class="overflow-x-auto rounded-lg shadow-md">
      <table class="min-w-full bg-gray-800 rounded-lg shadow-md">
        <thead class="bg-gray-80">
          <tr class="border-b-1 border-gray-500">
            <th class="px-6 py-3 text-left">Name</th>
            <th
              @click="sortData('loanTerm')"
              class="cursor-pointer px-6 py-3 text-left hover:bg-blue-300 hover:opacity-50 hover:text-gray-900"
            >
              <div class="flex items-center justify-between w-full">
                Loan Term in Months
                <span v-if="sortField === 'loanTerm'" class="ml-2">{{ getSortIndicator('loanTerm') }}</span>
              </div>
            </th>
            <th
              @click="sortData('loanAmount')"
              class="cursor-pointer px-6 py-3 text-left hover:bg-blue-300 hover:opacity-50 hover:text-gray-900"
            >
              <div class="flex items-center justify-between w-full">
                Loan Amount
                <span v-if="sortField === 'loanAmount'" class="ml-2">{{ getSortIndicator('loanAmount') }}</span>
              </div>
            </th>
            <th class="px-6 py-3 text-left">Currency</th>
            <th class="px-6 py-3 text-left">Loan Value in GBP</th>
            <th
              @click="sortData('submissionDate')"
              class="cursor-pointer px-6 py-3 text-left hover:bg-blue-300 hover:opacity-50 hover:text-gray-900"
            >
              <div class="flex items-center justify-between w-full">
                Submission Date
                <span v-if="sortField === 'submissionDate'" class="ml-2">{{ getSortIndicator('submissionDate') }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="loan in loanApplications"
            :key="loan.id"
            @click="goToLoanDetails(loan.id)"
            class="hover:bg-blue-300 hover:opacity-50 hover:text-gray-900 cursor-pointer"
          >
            <td class="px-6 py-4">{{ loan.name }}</td>
            <td class="px-6 py-4">{{ loan.loanTerm }}</td>
            <td class="px-6 py-4">{{ loan.loanAmount }}</td>
            <td class="px-6 py-4">{{ loan.currency }}</td>
            <td class="px-6 py-4">{{ loan.convertedLoanAmount.GBP }}</td>
            <td class="px-6 py-4">{{ new Date(loan.submissionDate).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
      <div class="row flex justify-end">
        <button
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          class="rounded-md rounded-r-none rounded-l-none border-1 border-gray-600 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-gray-600 hover:text-white hover:bg-gray-900 hover:border-gray-200 focus:text-white focus:bg-gray-900 focus:border-gray-200 active:border-gray-400 active:text-white active:bg-gray-800 cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path
              fill-rule="evenodd"
              d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button
          v-for="page in pageNumbers"
          :key="page"
          :active="currentPage === page"
          :focus="currentPage === page"
          @click="goToPage(page)"
          class="rounded-md rounded-r-none rounded-l-none border-1 border-gray-600 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-gray-600 hover:text-white hover:bg-gray-900 hover:border-gray-200 focus:text-white focus:bg-gray-900 focus:border-gray-200 active:border-gray-400 active:text-white active:bg-gray-800 cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          {{ page }}
        </button>
        <button
          :disabled="currentPage === totalPages"
          :focus="false"
          :active="false"
          @click="goToPage(currentPage + 1)"
          class="rounded-md rounded-r-none rounded-l-none border-1 border-gray-600 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-gray-600 hover:text-white hover:bg-gray-900 hover:border-gray-200 focus:text-white focus:bg-gray-900 focus:border-gray-200 active:border-gray-400 active:text-white active:bg-gray-800 cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path
              fill-rule="evenodd"
              d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>
