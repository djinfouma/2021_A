
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// create a tooltip
var Tooltip2 = d3.select("#multi")
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



// append the svg2 object to the body of the page
var svg2 = d3.select("#multi")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("./js/ansiolitici.csv", function (data) {

  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function (d) { return d.anno; })
    .entries(data);

  // Add X axis --> it is a date format
  var x = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return d3.timeParse("%B")(d.mesi); }))
    .range([0, 600]);
  svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .style("font-family", "'Poppins', sans-serif")
    .style("font-size", "8px")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([9.5, 13])
    .range([height, 0]);
  svg2.append("g")
    .style("font-family", "'Poppins', sans-serif")
    .call(d3.axisLeft(y));

  // color palette
  var res = sumstat.map(function (d) { return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#734DFF', '#2A9D8F', '#E76F51'])


  // Draw the line
  svg2.selectAll(".line")
    .data(sumstat)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", function (d) { return color(d.key) })
    .attr("stroke-width", 2)
    .attr("d", function (d) {
      return d3.line()
        .x(function (d) { return x(d3.timeParse("%B")(d.mesi)); })
        .y(function (d) { return y(+d.value); })
        (d.values)
    })


  // Three function that change the tooltip when user hover / move / leave a cell

  var mouseover2 = function (d) {
    Tooltip2
      .style("opacity", 1)
      .html("<b>Mese: </b>" + d.mesi + "<br><b>Valore: </b>" + d.value)
  }
  var mousemove2 = function (d) {
    Tooltip2
      .html("<b>Mese: </b>" + d.mesi + "<br><b>Valore: </b>" + d.value)
      .style("left", (event.pageX) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top",(event.pageY-70) + "px")
  }
  var mouseleave2 = function (d) {
    Tooltip2
      .style("opacity", 0)
  }


  // Add the points
  svg2
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "myCircle")
    .attr("cx", function (d) { return x(d3.timeParse("%B")(d.mesi)) })
    .attr("cy", function (d) { return y(d.value) })
    .attr("r", 4)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill", "white")
    .on("mouseover", mouseover2)
    .on("mousemove", mousemove2)
    .on("mouseleave", mouseleave2)


  // Handmade legend
  svg2.append("circle").attr("cx", 680).attr("cy", 0).attr("r", 6).style("fill", "#E76F51")
  svg2.append("circle").attr("cx", 680).attr("cy", 30).attr("r", 6).style("fill", "#2A9D8F")
  svg2.append("circle").attr("cx", 680).attr("cy", 60).attr("r", 6).style("fill", "#734DFF")
  svg2.append("text").attr("x", 700).attr("y", 0).text("2021").style("font-size", "12px").style("font-family", "'Poppins', sans-serif").attr("alignment-baseline", "middle")
  svg2.append("text").attr("x", 700).attr("y", 30).text("2020").style("font-size", "12px").style("font-family", "'Poppins', sans-serif").attr("alignment-baseline", "middle")
  svg2.append("text").attr("x", 700).attr("y", 60).text("2019").style("font-size", "12px").style("font-family", "'Poppins', sans-serif").attr("alignment-baseline", "middle")


//Add annotations
    
var parseDate = function(d){ return d3.timeParse("%B")(d)}
const annotations = [
  // first annotation
  {
  note: {
    label: "1° Lockdown",
    title: "Marzo 2020",
    wrap: 100  // try something smaller to see text split in several lines

},
color: ["#081F54"],
x: x(parseDate('March')),
y: y(12.4554),
dy: -20,
dx: 70,
subject: {
  radius: 20,
  radiusPadding: 2
},
type: d3.annotationCalloutCircle
}]

window.makeAnnotations = d3.annotation()
  .annotations(annotations)
 
  
  svg2.append("g")
  .style("font-size", "13px")
  .call(makeAnnotations)



})

