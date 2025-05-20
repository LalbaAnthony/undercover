<template>
  <footer>
    <p class="text-center text-light-gray text-sm p-2">{{ VITE_APP_NAME }} par {{ VITE_APP_AUTHOR_NAME }}<br>
      Version {{ VITE_APP_VERSION }}</p>
  </footer>
</template>

<script setup>
import { VITE_APP_NAME } from '@/config';
import { VITE_APP_AUTHOR_NAME } from '@/config';
import { VITE_APP_VERSION } from '@/config';
</script>