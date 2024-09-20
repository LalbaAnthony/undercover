<template>
  <div>
    <section>
      <!-- {{ undercoverStore.allRoles }}<br><br><br> -->
      <!-- {{ undercoverStore.suggestedNumberOfUndercovers }}<br><br><br> -->
    </section>

    <div class="md:grid md:grid-cols-2 md:gap-4">
      <!-- Number of players -->
      <section>
        <h2 class="text-center text-2xl my-4">Nombre de joueurs</h2>
        <div class="flex justify-center items-center gap-2">
          <span class="text-lg">{{ undercoverStore.NUMBER_MIN_OF_PLAYERS }}</span>
          <input type="range" :min="undercoverStore.NUMBER_MIN_OF_PLAYERS" :max="undercoverStore.NUMBER_MAX_OF_PLAYERS"
            step="1" v-model="numberOfPlayer">
          <span class="text-lg">{{ undercoverStore.NUMBER_MAX_OF_PLAYERS }}</span>
        </div>
        <div class="text-center">
          <p> <span class="text-xl text-primary"> {{ numberOfPlayer }}</span> joueurs</p>
        </div>
      </section>

      <!-- Distribution -->
      <section>
        <h2 class="text-center text-2xl my-4">Répartition</h2>
        <div>
          <div v-for="(role, slug) in undercoverStore.allRoles" :key="slug"
            class="flex justify-center items-center gap-4">
            <div
              class="cursor-pointer rounded-full bg-primary text-white p-0.5 hover:scale-105 transition-transform duration-200"
              @click="undercoverStore.decrementNumberOf(slug)">
              <MinusIcon class="size-5 text-light" />
            </div>
            <div>
              {{ undercoverStore.distribution[slug] }}&nbsp;
              <span class="text-xl">{{ role.name }}</span>
            </div>
            <div
              class="cursor-pointer rounded-full bg-primary text-white p-0.5 hover:scale-105 transition-transform duration-200"
              @click="undercoverStore.incrementNumberOf(slug)">
              <PlusIcon class="size-5 text-light" />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Players -->
    <section>
      <h2 class="text-center text-2xl my-4">Joueurs</h2>

      <!-- Add -->
      <div class="flex justify-center items-center gap-2 my-8">
        <input class="rounded-lg py-1.5 px-2 text-dark" type="text" placeholder="Nom du joueur" v-model="newPlayerName"
          @keyup.enter="addPlayer()">
        <button
          class="text-light py-1.5 px-3 rounded-lg cursor-pointer hover:scale-105 transition-transform ease-in-out transform duration-200 bg-primary"
          @click="addPlayer()">
          <span class="block sm:hidden">
            <PlusIcon class="size-6 text-light" />
          </span>
          <span class="hidden sm:block">Ajouter un joueur</span>
        </button>
      </div>

      <!-- List -->
      <div class="m-4">
        <Grid :items="undercoverStore.players">
          <template #item="{ item }">
            <Player :player="item" />
          </template>
        </Grid>
      </div>
    </section>

    <!-- Action -->
    <section>
      <div class="flex justify-center items-center gap-4">
        <button
          class="text-light py-1.5 px-3 rounded-lg cursor-pointer transition-colors	duration-300 hover:bg-light-dark"
          @click="resetAll()">Réinitialiser</button>
        <button class="text-light py-1.5 px-3 rounded-lg cursor-pointer transition-colors	duration-300 bg-primary"
          @click="startGame()">Commencer</button>
      </div>
    </section>

  </div>
</template>

<script setup>
import Player from '@/components/undercover/PlayerComponent.vue'
import Grid from '@/components/GridComponent.vue'
import { MinusIcon } from '@heroicons/vue/24/solid'
import { PlusIcon } from '@heroicons/vue/24/solid'
import { notify } from '@/helpers/notif.js'
import { onMounted, ref } from 'vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

const numberOfPlayer = ref(3)
const newPlayerName = ref('')

function addPlayer() {
  if (newPlayerName.value.length === 0) {
    notify('Le nom du joueur ne peut pas être vide', 'error')
    console.error('The player name cannot be empty')
    return false
  }

  if (newPlayerName.value.length > 40) {
    notify('La t\'abuse sur la longueur du nom du joueur', 'error')
    console.error('The player name cannot be longer than 40 characters')
    return false
  }

  if (undercoverStore.numberOfPlayers >= numberOfPlayer.value) {
    notify('Le nombre maximum de joueurs est atteint pour votre sélection', 'error')
    console.error('The maximum number of players is reached for your selection')
    return false
  }

  if (undercoverStore.checkIfNameAlreadyExists(newPlayerName.value)) {
    return false
  }

  if (undercoverStore.numberMaxOfPlayersReached()) {
    return false
  }

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
  console.log('startGame')
  // undercoverStore.startGame()
}

onMounted(() => {
  undercoverStore.initSetup()
})

</script>

<style scoped></style>