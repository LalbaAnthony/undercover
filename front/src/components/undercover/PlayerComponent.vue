<template>
  <div class="flex justify-between items-center gap-2 p-4 rounded-2xl border border-2 border-dark-gray">
    <div class="overflow-hidden">{{ props.player.name }}</div>
    <div v-if="props.displayRole" class="text-gray overflow-hidden">{{ undercoverStore.getRole(props.player.role).name }}</div>
    <div
      v-if="props.removeButton"
      class="cursor-pointer rounded-full p-0.5 hover:scale-105 transition-transform duration-200"
      @click="undercoverStore.deletePlayer(props.player.id)">
      <TrashIcon class="size-6 text-primary" />
    </div>
  </div>
</template>

<script setup>
import { TrashIcon } from '@heroicons/vue/24/outline'
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