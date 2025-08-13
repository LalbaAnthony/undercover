<template>
  <div>
    <Bento>
      <div class="flex flex-col flex-wrap gap-4">
        <h4 class="text-lg">La partie est terminée</h4>
        <h4 class="text-lg">Les
          <span v-if="undercoverStore.hasWhiteWon" class="text-primary font-bold">Mr White</span>
          <span v-else-if="undercoverStore.hasUndercoverWon" class="text-primary font-bold">Undercover</span>
          <span v-else-if="undercoverStore.hasCivilianWon" class="text-primary font-bold">Civils</span>
          <span v-else class="text-primary font-bold">joueurs</span>
          ont gagnés la partie !
        </h4>
      </div>
    </Bento>
    <RemainingsComponent />
    <Players :title="true" :seeButton="true" :displayRole="true" />
    <Actions :actions="[
      { name: 'Rejouer', type: 'primary', callback: restartGame },
    ]" />
  </div>
</template>

<script setup>
import Bento from '@/components/BentoComponent.vue'
import Actions from '@/components/ActionsComponent.vue'
import Players from '@/components/player/ListComponent.vue'
import RemainingsComponent from '@/components/role/RemainingsComponent.vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

function restartGame() {
  if (undercoverStore.DEBUG_ACTIVE || confirm('Es-tu sûr de vouloir arrêter la partie ?')) {
    undercoverStore.restartGame()
  }
}

</script>

<style scoped></style>