<template>
  <div class="setup">
    <Bento
      :title="undercoverStore.numberOfPlayers ? `${undercoverStore.numberOfPlayers} joueur${undercoverStore.numberOfPlayers > 1 ? 's' : ''}` : 'Joueurs'"
      class="a">

      <Draggable v-model="undercoverStore.players" :animation="200" :itemKey="'id'"
        :group="{ name: 'players', pull: true, put: true }" class="custom-grid">
        <template #item="{ element }">
          <Player :player="element" :deleteButton="true" :dragButton="true" :key="element.id" />
        </template>
      </Draggable>

      <div class="flex justify-between items-center gap-2 mt-2 p-2 border-b-2 border-dark-gray">
        <input class="w-full py-1.5 px-2 bg-light-dark text-white" type="text" id="name" placeholder="Nom du joueur"
          v-model="name" @keyup.enter="addPlayer()">
        <button class="cursor-pointer rounded-full p-0.5 pr-3 hover:scale-105 transition-transform duration-200"
          @click="addPlayer()">
          <PlusIcon class="size-6 text-primary" />
        </button>
      </div>
    </Bento>

    <Roles class="b" />

    <Settings class="c" />

    <Actions class="d" :actions="[
      { name: 'Réinitialiser', type: 'secondary', callback: () => resetAll() },
      { name: 'Jouer', type: 'primary', callback: () => undercoverStore.startGame() }
    ]" />
  </div>
</template>

<script setup>
import Player from '@/components/player/ItemComponent.vue'
import Bento from '@/components/BentoComponent.vue'
import Roles from '@/components/role/RepartitionComponent.vue'
import Settings from '@/components/setting/ListComponent.vue'
import Actions from '@/components/ActionsComponent.vue'
import Draggable from 'vuedraggable'
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
  if (confirm('Es-tu sûr de vouloir réinitialiser la configuration ?')) {
    undercoverStore.resetAll()
  }
}

onMounted(() => {
  undercoverStore.initSetup()
})

</script>

<style scoped>
.setup {
  display: grid;
  grid-template-rows: auto;
}

.a {
  grid-area: a;
}

.b {
  grid-area: b;
}

.c {
  grid-area: c;
}

.d {
  grid-area: d;
}

@media (min-width: 1536px) {
  .setup {
    grid-template-areas:
      "a b"
      "c c"
      "d d";
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem 3rem;
  }
}

@media (min-width: 1280px) and (max-width: 1535px) {
  .setup {
    grid-template-areas:
      "a b"
      "c c"
      "d d";
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 3rem;
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .setup {
    grid-template-areas:
      "a b"
      "c c"
      "d d";
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 3rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .setup {
    grid-template-areas:
      "a"
      "b"
      "c"
      "d";
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem 3rem;
  }
}

@media (min-width: 640px) and (max-width: 767px) {
  .setup {
    grid-template-areas:
      "a"
      "b"
      "c"
      "d";
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 639px) {
  .setup {
    grid-template-areas:
      "a"
      "b"
      "c"
      "d";
    grid-template-columns: repeat(1, 1fr);
    gap: 0rem;
  }
}
</style>