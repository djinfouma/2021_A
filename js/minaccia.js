
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// create a Tooltip4
var Tooltip4 = d3.select("#minaccia")
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



// append the svg4 object to the body of the page
var svg4 = d3.select("#minaccia")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("./js/minaccia.csv", function (data) {

  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function (d) { return d.tipo; })
    .entries(data);

  // Add X axis --> it is a date format
  var x = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return d3.timeParse("%d/%m/%Y")(d.data); }))
    .range([0, 550]);
  svg4.append("g")
    .attr("transform", "translate(0," + height + ")")
    .style("font-family", "'Poppins', sans-serif")
    .style("font-size", "8px")
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);
  svg4.append("g")
    .style("font-family", "'Poppins', sans-serif")
    .call(d3.axisLeft(y));

  // color palette
  var res = sumstat.map(function (d) { return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#9FBDFF', '#734DFF'])


  // Draw the line
  svg4.selectAll(".line")
    .data(sumstat)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", function (d) { return color(d.key) })
    .attr("stroke-width", 2)
    .attr("d", function (d) {
      return d3.line()
        .x(function (d) { return x(d3.timeParse("%d/%m/%Y")(d.data)); })
        .y(function (d) { return y(+d.value); })
        (d.values)
    })


  // Three function that change the Tooltip4 when user hover / move / leave a cell

  var mouseover4 = function (d) {
    Tooltip4
      .style("opacity", 1)
      .html("Valore: " + d.value + "<br>Data: " + d.data)
  }
  var mousemove4 = function (d) {
    Tooltip4
      .html("<b>Valore:</b> " + d.value + "<br><b>Data:</b> " + d.data)
      .style("left", (event.pageX) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top",(event.pageY-70) + "px")
  }
  var mouseleave4 = function (d) {
    Tooltip4
      .style("opacity", 0)
  }


  // Add the points
  svg4
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "myCircle")
    .attr("cx", function (d) { return x(d3.timeParse("%d/%m/%Y")(d.data)) })
    .attr("cy", function (d) { return y(d.value) })
    .attr("r", 4)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill", "#ffffff")
    .on("mouseover", mouseover4)
    .on("mousemove", mousemove4)
    .on("mouseleave", mouseleave4)


  // Handmade legend
  svg4.append("circle").attr("cx", 630).attr("cy", 0).attr("r", 6).style("fill", "#734DFF")
  svg4.append("circle").attr("cx", 630).attr("cy", 30).attr("r", 6).style("fill", "#9FBDFF")
  svg4.append("text").attr("x", 650).attr("y", 0).text("Per il mondo").style("font-size", "12px").style("font-family", "'Poppins', sans-serif").attr("alignment-baseline", "middle")
  svg4.append("text").attr("x", 650).attr("y", 30).text("Per me").style("font-size", "12px").style("font-family", "'Poppins', sans-serif").attr("alignment-baseline", "middle")



  const annotations1 = [
    // first annotation
    {
    note: {
      label: "Lockdown",
      title: "Marzo - Aprile",
      wrap: 150,  // try something smaller to see text split in several lines
      padding: 5   // More = text lower
  
  },
  color: ["#081F54"],
  x: 15,
  y: y(92),
  dy: 100,
  dx: 100,
  subject: {
    width: 60,
    height: 180
  },
  type: d3.annotationCalloutRect,
  
  }]
  
  window.makeAnnotations = d3.annotation()
    .annotations(annotations1)
   
    
    svg4.append("g")
    .style("font-size", "13px")
    .call(makeAnnotations)
})