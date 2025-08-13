const routes = [
  // ==================== GAME ====================
  {
    path: '/',
    name: 'setup',
    component: () => import('../pages/SetupPage.vue'),
    meta: {
      title: 'Configuration',
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
  {
    path: '/over',
    name: 'over',
    component: () => import('../pages/OverPage.vue'),
    meta: {
      title: 'Terminé',
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