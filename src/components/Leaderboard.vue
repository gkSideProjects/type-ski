<script setup>
defineProps({
  scores: Array,
});
</script>

<template>
  <div class="main-content">
    <header>
      <h1>All time high scores</h1>
    </header>
    <transition-group name="list" tag="ul">
      <li v-for="score in scores" :key="score">{{ score }}</li>
    </transition-group>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
