// Load your JSON data
d3.json("https://raw.githubusercontent.com/bossbossleu/eb5/main/data/EB5_completed_projects - NY.json").then(function (originalData) {
    // Define margins
    var margin = { top: 50, right: 50, bottom: 50, left: 150 }; // Adjust as needed

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
    var width = 1920, height = 900; // Adjust as needed

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
            .domain(Array.from(new Set(data.map(function (d) { return d[dimension]; }))))
            .range([height - margin.top - margin.bottom, 0]);
    });

    var line = d3.line()
        .defined(function (d) { return d[1] !== undefined; })
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return y[d[0]](d[1]); });

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
            .attr("stroke", function(d) {
                if (d[currentDimension].startsWith("NA") || d[nextDimension].startsWith("NA")) {
                    return "red";
                } else {
                    return "blue";
                }
            })
            .attr("stroke-opacity", 0.5)
            .attr("fill", "none");
    }

    // Draw axes
    g.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
        .each(function (d) { d3.select(this).call(d3.axisLeft(y[d])).selectAll("text").style("font-size", "12px").style("font-family", "Arial"); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .style("font-size", "12px")
        .style("font-family", "Arial")
        .text(function (d) { return d; });

    // Create a new data label for the modified JSON data
    var newDataLabel = g.append("text")
        .attr("x", 10)
        .attr("y", height - 10)
        .style("font-size", "12px")
        .style("font-family", "Arial")
        .text("Modified Data: NA values replaced and labeled");

});












































