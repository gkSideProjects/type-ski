<script setup>
const props = defineProps({
  userProf: String,
  signInState: Boolean,
});
</script>

<template>
  <div class="header">
    <div class="headerContainer">
      <div class="headerImageContainer">
        <a href="#"><img id="header-image" src="../assets/type-ski.png" /></a>
      </div>
      <nav class="header-menu">
        <li><a href="#">/ about&nbsp;&nbsp; </a></li>
        <li><a href="#">/ contact &nbsp;&nbsp;</a></li>
        <li>
          <a href="#" @click.prevent="$emit('signinEvent')"
            >/ {{ userProf }}&nbsp;&nbsp;
          </a>
        </li>
        <li>
          <a
            :class="{ disableSignUp: props.signInState }"
            href="#"
            @click.prevent="$emit('signupEvent')"
            >/ sign up&nbsp;&nbsp;
          </a>
        </li>
      </nav>
    </div>
  </div>
</template>

<style scoped>
* {
  color: black;
}

.disableSignUp {
  color: lightgrey;
  pointer-events: none;
}
</style>
