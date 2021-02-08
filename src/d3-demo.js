import sunshineData from '../static/sunshine.csv'    // import dataset
"use strict";     // the code should be executed in "strict mode".
                  // With strict mode, you can not, for example, use undeclared variables


var line_svg;    // used for svg later
var colorSet;    // used for color scheme later
var sunshineArray = [];   // used to store data later

// preparation for our svg
var margin = { top: 50, right: 35, bottom: 50, left: 50 },
w = 650 - (margin.left + margin.right),
h = 520 - (margin.top + margin.bottom);
var legendSpace = 130;

// preparation for our x/y axis
var y = d3.scaleLinear()
          .range([h, 0]);
var x = d3.scaleTime()
          .range([ 0, w]);
var yAxis = d3.axisLeft(y);
var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b"));   // %b: abbreviated Month format (Mon, Jun..)

var citySet = [];

// once finish processing data, make a graph!
d3.csv(sunshineData).then(function(data) {
  data.forEach(function(d){
    sunshineArray.push(d);
    if (!citySet.includes(d.city)) {
      citySet.push(d.city);
    }
  })
  drawLineD3();
});

function drawLineD3() {
  colorSet = d3.scaleOrdinal().domain(citySet)
                .range(d3.schemeSet2);
  x.domain(d3.extent(sunshineArray, function(d) { return d3.timeParse("%b")(d.month); }));
  y.domain(d3.extent(sunshineArray, function(d) { return parseFloat(d.sunshine); }));

  // create our svg
  line_svg = d3.select('#d3-demo').append('svg')
  .attr("id", "line-chart")
  .attr("width", w + margin.left + margin.right + legendSpace)
  .attr("height", h + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // append x axis to svg
  line_svg.append("g")
  .attr("transform", "translate(0," + h + ")")
  .attr("class","myXaxis")
  .call(xAxis);

  // append y axis to svg
  line_svg.append("g")
  .attr("class","myYaxis")
  .call(yAxis);

// make a line for each city
  citySet.forEach(function(d) {
      var currentCity = sunshineArray.filter(function(e) {return e.city === d;});

      var line = d3.line()
      .x(function(d){return x(d3.timeParse("%b")(d.month));})
      .y(function(d){return y(parseFloat(d.sunshine));});

      var path = line_svg.append("path")
        .datum(currentCity)
        .attr("class", "lines")
        .attr('d', line)
        .style("stroke-width", 2.5)
        .style("fill", "none")
        .attr("stroke", colorSet(d))
  });

  // add legend
  for (let i = 0; i < citySet.length; i++) {
    line_svg.append("rect").attr("class","legends").attr("x",600).attr("y",25+30*i).attr("width", 10).attr("height", 10).style("fill", colorSet(citySet[i]));
    line_svg.append("text").attr("class","legends").attr("x", 620).attr("y", 30+30*i).text(citySet[i]).style("font-size", "15px").attr("alignment-baseline","middle")
  }
}


