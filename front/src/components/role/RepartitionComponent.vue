<template>
    <Bento title="Répartition des rôles">
        <div class="flex flex-col gap-2">
            <div v-for="(role, key) in undercoverStore.allRoles" :key="key"
                class="flex justify-between items-center gap-4">
                <Button icon="minus" :disabled="!undercoverStore.canDecrementDistribution(key)"
                    @click="undercoverStore.decrementDistribution(key)">
                </Button>
                <div>
                    {{ undercoverStore.distribution[key] }}&nbsp;
                    <span class="text-xl">{{ role.name }}</span>
                </div>
                <Button icon="plus" :disabled="!undercoverStore.canIncrementDistribution(key)"
                    @click="undercoverStore.incrementDistribution(key)">
                </Button>
            </div>
        </div>
    </Bento>
</template>

<script setup>
import Button from '@/components/ButtonComponent.vue'
import Bento from '@/components/BentoComponent.vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

</script>
