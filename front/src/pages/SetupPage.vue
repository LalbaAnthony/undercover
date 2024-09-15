<template>
  <div>
    <section>
      <!-- {{ undercoverStore.allWords }}<br>
    {{ undercoverStore.allRoles }}<br>
    {{ undercoverStore.allDistributions }}<br>
    {{ undercoverStore.suggestedNumberOfUndercovers }}<br> -->
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
          <p> <span class="text-lg text-primary"> {{ numberOfPlayer }}</span> joueurs</p>
        </div>
      </section>

      <!-- Distribution -->
      <section>
        <h2 class="text-center text-2xl my-4">Répartition</h2>
        <div class="flex justify-center items-center gap-2">

        </div>
      </section>
    </div>

    <!-- Players -->
    <section>
      <h2 class="text-center text-2xl my-4">Joueurs</h2>

      <!-- Add -->
      <div class="flex justify-center items-center gap-2">
        <input type="text" placeholder="Nom du joueur" v-model="newPlayerName">
        <button @click="addPlayer()">Ajouter un joueur</button>
      </div>

      <!-- List -->
      <div class="my-4">
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
        <button @click="resetAll()">Réinitialiser</button>
        <button @click="startGame()">Commencer</button>
      </div>
    </section>

  </div>
</template>

<script setup>
import Player from '@/components/undercover/PLayerComponent.vue'
import Grid from '@/components/GridComponent.vue'
import { notify } from '@/helpers/notif.js'
import { onMounted, ref } from 'vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

const numberOfPlayer = ref(3)
const newPlayerName = ref('')

function addPlayer() {
  if (newPlayerName.value.length === 0) {
    notify('Le nom du joueur ne peut pas être vide', 'error')
    return
  }

  if (undercoverStore.numberOfPlayers >= numberOfPlayer.value) {
    notify('Le nombre maximum de joueurs est atteint', 'error')
    return
  }

  undercoverStore.addPlayer(newPlayerName.value)
  newPlayerName.value = ''
}


function resetAll() {
  undercoverStore.resetGame()
}

function startGame() {
  console.log('startGame')
  // undercoverStore.startGame()
}


onMounted(() => {
  undercoverStore.initGame()
})


</script>

<style scoped></style>