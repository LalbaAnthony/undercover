<template>
  <div>
    <Bento>
      <div class="flex items-center justify-evenly flex-wrap gap-x-6 gap-y-4">
        <div v-if="undercoverStore.numberOfCivilians > 0">
          <span>Civils : </span>
          <span class="text-xl font-bold text-primary">{{ undercoverStore.numberOfCiviliansRemaining }}</span>
          <span>&nbsp;/&nbsp;</span>
          <span class="text-xl font-bold">{{ undercoverStore.numberOfCivilians }}</span>
        </div>
        <div v-if="undercoverStore.numberOfUndercovers > 0">
          <span>Undercover : </span>
          <span class="text-xl font-bold text-primary">{{ undercoverStore.numberOfUndercoversRemaining }}</span>
          <span>&nbsp;/&nbsp;</span>
          <span class="text-xl font-bold">{{ undercoverStore.numberOfUndercovers }}</span>
        </div>
        <div v-if="undercoverStore.numberOfWhite > 0">
          <span>Mr. White : </span>
          <span class="text-xl font-bold text-primary">{{ undercoverStore.numberOfWhiteRemaining }}</span>
          <span>&nbsp;/&nbsp;</span>
          <span class="text-xl font-bold">{{ undercoverStore.numberOfWhite }}</span>
        </div>
      </div>
    </Bento>
    <Players :title="false" :seeButton="true" :eliminateButton="true" />
    <Actions :actions="[
      { name: 'Arrêter la partie', type: 'dark', callback: endGame },
    ]" />
  </div>
</template>

<script setup>
import Bento from '@/components/BentoComponent.vue'
import Actions from '@/components/ActionsComponent.vue'
import Players from '@/components/player/ListComponent.vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

function endGame() {
  if (undercoverStore.DEBUG_ACTIVE || confirm('Es-tu sûr de vouloir arrêter la partie ?')) {
    undercoverStore.endGame()
  }
}

</script>

<style scoped></style>