<template>
  <footer>
    <p class="text-center text-light-gray text-sm p-2">{{ VITE_APP_NAME }} par {{ VITE_APP_AUTHOR_NAME }}<br>
      Version {{ VITE_APP_VERSION }}</p>
    <div class="text-center text-light-gray text-sm p-2">
      <button class="text-primary hover:underline" @click="deleteAll">Supprimer toutes les données</button>
      <span> | <a :href="VITE_GIT_REPO + '/issues'" target="_blank" class="text-primary hover:underline"
          @click="undercoverStore.printGameState()">Signaler un bug</a></span>
      <span v-if="undercoverStore.DEBUG"> | <button class="text-primary hover:underline"
          @click="undercoverStore.printGameState()">Debug</button></span>
    </div>
  </footer>
</template>

<script setup>
import { VITE_APP_NAME } from '@/config';
import { VITE_APP_AUTHOR_NAME } from '@/config';
import { VITE_APP_VERSION } from '@/config';
import { useUndercoverStore } from '@/stores/undercover'
import { VITE_GIT_REPO } from '@/config'

const undercoverStore = useUndercoverStore()

function deleteAll() {
  if (confirm('Es-tu sûr de vouloir supprimer toutes les données ?')) {
    if (undercoverStore.isGameRunning && !confirm('La partie en cours sera perdue. Es-tu sûr de vouloir continuer ?')) {
      return;
    }
    undercoverStore.deleteAll()
    window.location.reload()
  }
}

</script>