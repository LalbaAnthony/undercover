<template>
  <TransitionRoot appear :show="props.show" as="template">
    <Dialog as="div" @hide="emit('hide', true)" class="relative z-20">
      <TransitionChild @click="emit('hide', true)" as="template" enter="transition ease-in-out duration-300"
        enter-from="opacity-0" enter-to="opacity-100" leave="transition ease-in-out duration-300"
        leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-dark bg-opacity-0 blur-xs transition-opacity"></div>
      </TransitionChild>
      <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="translate-y-full"
        enter-to="translate-y-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-y-0"
        leave-to="translate-y-full">
        <DialogPanel class="bg-light-dark p-6 fixed inset-0 mt-48">
          <div class="flex items-center justify-end gap-3">
            <XMarkIcon class="size-10 text-gray-light cursor-pointer" @click.stop="emit('hide', true)" />
          </div>

          <!-- Content -->
          <div>
            <slot />
          </div>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  show: {
    type: Boolean,
    required: false,
    default: false
  },
})

const emit = defineEmits(['hide'])

</script>
