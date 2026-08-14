<template>
  <div>
    <Roles />
    <Actions :actions="[
      { name: 'Retour', type: 'dark', callback: goBack },
      { name: 'Copier', type: 'primary', callback: copyRules },
    ]" />
  </div>
</template>

<script setup>
import Actions from '@/components/ActionsComponent.vue'
import Roles from '@/components/role/ListComponent.vue'
import { notif } from '@/composables/notif.js'
import { useUndercoverStore } from '@/stores/undercover'

const undercoverStore = useUndercoverStore()

function goBack() {
  window.history.back()
}

function getRules() {
  let rules = 'Règles du jeu Undercover :\n\n'

  for (const role of Object.values(undercoverStore.allRoles)) {
    rules += `**${role.name}**\n`
    rules += `${role.description}\n`
    rules += `Objectif : ${role.goal}\n\n`
  }

  return rules
}

function copyRules() {
  let rules = getRules()
  navigator.clipboard.writeText(rules)

  notif.notify('Les règles ont été copiées dans le presse-papiers', 'info')
}

</script>
