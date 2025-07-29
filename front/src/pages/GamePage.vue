<template>
  <div>
    <Players :title="false" :seeButton="true" :eliminateButton="true" />
    <Actions :actions="[
      { name: 'Arrêter la partie', type: 'secondary', callback: endGame },
    ]" />
  </div>
</template>

<script setup>
import Actions from '@/components/ActionsComponent.vue'
import Players from '@/components/player/ListComponent.vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

function endGame() {
  if (confirm('Es-tu sûr de vouloir arrêter la partie ?')) {
    undercoverStore.endGame()
  }
}

</script>

<style scoped></style>