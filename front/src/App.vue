<template>
  <div>
    <Header />
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/HeaderComponent.vue'
import Footer from '@/components/FooterComponent.vue'
import { RouterView} from 'vue-router'
import { nextTick, onMounted } from 'vue'
import { useUndercoverStore } from './stores/undercover'

const undercoverStore = useUndercoverStore()

onMounted(async () => {
  undercoverStore.fetchEverything(false)

  await nextTick();

  // Remove pre-loader from index.html
  const preLoaderContainer = document.getElementById('pre-loader-container')
  if (preLoaderContainer) {
    preLoaderContainer.remove()
  }
})

</script>
