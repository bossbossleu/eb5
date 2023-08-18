// Load your JSON data
d3.json("https://raw.githubusercontent.com/bossbossleu/eb5/main/data/EB5_completed_projects - NY.json").then(function (originalData) {
  // Define margins
  var margin = { top: 80, right: 80, bottom: 80, left: 160 }; // Adjust as needed

  // Define the dimensions for the parallel categories diagram
  var dimensions = ["r_name", "p_name", "developer_1", "arch_firm_1"];

  // Replace null values and "N/A" values with "NA" and label sequential "NA"
  var data = JSON.parse(JSON.stringify(originalData)); // Clone the original data
  var naCounter = 0;
  data.forEach(function (d) {
    dimensions.forEach(function (dimension) {
      if (d[dimension] === null || d[dimension] === "N/A") {
        d[dimension] = "NA " + (++naCounter);
      }
    });
  });

  // Create the parallel categories diagram
  var width = 1920, height = 1080; // Adjust as needed

  // Append an SVG element to the myDiv container
  var svg = d3.select("#myDiv").append("svg")
    .attr("width", width)
    .attr("height", height);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scalePoint()
    .domain(dimensions)
    .range([0, width - margin.left - margin.right]);

  var y = {};

  dimensions.forEach(function (dimension) {
    y[dimension] = d3.scalePoint()
        .domain(Array.from(new Set(data.map(function (d) { return d[dimension]; }))).reverse()) // Reverse the domain array
        .range([height - margin.top - margin.bottom, 0]);
  });

  var line = d3.line()
    .defined(function (d) { return d[1] !== undefined; })
    .x(function (d) { return x(d[0]); })
    .y(function (d) { return y[d[0]](d[1]); });

  // Append circles for nodes
  dimensions.forEach(function (currentDimension) {
    var circles = g.selectAll(".node-circle-" + currentDimension)
  .data(data)
  .enter().append("circle")
  .attr("class", "node-circle node-circle-" + currentDimension) // Add class for specific dimension
  .attr("cx", x(currentDimension))
  .attr("cy", function (d) { return y[currentDimension](d[currentDimension]); })
  .attr("data-dimension", currentDimension) // Store currentDimension as a data attribute
  .attr("data-value", function (d) { return d[currentDimension]; }) // Store the value for filtering
  .attr("r", function (d) {
      var valueCount = data.filter(function (item) {
          return item[currentDimension] === d[currentDimension];
      }).length;
      return valueCount * 2; // Adjust the multiplier as needed
  })
  .style("fill", "white") // Set initial fill color
  .style("stroke", "black") // Set stroke color
  .style("stroke-width", "1px") // Set stroke width
  .on("mouseover", function () {
      d3.select(this)
          .style("fill", "neonGreen")
          .style("stroke", "neonGreen")
          .style("stroke-width", "2px");
  })
  .on("mouseout", function () {
      d3.select(this)
          .style("fill", "white")
          .style("stroke", "black")
          .style("stroke-width", "1px");
  });

});

  // Mouseover event handler for circles
  function handleCircleMouseOver(event, d) {
    var circle = d3.select(this);

    // Change circle fill color to neon green
    circle.style("fill", "neonGreen")
      .style("stroke", "neonGreen")
      .style("stroke-width", "2px");
  }

  // Mouseout event handler for circles
  function handleCircleMouseOut(event, d) {
    var circle = d3.select(this);

    // Change circle fill color back to white
    circle.style("fill", "white")
      .style("stroke", "black")
      .style("stroke-width", "1px");
  }

  // Loop through each dimension and draw paths
  for (var i = 0; i < dimensions.length - 1; i++) {
    var currentDimension = dimensions[i];
    var nextDimension = dimensions[i + 1];

    g.selectAll(".dimension-path-" + currentDimension)
      .data(data)
      .enter().append("path")
      .attr("class", "dimension-path-" + currentDimension)
      .attr("d", function (d) {
        var dataSegment = dimensions.slice(i, i + 2).map(function (dimension) {
          return [dimension, d[dimension]];
        });
        return line(dataSegment);
      })
      .attr("stroke", function (d) {
        if (d[currentDimension].startsWith("NA") || d[nextDimension].startsWith("NA")) {
          return "lightgrey";
        } else {
          return "darkgrey";
        }
      })
      .attr("stroke-opacity", function (d) {
        if (d[currentDimension].startsWith("NA") || d[nextDimension].startsWith("NA")) {
          return 0.2;
        } else {
          return 0.7;
        }
      })
      .attr("fill", "none");
  }

  // Draw axes
  g.selectAll(".dimension")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
    .each(function (d) {
      var tickCounts = {}; // Object to store tick counts for each unique value
      data.forEach(function (item) {
        var value = item[d];
        tickCounts[value] = (tickCounts[value] || 0) + 1;
      });

      d3.select(this).call(d3.axisLeft(y[d]))
        .selectAll(".tick")
        .each(function (tickValue) {
          var circleRadius = tickCounts[tickValue] * 2; // Calculate circle radius based on tick count

          d3.select(this).append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", circleRadius)
          .style("fill", "white") // Set the fill color to white
          .style("stroke", "black") // Set the stroke color to black
          .style("stroke-width", "1px"); // Set the stroke width
      });

    d3.select(this).selectAll("path")
      .style("opacity", 0.1);
    d3.select(this).selectAll("text")
      .style("font-size", "7px")
      .style("font-family", "Arial");
  });

// Adjust opacity for text labels starting with "NA"
g.selectAll(".dimension text")
  .style("opacity", function (d) {
    if (d.startsWith("NA")) {
      return 0.1;
    } else {
      return 1;
    }
  });

});




























































