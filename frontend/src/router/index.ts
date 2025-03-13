import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/loan-applications',
      name: 'loan-applications',
      component: () => import('../views/LoanApplicationsView.vue'),
    },
    {
      path: '/loan-applications/:id',
      name: 'loan-application-details',
      component: () => import('../views/LoanApplicationDetailsView.vue'),
    },
    {
      path: '/apply',
      name: 'apply',
      component: () => import('../views/LoanApplicationFormView.vue'),
    },
    {
      path: '/:catchAll(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
});

export default router;
