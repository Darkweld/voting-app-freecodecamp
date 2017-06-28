'use strict';

(function(){
var polls = document.querySelector("#polls");
var form = document.querySelector("#formy");
var title = document.querySelector(".title");
var pollurlid = window.location.search.slice(1);
var apiUrlView = appUrl + '/viewpolls/' + pollurlid;


ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrlView, function (data) {
    
    try {
      var pollobject = JSON.parse(data);
    } catch(err) {
       return document.querySelector(".container").innerHTML = "<p>That poll does not exist. Please try again.</p>";
    }
      
          var submittedpoll = document.createElement("h1");
          var text = document.createTextNode(pollobject.pollquestion);
          submittedpoll.appendChild(text);
          title.appendChild(submittedpoll);

          var createdp = document.createElement("h2");
          var createdtext = document.createTextNode("Created by: " + pollobject.createdby);
          createdp.appendChild(createdtext);
          title.appendChild(createdp);
          
          if (pollobject.match) {
                var deletelink = document.createElement("a"); 
                var deletelinktext = document.createTextNode("Delete Poll?");
                deletelink.href = "#";
                deletelink.id = "delete";
                deletelink.className = "delete";
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
                 
          var countpolls = 0;
             
             var arr = [];
             
             for (var l in pollobject.pollvalues) {
                 arr.push([l, pollobject.pollvalues[l]]);
             }
             arr = arr.sort(function(a, b) {
                  return (a[0].replace("polloption", "")) - (b[0].replace("polloption", ""));
             });
             
             
          arr.forEach(function(p) { 
             countpolls++;
             var currentPollOption = "polloption" + countpolls;
             
             
             var optiondiv = document.createElement("div");
             optiondiv.className = "options-list";
             
             var pollValinput = document.createElement("input");
             pollValinput.name = "pollOption";
             pollValinput.id = currentPollOption;
             pollValinput.type = "radio";
             pollValinput.required = true;
             pollValinput.value = currentPollOption;
             optiondiv.appendChild(pollValinput);
             
             var pollValLabel = document.createElement("LABEL");
             pollValLabel.htmlFor = currentPollOption;
             pollValLabel.className = "poll-a-block";
             pollValLabel.innerHTML = pollobject.pollvalues[p[0]];
             optiondiv.appendChild(pollValLabel);
             
             polls.appendChild(optiondiv);
          });
            
            
            var votearray = [];
            var labelsarr = [];
            for (var i = 0; i < arr.length; i++) {
                votearray[i] = 0;
                labelsarr.push(arr[i][1]);
            }

        for (var i in pollobject.ips) {
            votearray[Number(pollobject.ips[i].slice(-1)) - 1]++;
        }
        
        function backgroundcolorpicker () {
            var colorarr = [
                '#ff0000',
                '#ff7b00',
                '#ffe900',
                '#3fff00',
                '#00ff6e',
                '#00faff',
                '#008cff',
                '#2a00ff',
                '#b200ff',
                '#ff00c7',
                '#ff004c'
            ];
            var returnarr = [];
        for (var r = 0; r < arr.length; r++) {
            returnarr.push(colorarr[Math.round(Math.random() * (colorarr.length - 1))]);
        }
            return returnarr;
        }
        
        

         var ctx = document.getElementById("myChart");
         var myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: labelsarr,
                datasets : [{
                    label: "Votes for option",
                    data: votearray,
                    backgroundColor: backgroundcolorpicker(),
            borderColor: '#000000',
            borderWidth: 1
        }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
        scales: {
            yAxes: [{
                scaleLabel: { 
                    display: true,
                    labelString: 'Poll Options'
                }
            }],
            xAxes: [{
                ticks: {
                    beginAtZero:true,
                    max: 10,
                },
                scaleLabel: { 
                    display: true,
                    labelString: 'Votes'
                }
            }]
        }
    }
});
            
            
            
        if (pollobject.match) {
            var editlink = document.createElement("a"); 
            var editlinktext = document.createTextNode("Edit Poll");
            editlink.href = "/edit?" + pollurlid;
            editlink.appendChild(editlinktext);
            document.querySelector("#submitContainer").appendChild(editlink);
        }
          
    }  
));


form.addEventListener("submit", function(event) {
    event.preventDefault();
    var pollval = document.forms["formy"]["pollOption"].value;
    
    
    var apiUrlPost = appUrl + '/submitvote/' + window.location.search.slice(1) + "/" + pollval;
    
    ajaxFunctions.ajaxRequest('POST', apiUrlPost, function (data) {
      window.location.reload();
    });
    return false;
    
}, false);

})();
