<template>
  <div>
    <div class="flex justify-between items-center gap-2 p-4 rounded-2xl border border-2 border-dark-gray">
      <div class="flex items-center gap-4">
        <EqualsIcon v-if="props.dragButton" class="size-6 text-gray" />
        <div :class="['overflow-hidden text-lg', props.player.eliminated ? ' text-gray line-through' : 'text-white']">{{
          props.player.name }}</div>
        <div v-if="undercoverStore.DEBUG_ACTIVE || props.displayRole || props.player.eliminated"
          :class="['overflow-hidden text-lg font-bold', props.player.eliminated ? ' text-gray' : 'text-secondary']">
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
          <div class="flex flex-row gap-4 items-center">
            <QuestionMarkCircleIcon class="text-primary size-7" />
            <h4 class="text-3xl my-4">Une dernière chance </h4>
          </div>
          <p class="text-lg">Mr White, quel est le mot que tu penses être le bon ?</p>
          <div class="flex justify-between items-center gap-2 mt-2 p-2 pr-4 border-b-2 border-dark-gray">
            <input class="w-full py-1.5 px-2 bg-light-dark text-white" type="text" id="name"
              placeholder="Mot de Mr. White" v-model="undercoverStore.whiteGuess" @keyup.enter="checkForWhiteGuess">
            <Button type="primary" icon="check" @click="checkForWhiteGuess"></Button>
          </div>
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
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
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

function disableReveal() {
  showReveal.value = false
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
    console.log(!undercoverStore.isGameRunning)
    if (!undercoverStore.isGameRunning || undercoverStore.DEBUG_ACTIVE || password === props.player.password) {
      showInfo.value = true
      return true
    } else {
      alert('Mot de passe incorrect.')
      return false
    }
  }

  if (!undercoverStore.isGameRunning || undercoverStore.DEBUG_ACTIVE || confirm(`Est-ce que tu veux vraiment voir le rôle de ${props.player.name} ?`)) {
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

function checkForWhiteGuess() {
  if (undercoverStore.checkForWhiteGuess(props.player.id)) {
    // If the guess is correct, we keep the reveal open
  } else {
    disableReveal()
  }
}

</script>