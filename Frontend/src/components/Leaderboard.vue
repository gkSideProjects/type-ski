<script setup>
defineProps({
  scores: Array,
});
</script>

<template>
  <div class="main-content lead">
    <header class="title">
      <p>All time high scores</p>
    </header>
    <div class="listContainer">
      <transition-group name="list">
        <li class="scores" v-for="(score, index) in scores" :key="score.id">
          <p class="index2">{{ index + 1 }}</p>
          <p class="name">{{ score.id }}</p>
          <p class="wpm">{{ score.value }}wpm</p>
        </li>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.main-content.lead {
  box-shadow: 0px 0px 10px 1px rgb(0 0 0 / 20%);
  width: 500px;
  border-radius: 8px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.title {
  font-size: 30px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.scores {
  display: flex;
  list-style-type: none;
  padding: 0;
  font-size: 20px;
  white-space: nowrap;
}

p {
  margin: 0;
}

.index2 {
  width: 10px;
  padding-left: 20px;
  padding-right: 5px;
}

.scores .name {
  margin-left: 30%;
}

.scores .wpm {
  padding-right: 20px;
  margin-left: auto;
}
</style>
