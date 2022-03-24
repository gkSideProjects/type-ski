<script setup>
defineProps({
  popup: Boolean,
});
</script>

<template>
  <Transition duration="400" name="nested">
    <div class="signupMain" v-if="popup">
      <div class="usernameContainer">
        <label>Username:</label><input type="text" />
      </div>
      <div class="passwordContainer">
        <label>Password:</label><input type="text" />
      </div>
      <div class="buttonContainer"><button>Create</button></div>
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
  transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateY(-15px);
  opacity: 0;
}

.signupMain {
  top: 140px;
  right: 30%;
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

button {
  margin-top: 5px;
  width: 100px;
  height: 20px;
  border-radius: 3px;
  border: 1px black solid;
  font-family: "Nunito", sans-serif;
  font-size: 10px;
  background-image: linear-gradient(to right, orange, darkorange);
  font-weight: bold;
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

.buttonContainer {
  text-align: center;
}
</style>
