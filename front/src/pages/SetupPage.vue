<template>
  <div class="setup">
    <Players :deleteButton="true" :dragButton="true" :addButton="true" class="a" />
    <Roles class="b" />
    <Settings class="c" />
    <Actions class="d" :actions="[
      { name: 'Réinitialiser', type: 'dark', callback: () => resetAll() },
      { name: 'Jouer', type: 'primary', callback: () => undercoverStore.startGame() }
    ]" />
  </div>
</template>

<script setup>
import Players from '@/components/player/ListComponent.vue'
import Roles from '@/components/role/RepartitionComponent.vue'
import Settings from '@/components/setting/ListComponent.vue'
import Actions from '@/components/ActionsComponent.vue'
import { onMounted } from 'vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

function resetAll() {
  if (undercoverStore.DEBUG_ACTIVE || confirm('Es-tu sûr de vouloir réinitialiser la configuration ?')) {
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