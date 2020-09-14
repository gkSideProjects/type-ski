
var textToType = "By the benefit of words and ratiocination they exceed brute beasts in knowledge, and the commodities that accompany the same, so they exceed them also in error.";
var textArray = [];

// Converts text to array
function textToArray(text) {
    textArray = text.split(" ");
    return textArray;
}


var app = new Vue({
    el: '#practice',
    data: {
        show: true
    },
    methods: {
        hideElements() {
            this.show = false;
            app2.show = true;
        }
    }
})

var app2 = new Vue({
    el: '#input-text',
    data: {
        value: "",
        letters: textToArray(textToType),
        show: false,
        arrayCount: 0,
        colour: "white",
        textColour: ""
    },
    methods: {
        clearText(event) {
            this.value = "";
            if (event.key === " ") {
                event.preventDefault();
            }
        },
        checkText(event) {
            if (this.value.charAt(this.value.length - 1) === textArray[this.arrayCount] && event.key !== " " && this.value !== "") {
                this.textColour = "lightgreen";
                this.arrayCount++;
            }
        }
    }
})


window.onload = function() {
    textToArray(textToType);

}
