$.ajax({
    url: 'http://elections.huffingtonpost.com/pollster/api/polls.json?callback=pollsterPoll&page=3&state=US&topic=2016-president',
    dataType: 'script',
    type: 'GET',
    cache: true
});

window.pollsterPoll = function (incoming_data) {
    console.log(incoming_data);
    for (var i = 0; i < 3; i++) {
        console.log(incoming_data[i].pollster);
        console.log(incoming_data[i].method);
        console.log(incoming_data[i].partisan);
        for (var j = 0; i < 3; i++) {
            console.log(incoming_data[i].questions[j].name);
            for (var k = 0; k < incoming_data[i].questions[j].subpopulations[0].responses.length; k++) {
                console.log(incoming_data[i].questions[j].subpopulations[0].responses[k].choice);
                console.log(incoming_data[i].questions[j].subpopulations[0].responses[k].value);
            }
        }
    }
};