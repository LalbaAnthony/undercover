<template>
  <footer>
    <p class="text-center text-light-gray text-sm p-2">{{ VITE_APP_NAME }} par {{ VITE_APP_AUTHOR_NAME }}<br>
      Version {{ VITE_APP_VERSION }}</p>
    <div class="text-center text-light-gray text-sm p-2">
      <router-link to="/rules" class="text-secondary text-md hover:underline">Règles</router-link>
      <span class="text-gray">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
      <a :href="VITE_GIT_REPO + '/issues'" target="_blank" class="text-secondary text-md hover:underline"
        @click="undercoverStore.debugGameState()">Signaler un bug</a>
      <span class="text-gray">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
      <span class="text-secondary text-md hover:underline" @click="deleteAll">Supprimer tout</span>
    </div>
  </footer>
</template>

<script setup>
import { VITE_APP_NAME } from '../../config';
import { VITE_APP_AUTHOR_NAME } from '../../config';
import { VITE_APP_VERSION } from '../../config';
import { useUndercoverStore } from '@/stores/undercover'
import { VITE_GIT_REPO } from '../../config'

const undercoverStore = useUndercoverStore()

function deleteAll() {
  if (confirm('Es-tu sûr de vouloir supprimer toutes les données ?')) {
    if (undercoverStore.isGameRunning && !confirm('La partie en cours sera perdue. Es-tu sûr de vouloir continuer ?')) {
      return;
    }

    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }
}

</script>