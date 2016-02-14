"use strict";
$.ajax({
    url: 'http://elections.huffingtonpost.com/pollster/api/polls.json?callback=pollsterPoll&page=3&state=US&topic=2016-president',
    dataType: 'script',
    type: 'GET',
    cache: true
});

window.pollsterPoll = function (incoming_data) {
    var html = "",
        block,
        i = 0,
        j = 0,
        k = 0;
    for (i = 0; i < incoming_data.length; i += 1) {
        block = document.createElement("section");
        block.setAttribute("id", "tab-" + i);
        block.setAttribute("class", incoming_data[i].affiliation);
        html += "<h2>Pollster: " + incoming_data[i].pollster + "</h2>" +
            "<h2>Affiliation: " + incoming_data[i].affiliation + "</h2>" +
            "<h2>Type of Poll: " + incoming_data[i].method + "</h2>";
        document.getElementById("tablinks").innerHTML += "<li><a href='#tab-" + i + "'>" + incoming_data[i].pollster + "</a></li>";

        //console.log(incoming_data[i].partisan);
        for (j = 0; j < incoming_data[i].questions.length; j += 1) {
            html += "<section class='question'>" +
                "<h3>" + incoming_data[i].questions[j].name + "</h3>";
            for (k = 0; k < incoming_data[i].questions[j].subpopulations[0].responses.length; k += 1) {
                html += "<section class='reply'>" +
                    "<h4>" + incoming_data[i].questions[j].subpopulations[0].responses[k].choice + "</h4>" +
                    "<h6>" + incoming_data[i].questions[j].subpopulations[0].responses[k].value + "</h6>" + "</section>";
            }
            html += "</section>";
            block.innerHTML = html;
        }
        document.getElementById("tabs").appendChild(block);
        html = "";
    }
};
window.onload = function () {
    $(function () {
        $("#tabs").tabs();
    });
};