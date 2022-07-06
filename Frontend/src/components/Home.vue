<script setup>
import { arrayOfTests, arrayOfTests2 } from "../text.js";
import { onMounted, ref, computed, nextTick } from "vue";
import Leaderboard from "./Leaderboard.vue";
import SignUp from "./SignUp.vue";
import Header from "./Header.vue";
import { hash } from "bcryptjs";
import { setAccessToken, getAccessToken } from "../accessToken";

/* Array that is filled by the chosen text from 'arrayOfTests' after a split of
the text. Each word has it's own location in the array */
let textArray = ref([]);
let leaderboardScores = ref([]);

let showSignup = ref(false);
let showSignin = ref(false);

let userProfile = ref("sign in");

let docState = ref("");

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

onMounted(() => {
  fetch(API_URL + "/getTopTen", {
    method: "POST",
    headers: {
      "Content-type": "applciation/json",
    },
  }).then(function (response) {
    if (response.ok) {
      response.json().then((json) => {
        for (let x of json) {
          let newValue = { id: x.owner, value: x.wpm };
          leaderboardScores.value.push(newValue);
        }
      });
    } else {
      alert("failed");
    }
  });
});

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
    console.log(textInput.value);
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
    // const temp = { id: Math.random(), value: finalWpm.value };
    addScoretoLeaderboard(finalWpm.value);
    sendResultToDB();
    for (var i = 0; i < wordRef.value.length; i++) {
      wordRef.value[i].style.color = "black";
    }
    resetValues1();
  }
}

function isLoggedIn() {
  if (getAccessToken() == "") {
    return false;
  } else {
    return true;
  }
}

function addScoretoLeaderboard(wpm) {
  if (!isLoggedIn()) {
    return;
  }
  const leaderScore = leaderboardScores.value.length;

  if (leaderScore === 0) {
    leaderboardScores.value.push(wpm);
  } else if (leaderScore < 10) {
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

async function clickSignup() {
  if (rightStyle.value === signIn) {
    isAcross.value = true;
    right.value = true;
    rightStyle.value = signUp;
    actionHeader.value = "Sign up";
  } else {
    if (showSignin.value) {
      hidePop();
      return;
    }
    isAcross.value = false;
    rightStyle.value = signUp;
    actionHeader.value = "Sign up";
    showSignin.value = !showSignin.value;
  }
}

async function clickSignin() {
  if (signInState.value) {
    actionHeader.value = "Sign Out";

  } else {
    actionHeader.value = "Sign In";
  }

  if (rightStyle.value === signUp) {
    isAcross.value = true;
    left.value = true;
    rightStyle.value = signIn;
  } else {
    if (showSignin.value) {
      hidePop();
      return;
    }
    isAcross.value = false;
    rightStyle.value = signIn;
    showSignin.value = !showSignin.value;
  }
}

function hidePop() {
  rightStyle.value = "";
  transitionClass.value = "nested";
  showSignin.value = false;

  actionHeader.value = "";
  isAcross.value = false;
}

const API_URL = "http://localhost:3001";

async function sendResultToDB() {
  if (isLoggedIn()) {
    const result = {
      username: "user2",
      wpm: "100",
      time_of: Date(),
    };
    fetch(API_URL + "/sendResult", {
      method: "POST",
      body: JSON.stringify(result),
      headers: {
        "Content-type": "application/json",
      },
    }).then(function (response) {
      if (response.ok) {
        response.json().then((json) => {
          alert(json);
        });
      } else {
        alert("failed");
      }
    });
  }
}

async function createUser(username, password) {
  const hashedPassword = await hash(password, 10);
  const user = {
    username: username,
    password: hashedPassword,
  };
  fetch(API_URL + "/createUser", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json",
    },
  }).then(function (response) {
    if (response.ok) {
      response.json().then((json) => {
        alert("User " + json.username + " created!");
        actionHeader.value = "Success!";
        complete.value = true;

        setTimeout(() => {
          clickSignin();
        }, 500);

        setTimeout(() => {
          complete.value = false;
        }, 1500);
      });
    } else {
      response.json().then((json) => {
        actionHeader.value = json.errorMsg;
      });

      failed.value = true;
      disableBtn.value = true;

      setTimeout(() => {
        disableBtn.value = false;
        failed.value = false;
        actionHeader.value = "Sign up";
      }, 1500);
    }
  });
}

function middleware(username, password) {
  if (actionHeader.value === "Sign In") {
    logIn(username, password);
  } else if (actionHeader.value === "Sign up") {
    createUser(username, password);
  } else {
    signOut();
  }
}

function signOut() {
  // localStorage.removeItem("token");
  setTimeout(() => {
    hidePop();
    userProfile.value = "sign In";
    actionHeader.value = "Sign In";
    signInState.value = false;
  }, 400);

}

async function logIn(username, password) {
  const user = {
    username: username,
    password: password,
  };

  fetch(API_URL + "/login", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  }).then(function (response) {
    if (response.ok) {
      response.json().then((json) => {
        // alert(json.accessToken);
        console.log(document.cookie);
        setAccessToken(json.accessToken);
        actionHeader.value = "Success!";
        userUsername.value = username;
        complete.value = true;
        disableBtn.value = true;
        setTimeout(() => {
          complete.value = false;
          userProfile.value = username;
          hidePop();
          signInState.value = true;
          disableBtn.value = false;
        }, 400);
      });
    } else {
      actionHeader.value = "Failed!";
      failed.value = true;

      setTimeout(() => {
        failed.value = false;
        actionHeader.value = "Sign in";
      }, 1500);
    }
  });
}

function disableSignUpBtn(state) {
  disableBtn.value = state[0];
}

let transitionClass = ref("nested");
let rightStyle = ref("");
let signUp = "calc(50% - 255px)";
let signIn = "calc(50% - 150px)";
let left = ref(false);
let right = ref(false);
let complete = ref(false);
let failed = ref(false);
let actionHeader = ref("");
let disableBtn = ref(true);
let isAcross = ref("");
let signInState = ref(false);
let userUsername = ref(null);
</script>

<template>
  <!-- Vue component comprising of the main functionality of the site @click="hidePop" -->
  <div class="mainContainer">
    <Header :userProf="userProfile" @signin-event="clickSignin" @signup-event="clickSignup" :signInState="signInState">
    </Header>
    <SignUp :class="{ moveRight: right, moveLeft: left }" :style="{ right: rightStyle }" v-slot="slotProps"
      :popup="showSignin" :isAcross="isAcross" @buttonState="disableSignUpBtn" :signedIn="signInState"
      :userUsername="userUsername">
      <div class="buttonContainer">
        <button :disabled="disableBtn" :class="{
          buttonNormal: true,
          buttonComplete: complete,
          buttonFailed: failed,
        }" @click="middleware(slotProps.username, slotProps.password)">
          {{ actionHeader }}
        </button>
      </div>
    </SignUp>
    <div class="for-border" @click="hidePop">
      <div class="main-content main-content-radius">
        <div v-if="showMain" class="main-menu">
          <img style="height: 66px; width: 100px; transform: rotate(5deg)" src="../assets/type-ski.png" />
          <a href="#" @click="clickShow" style="margin-top: auto; margin-bottom: auto">
            <p style="margin: 0; font-size: 30px">Take test</p>
          </a>
        </div>
        <div v-if="showPracticeDiv" class="practice-div">
          <div class="text-border">
            <p id="text-to-type" v-if="showText" :ref="(el) => (wordRef[i] = el)" class="typeText"
              v-for="(splitWord, i) in splitWords">
              {{ splitWord }}
            </p>
            <input ref="textInput" class="enter-text" v-if="showInput" @keydown="clearText" @keyup="finish"
              v-model="textValue" />
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
    </div>
    <div class="for-border">
      <Leaderboard :scores="leaderboardScores" @click="hidePop"></Leaderboard>
    </div>
  </div>
</template>

<style>
/*
  Author: George Kombostiotis,
  Version: 1.0.0
 */
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@200;400;600&display=swap");

@keyframes bg-change {

  0%,
  100% {
    filter: hue-rotate(0deg);
  }

  50% {
    filter: hue-rotate(-45deg);
  }
}

.for-border {
  margin-bottom: 30px;
  background-color: #14c2cc;
  background-image: radial-gradient(circle farthest-side at top right,
      transparent,
      #0d64ff),
    radial-gradient(ellipse farthest-corner at 0% 100%, transparent, #ff00a0);
  animation: bg-change 5s infinite;
  padding: 12px;
  display: flex;
  border-radius: 10px;
  box-shadow: 0px 0px 15px 5px rgb(0 0 0 / 20%);
}

.moveRight {
  transition: 0.7s;
}

.moveLeft {
  transition: 0.5s;
  transform: translate(0px);
}

.mainContainer {
  background-color: rgb(251, 251, 251);
  flex-wrap: wrap;
  background-image: url("../assets/keyboardcablenew.jpg");
  background-repeat: no-repeat;
  background-size: 800px, 500px;
  display: flex;
  justify-content: space-evenly;
}

html,
body {
  margin: 0;
  height: 100%;
  min-width: 500px;
  overflow-x: hidden;
}

.header {
  height: 272px;
  width: 100%;
  display: flex;
  font-family: "Nunito", sans-serif;
}

#header-image {
  height: 90px;
  width: 150px;
  transform: rotate(5deg);
}

.headerImageContainer {
  padding-bottom: 5px;
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
}

/* .main-content-radius {
  animation: Border 10s infinite;
  border-radius: 30px 30px 30px 30px;
  border: solid 4px; 
} */

.main-content {
  box-shadow: 0px 0px 5px 2px rgb(0 0 0 / 20%);
  background-color: white;
  border-radius: 8px;
  height: 400px;
  width: 800px;
  margin: 0;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  text-align: center;
}

.main-menu {
  margin: 40px 0 10px 40px;
  display: flex;
}

.main-menu>a {
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
  border-radius: 5px;
  border-style: solid;
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: bold;
}

.buttonFailed {
  background-color: red;
}

.buttonComplete {
  background-color: lightgreen;
}

.buttonNormal {
  transition: 0.5s;
  width: 172px;
  border-radius: 5px;
  border: 1px black solid;
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: bold;
}

.buttonContainer {
  width: 100%;
  text-align: center;
  padding-bottom: 10px;
}
</style>
