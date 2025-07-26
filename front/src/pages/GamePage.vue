<template>
  <div>
    <Bento>
      <div class="custom-grid">
        <Player v-for="player in undercoverStore.players" :key="player.id" :player="player" :seeButton="true" :eliminateButton="true" />
      </div>
    </Bento>
    <Actions :actions="[
      { name: 'Arrêter la partie', type: 'secondary', callback: endGame },
    ]" />
  </div>
</template>

<script setup>
import Actions from '@/components/ActionsComponent.vue'
import Player from '@/components/undercover/PlayerComponent.vue'
import Bento from '@/components/BentoComponent.vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

function endGame() {
  if (confirm('Es-tu sûr de vouloir arrêter la partie ?')) {
    undercoverStore.endGame()
  }
}

</script>

<style scoped></style>