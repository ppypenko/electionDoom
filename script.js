"use strict";
var picbox = [""];
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
        html += "<div class='"+ incoming_data[i].affiliation+"'>";
        html += "<h2>Pollster: " + incoming_data[i].pollster + "</h2>" +
            "<h2>Affiliation: " + incoming_data[i].affiliation + "</h2>" +
            "<h2>Type of Poll: " + incoming_data[i].method + "</h2>";
        document.getElementById("tablinks").innerHTML += "<li><a href='#tab-" + i + "'>" + incoming_data[i].pollster + "</a></li>";

        //console.log(incoming_data[i].partisan);
        for (j = 0; j < incoming_data[i].questions.length; j += 1) {
            html += "<section class='question'>" +
                "<h3>" + incoming_data[i].questions[j].name + "</h3>" +
                "<canvas id='answer-" + i + "-" + j + "'></canvas>" +
                "</section>";
            block.innerHTML = html;

        }
        document.getElementById("tabs").appendChild(block);
        html = "";
    }

    for (i = 0; i < incoming_data.length; i += 1) {
        var labelArr = [];
        var values = [];
        for (j = 0; j < incoming_data[i].questions.length; j += 1) {
            var ctx = document.getElementById("answer-" + i + "-" + j).getContext("2d");
            var graph = new BarGraph(ctx);
            graph.margin = 2;
            if (incoming_data[i].questions[j].subpopulations[0].responses.length <= 3) {
                graph.width = 500;
                graph.height = 200;
            } else {
                graph.width = 1000;
                graph.height = 300;
            }



            for (k = 0; k < incoming_data[i].questions[j].subpopulations[0].responses.length; k += 1) {
                labelArr.push(incoming_data[i].questions[j].subpopulations[0].responses[k].choice);
                values.push(incoming_data[i].questions[j].subpopulations[0].responses[k].value);


            }

            console.log(labelArr);
            console.log(values);
            graph.xAxisLabelArr = labelArr;
            graph.update(values);
            labelArr = [];
            values = [];
        }

    }
};

function BarGraph(ctx) {
    var that = this;
    var startArr;
    var endArr;
    var looping = false;

    var draw = function (arr) {

        var numOfBars = arr.length;
        var barWidth;
        var barHeight;
        var border = 2;
        var ratio;
        var maxBarHeight;
        var gradient;
        var largestValue;
        var graphAreaX = 0;
        var graphAreaY = 0;
        var graphAreaWidth = that.width;
        var graphAreaHeight = that.height;
        var i;

        // Update the dimensions of the canvas only if they have changed
        if (ctx.canvas.width !== that.width || ctx.canvas.height !== that.height) {
            ctx.canvas.width = that.width;
            ctx.canvas.height = that.height;
        }

        // Draw the background color
        ctx.fillStyle = that.backgroundColor;
        ctx.fillRect(0, 0, that.width, that.height);

        // If x axis labels exist then make room	
        if (that.xAxisLabelArr.length) {
            graphAreaHeight -= 40;
        }

        // Calculate dimensions of the bar
        barWidth = graphAreaWidth / numOfBars - that.margin * 2;
        maxBarHeight = graphAreaHeight - 25;

        // Determine the largest value in the bar array
        var largestValue = 0;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i] > largestValue) {
                largestValue = arr[i];
            }
        }

        // For each bar
        for (i = 0; i < arr.length; i += 1) {
            // Set the ratio of current bar compared to the maximum
            if (that.maxValue) {
                ratio = arr[i] / that.maxValue;
            } else {
                ratio = arr[i] / largestValue;
            }

            barHeight = ratio * maxBarHeight;

            // Turn on shadow
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 2;
            ctx.shadowColor = "#999";

            // Draw bar background
            ctx.fillStyle = "#333";
            ctx.fillRect(that.margin + i * that.width / numOfBars,
                graphAreaHeight - barHeight,
                barWidth,
                barHeight);

            // Turn off shadow
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;

            // Draw bar color if it is large enough to be visible
            if (barHeight > border * 2) {
                // Create gradient
                gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
                gradient.addColorStop(1 - ratio, that.colors[i % that.colors.length]);
                gradient.addColorStop(1, "#ffffff");

                ctx.fillStyle = gradient;
                // Fill rectangle with gradient
                ctx.fillRect(that.margin + i * that.width / numOfBars + border,
                    graphAreaHeight - barHeight + border,
                    barWidth - border * 2,
                    barHeight - border * 2);
            }

            // Write bar value
            ctx.fillStyle = "#333";
            ctx.font = "bold 12px sans-serif";
            ctx.textAlign = "center";
            // Use try / catch to stop IE 8 from going to error town
            try {
                ctx.fillText(parseInt(arr[i], 10),
                    i * that.width / numOfBars + (that.width / numOfBars) / 2,
                    graphAreaHeight - barHeight - 10);
            } catch (ex) {}
            // Draw bar label if it exists
            if (that.xAxisLabelArr[i]) {
                // Use try / catch to stop IE 8 from going to error town				
                ctx.fillStyle = "#333";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                try {
                    ctx.fillText(that.xAxisLabelArr[i],
                        i * that.width / numOfBars + (that.width / numOfBars) / 2,
                        that.height - 10);
                } catch (ex) {}
            }
        }
    };

    this.width = 300;
    this.height = 150;
    this.maxValue;
    this.margin = 5;
    this.colors = ["purple", "red", "green", "yellow"];
    this.curArr = [];
    this.backgroundColor = "#fff";
    this.xAxisLabelArr = [];
    this.yAxisLabelArr = [];
    this.animationInterval = 100;
    this.animationSteps = 10;

    // Update method sets the end bar array and starts the animation
    this.update = function (newArr) {

        // If length of target and current array is different 
        if (that.curArr.length != newArr.length) {
            that.curArr = newArr;
            draw(newArr);
        }
    };
}

window.onload = function () {
    $(function () {
        $("#tabs").tabs();
    });
};

$(function () {
    $("#tabs").tabs();
});

$(document).ready(function () {

    $curtainopen = false;

    $(".conf").click(function () {

        $(this).blur();

        if ($curtainopen == false) {

            $(this).stop().animate({
                top: '0px'
            }, {
                queue: false,
                duration: 350,
                easing: 'easeOutBounce'
            });
            $("#leftcurtain").stop().animate({
                width: '0px'
            }, 2000);
            $("#rightcurtain").stop().animate({
                width: '0px'
            }, 2000);
            $curtainopen = true;

        }

        return false;

    });

});