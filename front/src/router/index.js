import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useUndercoverStore } from '@/stores/undercover'
import { VITE_SITE_NAME } from '@/config';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ left: 0, top: 0, behavior: 'smooth' }),
  routes,
})

router.beforeEach((to, from, next) => {

  const undercoverStore = useUndercoverStore()
  undercoverStore.printGameState()

  if (from.name === 'game' && to.name !== 'game') {
    undercoverStore.resetGame()
  }

  if (to.name === 'game' && undercoverStore.isGameRunning !== true) {
    next({path: '/'})
  }

  document.title = VITE_SITE_NAME;
  next();
});

router.afterEach(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

export default router
