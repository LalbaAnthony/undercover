<template>
    <div class="flex flex-col gap-4">
        <Bento v-for="role in undercoverStore.allRoles" :key="role.id">
            <Role :role="role" />
        </Bento>
    </div>
</template>

<script setup>
import Bento from '@/components/BentoComponent.vue'
import Role from '@/components/role/ItemComponent.vue'
import { onMounted } from 'vue';
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

onMounted(() => {
    undercoverStore.fetchAllRoles()
})
</script>
