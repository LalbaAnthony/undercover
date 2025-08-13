<template>
  <header class="flex justify-between items-center py-2 px-4 gap-3">
    <Button type="dark" v-if="route.name !== 'rules'" icon="newspaper" size="lg" @click="goToRules"></Button>
    <Button type="dark" v-else icon="chevronLeft" size="lg" @click="goBack"></Button>
    <h1 class="text-center text-4xl my-4">{{ route?.meta?.title || VITE_APP_NAME }}</h1>
    <Button :visible="undercoverStore.DEBUG_ACTIVE" type="primary" icon="bug" size="lg" @click="handleDebug"></Button>
  </header>
</template>

<script setup>
import { VITE_APP_NAME } from '@/config';
import Button from '@/components/ButtonComponent.vue'
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

// Reset debug count every 10 seconds: so user must press DEBUG_GOAL* times in 10 seconds to toggle trigger the event
setInterval(() => {
  debugCount.value = 0
}, 10000)

function goBack() {
  window.history.back()
}

function goToRules() {
  router.push({ name: 'rules' })
}

</script>