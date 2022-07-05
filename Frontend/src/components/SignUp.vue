<script setup>
import { onUpdated, onMounted, ref, popScopeId, watch } from "vue";

const props = defineProps({
  popup: Boolean,
  transitionClass: String,
  isAcross: Boolean,
});

const usr = ref(null);

onUpdated(() => {
  if (props.popup) {
    username.value = "";
    password.value = "";
    if (props.isAcross) {
      usr.value.blur();
      setTimeout(() => {
        usr.value.focus();
      }, 500);
    } else {
      usr.value.focus();
    }
  }
});

let username = ref("");
let password = ref("");

const emit = defineEmits({
  buttonState: Boolean,
});

watch([username, password], ([username, password]) => {
  if (username.length > 0 && password.length > 0) {
      emit("buttonState", [false, { username, password }]);
  } else {
    emit("buttonState", [true, { username, password }]);
  }
});

</script>

<template>
  <Transition duration="500" name="nested">
    <div class="signupMain" v-if="popup">
      <div class="usernameContainer">
        <input
          placeholder="Username"
          ref="usr"
          type="text"
          v-model="username"
        />
      </div>
      <div class="passwordContainer">
        <input placeholder="Password" type="password" v-model="password" />
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
  transition-delay: 0s;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateY(-15px);
  opacity: 0;
}

.signupMain {
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(1px);
  top: 230px;
  right: calc(50% - 255px);
  position: absolute;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 1px rgb(0 0 0 / 20%);
  width: 200px;
  height: 105px;
}

input {
  font-family: "Nunito", sans-serif;
  padding: 2px 2px 2px 10px;
  height: 20px;
  border-radius: 5px;
  border: solid gray 1px;
}

input:focus {
  outline: none;
  border-color: black;
}

.usernameContainer {
  margin-top: 10px;
  margin-bottom: 5px;
  text-align: center;
}

.passwordContainer {
  text-align: center;
  margin-bottom: 5px;
}
</style>
