'use strict';

(function(){
var optionsForms = document.querySelector("#option-container");
var form = document.querySelector("#Form");
var button = document.querySelector("#Button");

button.addEventListener("click", function(event) {
        event.preventDefault();
        var num;
        for (var i = 0; i < form.elements.length; i++) {
            if (form.elements[i].type !== "text") {
             num = i;
             break;
            }
        }
        
        var optiondiv = document.createElement("div");
             optiondiv.className = "optiondiv";
        
        var appendme = document.createElement("input");
        appendme.type = "text";
        appendme.required = true;
        appendme.name = "polloption" + num;
        appendme.placeholder = "Poll Option";
        
        optiondiv.appendChild(appendme);
        optionsForms.appendChild(optiondiv);
});
})();