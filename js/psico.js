
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 700 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// create a tooltip
var Tooltip = d3.select("#psico")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("font-family", "'Poppins', sans-serif")
.style("font-size", "12px")
.style("color", "#081F54")
.style("border-radius", "10px")
.style("padding", "10px")
.style("position", "absolute")
.style("box-shadow", "4px 3px 17px #99a7c9")



// append the svg object to the body of the page
var svg = d3.select("#psico")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("./js/psicotrend.csv", function (data) {

  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function (d) { return d.psicofarmaco; })
    .entries(data);

  // Add X axis --> it is a date format
  var x = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return d3.timeParse("%Y")(d.anno); }))
    .range([0, 400]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .style("font-family", "'Poppins', sans-serif")
    .style("font-size", "9px")
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 55])
    .range([height, 0]);
  svg.append("g")
    .style("font-family", "'Poppins', sans-serif")
    .call(d3.axisLeft(y));

  // color palette
  var res = sumstat.map(function (d) { return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#734DFF', '#2A9D8F', '#E76F51'])


  // Draw the line
  svg.selectAll(".line")
    .data(sumstat)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", function (d) { return color(d.key) })
    .attr("stroke-width", 2)
    .attr("d", function (d) {
      return d3.line()
        .x(function (d) { return x(d3.timeParse("%Y")(d.anno)); })
        .y(function (d) { return y(+d.value); })
        (d.values)
    })


  // Three function that change the tooltip when user hover / move / leave a cell

  var mouseover = function (d) {
    Tooltip
      .style("opacity", 1)
      .html("Valore: " + d.value + "<br>Anno: " + d.anno)
  }
  var mousemove = function (d) {
    Tooltip
      .html("<b>Valore: </b>" + d.value)
      .style("left", (event.pageX) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (event.pageY-50) + "px")
  }
  var mouseleave = function (d) {
    Tooltip
      .style("opacity", 0)
  }


  // Add the points
  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "myCircle")
    .attr("cx", function (d) { return x(d3.timeParse("%Y")(d.anno)) })
    .attr("cy", function (d) { return y(d.value) })
    .attr("r", 4)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill", "white")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)


  // Handmade legend
  svg.append("circle").attr("cx", 480).attr("cy", 0).attr("r", 6).style("fill", "#E76F51") 
  svg.append("circle").attr("cx", 480).attr("cy", 30).attr("r", 6).style("fill", "#2A9D8F")
  svg.append("circle").attr("cx", 480).attr("cy", 60).attr("r", 6).style("fill", "#734DFF")
  svg.append("text").attr("x", 500).attr("y", 0).text("Benzodiazepine").style("font-size", "12px").style("font-family", "'Poppins', sans-serif").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", 500).attr("y", 30).text("Antidepressivi").style("font-size", "12px").style("font-family", "'Poppins', sans-serif").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", 500).attr("y", 60).text("Antipsicotici").style("font-size", "12px").style("font-family", "'Poppins', sans-serif").attr("alignment-baseline", "middle")

})