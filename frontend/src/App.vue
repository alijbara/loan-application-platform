<script lang="ts" setup>
import NavBar from '@/components/Navbar.vue';
import Toast from '@/components/Toast.vue';
import Spinner from '@/components/Spinner.vue';
</script>

<template>
  <NavBar />
  <router-view />
  <Toast />
  <Spinner />
</template>
