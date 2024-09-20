<template>
  <div>
    <section>
      <!-- {{ undercoverStore.allRoles }}<br><br><br> -->
      <!-- {{ undercoverStore.suggestedNumberOfUndercovers }}<br><br><br> -->
    </section>

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

    <!-- Distribution -->
    <section>
      <h2 class="text-center text-2xl my-4">Répartition</h2>
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
  console.log('startGame')
  // undercoverStore.startGame()
}

onMounted(() => {
  undercoverStore.initSetup()
})

</script>

<style scoped></style>