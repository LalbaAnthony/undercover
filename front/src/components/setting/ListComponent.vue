<template>
    <Bento title="Paramètres" class="c">
        <div class="flex flex-row flex-wrap flexitems-center gap-x-8 gap-y-4 mx-4">
            <div class="flex flex-row gap-2">
                <input v-model="undercoverStore.settings.randomStartingPlayer" id="randomStartingPlayer" name="randomStartingPlayer" type="checkbox" />
                <label for="randomStartingPlayer">Joueur de départ aléatoire</label>
            </div>
            <div class="flex flex-row gap-2">
                <input v-model="undercoverStore.settings.canMrWhiteStart" id="canMrWhiteStart" name="canMrWhiteStart" type="checkbox" />
                <label for="canMrWhiteStart">Mister White peut commencer</label>
            </div>
            <div class="flex flex-row gap-2">
                <input v-model="undercoverStore.settings.randomOrder" id="randomOrder" name="randomOrder" type="checkbox" />
                <label for="randomOrder">Ordre aléatoire des joueurs</label>
            </div>
        </div>
    </Bento>
</template>

<script setup>
import Bento from '@/components/BentoComponent.vue'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

</script>
