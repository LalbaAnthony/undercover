<template>
  <div>
    <!-- Card -->
    <div class="flex justify-between items-center gap-2 p-4 rounded-2xl border border-2 border-dark-gray">
      <div class="flex items-center gap-4">
        <EqualsIcon class="size-6 text-gray" />
        <div class="overflow-hidden">{{ props.player.name }}</div>
        <div v-if="props.displayRole" class="text-gray overflow-hidden">
          {{ undercoverStore.getRole(props.player.role).name }}
        </div>
      </div>
      <div class="flex items-center justify-end gap-2">
        <button v-if="props.seeButton"
          class="cursor-pointer rounded-full p-1 hover:scale-105 transition-transform duration-200"
          @click="toggleShowInfo()">
          <EyeIcon class="size-6 text-primary" />
        </button>
        <button v-if="props.eliminateButton"
          class="cursor-pointer rounded-full p-1 hover:scale-105 transition-transform duration-200 bg-primary"
          @click="console.log(props.player.id)">
          <UserMinusIcon class="size-6 text-light" />
        </button>
        <button v-if="props.deleteButton"
          class="cursor-pointer rounded-full p-1 hover:scale-105 transition-transform duration-200"
          @click="undercoverStore.deletePlayer(props.player.id)">
          <TrashIcon class="size-6 text-primary" />
        </button>
      </div>
    </div>

    <!-- Role popup -->
    <Panel :show="showInfo" @hide="showInfo = false">
      <div class="flex flex-col gap-4">
        <Word v-if="props.player.role !== 'white'" :word="undercoverStore?.getPlayerWord(props.player.id)" />
        <Role :role="undercoverStore.getRole(props.player.role)" />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import Word from '@/components/undercover/WordComponent.vue'
import Role from '@/components/undercover/RoleComponent.vue'
import { EyeIcon } from '@heroicons/vue/24/outline'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { EqualsIcon } from '@heroicons/vue/24/outline'
import { UserMinusIcon } from '@heroicons/vue/24/outline'
import { useUndercoverStore } from '@/stores/undercover'
import { ref } from 'vue'
import Panel from '@/components/PanelComponent.vue'

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
  dragButton: {
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
})

const showInfo = ref(false)

function toggleShowInfo() {
  if (showInfo.value) {
    showInfo.value = false
    return true
  } else {
    if (undercoverStore.DEBUG) {
      showInfo.value = true
      return true
    }
    if (Object.prototype.hasOwnProperty.call(props.player, 'password') && props.player.password) {
      const password = prompt(`Enter the password for ${props.player.name} to see their role:`, '')
      if (password === props.player.password) {
        showInfo.value = true
        return true
      } else {
        alert('Mot de passe incorrect.')
        return false
      }
    }
    if (confirm(`Est-ce que tu veux vraiment voir le rôle de ${props.player.name} ?`)) {
      showInfo.value = true
      return true
    }
  }
}

</script>