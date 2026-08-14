<template>
  <div class="flex flex-row gap-4 items-center">
    <UserIcon class="text-primary size-7" />
    <h4 class="text-3xl my-4">{{ props.role?.name }}</h4>
  </div>
  <p class="text-sm" v-if="props.displayDescription">{{ props.role?.description }}</p>
  <p class="text-sm" v-if="props.displayGoal">Objectif ? {{ props.role?.goal }}</p>
</template>

<script setup>
import { UserIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  role: {
    type: Object,
    required: true,
  },
  displayDescription: {
    type: Boolean,
    default: true,
    required: false,
  },
  displayGoal: {
    type: Boolean,
    default: true,
    required: false,
  },
})

</script>