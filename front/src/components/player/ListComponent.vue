<template>
  <Bento
    :title="props.title ? undercoverStore.numberOfPlayers ? `${undercoverStore.numberOfPlayers} joueur${undercoverStore.numberOfPlayers > 1 ? 's' : ''}` : 'Joueurs' : ''">
    <Draggable v-if="props.dragButton" v-model="undercoverStore.players" :animation="200" :itemKey="'id'" :delay="200"
      :delayOnTouchOnly="true" :group="{ name: 'players', pull: true, put: true }" class="custom-grid">
      <template #item="{ element }">
        <Player :player="element" :key="element.id" :displayRole="props.displayRole" :dragButton="props.dragButton"
          :seeButton="props.seeButton" :deleteButton="props.deleteButton" :eliminateButton="props.eliminateButton" />
      </template>
    </Draggable>
    <div v-else class="custom-grid">
      <Player v-for="player in undercoverStore.players" :key="player.id" :player="player"
        :displayRole="props.displayRole" :dragButton="props.dragButton" :seeButton="props.seeButton"
        :deleteButton="props.deleteButton" :eliminateButton="props.eliminateButton" />
    </div>

    <div v-if="props.addButton" class="flex justify-between items-center gap-2 mt-2 p-2 border-b-2 border-dark-gray">
      <input class="w-full py-1.5 px-2 bg-light-dark text-white" type="text" id="name" placeholder="Nom du joueur"
        v-model="name" @keyup.enter="addPlayer()">
      <button
        class="cursor-pointer rounded-lg bg-primary text-white p-0.5 mr-[11px] hover:scale-105 transition-all duration-200"
        @click="addPlayer()">
        <PlusIcon class="size-6 text-light" />
      </button>
    </div>
  </Bento>
</template>

<script setup>
import { ref } from 'vue'
import Player from '@/components/player/ItemComponent.vue'
import Bento from '@/components/BentoComponent.vue'
import { useUndercoverStore } from '@/stores/undercover'
import Draggable from 'vuedraggable'
import { PlusIcon } from '@heroicons/vue/24/solid'

const undercoverStore = useUndercoverStore()

const props = defineProps({
  displayRole: {
    type: Boolean,
    default: false,
    required: false,
  },
  dragButton: {
    type: Boolean,
    default: false,
    required: false,
  },
  addButton: {
    type: Boolean,
    default: false,
    required: false,
  },
  seeButton: {
    type: Boolean,
    default: false,
    required: false,
  },
  deleteButton: {
    type: Boolean,
    default: false,
    required: false,
  },
  eliminateButton: {
    type: Boolean,
    default: false,
    required: false,
  },
  title: {
    type: Boolean,
    default: true,
    required: false,
  }
})

const name = ref('')

function addPlayer() {
  undercoverStore.addPlayer(name.value)
  name.value = ''
  document.getElementById('name').focus()
}

</script>

<style scoped></style>