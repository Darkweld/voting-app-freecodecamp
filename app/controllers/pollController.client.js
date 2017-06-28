'use strict';

(function(){
var polls = document.querySelector("#polls");
var apiUrl = appUrl + '/viewpolls';

function updatePolls (data) {
      var pollobject = JSON.parse(data);
          pollobject.forEach(function(p) {
           var optiondiv = document.createElement("div");
            optiondiv.className = "options-list";  
              
          var eachpoll = document.createElement("a");
          var text = document.createTextNode(p.pollquestion);
          eachpoll.appendChild(text);
          eachpoll.href = "/poll?" + p._id;
          eachpoll.className = "poll-a-block";
          
          optiondiv.appendChild(eachpoll);
          
          polls.appendChild(optiondiv);
          });
}


ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePolls));


})();
