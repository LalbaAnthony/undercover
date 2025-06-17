<template>
  <div>
    <div class="md:grid md:grid-cols-2 md:gap-6">
      <Bento
        :title="undercoverStore.numberOfPlayers ? `${undercoverStore.numberOfPlayers} joueur${undercoverStore.numberOfPlayers > 1 ? 's' : ''}` : 'Joueurs'">
        <div class="my-4 custom-grid">
          <Player v-for="player in undercoverStore.players" :key="player.id" :player="player" :deleteButton="true" />
        </div>

        <div class="flex justify-between items-center gap-2 p-2 border-b-2 border-dark-gray">
          <input class="w-full py-1.5 px-2 bg-light-dark text-white" type="text" id="name" placeholder="Nom du joueur"
            v-model="name" @keyup.enter="addPlayer()">
          <button class="cursor-pointer rounded-full p-0.5 pr-3 hover:scale-105 transition-transform duration-200"
            @click="addPlayer()">
            <PlusIcon class="size-6 text-primary" />
          </button>
        </div>
      </Bento>

      <Bento title="Répartition des rôles">
        <div class="flex flex-col gap-2">
          <div v-for="(role, key) in undercoverStore.allRoles" :key="key"
            class="flex justify-between items-center gap-4">
            <button
              class="cursor-pointer rounded-lg disabled:cursor-not-allowed disabled:bg-dark-gray bg-primary text-white p-1 hover:scale-105 transition-all duration-200"
              :disabled="!undercoverStore.canDecrementDistribution(key)"
              @click="undercoverStore.decrementDistribution(key)">
              <MinusIcon class="size-6 text-light" />
            </button>
            <div>
              {{ undercoverStore.distribution[key] }}&nbsp;
              <span class="text-xl">{{ role.name }}</span>
            </div>
            <button
              class="cursor-pointer rounded-lg disabled:cursor-not-allowed disabled:bg-dark-gray bg-primary text-white p-1 hover:scale-105 transition-all duration-200"
              :disabled="!undercoverStore.canIncrementDistribution(key)"
              @click="undercoverStore.incrementDistribution(key)">
              <PlusIcon class="size-6 text-light" />
            </button>
          </div>
        </div>
      </Bento>
    </div>

    <Bento title="Paramètres">
      WIP
    </Bento>

    <Actions :actions="[
      { name: 'Réinitialiser', type: 'secondary', callback: () => resetAll() },
      { name: 'Jouer', type: 'primary', callback: () => undercoverStore.startGame() }
    ]" />
  </div>
</template>

<script setup>
import Player from '@/components/undercover/PlayerComponent.vue'
import Bento from '@/components/BentoComponent.vue'
import Actions from '@/components/ActionsComponent.vue'
import { MinusIcon } from '@heroicons/vue/24/solid'
import { PlusIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref } from 'vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

const name = ref('')

function addPlayer() {
  undercoverStore.addPlayer(name.value)
  name.value = ''
  document.getElementById('name').focus()
}

function resetAll() {
  if (confirm('Es-tu sûr de vouloir réinitialiser la partie ?')) {
    undercoverStore.resetAll()
  }
}

onMounted(() => {
  undercoverStore.initSetup()
})

</script>

<style scoped></style>