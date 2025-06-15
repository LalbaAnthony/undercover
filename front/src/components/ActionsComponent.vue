<template>
  <Bento>
    <div class="flex justify-center items-center gap-4">
      <div v-for="action in props.actions" :key="action.name">
        <button
          :class="['text-light py-1.5 px-3 rounded-lg cursor-pointer transition-colors	duration-300', action.type === 'primary' ? 'bg-primary' : 'hover:bg-light-dark']"
          @click="action.callback" :disabled="action?.disabled" class="w-full">
          {{ action.name }}
        </button>
      </div>
    </div>
  </Bento>
</template>

<script setup>
import Bento from '@/components/BentoComponent.vue'

const props = defineProps({
  actions: {
    type: Array,
    required: true,
  },
})

</script>
