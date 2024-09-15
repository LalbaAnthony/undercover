<template>
  <div>
    {{ props.player }}
  </div>
</template>

<script setup>

const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
  displayRole: {
    type: Boolean,
    default: false,
    required: false,
  },
})

</script>

<style scoped></style>