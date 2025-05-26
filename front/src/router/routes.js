const routes = [
  // ==================== GAME ====================
  {
    path: '/',
    name: 'setup',
    component: () => import('../pages/SetupPage.vue'),
    meta: {
      title: 'Initialisation',
      private: false,
    },
  },
  {
    path: '/rules',
    name: 'rules',
    component: () => import('../pages/RulesPage.vue'),
    meta: {
      title: 'Règles',
      private: false,
    },
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('../pages/GamePage.vue'),
    meta: {
      title: 'Jeu',
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