<template>
  <div  class="bg-light-dark rounded-2xl p-6 my-4">
    <h2 v-if="props.title" class="text-2xl mb-10 text-left text-light">
      {{ props.title }}
    </h2>
    <slot></slot>
  </div>
</template>

<script setup>

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
})

</script>
