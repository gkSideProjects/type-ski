<script setup></script>

<template>
  <div class="header">
    <div class="headerContainer">
      <div class="headerImageContainer">
        <a href="index.html"
          ><img id="header-image" src="../assets/type-ski.png"
        /></a>
      </div>
      <nav class="header-menu">
        <li><a href="#">/ about&nbsp;&nbsp; </a></li>
        <li><a href="#">/ contact &nbsp;&nbsp;</a></li>
        <li>
          <a href="#" @click.prevent="$emit('anotherEvent')"
            >/ sign in&nbsp;&nbsp;
          </a>
        </li>
        <li>
          <a href="#" @click.prevent="$emit('someEvent')"
            >/ sign up&nbsp;&nbsp;
          </a>
        </li>
      </nav>
    </div>
  </div>
</template>

<style></style>
