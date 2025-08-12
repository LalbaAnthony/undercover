<template>
  <header class="flex justify-between items-center py-2 px-4 gap-3">
    <button v-if="route.name !== 'rules'" class="rounded-full p-2 hover:bg-light-dark" @click="goToRules">
      <NewspaperIcon class="size-8" />
    </button>
    <button v-else class="rounded-full p-2 hover:bg-light-dark" @click="goBack">
      <ChevronLeftIcon class="size-8" />
    </button>
    <h1 class="text-center text-4xl my-4">{{ route?.meta?.title || VITE_APP_NAME }}</h1>
    <button :class="['rounded-full p-2', undercoverStore.DEBUG_ACTIVE ? 'bg-primary' : 'bg-dark']"
      @click="handleDebug()">
      <BugAntIcon :class="['size-8', undercoverStore.DEBUG_ACTIVE ? 'text-light' : 'text-dark']" />
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
const DEBUG_GOAL_PRINT = 1
const DEBUG_GOAL_TOGGLE = 5

function handleDebug() {
  debugCount.value++

  if (debugCount.value % DEBUG_GOAL_TOGGLE === 0) {
    alert('Debug mode toggled')
    undercoverStore.DEBUG_ACTIVE = !undercoverStore.DEBUG_ACTIVE
  }
  if (debugCount.value % DEBUG_GOAL_PRINT === 0) {
    if (undercoverStore.DEBUG_ACTIVE) undercoverStore.printGameState()
  }
}

function goBack() {
  window.history.back()
}

function goToRules() {
  router.push({ name: 'rules' })
}

</script>