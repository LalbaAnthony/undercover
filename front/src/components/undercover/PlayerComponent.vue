<template>
  <div class="flex justify-between items-center gap-2 custom-shadow p-4 rounded-xl border border-1 border-dark-gray">
    <div>{{ props.player.name }}</div>
    <div v-if="props.displayRole" class="text-gray">{{ undercoverStore.getRole(props.player.role).name }}</div>
    <div
      v-if="props.removeButton"
      class="cursor-pointer rounded-full bg-primary text-white p-0.5 hover:scale-105 transition-transform duration-200"
      @click="undercoverStore.removePlayer(props.player.timestamp)">
      <MinusIcon class="size-5 text-light" />
    </div>
  </div>
</template>

<script setup>
import { MinusIcon } from '@heroicons/vue/24/solid'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
  displayRole: {
    type: Boolean,
    default: false,
    required: false,
  },
  removeButton: {
    type: Boolean,
    default: false,
    required: false,
  },
})

</script>

<style scoped></style>