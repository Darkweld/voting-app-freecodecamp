'use strict';



(function(){
    
var pollurlid = window.location.search.slice(1);
var apiUrlView = appUrl + '/viewpolls/' + pollurlid;
var polls = document.querySelector("#optionshere");
var form = document.querySelector("#Edit");
var button = document.querySelector(".addOption");
var title = document.querySelector(".title");
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", apiUrlView, function(data){
        
    
    try {
      var pollobject = JSON.parse(data);
    } catch(err) {
       return polls.innerHTML = "That poll does not exist. Please try again.";
    }
      if (!pollobject.match) return document.querySelector(".container").innerHTML = '<p> You are not the creator of this poll </p>';
      
      
          
          var submittedpoll = document.createElement("h4");
          var text = document.createTextNode("Editing: " + pollobject.pollquestion);
          submittedpoll.appendChild(text);
          title.appendChild(submittedpoll);
          
          if (pollobject.match) {
                var deletelink = document.createElement("a"); 
                var deletelinktext = document.createTextNode("Delete Poll?");
                deletelink.href = "delete";
                deletelink.className = "delete";
                deletelink.id = "delete";
                deletelink.appendChild(deletelinktext);
                polls.appendChild(deletelink);
                 
                 
                 document.querySelector("#delete").addEventListener("click", function(event) {
                     event.preventDefault();
                     var deleteappurl = appUrl + "/delete/" + pollurlid;
                     ajaxFunctions.ajaxRequest("DELETE", deleteappurl, function() {
                         window.location.href = appUrl;
                     });
                 });
                 
                 }
          
          
          var arr = Object.keys(pollobject.pollvalues);
          arr = arr.sort(function(a, b) {
    return (a.replace("polloption", "")) - (b.replace("polloption", ""));
          });
          arr.forEach(function (p) {
             
             var optiondiv = document.createElement("div");
             optiondiv.className = "optiondiv";
             
             var pollValinput = document.createElement("input");
             pollValinput.name = p;
             pollValinput.type = "text";
             pollValinput.value = pollobject.pollvalues[p];
             optiondiv.appendChild(pollValinput);
             polls.appendChild(optiondiv);

          });

    }  
)); 
    
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        var editappurl = "/edit/" + pollurlid;
        form.action = editappurl;
        form.method = "POST";
        form.submit();
    });
    
   document.querySelector("#Back").href = appUrl + "/poll?" + pollurlid; 

    button.addEventListener("click", function(event) {
        event.preventDefault();
        var num;
        for (var i = 0; i < form.elements.length; i++) {
            if (form.elements[i].type !== "text") {
             num = i+1;
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
        polls.appendChild(optiondiv);
        
    });
})();