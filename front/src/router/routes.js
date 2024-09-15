const routes = [
  // ==================== GAME ====================
  {
    path: '/',
    name: 'setup',
    component: () => import('../pages/SetupPage.vue'),
    meta: {
      title: 'Setup',
      private: false,
    },
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('../pages/GamePage.vue'),
    meta: {
      title: 'game',
      private: false,
    },
  },
  // ==================== CATCH ====================
  {
    path: '/:catchAll(.*)*',
    name: 'Error',
    component: () => import('../pages/error/ErrorPage.vue'),
    meta: {
      title: 'Error',
    },
  },
]

export default routes