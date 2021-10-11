
const margin = {top: 120, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

const padding = 30


const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        `translate(${margin.left}, ${margin.top})`);


d3.json("data/dataset.json").then( function(data) {


    const root = d3.hierarchy(data).sum(function(d){ return d.value}) // Here the size of each leave is given in the 'value' field in input data

    console.log(root)


    const tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("box-shadow", "2px 2px 4px lightgrey")
        .style("padding", "10px")


    const mouseover = function(event, d) {
        tooltip
            .style("opacity", 1)
        d3.select(this)
                .style("stroke", "black")
                .style("stroke-width", "2.5")
                // .style("opacity", 1)
    }



    const mouseleave = function(event,d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", "2.5")
                // .style("opacity", 0.8)
    }


    var mousemove = function(event, d) {
        tooltip
            .html(`<strong>$${d.data.value} billion </strong> <br>${d.data.group}`)
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2 + "px")
    }


    d3.treemap()
        .size([width, height])
        .paddingInner(2.5)
        (root)


    const color = d3.scaleOrdinal()
        .domain(["business", "individuals", "government", "medicine"])
        .range([ "#fde3b1", "#d4e6cb", "#d8e0f0", "#f5d8d5"])


    const opacity = d3.scaleLinear()
        .domain([10, 300])
        .range([.5,1])


    svg
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "white")
        .style("stroke-width", "2.5")
        .style("fill", function(d){ return color(d.parent.data.name)} )
        // .style("opacity", function(d){ return opacity(d.data.value)})
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);



    //wrap text label2
    function wrap(text) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                x = text.attr("x"),
                y = text.attr("y"),
                dy = 0,
                width = text.attr("width"),
                tspan = text.text(null).append("tspan").attr("y", y);
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }


    svg
        .append("rect")
        .attr('x', 0)
        .attr('y', -27.5)
        .attr('width', "100px")
        .attr('height', "25px")
        .style("fill", "black" )

    svg
        .append("rect")
        .attr('x', 493)
        .attr('y', -27.5)
        .attr('width', "130px")
        .attr('height', "25px")
        .style("fill", "black" )


    svg
        .append("rect")
        .attr('x', 810)
        .attr('y', -27.5)
        .attr('width', "90px")
        .attr('height', "25px")
        .style("fill", "black" )


    svg
        .append("rect")
        .attr('x', 493)
        .attr('y', height+2.5)
        .attr('width', "145px")
        .attr('height', "25px")
        .style("fill", "black" )



    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+5})
        .attr("y", function(d){ return d.y0+20})
        .text(function(d){ return d.data.name })
        .attr("font-size", "14px")
        .attr("fill", "black")
        .attr("font-weight", "bold");



    svg
        .selectAll("text2")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+5})
        .attr("y", function(d){ return d.y0+50})
        .text(function(d){ return d.data.label2})
        .attr("font-size", "10px")
        .attr('width', function (d) { return d.x1 - d.x0; })
        .call(wrap);


    svg
        .selectAll("text3")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+5})
        .attr("y", function(d){ return d.y0+80})
        .text(function(d){ return d.data.label3})
        .attr("font-size", "10px")
        .attr("fill", "black")
        .attr("font-weight", "bold")



    svg
        .append("text")
        .attr("x",margin.left)
        .attr("y", -10)
        .text("BUSINESS")
        .attr("font-size", "11px")
        .attr("fill",  "white" )
        .style("font-weight", "bold")
        .style("text-anchor","middle")


    svg
        .append("text")
        .attr("x",width/2+110)
        .attr("y", -10)
        .text("INDIVIDUALS")
        .attr("font-size", "11px")
        .attr("fill",  "white" )
        .style("font-weight", "bold")
        .style("text-anchor","middle")

    svg
        .append("text")
        .attr("x",856)
        .attr("y", -10)
        .text("GOVERNMENTS")
        .attr("font-size", "11px")
        .attr("fill",  "white" )
        .style("font-weight", "bold")
        .style("text-anchor","middle")

    svg
        .append("text")
        .attr("x",width/2+110)
        .attr("y", height+20)
        .text("MEDICINE")
        .attr("font-size", "11px")
        .attr("fill",  "white" )
        .style("font-weight", "bold")
        .style("text-anchor","middle")



    svg
        .append("text")
        .attr("x", width/2)
        .attr("y", -100)
        .text("$4 Trillion")
        .attr("font-size", "19px")
        .attr("fill",  "black" )
        .style("font-weight", "bold")
        .style("text-anchor","middle")



    svg
        .append("text")
        .attr("x", width/2)
        .attr("y", -70)
        .text("Total U.S. Coronavirus bailout")
        .attr("font-size", "14px")
        .attr("fill",  "black" )
        .style("text-anchor","middle")


})