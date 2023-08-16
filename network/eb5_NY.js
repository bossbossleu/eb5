// Load your JSON data
d3.json("https://raw.githubusercontent.com/bossbossleu/eb5/main/data/EB5_completed_projects - NY.json").then(function (data) {
    // Define margins
    var margin = { top: 50, right: 50, bottom: 50, left: 150 }; // Adjust as needed

    // Define the dimensions for the parallel categories diagram
    var dimensions = ["r_name", "p_name", "developer_1", "arch_firm_1"];

    // Fill null values with "N/A" and rename "N/A" values
    var naCounter = 0;
    data.forEach(function (d) {
        dimensions.forEach(function (dimension) {
            if (d[dimension] === null) {
                d[dimension] = "N/A";
            } else if (d[dimension] === "N/A") {
                d[dimension] = "N/A " + (++naCounter);
            }
        });
    });

    // Create an array of unique categories for each dimension
    var categoriesData = dimensions.map(function (dimension) {
        return {
            dimension: dimension,
            categories: Array.from(new Set(data.map(function (d) { return d[dimension]; })))
        };
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
        .range([0, innerWidth]);

    var y = {};

    dimensions.forEach(function (dimension) {
        y[dimension] = d3.scalePoint()
            .domain(categoriesData.find(function (d) { return d.dimension === dimension; }).categories)
            .range([innerHeight, 0]);
    });

    var line = d3.line()
        .defined(function (d) { return d[1] !== undefined; })
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return y[d[0]](d[1]); });

    g.selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", function (d) {
            return line(dimensions.map(function (dimension) {
                return [dimension, d[dimension]];
            }));
        })
        .attr("stroke", "steelblue")
        .attr("stroke-opacity", function(d) {
            return d.r_name.includes("N/A") ? 0 : 0.5;
        })
        .attr("fill", "none");

    // Draw axes
    g.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
        .each(function (d) { d3.select(this).call(d3.axisLeft(y[d])).selectAll("text").style("font-size", "7px").style("font-family", "Arial"); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .style("font-size", "7px")
        .style("font-family", "Arial")
        .text(function (d) { return d; });
});



























