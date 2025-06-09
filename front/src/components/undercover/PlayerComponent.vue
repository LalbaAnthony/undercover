<template>
  <div>
    <!-- Card -->
    <div class="flex justify-between items-center gap-2 p-4 rounded-2xl border border-2 border-dark-gray">
      <div class="overflow-hidden">{{ props.player.name }}</div>
      <div v-if="props.displayRole" class="text-gray overflow-hidden">
        {{ undercoverStore.getRole(props.player.role).name }}
      </div>
      <div class="flex items-center justify-end gap-2">
        <div v-if="props.seeButton"
          class="cursor-pointer rounded-full p-0.5 hover:scale-105 transition-transform duration-200"
          @click="toggleShowRole()">
          <EyeIcon class="size-6 text-primary" />
        </div>
        <div v-if="props.removeButton"
          class="cursor-pointer rounded-full p-0.5 hover:scale-105 transition-transform duration-200"
          @click="undercoverStore.deletePlayer(props.player.id)">
          <TrashIcon class="size-6 text-primary" />
        </div>
      </div>
    </div>

    <!-- Role popup -->
    <!-- WIP -->
  </div>
</template>

<script setup>
import { EyeIcon } from '@heroicons/vue/24/outline'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { useUndercoverStore } from '@/stores/undercover'
import { ref } from 'vue'

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
  seeButton: {
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

const showRole = ref(false)

function toggleShowRole() {
  if (showRole.value) {
    showRole.value = false
    return true
  } else {
    if (confirm(`Are you really ${props.player.name} ? You will it's role.`)) {
      showRole.value = true
    }

    return showRole.value
  }
}

</script>