<template>
    <Bento v-for="role in undercoverStore.allRoles" :key="role.id">
        <Role :role="role" />
    </Bento>
</template>

<script setup>
import { useUndercoverStore } from '@/stores/undercover'
import { onMounted } from 'vue';
import Bento from '@/components/BentoComponent.vue'
import Role from '@/components/role/ItemComponent.vue'

const undercoverStore = useUndercoverStore()

onMounted(() => {
    undercoverStore.fetchAllRoles()
})
</script>
