window.onload = function() {

}

var textToType = "By the benefit of words and ratiocination they exceed brute beasts in knowledge, and the commodities that accompany the same, so they exceed them also in error.";
var textArray = [];

Vue.component('main-content', {
    template: `
        <div>
            <div v-show="show" class="main-menu">
                <img style="height: 40px; width: 60px;" :src="image">
                <a href="#" @click="{ clickShow }"><p style="margin: 0; font-size: 30px;">Enter race</p></a>
            </div>
            <div v-show="showText" class="practice-div">
                <div class="text-border">
                    <p id="text-to-type" ref="wordRef" class="type-text" v-for="(splitWord) in splitWords">{{ splitWord }}</p>
                    <input class="enter-text" v-model="value" @keydown.space="clearText">
                </div>
                
            </div>   
        </div>
    `,
    data() {
        return {
            show: true,
            showText: false,
            image: "../CONTENT/images/type-ski logo-cut.png",
            value: "",
            text: textToType,
            arrayCount: 0,
            counter: 0
        }
    },
    methods: {
        clearText(event) {
            if (this.value === this.splitWords[this.arrayCount] && (event.key === " " && this.value !== "")) {
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
        clickShow: function() {
            return (this.show = false, this.showText = true)
        },

        splitWords: {
            get: function () {
                return textArray = this.text.split(" ");
            },
            set: function(newTxt) {

            }
        }
    }
})

var app = new Vue   ({
    el: '#main',
    data: {
    }
})

/*
Vue.component('practice-menu', {
    template: `
         <div id="practice" v-show="show" class="main-menu">
            <img style="height: 40px; width: 60px;" :src="image">
            <a href="#" @click="{ clickShow }"><p style="margin: 0; font-size: 30px;">Enter race</p></a>
        </div>
    `,
    data() {

    },
    methods: {

    },
    computed: {
        clickShow: function() {
            return this.show = false
        }
    }
})


Vue.component('display-text', {
    template: `
        <div id="input-text" class="practice-div">
            <p id="text-to-type" class="type-text" v-for="splitWord in splitWords">{{ splitWord }}</p>
            <input class="enter-text" v-model="value" @keydown.space="clearText" @keyup="checkText">
        </div>        
    `,
    data() {
       return {

        }
    },
    methods: {
        clearText(event) {
            this.value = "";
            if (event.key === " ") {
                event.preventDefault();
            }
        },
        checkText(event) {
            if (this.value === this.words[this.arrayCount] && event.key !== " " && this.value !== "") {
                this.arrayCount++;
            }
        }
    },
    computed: {
        splitWords: {
            get: function () {
                return textArray = this.text.split(" ");
            },
            set: function(newTxt) {

            }
        }
    }
})
*/








