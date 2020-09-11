window.onload = function() {

    textToArray(textToType);

}

var textToType = "By the benefit of words and ratiocination they exceed brute beasts in knowledge, and the commodities that accompany the same, so they exceed them also in error.";
var textArray = [];

// Converts text to array
function textToArray(text) {
    textArray = text.split(" ");
}



var app = new Vue({
    el: '#practice',
    data: {
        hide: false
    }
})

var app2 = new Vue({
    el: '#input-text',
    data: {
        value: "",
        text: textToType,

    },
    methods: {
        clearText() {
            this.value = "";
        }
    }
})


