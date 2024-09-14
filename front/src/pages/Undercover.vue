<template>
  <div>
    hey
    {{ undercoverStore.words }}
  </div>
</template>

<script setup>
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

undercoverStore.fetchWordsList()

</script>

<style scoped></style>