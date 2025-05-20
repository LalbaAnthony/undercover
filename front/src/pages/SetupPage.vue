<template>
  <div>
    <Bento title="Joueurs">
      <div class="m-4">
        <Grid :items="undercoverStore.players">
          <template #item="{ item }">
            <Player :player="item" :removeButton="true" />
          </template>
        </Grid>
      </div>
      <div class="grid grid-cols-12 grid-rows-1 gap-4 w-full">
        <input class="col-span-8 sm:col-span-9 md:col-span-10 py-1.5 px-2 bg-light-dark border-b border-gray text-gray" type="text"
          placeholder="Nom du joueur" v-model="newPlayerName" @keyup.enter="addPlayer()">
        <button
          class="col-span-4 sm:col-span-3 md:col-span-2 text-light py-1.5 px-3 rounded-lg
          flex justify-center items-center cursor-pointer hover:scale-105 transition-transform ease-in-out transform duration-200 bg-primary"
          @click="addPlayer()">
          <PlusIcon class="size-6 text-light" />
        </button>
      </div>
    </Bento>

    <Bento title="Distribution">
      <div>
        <div v-for="(role, slug) in undercoverStore.allRoles" :key="slug"
          class="flex justify-center items-center gap-4">
          <div
            class="cursor-pointer rounded-full bg-primary text-white p-0.5 hover:scale-105 transition-transform duration-200"
            @click="undercoverStore.decrementDistribution(slug)">
            <MinusIcon class="size-5 text-light" />
          </div>
          <div>
            {{ undercoverStore.distribution[slug] }}&nbsp;
            <span class="text-xl">{{ role.name }}</span>
          </div>
          <div
            class="cursor-pointer rounded-full bg-primary text-white p-0.5 hover:scale-105 transition-transform duration-200"
            @click="undercoverStore.incrementDistribution(slug)">
            <PlusIcon class="size-5 text-light" />
          </div>
        </div>
      </div>
    </Bento>

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
import Grid from '@/components/GridComponent.vue'
import Bento from '@/components/BentoComponent.vue'
import { MinusIcon } from '@heroicons/vue/24/solid'
import { PlusIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref } from 'vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

const newPlayerName = ref('')

function addPlayer() {
  undercoverStore.addPlayer(newPlayerName.value)
  newPlayerName.value = ''
}

function resetAll() {
  if (confirm('Es-tu sûûûûûr de vouloir réinitialiser la partie ?')) {
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