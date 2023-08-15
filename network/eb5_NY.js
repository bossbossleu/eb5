// Define width and height for the SVG container
var svgWidth = 800; // Adjust as needed
var svgHeight = 600; // Adjust as needed

// Create margins
var margin = { top: 30, right: 10, bottom: 10, left: 10 },
  width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom;

// Append an SVG element to the diagram-container
var svg = d3.select("#diagram-container").append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/// Load your JSON data
d3.json("https://raw.githubusercontent.com/bossbossleu/eb5/main/data/EB5_completed_projects%20-%20NY.json").then(function (data) {
  console.log(data); // Check if data is loaded correctly

  // Define the dimensions for the parallel coordinates plot
  var dimensions = ["r_name", "p_name", "developer_1", "arch_firm_1"];

  // Create scales for each dimension
  var y = {};
  dimensions.forEach(function (d) {
    y[d] = d3.scalePoint()
      .domain(data.map(function (p) { return p[d]; }))
      .range([height, 0]);
  });

    // Create the parallel coordinates plot
    var foreground = svg.append("g")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path);

    function path(d) {
      return dimensions.map(function (p, i) {
        // Check for missing data or "N/A" values
        if (d[p] === null || d[p] === "N/A") {
          return [y[p](p), y[p](p)];
        }
        return [i * (width / (dimensions.length - 1)), y[p](d[p])];
      });
    }
});





