<template>
  <div>
    <div class="flex justify-between items-center gap-2 p-4 rounded-2xl border border-2 border-dark-gray">
      <div class="flex items-center gap-4">
        <EqualsIcon v-if="props.dragButton" class="size-6 text-gray" />
        <div :class="['overflow-hidden', props.player.eliminated ? ' text-gray line-through' : 'text-white']">{{
          props.player.name }}</div>
        <div v-if="undercoverStore.DEBUG_ACTIVE || props.displayRole"
          :class="['font-bold overflow-hidden', props.player.eliminated ? ' text-gray' : 'text-secondary']">
          {{ undercoverStore.getRole(props.player.role).name }}
        </div>
      </div>
      <div class="flex items-center justify-end gap-2">
        <Button v-if="props.deleteButton" type="dark" icon="trash" class="text-primary"
          @click.stop="undercoverStore.deletePlayer(props.player.id)">
        </Button>
        <Button v-if="props.seeButton" type="secondary" icon="eye" :disabled="props.player.eliminated"
          @click.stop="enableShowInfo()"> </Button>
        <Button v-if="props.eliminateButton" type="primary" icon="userMinus" :disabled="props.player.eliminated"
          @click.stop="eliminatePlayer()"> </Button>
      </div>
    </div>

    <Panel :show="showReveal" @hide="showReveal = false">
      <div class="flex flex-col gap-4"> 
        <h4 class="text-3xl">{{ props.player.name }} était ...</h4>
        <Role :role="undercoverStore.getRole(props.player.role)" :displayGoal="false" :displayDescription="true" />
        <div v-if="props.player.role === 'white'">
          <!-- TODO Suite à l'élimination de Mr White, il doit deviner le mot des civils -->
        </div>
      </div>
    </Panel>

    <Panel :show="showInfo" @hide="showInfo = false">
      <div class="flex flex-col gap-4">
        <Word v-if="props.player.role !== 'white'" :word="undercoverStore?.getPlayerWord(props.player.id)" />
        <Role :role="undercoverStore.getRole(props.player.role)" />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import Button from '@/components/ButtonComponent.vue'
import Word from '@/components/word/ItemComponent.vue'
import Role from '@/components/role/ItemComponent.vue'
import { EqualsIcon } from '@heroicons/vue/24/outline'
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

const showReveal = ref(false)
const showInfo = ref(false)

function enableReveal() {
  showReveal.value = true
}

function enableShowInfo() {
  if (showInfo.value) {
    showInfo.value = false
    return true
  }

  if (undercoverStore.DEBUG_ACTIVE) {
    showInfo.value = true
    return true
  }

  if (Object.prototype.hasOwnProperty.call(props.player, 'password') && props.player.password) {
    const password = prompt(`Enter the password for ${props.player.name} to see their role:`, '')
    if (undercoverStore.DEBUG_ACTIVE || password === props.player.password) {
      showInfo.value = true
      return true
    } else {
      alert('Mot de passe incorrect.')
      return false
    }
  }

  if (undercoverStore.DEBUG_ACTIVE || confirm(`Est-ce que tu veux vraiment voir le rôle de ${props.player.name} ?`)) {
    showInfo.value = true
    return true
  }
}

function eliminatePlayer() {
  if (undercoverStore.DEBUG_ACTIVE || confirm(`Es-tu sûr de vouloir éliminer ${props.player.name} ?`)) {
    if (undercoverStore.eliminatePlayer(props.player.id)) {
      enableReveal()
    }
  }
}

</script>