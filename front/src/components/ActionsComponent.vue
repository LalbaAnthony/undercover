<template>
  <Bento>
    <div class="flex justify-center items-center gap-4">
      <div v-for="action in props.actions" :key="action.name">
        <Button :text="action.name" :type="action?.type" :disabled="action?.disabled" @click="action.callback"
          :class="action?.class">
        </Button>
      </div>
    </div>
  </Bento>
</template>

<script setup>
import Button from '@/components/ButtonComponent.vue'
import Bento from '@/components/BentoComponent.vue'

const props = defineProps({
  actions: {
    type: Array,
    required: true,
  },
})

</script>
