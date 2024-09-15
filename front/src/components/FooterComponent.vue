<template>
  <footer>
    <p class="text-center text-light-gray text-sm p-4">{{ VITE_SITE_NAME }} par {{ VITE_AUTHOR_NAME }}</p>
  </footer>
</template>

<script setup>
import { VITE_SITE_NAME } from '@/config';
import { VITE_AUTHOR_NAME } from '@/config';
</script>