<template>
  <div>
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Footer from '@/components/FooterComponent.vue'
import { RouterView} from 'vue-router'
</script>
