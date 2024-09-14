<template>
  <div>
    {{ undercoverStore.allWords }}
    {{ undercoverStore.allRoles }}
    etet
  </div>
</template>

<script setup>
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

// undercoverStore.initGame()
undercoverStore.startGame()


</script>

<style scoped></style>