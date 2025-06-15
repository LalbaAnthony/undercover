<template>
  <div
    class="flex flex-col items-center justify-center gap-4 h-96 max-w-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <p class="text-4xl text-center font-bold text-light">Not Found</p>
    <p class="text-lg text-center text-light">The page you are looking for does not exist.</p>
    <button class="mt-8 text-light py-1.5 px-3 rounded-lg cursor-pointer transition-colors	duration-300 bg-primary"
      @click="goHome()">Accueil</button>
  </div>
</template>

<script setup>

function goHome() {
  window.location.href = '/'
}

</script>