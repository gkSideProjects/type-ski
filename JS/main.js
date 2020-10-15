window.onload = function() {

}

var arrayOfTests = ["So, this is data collection for the month of March worldwide, emails and Skype calls. So France, 70 million. Germany, 500 million. Brazil, two billion. Inside the U.S., 3.1 billion emails and calls. That's not including any of the telecom company data.",
    "I think the greatest freedom that I have gained, the fact that I don't have to worry about what happens tomorrow, Because I'm happy with what I've done Today."]

var arrayOfTests2 = ["Yo, what up guys", "hey everybody what's going on"]

var textToType = "By the benefit of words.";
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
                    <p id="text-to-type" v-show="showText"  ref="wordRef" class="typeText"  v-for="(splitWord) in splitWords">{{ splitWord }}</p>
                    <input class="enter-text" v-show="showInput" @keydown="clearText" @keyup="finish" v-model="value">
                    <p>{{ ':' + seconds + ' ' + wpm }}</p>
                    <p id="information" v-show="showInformation"></p> 
                </div>
            
            </div> 
            <div class="nextRaceDiv" v-show="showButton">
                <button @click="resetValues" class="nextRace">next race</button>
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
            arrayCount: 0,
            counter: 0,
            seconds: 150,
            timeInterval: 0,
            letterCount: 1,
        }
    },
    methods: {
        resetValues() {
            this.value = ""
            this.showText = true
            this.showInput = true
            this.showButton = false
            this.seconds = 150
            this.arrayCount = 0
        },
        resetValues1()  {
            this.counter = 0
            this.splitWords = 1
            this.letterCount = 1
            this.timeInterval = 0
            this.value = ""
        },

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
                for (var i = 0; i < this.$refs.wordRef.length; i++){
                    this.$refs.wordRef[i].style.color = "black"
                }
                this.resetValues1()
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
                return Math.round(Math.round((60 / (150 - this.seconds))) * this.arrayCount)
            }
            else {
                return 0
            }
        },

        clickShow: function() {
            return (this.showMain = false, this.showPracticeDiv = true )
        },

        splitWords: {
            get: function () {
                return textArray = arrayOfTests[0].split(" ")
            },
            set: function (newVale) {
                textArray = arrayOfTests[newVale].split(" ")
                this.splitWords.length = textArray.length
                for (var i = 0; i < textArray.length; i++) {
                    this.splitWords[i] = textArray[i]
                }
            }
        },
    }
})

var app = new Vue   ({
    el: '#main',
    data: {
    }
})








