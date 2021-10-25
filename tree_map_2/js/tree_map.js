
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


    const root = d3.hierarchy(data).sum(function(d){ return d.value})

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
                .style("stroke", "#434343")
                .style("stroke-width", "1.5")
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
            .style("left", ((event.x) +10) + "px")
            .style("top", ((event.y) +10) + "px")

    }


    const mouseover_business = function(event, d) {
        d3.selectAll("rect.business_border")
            .style("stroke-width", "5.5");

        d3.select(this)
            .style("font-size","16px");

        d3.selectAll("text.business_label")
            .style("font-size","12px");

        d3.selectAll("text.text-business")
            .style("font-size","16px");


    }



    const mouseleave_business = function(event,d) {
        d3.selectAll("rect.business_border")
            .style("stroke-width", "3.5");

        d3.select(this)
            .style("font-size","15px");

        d3.selectAll("text.business_label")
            .style("font-size","10px");

        d3.selectAll("text.text-business")
            .style("font-size","15px");
    }


    const mouseover_individuals = function(event, d) {
        d3.selectAll("rect.individuals_border")
            .style("stroke-width", "5.5");

        d3.select(this)
            .style("font-size","16px");

        d3.selectAll("text.individuals_label")
            .style("font-size","12px");

        d3.selectAll("text.text-individuals")
            .style("font-size","16px");

    }

    const mouseleave_individuals = function(event,d) {
        d3.selectAll("rect.individuals_border")
            .style("stroke-width", "3.5");

        d3.select(this)
            .style("font-size","15px");

        d3.selectAll("text.individuals_label")
            .style("font-size","10px");

        d3.selectAll("text.text-individuals")
            .style("font-size","15px");
    }


    const mouseover_government = function(event, d) {
        d3.selectAll("rect.government_border")
            .style("stroke-width", "5.5");

        d3.select(this)
            .style("font-size","16px");

        d3.selectAll("text.government_label")
            .style("font-size","12px");

        d3.selectAll("text.text-government")
            .style("font-size","16px");
    }

    const mouseleave_government = function(event,d) {
        d3.selectAll("rect.government_border")
            .style("stroke-width", "3.5");

        d3.select(this)
            .style("font-size","15px");

        d3.selectAll("text.government_label")
            .style("font-size","10px");

        d3.selectAll("text.text-government")
            .style("font-size","15px");
    }

    const mouseover_medicine = function(event, d) {
        d3.selectAll("rect.medicine_border")
            .style("stroke-width", "5.5");

        d3.select(this)
            .style("font-size","16px");

        d3.selectAll("text.medicine_label")
            .style("font-size","12px");

        d3.selectAll("text.text-medicine")
            .style("font-size","16px");
    }

    const mouseleave_medicine = function(event,d) {
        d3.selectAll("rect.medicine_border")
            .style("stroke-width", "3.5");

        d3.select(this)
            .style("font-size","15px");

        d3.selectAll("text.medicine_label")
            .style("font-size","10px");

        d3.selectAll("text.text-medicine")
            .style("font-size","15px");
    }

    d3.treemap()
        .size([width, height])
        .paddingInner(2)
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


    //highlight box1 from business category
    svg
        .selectAll("rect5")
        .data(root.leaves()[1])
        .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "#434343")
        .style("stroke-width", "1.5")
        .style("fill", "none")

    //highlight box2 from business category
    svg
        .selectAll("rect5")
        .data(root.leaves()[2])
        .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "#434343")
        .style("stroke-width", "1.5")
        .style("fill", "none")


    //highlight box2 from individuals category
    svg
        .selectAll("rect5")
        .data(root.leaves()[20])
        .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "#434343")
        .style("stroke-width", "1.5")
        .style("fill", "none")

    //highlight box2 from individuals category
    svg
        .selectAll("rect5")
        .data(root.leaves()[49])
        .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "#434343")
        .style("stroke-width", "1.5")
        .style("fill", "none")



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
        .on("mouseover",mouseover_business)
        .on("mouseleave", mouseleave_business);

    svg
        .append("rect")
        .attr('x', 493)
        .attr('y', -27.5)
        .attr('width', "130px")
        .attr('height', "25px")
        .style("fill", "black" )
        .on("mouseover",mouseover_individuals)
        .on("mouseleave", mouseleave_individuals);


    svg
        .append("rect")
        .attr('x', 810)
        .attr('y', -27.5)
        .attr('width', "90px")
        .attr('height', "25px")
        .style("fill", "black" )
        .on("mouseover",mouseover_government)
        .on("mouseleave", mouseleave_government);


    svg
        .append("rect")
        .attr('x', 493)
        .attr('y', height+2.5)
        .attr('width', "145px")
        .attr('height', "25px")
        .style("fill", "black")
        .on("mouseover",mouseover_medicine)
        .on("mouseleave", mouseleave_medicine);


    //overall border overlay for business category
    svg
        .append("rect")
        .attr("class", "business_border")
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 491.5)
        .attr('height', height)
        .style("stroke", "black")
        .style("stroke-width", "3.5")
        .style("fill", "none" );

    //overall border overlay for individuals category
    svg
        .append("rect")
        .attr("class", "individuals_border")
        .attr('x', 491.5)
        .attr('y', 0)
        .attr('width', 810-491.5)
        .attr('height', 275)
        .style("stroke", "black")
        .style("stroke-width", "3.5")
        .style("fill", "none" );

    //overall border overlay for individuals category
    svg
        .append("rect")
        .attr("class", "government_border")
        .attr('x', 810)
        .attr('y', 0)
        .attr('width', width-810)
        .attr('height', 275)
        .style("stroke", "black")
        .style("stroke-width", "3.5")
        .style("fill", "none" )

    //overall border overlay for medicine category
    svg
        .append("rect")
        .attr("class", "medicine_border")
        .attr('x', 491.5)
        .attr('y', 275)
        .attr('width', width-491.5)
        .attr('height', height-275)
        .style("stroke", "black")
        .style("stroke-width", "3.5")
        .style("fill", "none" )




    svg
        .selectAll("text-business")
        .data(root.leaves()[0])
        .enter()
        .append("text")
        .attr("class", "text-business")
        .attr("x", function(d){ return d.x0+5})
        .attr("y", function(d){ return d.y0+20})
        .text(function(d){ return data.children[0].children[0].name})
        .attr("font-size", "15px")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .on("mouseover",mouseover_business)
        .on("mouseleave", mouseleave_business);


    svg
        .selectAll("text-individuals")
        .data(root.leaves()[19])
        .enter()
        .append("text")
        .attr("class", "text-individuals")
        .attr("x", function(d){ return d.x0+5})
        .attr("y", function(d){ return d.y0+20})
        .text(function(d){ return data.children[1].children[0].name})
        .attr("font-size", "15px")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .on("mouseover",mouseover_individuals)
        .on("mouseleave", mouseleave_individuals);

    svg
        .selectAll("text-government")
        .data(root.leaves()[37])
        .enter()
        .append("text")
        .attr("class", "text-government")
        .attr("x", function(d){ return d.x0+2})
        .attr("y", function(d){ return d.y0+20})
        .text(function(d){ return data.children[2].children[0].name})
        .attr("font-size", "15px")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .on("mouseover",mouseover_government)
        .on("mouseleave", mouseleave_government);

    svg
        .selectAll("text-medicine")
        .data(root.leaves()[49])
        .enter()
        .append("text")
        .attr("class", "text-medicine")
        .attr("x", function(d){ return d.x0+5})
        .attr("y", function(d){ return d.y0+20})
        .text(function(d){ return data.children[3].children[0].name})
        .attr("font-size", "15px")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .on("mouseover",mouseover_medicine)
        .on("mouseleave", mouseleave_medicine);

    svg
        .selectAll("text2")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+5})
        .attr("y", function(d){ return d.y0+50})
        .text(function(d){ return d.data.label2})
        .attr("font-size", "9px")
        .attr("fill", "#434343")
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
        .attr("font-size", "9px")
        .attr("fill", "#434343")
        .attr("font-weight", "bold")


    const mouseover_text = function(event, d) {
        d3.select(this)
            .style("font-size", "13px")
    }


    const mouseleave_text = function(event,d) {
        d3.select(this)
            .style("font-size", "9px")

    }

    svg
        .append("text")
        .attr("x",margin.left)
        .attr("y", -10)
        .text("BUSINESS")
        .attr("class", "business_label")
        .attr("font-size", "10px")
        .attr("fill",  "white" )
        .style("font-weight", "bold")
        .style("text-anchor","middle")
        .on("mouseover", mouseover_business)
        .on("mouseleave", mouseleave_business);



    svg
        .append("text")
        .attr("x",width/2+110)
        .attr("y", -10)
        .text("INDIVIDUALS")
        .attr("class", "individuals_label")
        .attr("font-size", "10px")
        .attr("fill",  "white" )
        .style("font-weight", "bold")
        .style("text-anchor","middle")
        .on("mouseover", mouseover_individuals)
        .on("mouseleave", mouseleave_individuals);

    svg
        .append("text")
        .attr("x",856)
        .attr("y", -10)
        .text("GOVERNMENT")
        .attr("class", "government_label")
        .attr("font-size", "10px")
        .attr("fill",  "white" )
        .style("font-weight", "bold")
        .style("text-anchor","middle")
        .on("mouseover", mouseover_government)
        .on("mouseleave", mouseleave_government);


    svg
        .append("text")
        .attr("x",width/2+110)
        .attr("y", height+20)
        .text("MEDICINE")
        .attr("class", "medicine_label")
        .attr("font-size", "10px")
        .attr("fill",  "white" )
        .style("font-weight", "bold")
        .style("text-anchor","middle")
        .on("mouseover", mouseover_medicine)
        .on("mouseleave", mouseleave_medicine);



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