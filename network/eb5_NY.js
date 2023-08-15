// Define the ID of your Google Drive file
var fileID = "1NSQRgurpd0iyeJv5yRwIJSxaofn298JG";

// Construct the Google Drive file URL
var fileURL = "https://drive.google.com/uc?id=" + fileID;

// Define width and height
var width = 800; // Adjust as needed
var height = 600; // Adjust as needed

// Load your JSON data
d3.json(fileURL).then(function(data) {
  console.log(data); // Log the loaded data to the console
    // Filter out rows with N/A and blank cells
    var filteredData = data.filter(function(d) {
      return d.r_name && d.p_name && d.developer_1 && d.arch_firm_1;
    });
  
    // Create a Sankey layout
    var sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 1], [width - 1, height - 6]]);
  
    // Create nodes and links
    var { nodes, links } = sankey({
      nodes: filteredData.map(function(d) {
        return { name: d.r_name };
      }),
      links: filteredData.map(function(d) {
        return {
          source: d.developer_1,
          target: d.arch_firm_1,
          value: 1 // You can customize the value based on your data
        };
      })
    });

    // Create an SVG container
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
  
    // Create links
    var link = svg.append("g")
        .selectAll("path")
        .data(links)
        .enter().append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", function(d) { return Math.max(1, d.width); });
  
    // Create nodes
    var node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
  
    // Add rectangles to nodes
    node.append("rect")
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("width", sankey.nodeWidth())
        .attr("fill", "steelblue");
  
    // Add text to nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return (d.y1 - d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(function(d) { return d.name; });
});

  