<template>
  <div class="flex flex-col gap-4">
    <Bento v-for="role in undercoverStore.allRoles" :key="role.id" class="p-4">
      <div class="flex flex-row gap-2 items-center">
        <UserIcon class="text-primary size-7" />
        <h4 class="text-3xl my-4">{{ role.name }}</h4>
      </div>
      <p class="text-sm">{{ role.description }}</p>
      <div class="flex flex-row flex-wrap gap-2 my-4">
        <h4 class="text-xl bg-primary rounded-xl px-1 py-0.5">Objectif ? </h4>
        <h4 class="text-xl">{{ role.goal }}</h4>
      </div>
    </Bento>
  </div>
</template>

<script setup>
import { UserIcon } from '@heroicons/vue/24/outline'
import { useUndercoverStore } from '@/stores/undercover'
import { onMounted } from 'vue';
import Bento from '@/components/BentoComponent.vue'

const undercoverStore = useUndercoverStore()

onMounted(() => {
  undercoverStore.fetchAllRoles()
})
</script>
