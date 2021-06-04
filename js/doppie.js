
// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 1200 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom;

// append the svg1 object to the body of the page
var svg1 = d3.select("#doppie")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg1.append("g")
  .attr("transform", "translate(0," + height + ")")
  .style("font-family", "'Poppins', sans-serif")
  .style("font-size", "8px")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg1.append("g")
  .style("font-family", "'Poppins', sans-serif")
  .attr("class", "myYaxis")


// A function that create / update the plot for a given variable:
function update(selectedVar) {

  // Parse the Data
  d3.csv("./js/consumo.csv", function(data) {

    // X axis
    x.domain(data.map(function(d) { return d.gruppo; }))
    xAxis.transition().duration(1000).call(d3.axisBottom(x))

    // Add Y axis
    y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // variable u: map data to existing bars
    var u = svg1.selectAll("rect")
      .data(data)

    // update bars
    u
      .enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
        .attr("x", function(d) { return x(d.gruppo); })
        .attr("y", function(d) { return y(d[selectedVar]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[selectedVar]); })
        .attr("fill", function(d){ if (((selectedVar == 'consumo')||(selectedVar == 'spesa'))&&((d.gruppo=='Ansiolitici')||(d.gruppo=='Ipnotici'))) return "#E76F51" ; 
        else if (selectedVar == 'consumo') return "#9EBCFD";
        else if (selectedVar == 'spesa') return "#081F54"})
  })

}

// Initialize plot
update('consumo')