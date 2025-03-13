<script lang="ts" setup>
import { ref } from 'vue';

const menuOpen = ref(false);
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<template>
  <header class="bg-gray-800 text-white shadow-md">
    <nav class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <div class="text-xl font-semibold">
        <router-link to="/">LoanApp</router-link>
      </div>

      <!-- Desktop Navigation -->
      <div class="lg:flex hidden space-x-8">
        <router-link to="/" class="hover:text-gray-400">Home</router-link>
        <router-link to="/loan-applications" class="hover:text-gray-400">Loan Applications</router-link>
        <router-link to="/apply" class="hover:text-gray-400">Apply</router-link>
      </div>

      <!-- Mobile Menu Button -->
      <button class="lg:hidden text-white focus:outline-none" @click="toggleMenu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </nav>

    <!-- Mobile Navigation -->
    <div v-if="menuOpen" class="lg:hidden flex flex-col space-y-4 py-4 bg-gray-800 text-white">
      <router-link to="/" class="px-4 py-2">Home</router-link>
      <router-link to="/loan-applications" class="px-4 py-2">Loan Applications</router-link>
      <router-link to="/apply" class="px-4 py-2">Apply</router-link>
    </div>
  </header>
</template>
