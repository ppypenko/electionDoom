$.ajax({
    url: 'http://elections.huffingtonpost.com/pollster/api/polls.json?callback=pollsterPoll&page=3&state=US&topic=2016-president',
    dataType: 'script',
    type: 'GET',
    cache: true
});

window.pollsterPoll = function (incoming_data) {
    console.log(incoming_data);
    var html = "",
        block,
        ind = 0,
        dem = 0,
        rep = 0;
    for (var i = 0; i < 3; i++) {
        block = document.createElement("section");
        block.setAttribute("id", "tab-" + i);
        if (incoming_data[i].affiliation === "None") {
            ind += 1;
            block.setAttribute("class", "ind");
            html += "<h2>Affiliation: Independant</h2>";
            document.getElementById("tablinks").innerHTML += "<li><a href='#tab-" + i + "'>Independant" + ind + "</a></li>";
        } else if (incoming_data[i].affiliation === "Dem") {
            dem += 1;
            block.setAttribute("class", "dem");
            html += "<h2>Affiliation: Democrat</h2>";
            document.getElementById("tablinks").innerHTML += "<li><a href='#tab-" + i + "'>Democrat" + dem + "</a></li>";
        } else if (incoming_data[i].affiliation === "Rep") {
            rep += 1;
            block.setAttribute("class", "rep");
            html += "<h2>Affiliation: Republican</h2>";
            document.getElementById("tablinks").innerHTML += "<li><a href='#tab-" + i + "'>Republican" + rep + "</a></li>";
        }
        block.innerHTML = html;
        //console.log(incoming_data[i].affiliation);
        //console.log(incoming_data[i].pollster);
        //console.log(incoming_data[i].method);
        //console.log(incoming_data[i].partisan);
        //        for (var j = 0; j < 3; j++) {
        //            console.log(incoming_data[i].questions[j].name);
        //            for (var k = 0; k < incoming_data[i].questions[j].subpopulations[0].responses.length; k++) {
        //                //console.log(incoming_data[i].questions[j].subpopulations[0].responses[k].choice);
        //                //console.log(incoming_data[i].questions[j].subpopulations[0].responses[k].value);
        //            }
        //        }
        document.getElementById("tabs").appendChild(block);
        html = "";
    }
};
$(function () {
    $("#tabs").tabs();
});