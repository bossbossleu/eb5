// Load your JSON data
d3.json("https://raw.githubusercontent.com/bossbossleu/eb5/main/data/test.json").then(function (originalData) {
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

  // Loop through each dimension pair and draw connecting lines
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
          // No need to add circles here
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

  // Append circles for nodes
  dimensions.forEach(function (currentDimension) {
    var circles = g.selectAll(".node-circle-" + currentDimension)
      .data(data)
      .enter().append("circle")
      .attr("class", "node-circle node-circle-" + currentDimension)
      .attr("cx", x(currentDimension))
      .attr("cy", function (d) { return y[currentDimension](d[currentDimension]); })
      .attr("data-dimension", currentDimension)
      .attr("data-value", function (d) { return d[currentDimension]; })
      .attr("r", function (d) {
        var valueCount = data.filter(function (item) {
          return item[currentDimension] === d[currentDimension];
        }).length;
        return valueCount * 2;
      })
      .style("fill", "white")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .on("click", function (event, d) {
        handleCircleClick(d); // Pass the data to the click handler
      });
  });

// Function to handle circle click
function handleCircleClick(clickedData) {
  // Perform actions based on the clicked circle, if needed
  clickedData.selected = !clickedData.selected; // Toggle selection status
  updateConnectedElements(clickedData); // Pass the clicked circle's data
  console.log("Circle clicked:", clickedData);
}

  // Function to update connected elements based on selection status
  function updateConnectedElements(clickedData) {
    console.log("Updating connected elements:", clickedData);
    // Update color of clicked circle
    var clickedCircle = g.select(".node-circle-" + clickedData["data-dimension"]);
    clickedCircle.style("fill", clickedData.selected ? "red" : "white");

    // Update color of connected lines and circles
    dimensions.forEach(function (currentDimension, index) {
      if (index < dimensions.length - 1) {
        var currentSelector = ".dimension-path-" + currentDimension;
        var nextDimension = dimensions[index + 1];

        g.selectAll(currentSelector)
          .filter(function (d) {
            return d[currentDimension] === clickedData[currentDimension];
          })
          .style("stroke", clickedData.selected ? "red" : "darkgrey")
          .style("stroke-opacity", clickedData.selected ? 1 : 0.7);

        // Update following circles connected to the lines
        var followingCircles = g.selectAll(".node-circle-" + nextDimension)
          .filter(function (d) {
            return d[currentDimension] === clickedData[currentDimension];
          });

        followingCircles.style("fill", clickedData.selected ? "red" : "white");
      }
    });

    // Update color of additional red paths
    g.selectAll(".dimension-path-" + clickedData["data-dimension"] + "-additional")
      .style("stroke", clickedData.selected ? "red" : "transparent");
  }


});




























































