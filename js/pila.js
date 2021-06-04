// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 20, left: 50 },
  width = 650 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg3 object to the body of the page
var svg3 = d3.select("#pila")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("./js/pila.csv", function (data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function (d) { return (d.groups) }).keys()

  // Add X axis
  var x = d3.scaleBand()
    .domain(groups)
    .range([0, 400])
    .padding([0.2])
  svg3.append("g")
    .style("font-family", "'Poppins', sans-serif")
    .style("font-size", "9px")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);
  svg3.append("g")
    .style("font-family", "'Poppins', sans-serif")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#9FBDFF', '#081F54'])

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)




  // ----------------
  // Create a tooltip
  // ----------------
  var tooltip3 = d3.select("#pila")
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

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover3 = function (d) {
    var subgroupName3 = d3.select(this.parentNode).datum().key;
    var subgroupValue3 = d.data[subgroupName3];
    tooltip3
      .html("<b>Valore: </b>" + subgroupValue3 + "%")
      .style("opacity", 1)
  }
  var mousemove3 = function (d) {
    tooltip3
    .style("left", (event.pageX) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    .style("top", (event.pageY-50) + "px")
  }
  var mouseleave3 = function (d) {
    tooltip3
      .style("opacity", 0)
  }




  // Show the bars
  svg3.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
    .attr("fill", function (d) { return color(d.key); })
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function (d) { return d; })
    .enter().append("rect")
    .attr("x", function (d) { return x(d.data.groups); })
    .attr("y", function (d) { return y(d[1]); })
    .attr("height", function (d) { return y(d[0]) - y(d[1]); })
    .attr("width", x.bandwidth())
    .on("mouseover", mouseover3)
    .on("mousemove", mousemove3)
    .on("mouseleave", mouseleave3)


  // Handmade legend
  svg3.append("circle").attr("cx", 450).attr("cy", 0).attr("r", 6).style("fill", "#9FBDFF")
  svg3.append("circle").attr("cx", 450).attr("cy", 30).attr("r", 6).style("fill", "#081F54")
  svg3.append("text").attr("x", 470).attr("y", 0).text("Nuovi casi").style("font-size", "12px").style("font-family", "'Poppins', sans-serif").attr("alignment-baseline", "middle")
  svg3.append("text").attr("x", 470).attr("y", 30).text("Casi già registrati").style("font-size", "12px").style("font-family", "'Poppins', sans-serif").attr("alignment-baseline", "middle")

})