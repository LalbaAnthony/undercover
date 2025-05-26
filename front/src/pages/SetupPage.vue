<template>
  <div>
    <div class="md:grid md:grid-cols-2 md:gap-6">
      <Bento :title="`Joueurs ${undercoverStore.numberOfPlayers ? `(${undercoverStore.numberOfPlayers})` : ''}`">
        <div class="my-4 custom-grid">
          <Player v-for="player in undercoverStore.players" :key="player.id" :player="player" :removeButton="true" />
        </div>

        <div class="flex justify-between items-center gap-2 p-2 border-b-2 border-dark-gray">
          <input class="py-1.5 px-2 bg-light-dark text-white" type="text" id="name" placeholder="Nom du joueur"
            v-model="name" @keyup.enter="addPlayer()">
          <button class="cursor-pointer rounded-full p-0.5 hover:scale-105 transition-transform duration-200"
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
              class="cursor-pointer rounded-lg disabled:cursor-not-allowed disabled:bg-gray bg-primary text-white p-1 hover:scale-105 transition-all duration-200"
              :disabled="!undercoverStore.canDecrementDistribution(key)"
              @click="undercoverStore.decrementDistribution(key)">
              <MinusIcon class="size-6 text-light" />
            </button>
            <div>
              {{ undercoverStore.distribution[key] }}&nbsp;
              <span class="text-xl">{{ role.name }}</span>
            </div>
            <button
              class="cursor-pointer rounded-lg disabled:cursor-not-allowed disabled:bg-gray bg-primary text-white p-1 hover:scale-105 transition-all duration-200"
              :disabled="!undercoverStore.canIncrementDistribution(key)"
              @click="undercoverStore.incrementDistribution(key)">
              <PlusIcon class="size-6 text-light" />
            </button>
          </div>
        </div>
      </Bento>
    </div>

    <Bento>
      <div class="flex justify-center items-center gap-4">
        <button
          class="text-light py-1.5 px-3 rounded-lg cursor-pointer transition-colors	duration-300 hover:bg-light-dark"
          @click="resetAll()">Réinitialiser</button>
        <button class="text-light py-1.5 px-3 rounded-lg cursor-pointer transition-colors	duration-300 bg-primary"
          @click="startGame()">Commencer</button>
      </div>
    </Bento>
  </div>
</template>

<script setup>
import Player from '@/components/undercover/PlayerComponent.vue'
import Bento from '@/components/BentoComponent.vue'
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
  if (confirm('Es-tu sûûûr de vouloir réinitialiser la partie ?')) {
    undercoverStore.clearPlayers()
    undercoverStore.resetGame()
    undercoverStore.initSetup()
  }
}

function startGame() {
  undercoverStore.startGame()
}

onMounted(() => {
  undercoverStore.initSetup()
})

</script>

<style scoped></style>