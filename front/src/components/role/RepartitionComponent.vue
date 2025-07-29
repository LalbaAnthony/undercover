<template>
    <Bento title="Répartition des rôles" class="b">
        <div class="flex flex-col gap-2">
            <div v-for="(role, key) in undercoverStore.allRoles" :key="key"
                class="flex justify-between items-center gap-4">
                <button
                    class="cursor-pointer rounded-lg disabled:cursor-not-allowed disabled:bg-dark-gray bg-primary text-white p-1 hover:scale-105 transition-all duration-200"
                    :disabled="!undercoverStore.canDecrementDistribution(key)"
                    @click="undercoverStore.decrementDistribution(key)">
                    <MinusIcon class="size-6 text-light" />
                </button>
                <div>
                    {{ undercoverStore.distribution[key] }}&nbsp;
                    <span class="text-xl">{{ role.name }}</span>
                </div>
                <button
                    class="cursor-pointer rounded-lg disabled:cursor-not-allowed disabled:bg-dark-gray bg-primary text-white p-1 hover:scale-105 transition-all duration-200"
                    :disabled="!undercoverStore.canIncrementDistribution(key)"
                    @click="undercoverStore.incrementDistribution(key)">
                    <PlusIcon class="size-6 text-light" />
                </button>
            </div>
        </div>
    </Bento>
</template>

<script setup>
import Bento from '@/components/BentoComponent.vue'
import { MinusIcon } from '@heroicons/vue/24/solid'
import { PlusIcon } from '@heroicons/vue/24/solid'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

</script>
