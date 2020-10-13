window.onload = function() {

}

var textToType = "By the benefit of words and ratiocination they exceed brute beasts in knowledge, and the commodities that accompany the same, so they exceed them also in error.";
var textArray = [];

Vue.component('main-content', {
    template: `
        <div>
            <div v-show="showMain" class="main-menu">
                <img style="height: 40px; width: 60px;" :src="image">
                <a href="#" @click="{ clickShow }"><p style="margin: 0; font-size: 30px;">Enter race</p></a>
            </div>
            <div v-show="showPracticeDiv" class="practice-div">
                <div class="text-border">
                    <p id="text-to-type" v-show="showText"  ref="wordRef" class="type-text" v-for="(splitWord) in splitWords">{{ splitWord }}</p>
                    <input class="enter-text" v-show="showInput" @keydown="clearText" @keyup="finish" v-model="value">
                    <p>{{ ':' + seconds + ' ' + wpm }}</p>
                    <p id="information" v-show="showInformation"></p> 
                </div>
            
            </div> 
            <div class="nextRaceDiv" v-show="showButton">
                <button class="nextRace">next race</button>
            </div>  
       
        </div>
    `,
    data() {
        return {
            showMain: true,
            showPracticeDiv: false,
            showText: true,
            showInput: true,
            showInformation: false,
            showButton: false,
            image: "../CONTENT/images/type-ski logo-cut.png",
            value: "",
            text: textToType,
            arrayCount: 0,
            counter: 0,
            seconds: 150,
            timeInterval: 0,
            letterCount: 1,
        }
    },
    methods: {
        timerMethod() {
            this.seconds -= 1
        },
        finish(event) {
            if (this.splitWords[this.arrayCount] === this.splitWords[this.splitWords.length - 1] && this.value === this.splitWords[this.arrayCount] ) {
                clearInterval(this.timeInterval)
                this.showText = false;
                this.showInput = false;
                this.showButton = true;
                this.showInformation = true;
            }
        },
        clearText(event) {
            if (this.timeInterval === 0) {
                this.timeInterval = setInterval(this.timerMethod, 1000)
            }

            if (this.value === this.splitWords[this.arrayCount] && this.value !== "") {
                this.$refs.wordRef[this.counter].style.color = "#00b300"
                event.preventDefault();
                this.counter++
                this.value = "";
                return this.arrayCount++
            }
            this.$refs.wordRef[this.counter].style.color = "indianred"
            if (event.key === " ") {
                event.preventDefault();
            }
        }
    },
    computed: {
        wpm: function() {
            if (this.seconds < 150 && this.arrayCount > 0) {
                return Math.round((this.arrayCount / (150 - this.seconds)) * 60)
            }
            else {
                return 0
            }
        },
        clickShow: function() {
            return (this.showMain = false, this.showPracticeDiv = true)
        },

        splitWords: {
            get: function () {
                return textArray = this.text.split(" ");
            },
            set: function(newTxt) {

            }
        },

    }
})

var app = new Vue   ({
    el: '#main',
    data: {
    }
})








