<template>
  <header class="flex justify-between items-center p-2 gap-3">
    <button v-if="route.name !== 'rules'" class="rounded-full p-2 hover:bg-light-dark" @click="goToRules">
      <NewspaperIcon class="size-8" />
    </button>
    <button v-else class="rounded-full p-2 hover:bg-light-dark" @click="goBack">
      <ChevronLeftIcon class="size-8" />
    </button>
    <h1 class="text-center text-4xl my-4">{{ route?.meta?.title || VITE_APP_NAME }}</h1>
    <button v-if="undercoverStore.DEBUG" class="rounded-full p-2 bg-primary" @click="undercoverStore.printGameState()">
      <BugAntIcon class="size-8" />
    </button>
    <button v-else class="rounded-full p-2 bg-dark" @click="incrementDebugCounter()">
      <BugAntIcon class="size-8 text-dark" />
    </button>
  </header>
</template>

<script setup>
import { VITE_APP_NAME } from '@/config';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { NewspaperIcon } from '@heroicons/vue/24/outline'
import { BugAntIcon } from '@heroicons/vue/24/outline'
import { useUndercoverStore } from '@/stores/undercover'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue';

const undercoverStore = useUndercoverStore()

const route = useRoute()
const router = useRouter()

const debugCount = ref(0)
const DEBUG_COUNT_GOAL = 5

function incrementDebugCounter() {
  debugCount.value++
  if (debugCount.value === DEBUG_COUNT_GOAL) {
    alert('Debug mode toggled')
    undercoverStore.DEBUG = !undercoverStore.DEBUG
    debugCount.value = 0
  }
}

function goBack() {
  window.history.back()
}

function goToRules() {
  router.push({ name: 'rules' })
}

</script>