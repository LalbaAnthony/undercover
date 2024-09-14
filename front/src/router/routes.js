const routes = [
  // ==================== UNDERCOVER ====================
  {
    path: '/',
    name: 'hame',
    component: () => import('../pages/Undercover.vue'),
    meta: {
      title: 'Undercover',
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
      displayInSearch: false,
    },
  },
]

export default routes