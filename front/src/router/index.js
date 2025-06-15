import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useUndercoverStore } from '@/stores/undercover'
import { VITE_APP_NAME } from '@/config';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
  routes,
})

router.beforeEach((to, from, next) => {
  const undercoverStore = useUndercoverStore()

  if (from.name === 'game' && to.name !== 'game') {
    undercoverStore.resetGame()
  }

  if (to.name === 'game' && !undercoverStore.isGameRunning) {
    next({ name: 'setup' })
    return;
  }

  if (to.name === 'setup' && undercoverStore.isGameRunning) {
    next({ name: 'game' })
    return;
  }

  document.title = VITE_APP_NAME;
  next();
});

router.afterEach(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

export default router
