<template>
  <label class="inline-flex items-center cursor-pointer select-none"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }">
    <input type="checkbox" class="sr-only" :checked="localValue" @change="onChange" :disabled="disabled"
      aria-hidden="true" />

    <span role="switch" :aria-checked="String(localValue)" :aria-label="label || 'switch'" tabindex="0"
      @keydown.space.prevent="toggle" @keydown.enter.prevent="toggle"
      class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400"
      :class="localValue ? 'bg-primary' : 'bg-gray'">
      <span
        class="inline-block h-4 w-4 transform rounded-full bg-light shadow transition-transform duration-200 ease-in-out"
        :class="localValue ? 'translate-x-6' : 'translate-x-1'" />
    </span>

    <span v-if="label" class="ml-3 text-md text-light">{{ label }}</span>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['update:modelValue'])

const localValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

function toggle() {
  if (props.disabled) return
  localValue.value = !localValue.value
}

function onChange(e) {
  localValue.value = e.target.checked
}
</script>