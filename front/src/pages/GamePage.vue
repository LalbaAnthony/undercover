<template>
  <div>
    <div class="m-4">
      <Grid :items="undercoverStore.players">
        <template #item="{ item }">
          <Player :player="item" :displayRole="true" />
        </template>
      </Grid>
    </div>
  </div>
</template>

<script setup>
import Grid from '@/components/GridComponent.vue'
import Player from '@/components/undercover/PlayerComponent.vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

</script>

<style scoped></style>