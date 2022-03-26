<script setup>
import { ref } from "vue";
import AppVue from "../App.vue";

const API_URL = "http://localhost:3001";

defineProps({
  popup: Boolean,
});

let username = ref("");
let password = ref("");

function createUser() {
  const user = {
    username: username.value,
    password: password.value,
  };

  console.log(JSON.stringify(user));

  fetch(API_URL + "/createUser", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json",
    },
  }).then(function (response) {
    if (response.ok) {
      response.json().then((json) => {
        console.log(json);
        alert("User " + json.username + " created!");
      });
    }
  });
}
</script>

<template>
  <Transition duration="400" name="nested">
    <div class="signupMain" v-if="popup">
      <div class="usernameContainer">
        <label>Username:</label><input type="text" v-model="username" />
      </div>
      <div class="passwordContainer">
        <label>Password:</label><input type="password" v-model="password" />
      </div>
      <slot></slot>
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
  border: solid grey 1px;
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
