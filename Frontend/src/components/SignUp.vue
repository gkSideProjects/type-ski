<script setup>
import { nextTick, onUpdated, ref } from "vue";

const props = defineProps({
  popup: Boolean,
});

const usr = ref(null);

onUpdated(() => {
  if (props.popup) {
    usr.value.focus();
  }
});

let username = ref("");
let password = ref("");
</script>

<template>
  <Transition duration="400" name="nested">
    <div class="signupMain" v-if="popup">
      <div class="usernameContainer">
        <label>Username:</label
        ><input ref="usr" type="text" v-model="username" />
      </div>
      <div class="passwordContainer">
        <label>Password:</label><input type="password" v-model="password" />
      </div>
      <slot :username="username" :password="password"></slot>
    </div>
  </Transition>
</template>

<style scoped>
.nested-enter-active,
.nested-leave-active {
  transition: all 0.3s ease-in-out;
}
/* delay leave of parent element */
.nested-leave-active {
  transition-delay: 0;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateY(-15px);
  opacity: 0;
}

.signupMain {
  top: 140px;
  right: calc(50% - 300px);
  position: absolute;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 1px rgb(0 0 0 / 20%);
  width: 300px;
  height: 100px;
  background-image: linear-gradient(to right, orange, darkorange);
}

input {
  width: 120px;
  height: 15px;
  border-radius: 3px;
  border: solid gray 1px;
}

label {
  margin-left: 15px;
  float: left;
}

.usernameContainer {
  margin-top: 20px;
  text-align: right;
  margin-right: 20px;
}

.passwordContainer {
  text-align: right;
  margin-right: 20px;
}
</style>
