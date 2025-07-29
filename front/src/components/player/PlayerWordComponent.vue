<template>
  <div class="flex flex-row gap-4 items-center">
    <ChatBubbleLeftEllipsisIcon class="text-primary size-7" />
    <h4 class="text-3xl my-4">{{ props.word }}</h4>
  </div>
</template>

<script setup>
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  word: {
    type: String,
    required: true,
  },
})

</script>