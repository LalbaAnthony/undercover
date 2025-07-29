<template>
  <div class="flex flex-col gap-4">
    <Bento v-for="role in undercoverStore.allRoles" :key="role.id">
      <Role :role="role" />
    </Bento>
  </div>
</template>

<script setup>
import { useUndercoverStore } from '@/stores/undercover'
import { onMounted } from 'vue';
import Bento from '@/components/BentoComponent.vue'
import Role from '@/components/RoleComponent.vue'

const undercoverStore = useUndercoverStore()

onMounted(() => {
  undercoverStore.fetchAllRoles()
})
</script>
