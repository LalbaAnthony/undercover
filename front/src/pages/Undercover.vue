<template>
  <div>
    {{ undercoverStore.words }}
    {{ undercoverStore.roles }}
  </div>
</template>

<script setup>
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

undercoverStore.fetchWordsList()
undercoverStore.fetchRolesList()

</script>

<style scoped></style>