<script setup>
import { arrayOfTests, arrayOfTests2 } from "../text.js";
import { onMounted, ref, computed, nextTick } from "vue";
import Leaderboard from "./Leaderboard.vue";
import SignUp from "./SignUp.vue";
import Header from "./Header.vue";
import { hash } from "bcryptjs";

// User states
let [userUsername, signInState] = [ref(null), ref(false)];

// Class style states
let transitionClass = ref("nested");
let moveLeftClass = ref(false);
let moveRightClass = ref(false);
let buttonCompleteClass = ref(false);
let buttonFailedClass = ref(false);

// Style states
let rightCssStyle = ref("");
let signUpStyle = "calc(50% - 255px)";
let signInStyle = "calc(50% - 150px)";

// Button states
let authBtnText = ref("");
let disableBtnAtt = ref(true);
let btnPosRight = ref("");

/* Array of chosen text from 'arrayOfTests' after split. 
Each word has it's own location in the array */
let wordsOfText = ref([]);

// Array of top 10 scores from db
let leaderboardScores = ref([]);

// View render states
let signInViewState = ref(false);
let timerViewState = ref(false);
let mainViewState = ref(true);
let practiceViewState = ref(false);
let txtViewState = ref(true);
let txtInputViewState = ref(true);
let infoViewState = ref(false);
let nextBtnViewState = ref(false);

// Sign in header text
let signInHeaderTxt = ref("sign in");

// Input text value
let txtInputValue = ref("");

// Word typed by user
let wordsTypedCount = ref(0);

// Index of current word to be typed
let currentWord = ref(0);

// Starting time of timer
let seconds = ref(150);

// Timer state
let intervalState = ref(0);

// Index of current letter in current word
let letterCount = ref(1);

// Completed race time (150 - n where n = race duration | 0 > n <= 150)
let finalTimeValue = ref(0);

// Reference to words in text
let wordRef = ref([]);

// Reference to user input in race
const txtInputRef = ref(null);

async function authenticateUser() {
  let response = await fetch(API_URL + "/cookieAuth", {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  });

  if (response.ok) {
    response.json().then((data) => {
      if (data.username) {
        signInState.value = true;
        disableBtnAtt.value = false;
        userUsername.value = data.username;
        signInHeaderTxt.value = data.username;
      }
    });
  }
}

onMounted(async () => {
  await authenticateUser();
  fetch(API_URL + "/getTopTen", {
    method: "POST",
    headers: {
      "Content-type": "applciation/json",
    },
  }).then(function (response) {
    if (response.ok) {
      response.json().then((json) => {
        if (json.length === undefined) {
          return;
        }
        for (let x of json) {
          let newValue = { owner: x.owner, wpm: x.wpm, time_of: x.time_of };
          leaderboardScores.value.push(newValue);
        }
      });
    } else {
      // failure
    }
  });
});

function clickShow() {
  timerViewState.value = true;
  mainViewState.value = false;
  practiceViewState.value = true;
  resetValues();
  resetValues1();
}

function clickHome() {
  mainViewState.value = true;
  practiceViewState.value = false;
  nextBtnViewState.value = false;
}

function resetValues() {
  infoViewState.value = false;
  timerViewState.value = true;
  txtInputValue.value = "";
  txtViewState.value = true;
  txtInputViewState.value = true;
  nextBtnViewState.value = false;
  intervalState.value = 0;
  seconds.value = 150;
  wordsTypedCount.value = 0;
  nextTick(() => {
    txtInputRef.value.focus();
  });
}

function resetValues1() {
  currentWord.value = 0;
  splitWords.value = Math.floor(Math.random() * 2);
  letterCount.value = 1;
  intervalState.value = 0;
  txtInputValue.value = "";
}

function timerMethod() {
  seconds.value--;
}

function finish(event) {
  if (
    splitWords.value[wordsTypedCount.value] ===
      splitWords.value[splitWords.value.length - 1] &&
    txtInputValue.value === splitWords.value[wordsTypedCount.value]
  ) {
    finalTimeValue.value = 150 - seconds.value;
    clearInterval(intervalState.value);
    txtViewState.value = false;
    txtInputViewState.value = false;
    nextBtnViewState.value = true;
    infoViewState.value = true;
    timerViewState.value = false;
    const newValue = { owner: userUsername.value, wpm: finalWpm.value };
    const newValueWithDate = { ...newValue, time_of: new Date() };
    addScoretoLeaderboard(newValueWithDate);
    sendResultToDB(newValue);
    for (var i = 0; i < wordRef.value.length; i++) {
      wordRef.value[i].style.color = "black";
    }
    resetValues1();
  }
}

function isLoggedIn() {
  if (signInState.value) {
    return true;
  } else {
    return false;
  }
}

function addScoretoLeaderboard(value) {
  if (!isLoggedIn()) {
    return;
  }
  const leaderScore = leaderboardScores.value.length;
  if (leaderScore === 0) {
    leaderboardScores.value.push(value);
  } else if (leaderScore < 10) {
    const found = leaderboardScores.value.find(
      (element) => element.wpm < value.wpm
    );

    if (found === undefined) {
      leaderboardScores.value.push(value);
    } else {
      const indexFound = leaderboardScores.value.indexOf(found);
      leaderboardScores.value.splice(indexFound, 0, value);
    }
  } else {
    const lowest = leaderboardScores.value[leaderboardScores.value.length - 1];
    if (lowest.wpm < value.wpm) {
      const found = leaderboardScores.value.find(
        (element) => element.wpm < value.wpm
      );
      const indexFound = leaderboardScores.value.indexOf(found);
      leaderboardScores.value.pop();
      setTimeout(() => {
        leaderboardScores.value.splice(indexFound, 0, value);
      }, 500);
    }
  }
}

function clearText(event) {
  if (intervalState.value === 0) {
    intervalState.value = setInterval(timerMethod, 1000);
  }

  if (
    txtInputValue.value === splitWords.value[wordsTypedCount.value] &&
    txtInputValue.value !== ""
  ) {
    wordRef.value[currentWord.value].style.color = "#00b300";
    event.preventDefault();
    currentWord.value++;
    txtInputValue.value = "";
    return wordsTypedCount.value++;
  }

  wordRef.value[currentWord.value].style.color = "indianred";

  if (event.key === " ") {
    event.preventDefault();
  }
}

let finalWpm = computed(() => {
  return Math.round((60 / finalTimeValue.value) * wordsTypedCount.value);
});

let wpm = computed(() => {
  let result = Math.round(
    (60 / (150 - seconds.value - 0.5)) * wordsTypedCount.value
  );
  if (seconds.value < 149) {
    return result;
  } else {
    return 0;
  }
});

let splitWords = computed({
  get() {
    return (wordsOfText =
      arrayOfTests[Math.floor(Math.random() * 2)].split(" "));
  },
  set(newVal) {
    wordsOfText = arrayOfTests[newVal].split(" ");
    splitWords.length = wordsOfText.length;
    for (var i = 0; i < wordsOfText.length; i++) {
      splitWords[i] = wordsOfText[i];
    }
  },
});

async function clickSignup() {
  if (rightCssStyle.value === signInStyle) {
    btnPosRight.value = true;
    moveRightClass.value = true;
    rightCssStyle.value = signUpStyle;
    authBtnText.value = "Sign up";
  } else {
    if (signInViewState.value) {
      hidePop();
      return;
    }
    btnPosRight.value = false;
    rightCssStyle.value = signUpStyle;
    authBtnText.value = "Sign up";
    signInViewState.value = !signInViewState.value;
  }
}

async function clickSignin() {
  if (signInState.value) {
    authBtnText.value = "Sign Out";
  } else {
    authBtnText.value = "Sign in";
  }

  if (rightCssStyle.value === signUpStyle) {
    btnPosRight.value = true;
    moveLeftClass.value = true;
    rightCssStyle.value = signInStyle;
  } else {
    if (signInViewState.value) {
      hidePop();
      return;
    }
    btnPosRight.value = false;
    rightCssStyle.value = signInStyle;
    signInViewState.value = !signInViewState.value;
  }
}

function hidePop() {
  rightCssStyle.value = "";
  transitionClass.value = "nested";
  signInViewState.value = false;
  authBtnText.value = "";
  btnPosRight.value = false;
}

const API_URL = "http://localhost:3001";

async function sendResultToDB(value) {
  if (isLoggedIn()) {
    fetch(API_URL + "/sendResult", {
      method: "POST",
      body: JSON.stringify(value),
      headers: {
        "Content-type": "application/json",
      },
    }).then(function (response) {
      if (response.ok) {
        response.json().then((json) => {
          // success
        });
      } else {
        // failure
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
        authBtnText.value = "Success!";
        buttonCompleteClass.value = true;

        setTimeout(() => {
          clickSignin();
        }, 500);

        setTimeout(() => {
          buttonCompleteClass.value = false;
        }, 1500);
      });
    } else {
      response.json().then((json) => {
        authBtnText.value = json.errorMsg;
      });

      buttonFailedClass.value = true;
      disableBtnAtt.value = true;

      setTimeout(() => {
        disableBtnAtt.value = false;
        buttonFailedClass.value = false;
        authBtnText.value = "Sign up";
      }, 1500);
    }
  });
}

function middleware(username, password) {
  if (authBtnText.value === "Sign in") {
    logIn(username, password);
  } else if (authBtnText.value === "Sign up") {
    createUser(username, password);
  } else {
    signOut();
  }
}

async function signOut() {
  let response = await fetch(API_URL + "/logout", {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  });

  // localStorage.removeItem("token");
  setTimeout(() => {
    hidePop();
    signInHeaderTxt.value = "sign in";
    authBtnText.value = "sign in";
    signInState.value = false;
    disableBtnAtt.value = true;
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
      buttonCompleteClass.value = true;
      disableBtnAtt.value = true;
      setTimeout(async () => {
        await hidePop();
        buttonCompleteClass.value = false;
        signInHeaderTxt.value = username;
        signInState.value = true;
        disableBtnAtt.value = false;
        userUsername.value = username;
      }, 200);
    } else {
      authBtnText.value = "Failed!";
      buttonFailedClass.value = true;

      setTimeout(() => {
        buttonFailedClass.value = false;
        authBtnText.value = "Sign in";
      }, 1500);
    }
  });
}

function disableSignUpBtn(state) {
  disableBtnAtt.value = state[0];
}
</script>

<template>
  <!-- Vue component comprising of the main functionality of the site @click="hidePop" -->
  <div class="mainContainer">
    <Header
      :userProf="signInHeaderTxt"
      @signin-event="clickSignin"
      @signup-event="clickSignup"
      :signInState="signInState"
    >
    </Header>
    <SignUp
      :class="{ moveRight: moveRightClass, moveLeft: moveLeftClass }"
      :style="{ right: rightCssStyle }"
      v-slot="slotProps"
      :popup="signInViewState"
      :isAcross="btnPosRight"
      @buttonState="disableSignUpBtn"
      :signedIn="signInState"
      :userUsername="userUsername"
    >
      <div class="buttonContainer">
        <button
          :disabled="disableBtnAtt"
          :class="{
            buttonNormal: true,
            buttonComplete: buttonCompleteClass,
            buttonFailed: buttonFailedClass,
          }"
          @click="middleware(slotProps.username, slotProps.password)"
        >
          {{ authBtnText }}
        </button>
      </div>
    </SignUp>
    <div class="for-border" @click="hidePop">
      <div class="main-content main-content-radius">
        <div v-if="mainViewState" class="main-menu">
          <img
            style="height: 66px; width: 100px; transform: rotate(5deg)"
            src="../assets/type-ski.png"
          />
          <a
            href="#"
            @click="clickShow"
            style="margin-top: auto; margin-bottom: auto"
          >
            <p style="margin: 0; font-size: 30px">Take test</p>
          </a>
        </div>
        <div v-if="practiceViewState" class="practice-div">
          <div class="text-border">
            <p
              id="text-to-type"
              v-if="txtViewState"
              :ref="(el) => (wordRef[i] = el)"
              class="typeText"
              v-for="(splitWord, i) in splitWords"
            >
              {{ splitWord }}
            </p>
            <input
              ref="txtInputRef"
              class="enter-text"
              v-if="txtInputViewState"
              @keydown="clearText"
              @keyup="finish"
              v-model="txtInputValue"
            />
            <p v-if="timerViewState">
              {{ "Time : " + seconds }}<br />{{ "wpm : " + wpm }}
            </p>
            <p id="information" v-if="infoViewState">
              {{ "You typed the text at " + finalWpm + " wpm" }}
            </p>
          </div>
        </div>
        <div class="nextRaceDiv" v-if="nextBtnViewState">
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
  background-image: radial-gradient(
      circle farthest-side at top right,
      transparent,
      #0d64ff
    ),
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
