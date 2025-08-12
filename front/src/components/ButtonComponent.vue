<template>
  <button :class="[
    'text-lg rounded-lg cursor-pointer disabled:cursor-not-allowed transition-colors duration-300',
    props.text ? 'py-1.5 px-3' : 'p-1.5',
    props.visible ? '' : 'opacity-0',
    classes[props.type],
    props.class
  ]" :disabled="props.disabled" @click="props.callback">
    <component v-if="props.icon" :is="icons[props.icon]" :class="[`size-${props.iconSize}`]" />
    <slot></slot>
    <span v-if="props.text">{{ props.text }}</span>
  </button>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { MinusIcon } from '@heroicons/vue/24/solid'
import { PlusIcon } from '@heroicons/vue/24/solid'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { NewspaperIcon } from '@heroicons/vue/24/outline'
import { BugAntIcon } from '@heroicons/vue/24/outline'
import { EyeIcon } from '@heroicons/vue/24/outline'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { EqualsIcon } from '@heroicons/vue/24/outline'
import { UserMinusIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  type: {
    type: String,
    possibleValues: ['primary', 'secondary', 'dark'],
    default: 'primary',
    required: false,
  },
  text: {
    type: String,
    default: null,
    required: false,
  },
  icon: {
    type: String,
    default: null,
    required: false,
  },
  iconSize: {
    type: Number,
    default: 6,
    required: false,
  },
  class: {
    type: String,
    default: '',
    required: false,
  },
  visible: {
    type: Boolean,
    default: true,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
    required: false,
  },
  callback: {
    type: Function,
    required: false,
  },
})

const classes = ref({
  primary: 'text-light bg-primary disabled:bg-dark-gray',
  secondary: 'text-light bg-secondary disabled:bg-dark-gray',
  dark: 'text-light bg-light-dark disabled:bg-dark-gray',
})

const icons = ref({
  minus: shallowRef(MinusIcon),
  plus: shallowRef(PlusIcon),
  chevronLeft: shallowRef(ChevronLeftIcon),
  newspaper: shallowRef(NewspaperIcon),
  bug: shallowRef(BugAntIcon),
  eye: shallowRef(EyeIcon),
  trash: shallowRef(TrashIcon),
  equals: shallowRef(EqualsIcon),
  userMinus: shallowRef(UserMinusIcon),
})

</script>
