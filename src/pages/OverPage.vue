<template>
  <div>
    <Bento>
      <div class="flex flex-col flex-wrap gap-4">
        <h1 class="text-4xl text-center mb-6">
          <div v-for="(role, key) in undercoverStore.allRoles" :key="key">
            <div v-if="undercoverStore.hasRoleWon(key)">
              {{ undercoverStore.numberOfPlayersByRole(key) > 1 ? 'Les' : 'Le' }}
              <span class="text-primary font-bold">{{  undercoverStore.numberOfPlayersByRole(key) > 1 ? role.labels.plural : role.labels.singular }}</span>
              {{ undercoverStore.numberOfPlayersByRole(key) > 1 ? 'ont gagnés' : 'a gagné' }}
              la partie.
            </div>
          </div>
        </h1>
        <p>Les civils avaient le mot <span class="text-secondary font-bold">{{ undercoverStore.civilianWord }}</span>.
        </p>
        <p>Les undercovers avaient eux le mot <span class="text-secondary font-bold">{{
          undercoverStore.undercoversWord}}</span>.</p>
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