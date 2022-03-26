<script setup>
import { arrayOfTests, arrayOfTests2 } from "../text.js";
import { ref, reactive, computed, nextTick } from "vue";
import Leaderboard from "./Leaderboard.vue";
import SignUp from "./SignUp.vue";
import Header from "./Header.vue";
import { hash } from "bcryptjs";

/* Array that is filled by the chosen text from 'arrayOfTests' after a split of
the text. Each word has it's own location in the array */
let textArray = ref([]);
let leaderboardScores = ref([]);

let show = ref(false);
let show2 = ref(false);

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

let wordRef = ref([]);
const textInput = ref(null);

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
  nextTick(() => {
    textInput.value.focus();
  });
}

function resetValues1() {
  counter.value = 0;
  splitWords.value = Math.floor(Math.random() * 2);
  letterCount.value = 1;
  timeInterval.value = 0;
  textValue.value = "";
}

function timerMethod() {
  seconds.value--;
}

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
    const temp = { id: Math.random(), value: finalWpm.value };
    addScoretoLeaderboard(temp);
    console.log(leaderboardScores.value);
    for (var i = 0; i < wordRef.value.length; i++) {
      wordRef.value[i].style.color = "black";
    }
    resetValues1();
  }
}

function addScoretoLeaderboard(wpm) {
  const leaderScore = leaderboardScores.value.length;

  if (leaderScore === 0) {
    leaderboardScores.value.push(wpm);
  } else if (leaderScore < 4) {
    const found = leaderboardScores.value.find(
      (element) => element.value < wpm.value
    );

    if (found === undefined) {
      leaderboardScores.value.push(wpm);
    } else {
      const indexFound = leaderboardScores.value.indexOf(found);
      leaderboardScores.value.splice(indexFound, 0, wpm);
    }
  } else {
    const lowest = leaderboardScores.value[leaderboardScores.value.length - 1];
    if (lowest.value < wpm.value) {
      const found = leaderboardScores.value.find(
        (element) => element.value < wpm.value
      );
      const indexFound = leaderboardScores.value.indexOf(found);
      leaderboardScores.value.pop();
      setTimeout(() => {
        leaderboardScores.value.splice(indexFound, 0, wpm);
      }, 500);
    }
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
  let result = Math.round(
    (60 / (150 - seconds.value - 0.5)) * arrayCount.value
  );
  if (seconds.value < 149) {
    return result;
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

async function changeView() {
  if (show2.value) {
    await changeView2();
    setTimeout(() => {
      show.value = !show.value;
    }, 300);
  } else {
    show.value = !show.value;
  }
}

async function changeView2() {
  if (show.value) {
    await changeView();
    setTimeout(() => {
      show2.value = !show2.value;
    }, 300);
  } else {
    show2.value = !show2.value;
  }
}

function hidePop() {
  show.value = false;
  show2.value = false;
}

const API_URL = "http://localhost:3001";

async function createUser(username, password) {
  const hashedPassword = await hash(password, 10);

  const user = {
    username: username,
    password: hashedPassword,
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
  <Header @some-event="changeView" @another-event="changeView2"></Header>
  <SignUp :popup="show2" style="right: calc(50% - 180px)">
    <div class="buttonContainer">
      <button @click="logIn">Login</button>
    </div>
  </SignUp>
  <SignUp v-slot="slotProps" :popup="show">
    <div class="buttonContainer">
      <button @click="createUser(slotProps.username, slotProps.password)">
        Create
      </button>
    </div>
  </SignUp>
  <!-- Vue component comprising of the main functionality of the site -->
  <div class="mainContainer" @click="hidePop">
    <div class="main-content">
      <div v-if="showMain" class="main-menu">
        <img style="height: 70px; width: 100px" src="../assets/type-ski.png" />
        <a
          href="#"
          @click="clickShow"
          style="margin-top: auto; margin-bottom: auto"
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
            ref="textInput"
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
        <button @click="resetValues" class="nextRace">Next race</button>
        <button @click="clickHome" class="nextRace">Home</button>
      </div>
    </div>
    <Leaderboard :scores="leaderboardScores"></Leaderboard>
  </div>
</template>

<style>
/*
  Author: George Kombostiotis,
  Version: 1.0.0
 */

@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@200;400;600&display=swap");

.mainContainer {
  display: flex;
  justify-content: space-evenly;
}

html,
body {
  margin: 0;
  max-width: 100%;
  min-width: 500px;
  overflow-x: hidden;
}

.header {
  width: 100%;
  height: 130px;
  display: flex;
  background-image: linear-gradient(to right, orange, darkorange);
  border-bottom: 1px black solid;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
}

#header-image {
  height: 90px;
  width: 140px;
  transform: rotate(5deg);
}

.headerImageContainer {
  text-align: center;
}

.header-menu li {
  list-style-type: none;
  display: inline;
  padding-left: 10px;
}

.header-menu {
  font-size: 20px;
}

a:visited,
a:link {
  text-decoration: none;
  color: inherit;
}

.main-content {
  box-shadow: 0px 0px 10px 1px rgb(0 0 0 / 20%);
  height: 450px;
  width: 700px;
  background-image: linear-gradient(to right, orange, darkorange);
  margin-top: 50px;
  border-radius: 5px;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  text-align: center;
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
  border-radius: 5px;
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
  display: flex;
  justify-content: flex-start;
  margin: 30px auto 10px auto;
  width: 85%;
  bottom: 10px;
}

.nextRace {
  margin-right: 10px;
  width: 100px;
  height: 40px;
  border-radius: 10px;
  border-style: solid;
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  background-image: linear-gradient(to right, orange, darkorange);
  font-weight: bold;
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

.buttonContainer {
  text-align: center;
}
</style>
