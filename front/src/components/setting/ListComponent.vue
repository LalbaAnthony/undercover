<template>
    <Bento title="Paramètres">
        <div class="flex flex-row flex-wrap flexitems-center gap-x-8 gap-y-4 mx-4">
            <Switch v-model="undercoverStore.settings.randomStartingPlayer" label="Joueur de départ aléatoire" />
            <Switch v-model="undercoverStore.settings.canWhiteStart" label="Mister White peut commencer" />
            <Switch v-model="undercoverStore.settings.randomOrder" label="Ordre aléatoire des joueurs" />
        </div>
    </Bento>
</template>

<script setup>
import Switch from '@/components/SwitchComponent.vue'
import Bento from '@/components/BentoComponent.vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

</script>
