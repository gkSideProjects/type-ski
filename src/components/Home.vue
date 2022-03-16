<script setup>
import { arrayOfTests, arrayOfTests2 } from "../text.js";
import { ref, reactive, computed } from "vue";

/* Array that is filled by the chosen text from 'arrayOfTests' after a split of
the text. Each word has it's own location in the array */
var textArray = ref([]);

let showTimer = ref(false);

let showMain = ref(true);
let showPracticeDiv = ref(false);
let showText = ref(true);
let showInput = ref(true);
let showInformation = ref(false);
let showButton = ref(false);

let textValue = ref("");
let arrayCount = ref(0);
let counter = ref(0);
let seconds = ref(150);
let timeInterval = ref(0);
let letterCount = ref(1);
let finalTime = ref(0);

function clickShow() {
  showTimer.value = true;
  showMain.value = false;
  showPracticeDiv.value = true;
  resetValues();
  resetValues1();
}

function clickHome() {
  showMain.value = true;
  showPracticeDiv.value = false;
  showButton.value = false;
}

function resetValues() {
  showInformation.value = false;
  showTimer.value = true;
  textValue.value = "";
  showText.value = true;
  showInput.value = true;
  showButton.value = false;
  seconds.value = 150;
  arrayCount.value = 0;
}

function resetValues1() {
  counter.value = 0;
  splitWords.value = Math.floor(Math.random() * 2);
  letterCount.value = 1;
  timeInterval.value = 0;
  textValue.value = "";
}

function timerMethod() {
  console.log(seconds.value);
  seconds.value--;
}

let wordRef = ref([]);

function finish(event) {
  if (
    splitWords.value[arrayCount.value] ===
      splitWords.value[splitWords.value.length - 1] &&
    textValue.value === splitWords.value[arrayCount.value]
  ) {
    finalTime.value = 150 - seconds.value;
    clearInterval(timeInterval.value);
    showText.value = false;
    showInput.value = false;
    showButton.value = true;
    showInformation.value = true;
    showTimer.value = false;
    for (var i = 0; i < wordRef.value.length; i++) {
      wordRef.value[i].style.color = "black";
    }
    resetValues1();
  }
}

function clearText(event) {
  if (timeInterval.value === 0) {
    timeInterval.value = setInterval(timerMethod, 1000);
  }

  if (
    textValue.value === splitWords.value[arrayCount.value] &&
    textValue.value !== ""
  ) {
    wordRef.value[counter.value].style.color = "#00b300";
    event.preventDefault();
    counter.value++;
    textValue.value = "";
    return arrayCount.value++;
  }

  wordRef.value[counter.value].style.color = "indianred";

  if (event.key === " ") {
    event.preventDefault();
  }
}

let finalWpm = computed(() => {
  return Math.round((60 / finalTime.value) * arrayCount.value);
});

let wpm = computed(() => {
  if (seconds.value < 150 && arrayCount.value > 0) {
    return Math.round((60 / (150 - seconds.value)) * arrayCount.value);
  } else {
    return 0;
  }
});

let splitWords = computed({
  get() {
    return (textArray =
      arrayOfTests2[Math.floor(Math.random() * 2)].split(" "));
  },
  set(newVal) {
    textArray = arrayOfTests2[newVal].split(" ");
    splitWords.length = textArray.length;
    for (var i = 0; i < textArray.length; i++) {
      splitWords[i] = textArray[i];
    }
  },
});
// var app = new Vue({
//   el: "#main",
//   data: {},
// });
//Vue.component("main-content", {
</script>

<template>
  <!-- Vue component comprising of the main functionality of the site -->
  <div class="main-content">
    <div v-if="showMain" class="main-menu">
      <img style="height: 40px; width: 60px" src="../assets/type-ski.png" />
      <a href="#" @click="clickShow"
        ><p style="margin: 0; font-size: 30px">Take test</p></a
      >
    </div>
    <div v-if="showPracticeDiv" class="practice-div">
      <div class="text-border">
        <p
          id="text-to-type"
          v-if="showText"
          :ref="(el) => (wordRef[i] = el)"
          class="typeText"
          v-for="(splitWord, i) in splitWords"
        >
          {{ splitWord }}
        </p>
        <input
          class="enter-text"
          v-if="showInput"
          @keydown="clearText"
          @keyup="finish"
          v-model="textValue"
        />
        <p v-if="showTimer">
          {{ "Time : " + seconds }}<br />{{ "wpm : " + wpm }}
        </p>
        <p id="information" v-if="showInformation">
          {{ "You typed the text at " + finalWpm + " wpm" }}
        </p>
      </div>
    </div>
    <div class="nextRaceDiv" v-if="showButton">
      <button @click="resetValues" class="nextRace">next race</button>
      <button @click="clickHome" class="nextRace">Home</button>
    </div>
  </div>
</template>

<style>
/*
  Author: George Kombostiotis,
  Version: 1.0.0
 */

html,
body {
  margin: 0;
  max-width: 100%;
  min-width: 500px;
  overflow-x: hidden;
}

.header {
  width: 100%;
  height: 100px;
  display: flex;
  padding: 20px;
  background-image: linear-gradient(to right, orange, darkorange);
  border-bottom: 3px black solid;
  font-family: Solway, sans-serif;
}

#header-image {
  height: 100px;
  width: 150px;
}

.header-menu li {
  list-style-type: none;
  display: inline;
  padding-left: 10px;
}

.header-menu {
  margin-top: 70px;
  margin-left: 20px;
  font-size: 20px;
}

a:visited,
a:link {
  text-decoration: none;
  color: inherit;
}

.main-content {
  height: 450px;
  width: 500px;
  background-image: linear-gradient(to right, orange, darkorange);
  margin: 50px auto 50px auto;
  border-radius: 20px;
  border-color: grey;
  border-style: solid;
  font-family: Solway, sans-serif;
}

.main-menu {
  margin: 40px 0 10px 40px;
  display: flex;
}

.main-menu > a {
  padding-left: 20px;
}

@media only screen and (max-width: 550px) {
  html,
  body {
    min-width: 100%;
  }
  .header {
    min-width: 100%;
  }
  .main-content {
    width: 90%;
    min-width: 300px;
  }
}

.typeText {
  font-size: 20px;
  margin: 0;
  padding-right: 7px;
  text-align: center;
}

.typeText2 {
  font-size: 20px;
  margin: 0;
  padding-right: 7px;
  text-align: center;
  color: black;
}

.practice-div {
  border-radius: 20px;
  border-color: lightgrey;
  border-style: solid;
  background-color: #f2f2f2;
  margin: 50px auto 10px auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 85%;
}

.text-border {
  margin: 20px auto 20px auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 85%;
}

.enter-text {
  border-radius: 5px;
  width: 100%;
  margin: 30px auto 10px auto;
  height: 30px;
  font-size: 25px;
  background-color: white;
  font-family: Solway, sans-serif;
}

.highlight-word {
  background-color: lightgreen;
  font-size: 20px;
  margin: 0;
  padding-right: 10px;
  text-align: center;
}

.nextRaceDiv {
  margin: 30px auto 10px auto;
  width: 85%;
  bottom: 10px;
}

.nextRace {
  width: 100px;
  height: 40px;
  border-radius: 10px;
  font-family: Solway, sans-serif;
  font-size: 15px;
  background-image: linear-gradient(to right, orange, darkorange);
  font-weight: bold;
}
</style>
