<template>
  <section
    class="flex flex-col justify-center items-center text-center py-16 bg-white dark:bg-gray-900 h-[calc(100vh-60px)]"
  >
    <div class="bg-white dark:bg-gray-900 dark:text-gray-100">
      <div class="container mx-auto space-y-16 px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
        <div class="text-center">
          <div class="mb-1 text-xl font-bold tracking-wider text-blue-600 uppercase dark:text-blue-500">LoanApp</div>
          <h2 class="mb-4 text-4xl font-black text-black dark:text-white">Easy and fast loans!</h2>
          <h3 class="mx-auto text-xl leading-relaxed font-medium text-gray-700 lg:w-2/3 dark:text-gray-300">
            Get the loan you need with our simple application process. No hidden fees and transparent terms.
          </h3>
        </div>
        <router-link
          to="/apply"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-700 px-7 py-3.5 leading-6 font-semibold text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring-3 focus:ring-blue-400/50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400/90"
        >
          Apply for a Loan
        </router-link>
      </div>
    </div>
  </section>
</template>
