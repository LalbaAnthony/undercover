<template>
    <Bento>
        <div class="flex items-center justify-evenly flex-wrap gap-x-6 gap-y-4">
            <div v-for="(role, key) in undercoverStore.allRoles" :key="key">
                <div v-if="undercoverStore.numberOfPlayersByRole(key) > 0">
                    <span
                        :class="['text-xl font-bold', undercoverStore.numberOfPlayersRemainingByRole(key) > 0 ? 'text-primary' : '']">{{
                            undercoverStore.numberOfPlayersRemainingByRole(key) }}</span>
                    <span>&nbsp;/&nbsp;</span>
                    <span class="text-xl font-bold">{{ undercoverStore.numberOfPlayersByRole(key) }}</span>
                    <span>&nbsp;&nbsp; {{
                        undercoverStore.numberOfPlayersRemainingByRole(key) > 1 ? role.labels.plural :
                            role.labels.singular
                    }}</span>
                </div>
            </div>
        </div>
    </Bento>
</template>

<script setup>
import Bento from '@/components/BentoComponent.vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

</script>
