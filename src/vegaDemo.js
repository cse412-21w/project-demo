import sunshineData from '../static/sunshine.csv'    // import dataset
var vl = require('vega-lite-api');
var vegaLite = require('vega-lite');
var vega = require('vega');
var vegaTooltip = require('vega-tooltip');
"use strict";     // the code should be executed in "strict mode".
                  // With strict mode, you can not, for example, use undeclared variables

var sunshineArray = [];   // used to store data later
var citySet = [];

const options = {
  config: {
    // Vega-Lite default configuration
  },
  init: (view) => {
    // initialize tooltip handler
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    // view constructor options
    // remove the loader if you don't want to default to vega-datasets!
    //   loader: vega.loader({
    //     baseURL: "",
    //   }),
    renderer: "canvas",
  },
};

vl.register(vega, vegaLite, options);

// Again, We use d3.csv() to process data
d3.csv(sunshineData).then(function(data) {
  data.forEach(function(d){
    sunshineArray.push(d);
    if (!citySet.includes(d.city)) {
      citySet.push(d.city);
    }
  })
  drawBarVegaLite();
});


function drawBarVegaLite() {
  vl.markBar({filled:true, color:'teal'})
    .data(sunshineArray)
    .encode(
      vl.x().fieldN('month').sort('none'),
      vl.y().fieldQ('sunshine'),
      vl.tooltip('sunshine')
    )
    .width(500)
    .height(500)
    .render()
    .then(viewElement => {
      document.getElementById("view").appendChild(viewElement);
    })
}
  