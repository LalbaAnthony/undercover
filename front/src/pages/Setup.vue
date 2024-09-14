<template>
  <div>
    {{ undercoverStore.allWords }}<br>
    {{ undercoverStore.allRoles }}<br>
    {{ undercoverStore.allDistributions}}<br>
    {{ undercoverStore.suggestedNumberOfUndercovers}}<br>
  </div>
</template>

<script setup>
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

undercoverStore.initGame()

</script>

<style scoped></style>