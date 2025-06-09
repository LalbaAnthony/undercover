<template>
  <div>
    <div class="custom-grid">
      <Player v-for="player in undercoverStore.players" :key="player.id" :player="player"
        :seeButton="true" />
    </div>
  </div>
</template>

<script setup>
import Player from '@/components/undercover/PlayerComponent.vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

</script>

<style scoped></style>