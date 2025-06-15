<template>
  <div class="flex flex-row gap-2 items-center">
    <UserIcon class="text-primary size-7" />
    <h4 class="text-3xl my-4">{{ props.role?.name }}</h4>
  </div>
  <p class="text-sm">{{ props.role?.description }}</p>
  <div class="flex flex-row flex-wrap gap-2 my-4">
    <h4 class="text-xl bg-primary rounded-xl px-2 py-0.5">Objectif ? </h4>
    <h4 class="text-xl">{{ props.role?.goal }}</h4>
  </div>
</template>

<script setup>
import { UserIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  role: {
    type: Object,
    required: true,
  },
})

</script>