<template>
  <div>
    <Bento>
      <div class="flex items-center justify-evenly flex-wrap gap-x-6 gap-y-4">
        <div v-if="undercoverStore.numberOfCivilians > 0">
          <span :class="['text-xl font-bold', undercoverStore.numberOfCiviliansRemaining > 0 ? 'text-primary' : '']">{{
            undercoverStore.numberOfCiviliansRemaining }}</span>
          <span>&nbsp;/&nbsp;</span>
          <span class="text-xl font-bold">{{ undercoverStore.numberOfCivilians }}</span>
          <span>&nbsp;&nbsp; civils</span>
        </div>
        <div v-if="undercoverStore.numberOfUndercovers > 0">
          <span
            :class="['text-xl font-bold', undercoverStore.numberOfUndercoversRemaining > 0 ? 'text-primary' : '']">{{
              undercoverStore.numberOfUndercoversRemaining }}</span>
          <span>&nbsp;/&nbsp;</span>
          <span class="text-xl font-bold">{{ undercoverStore.numberOfUndercovers }}</span>
          <span>&nbsp;&nbsp; undercovers</span>
        </div>
        <div v-if="undercoverStore.numberOfWhite > 0">
          <span :class="['text-xl font-bold', undercoverStore.numberOfWhiteRemaining > 0 ? 'text-primary' : '']">{{
            undercoverStore.numberOfWhiteRemaining }}</span>
          <span>&nbsp;/&nbsp;</span>
          <span class="text-xl font-bold">{{ undercoverStore.numberOfWhite }}</span>
          <span>&nbsp;&nbsp; Mr. White</span>
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