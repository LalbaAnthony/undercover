<template>
  <div>
    <Bento>
      <div class="flex flex-col flex-wrap gap-4">
        <h1 class="text-4xl text-center mb-6">Les&nbsp;
          <span v-if="undercoverStore.hasWhiteAndUndercoverWon" class="text-primary font-bold">undercovers et Mr
            White</span>
          <span v-else-if="undercoverStore.hasCivilianWon" class="text-primary font-bold">civils</span>
          <span v-else-if="undercoverStore.hasUndercoverWon" class="text-primary font-bold">undercovers</span>
          <span v-else-if="undercoverStore.hasWhiteWon" class="text-primary font-bold">Mr White</span>
          <span v-else-if="undercoverStore.hasFoolWon" class="text-primary font-bold">Fools</span>
          <span v-else class="text-primary font-bold">joueurs</span>&nbsp;ont gagnés la partie.
        </h1>
        <p>Les civils avaient le mot <span class="text-secondary font-bold">{{ undercoverStore.civilianWord }}</span>.</p>
        <p>Les undercovers avaient eux le mot <span class="text-secondary font-bold">{{ undercoverStore.undercoversWord }}</span>.</p>
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
import { onMounted } from 'vue'

const undercoverStore = useUndercoverStore()

function restartGame() {
  undercoverStore.restartGame()
}

onMounted(() => {
  undercoverStore.stopGame()
})

</script>

<style scoped></style>