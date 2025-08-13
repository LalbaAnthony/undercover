<template>
  <div>
    <Bento>
      <div class="flex flex-col flex-wrap gap-4">
        <h4 class="text-lg">Nous en sommes au tour numéro <span class="text-primary font-bold">{{
          undercoverStore.currentRound }}</span>
        </h4>
        <h4 class="text-lg">Et c'est à <span class="text-primary font-bold">{{
          undercoverStore.getPlayerMustBegin()?.name }}</span> de commencer !
        </h4>
      </div>
    </Bento>
    <Remainings />
    <Players :title="false" :seeButton="true" :eliminateButton="true" />
    <Actions :actions="[
      { name: 'Arrêter la partie', type: 'dark', callback: undercoverStore.restartGame },
    ]" />
  </div>
</template>

<script setup>
import Bento from '@/components/BentoComponent.vue'
import Actions from '@/components/ActionsComponent.vue'
import Players from '@/components/player/ListComponent.vue'
import Remainings from '@/components/role/RemainingsComponent.vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

</script>

<style scoped></style>