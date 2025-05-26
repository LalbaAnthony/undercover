<template>
  <header class="flex justify-between items-center p-2 gap-3">
    <button v-if="route.name !== 'rules'" class="rounded-full p-2 hover:bg-light-dark" @click="goToRules">
      <NewspaperIcon class="size-8" />
    </button>
    <button v-else class="rounded-full p-2 hover:bg-light-dark" @click="goBack">
      <ChevronLeftIcon class="size-8" />
    </button>
    <h1 class="text-center text-4xl my-4">{{ VITE_APP_NAME }}</h1>
    <div class="size-8 p-2">&nbsp;</div>
  </header>
</template>

<script setup>
import { VITE_APP_NAME } from '@/config';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { NewspaperIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

const route = useRoute()

function goBack() {
  window.history.back()
}

function goToRules() {
  window.location.href = '/rules'
}

</script>