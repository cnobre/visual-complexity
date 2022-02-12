class TreeMapChart {
    constructor(data) {

        this.root = d3.hierarchy(data).sum(function (d) {
            return d.value
        })

        this.data = data;

        console.log(this.root)

        this.initVis();
    }

    initVis() {

        let vis = this;

        vis.margin = {top: 120, right: 50, bottom: 50, left: 50},

        vis.width = 1000 - vis.margin.left - vis.margin.right,
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

        vis.padding = 30;

        //treemap set up
        vis.svg = d3.select("#treemap")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                `translate(${vis.margin.left}, ${vis.margin.top})`);

        //treemap set up
        d3.treemap()
            .size([vis.width, vis.height])
            .paddingInner(2)
            (vis.root)

        vis.color = d3.scaleOrdinal()
            .domain(["business", "individuals", "government", "medicine"])
            .range([ "#fde3b1", "#d4e6cb", "#d8e0f0", "#f5d8d5"])


        vis.opacity = d3.scaleLinear()
            .domain([10, 300])
            .range([.5,1])

        //tooltip
        vis.tooltip = d3.select("#treemap")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("box-shadow", "2px 2px 4px lightgrey")
            .style("padding", "10px")

        //the main rectangles
        vis.svg
            .selectAll("rect")
            .data(vis.root.leaves())
            .join("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "white")
            .style("stroke-width", "2.5")
            .style("fill", function(d){ return vis.color(d.parent.data.name)} )
            .on("mouseover", function() {vis.Mouseover(this)})
            .on("mousemove", function(e,d){vis.Mousemove(e,d)})
            .on("mouseleave", function() {vis.Mouseleave(this)});


        //highlight box1 from business category
        vis.svg
            .selectAll("rect5")
            .data(vis.root.leaves()[1])
            .join("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "#434343")
            .style("stroke-width", "1.5")
            .style("fill", "none")

        //highlight box2 from business category
        vis.svg
            .selectAll("rect5")
            .data(vis.root.leaves()[2])
            .join("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "#434343")
            .style("stroke-width", "1.5")
            .style("fill", "none")


        //highlight box2 from individuals category
        vis.svg
            .selectAll("rect5")
            .data(vis.root.leaves()[20])
            .join("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "#434343")
            .style("stroke-width", "1.5")
            .style("fill", "none")

        //highlight box2 from individuals category
        vis.svg
            .selectAll("rect5")
            .data(vis.root.leaves()[49])
            .join("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "#434343")
            .style("stroke-width", "1.5")
            .style("fill", "none")



        //wrap text for small labels in rectangles (label2)
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

        //Tooltip
        vis.tooltip = d3.select("#treemap")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("box-shadow", "2px 2px 4px lightgrey")
            .style("padding", "10px")


        //Main Title
        vis.svg
            .append("text")
            .attr("x", vis.width/2)
            .attr("y", -100)
            .text("$4 Trillion")
            .attr("font-size", "19px")
            .attr("fill",  "black" )
            .style("font-weight", "bold")
            .style("text-anchor","middle")


        //Secondary Title
        vis.svg
            .append("text")
            .attr("x", vis.width/2)
            .attr("y", -70)
            .text("Total U.S. Coronavirus bailout")
            .attr("font-size", "14px")
            .attr("fill",  "black" )
            .style("text-anchor","middle")



        //Value label for business - $2.3 trillion
        vis.svg
            .selectAll("text-business")
            .data(vis.root.leaves()[0])
            .enter()
            .append("text")
            .attr("class", "text-business")
            .attr("x", function(d){ return d.x0+5})
            .attr("y", function(d){ return d.y0+20})
            .text(function(d){ return vis.data.children[0].children[0].name})
            .attr("font-size", "15px")
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .on("mouseover", function(e, d) {vis.MouseOverBusiness(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveBusiness(this)});

        //Value label for individuals - $884 billion
        vis.svg
            .selectAll("text-individuals")
            .data(vis.root.leaves()[19])
            .enter()
            .append("text")
            .attr("class", "text-individuals")
            .attr("x", function(d){ return d.x0+5})
            .attr("y", function(d){ return d.y0+20})
            .text(function(d){ return vis.data.children[1].children[0].name})
            .attr("font-size", "15px")
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .on("mouseover", function(e, d) {vis.MouseOverIndividuals(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveIndividuals(this)});

        //Value label for government - $253 billion
        vis.svg
            .selectAll("text-government")
            .data(vis.root.leaves()[37])
            .enter()
            .append("text")
            .attr("class", "text-government")
            .attr("x", function(d){ return d.x0+1})
            .attr("y", function(d){ return d.y0+20})
            .text(function(d){ return vis.data.children[2].children[0].name})
            .attr("font-size", "15px")
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .on("mouseover", function(e, d) {vis.MouseOverGovernment(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveGovernment(this)});

        //Value label for medicine - $363 billion
        vis.svg
            .selectAll("text-medicine")
            .data(vis.root.leaves()[49])
            .enter()
            .append("text")
            .attr("class", "text-medicine")
            .attr("x", function(d){ return d.x0+5})
            .attr("y", function(d){ return d.y0+20})
            .text(function(d){ return vis.data.children[3].children[0].name})
            .attr("font-size", "15px")
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .on("mouseover", function(e, d) {vis.MouseOverMedicine(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveMedicine(this)});

        //text on a few selected rectangles
        vis.svg
            .selectAll("text2")
            .data(vis.root.leaves())
            .enter()
            .append("text")
            .attr("x", function(d){ return d.x0+5})
            .attr("y", function(d){ return d.y0+50})
            .text(function(d){ return d.data.label2})
            .attr("font-size", "9px")
            .attr("fill", "#434343")
            .attr('width', function (d) { return d.x1 - d.x0; })
            .call(wrap);

        //label text on the selected rectangles
        vis.svg
            .selectAll("text3")
            .data(vis.root.leaves())
            .enter()
            .append("text")
            .attr("x", function(d){ return d.x0+5})
            .attr("y", function(d){ return d.y0+80})
            .text(function(d){ return d.data.label3})
            .attr("font-size", "9px")
            .attr("fill", "#434343")
            .attr("font-weight", "bold")


        //overall border overlay for business category
        vis.svg
            .append("rect")
            .attr("class", "business_border")
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 491.5)
            .attr('height', vis.height)
            .style("stroke", "black")
            .style("stroke-width", "3.5")
            .style("fill", "none" )
            .on("mouseover", function(e, d) {vis.MouseOverBusiness(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveBusiness(this)});

        //overall border overlay for individuals category
        vis.svg
            .append("rect")
            .attr("class", "individuals_border")
            .attr('x', 491.5)
            .attr('y', 0)
            .attr('width', 810-491.5)
            .attr('height', 275)
            .style("stroke", "black")
            .style("stroke-width", "3.5")
            .style("fill", "none" )
            .on("mouseover", function(e, d) {vis.MouseOverIndividuals(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveIndividuals(this)});

        //overall border overlay for individuals category
        vis.svg
            .append("rect")
            .attr("class", "government_border")
            .attr('x', 810)
            .attr('y', 0)
            .attr('width', vis.width-810)
            .attr('height', 275)
            .style("stroke", "black")
            .style("stroke-width", "3.5")
            .style("fill", "none" )
            .on("mouseover", function(e, d) {vis.MouseOverGovernment(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveGovernment(this)});

        //overall border overlay for medicine category
        vis.svg
            .append("rect")
            .attr("class", "medicine_border")
            .attr('x', 491.5)
            .attr('y', 275)
            .attr('width', vis.width-491.5)
            .attr('height', vis.height-275)
            .style("stroke", "black")
            .style("stroke-width", "3.5")
            .style("fill", "none" )
            .on("mouseover", function(e, d) {vis.MouseOverMedicine(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveMedicine(this)});

        //rectangle behind the business value label text
        vis.svg
            .append("rect")
            .attr('x', 0)
            .attr('y',0)
            .attr('width', "100px")
            .attr('height', "35px")
            .style("stroke", "black")
            .style("stroke-width", "3.5")
            .style("opacity", 0)
            .on("mouseover", function(e, d) {vis.MouseOverBusiness(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveBusiness(this)});


        //rectangle behind the individuals value label text
        vis.svg
            .append("rect")
            .attr('x', 493)
            .attr('y', 0)
            .attr('width', "130px")
            .attr('height', "35px")
            .style("stroke", "black")
            .style("stroke-width", "3.5")
            .style("opacity", 0)
            .on("mouseover", function(e, d) {vis.MouseOverIndividuals(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveIndividuals(this)});


        //rectangle behind the government value label text
        vis.svg
            .append("rect")
            .attr('x', 810)
            .attr('y', 0)
            .attr('width', "90px")
            .attr('height', "35px")
            .style("fill", "black" )
            .style("stroke", "black")
            .style("stroke-width", "3.5")
            .style("opacity", 0)
            .on("mouseover", function(e, d) {vis.MouseOverGovernment(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveGovernment(this)});


        //rectangle behind the medicine value label text
        vis.svg
            .append("rect")
            .attr('x', 493)
            .attr('y', 275)
            .attr('width', "145px")
            .attr('height', "35px")
            .style("fill", "black" )
            .style("stroke", "black")
            .style("stroke-width", "3.5")
            .style("opacity", 0)
            .on("mouseover", function(e, d) {vis.MouseOverMedicine(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveMedicine(this)});


        //black box stating 'medicine'
        vis.svg
            .append("rect")
            .attr("class", "rect-business_box")
            .attr('x', 0)
            .attr('y', -27.5)
            .attr('width', "100px")
            .attr('height', "25px")
            .style("fill", "black" )
            .on("mouseover", function(e, d) {vis.MouseOverBusiness(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveBusiness(this)});

        //black box stating 'individuals'
        vis.svg
            .append("rect")
            .attr("class", "rect-individuals_box")
            .attr('x', 493)
            .attr('y', -27.5)
            .attr('width', "130px")
            .attr('height', "25px")
            .style("fill", "black" )
            .on("mouseover", function(e, d) {vis.MouseOverIndividuals(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveIndividuals(this)});

        //black box stating 'government'
        vis.svg
            .append("rect")
            .attr("class", "rect-government_box")
            .attr('x', 810)
            .attr('y', -27.5)
            .attr('width', "90px")
            .attr('height', "25px")
            .style("fill", "black" )
            .on("mouseover", function(e, d) {vis.MouseOverGovernment(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveGovernment(this)});

        //black box stating 'medicine'
        vis.svg
            .append("rect")
            .attr("class", "rect-medicine_box")
            .attr('x', 493)
            .attr('y', vis.height+2.5)
            .attr('width', "145px")
            .attr('height', "25px")
            .style("fill", "black")
            .on("mouseover", function(e, d) {vis.MouseOverMedicine(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveMedicine(this)});

        //BUSINESS category label
        vis.svg
            .append("text")
            .attr("x",vis.margin.left)
            .attr("y", -10)
            .text("BUSINESS")
            .attr("class", "business_label")
            .attr("font-size", "10px")
            .attr("fill",  "white" )
            .style("font-weight", "bold")
            .style("text-anchor","middle")
            .on("mouseover", function(e, d) {vis.MouseOverBusiness(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveBusiness(this)});


        //INDIVIDUALS category label
        vis.svg
            .append("text")
            .attr("x",vis.width/2+110)
            .attr("y", -10)
            .text("INDIVIDUALS")
            .attr("class", "individuals_label")
            .attr("font-size", "10px")
            .attr("fill",  "white" )
            .style("font-weight", "bold")
            .style("text-anchor","middle")
            .on("mouseover", function(e, d) {vis.MouseOverIndividuals(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveIndividuals(this)});

        //GOVERNMENT category label
        vis.svg
            .append("text")
            .attr("x",856)
            .attr("y", -10)
            .text("GOVERNMENT")
            .attr("class", "government_label")
            .attr("font-size", "10px")
            .attr("fill",  "white" )
            .style("font-weight", "bold")
            .style("text-anchor","middle")
            .on("mouseover", function(e, d) {vis.MouseOverGovernment(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveGovernment(this)});


        //MEDICINE category label
        vis.svg
            .append("text")
            .attr("x",vis.width/2+110)
            .attr("y", vis.height+20)
            .text("MEDICINE")
            .attr("class", "medicine_label")
            .attr("font-size", "10px")
            .attr("fill",  "white" )
            .style("font-weight", "bold")
            .style("text-anchor","middle")
            .on("mouseover", function(e, d) {vis.MouseOverMedicine(this)})
            .on("mouseleave", function(e, d) {vis.MouseLeaveMedicine(this)});


    }

    //display a thin dark-grey border for each rectangle when hovering over
    Mouseover(element) {

        let vis = this;

        vis.tooltip
            .style("opacity", 1)

        d3.select(element)
            .style("stroke", "#434343")
            .style("stroke-width", "1.5")

        console.log(element)

    }


    //display tooltip text
    Mousemove(e,d) {

        let vis = this;

        vis.tooltip
            .html(`<strong>$${d.data.value} billion </strong> <br>${d.data.group}`)
            .style("left", ((e.x) +10) + "px")
            .style("top", ((e.y) +10) + "px")


        }

    //display a white border for each rectangle after hovering over
    Mouseleave(element) {

           let vis = this;

            vis.tooltip
                .style("opacity", 0)

            d3.select(element)
                .style("stroke", "white")
                .style("stroke-width", "2.5")

    }


    //the mouseover function for the overall business category
    MouseOverBusiness(element) {

        let vis = this;

        d3.selectAll("rect.business_border")
            .style("stroke-width", "5.5");

        d3.select(element)
            .style("font-size", "16px");

        d3.selectAll("text.business_label")
            .style("font-size", "12px");

        d3.selectAll("rect.rect-business_box")
            .style("stroke", "black")
            .style("stroke-width", "5.5px");

        d3.selectAll("text.text-business")
            .style("font-size", "16px");
    }

    //the mouseover function for the overall individuals category
    MouseOverIndividuals(element) {

        let vis = this;

        d3.selectAll("rect.individuals_border")
            .style("stroke-width", "5.5");

        d3.select(element)
            .style("font-size","16px");

        d3.selectAll("text.individuals_label")
            .style("font-size","12px");

        d3.selectAll("rect.rect-individuals_box")
            .style("stroke", "black")
            .style("stroke-width", "7.5px");

        d3.selectAll("text.text-individuals")
            .style("font-size","16px");

        }

    //the mouseover function for the overall government category
    MouseOverGovernment(element) {

        let vis = this;

        d3.selectAll("rect.government_border")
            .style("stroke-width", "5.5");

        d3.select(element)
            .style("font-size","16px");

        d3.selectAll("text.government_label")
            .style("font-size","12px");

        d3.selectAll("rect.rect-government_box")
            .style("stroke", "black")
            .style("stroke-width", "5.5px");

        d3.selectAll("text.text-government")
            .attr("x", function(d){ return d.x0-1})
            .attr("y", function(d){ return d.y0+20})
            .style("font-size","16px");
    }

    //the mouseover function for the overall medicine category
    MouseOverMedicine(element) {

        let vis = this;

        d3.selectAll("rect.medicine_border")
            .style("stroke-width", "5.5");

        d3.select(element)
            .style("font-size","16px");

        d3.selectAll("text.medicine_label")
            .style("font-size","12px");

        d3.selectAll("rect.rect-medicine_box")
            .style("stroke", "black")
            .style("stroke-width", "7.5px");

        d3.selectAll("text.text-medicine")
            .style("font-size","16px");
    }

    //the mouseleave function for the overall business category
    MouseLeaveBusiness(element) {

        let vis = this;

        d3.selectAll("rect.business_border")
            .style("stroke-width", "3.5");

        d3.select(element)
            .style("font-size","15px");

        d3.selectAll("text.business_label")
            .style("font-size","10px");

        d3.selectAll("rect.rect-business_box")
            .style("stroke-width", "0px");

        d3.selectAll("text.text-business")
            .style("font-size","15px");
    }

    //the mouseleave function for the overall individuals category
    MouseLeaveIndividuals(element) {

        let vis = this;

        d3.selectAll("rect.individuals_border")
            .style("stroke-width", "3.5");

        d3.select(element)
            .style("font-size","15px");

        d3.selectAll("text.individuals_label")
            .style("font-size","10px");

        d3.selectAll("rect.rect-individuals_box")
            .style("stroke-width", "0px");

        d3.selectAll("text.text-individuals")
            .style("font-size","15px");
    }

    //the mouseleave function for the overall government category
    MouseLeaveGovernment(element) {

        let vis = this;

        d3.selectAll("rect.government_border")
            .style("stroke-width", "3.5");

        d3.select(element)
            .style("font-size","15px");

        d3.selectAll("text.government_label")
            .style("font-size","10px");

        d3.selectAll("rect.rect-government_box")
            .style("stroke-width", "0px");

        d3.selectAll("text.text-government")
            .attr("x", function(d){ return d.x0+1})
            .attr("y", function(d){ return d.y0+20})
            .style("font-size","15px");
    }

    //the mouseleave function for the overall medicine category
    MouseLeaveMedicine(element) {

        let vis = this;

        d3.selectAll("rect.medicine_border")
            .style("stroke-width", "3.5");

        d3.select(element)
            .style("font-size","15px");

        d3.selectAll("text.medicine_label")
            .style("font-size","10px");

        d3.selectAll("rect.rect-medicine_box")
            .style("stroke-width", "0px");

        d3.selectAll("text.text-medicine")
            .style("font-size","15px");
    }




}