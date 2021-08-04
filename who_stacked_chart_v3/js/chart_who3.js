class Chart_WHO {
    constructor() {
        let vis = this;

        vis.currentStep = 0;

        let parseTime = d3.timeParse("%d-%b-%y");

        vis.height = 550;
        vis.width = 700;
        vis.padding = 150;

        d3.csv("data/daily_cases_regions_w_7_average.csv", (row, i) => {
            row.date = parseTime(row.date);
            row.Africa = +row.Africa;
            row.Americas = +row.Americas;
            row.Eastern_Mediterranean = +row.Eastern_Mediterranean;
            row.Europe = +row.Europe;
            row.Other = +row.Other;
            row.South_East_Asia = +row.South_East_Asia;
            row.Western_Pacific = +row.Western_Pacific;
            row.new_cases = +row.new_cases;
            row.day_average = +row.day_average;

            return row;
        }).then(data => {
            vis.data = data;
            vis.initVis();
        });
    }

    initVis() {
        let vis = this;
        let dataset = vis.data;

        vis.svg = d3.select("#svg")
            .append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height);

        vis.svg.append("text")
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("x", vis.width - 80)
            .attr("y", vis.height - 110)
            .style("font-size", "12px")
            .transition()
            .attr("text-anchor", "end")
            .attr("x", vis.width - 80)
            .attr("y", vis.height - 110)
            .text("Date")
            .style("font-size", "12px");

        vis.svg.append("text")
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("x", vis.width/2- 120)
            .attr("y", 80)
            .style("font-size", "14px")
            .transition()
            .attr("text-anchor", "end")
            .attr("x", vis.width/2-120)
            .attr("y", 80)
            .text("New Covid Cases Around the World")
            .attr("text-anchor", "start")
            .style("font-size", "14px")
            .style("font-weight", "bold");


        vis.svg.append("text")
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("x", 80)
            .attr("y", 110)
            .style("font-size", "12px")
            .transition()
            .attr("text-anchor", "end")
            .attr("x", 80)
            .attr("y", 110)
            .text("# of New Covid Cases")
            .attr("text-anchor", "start")
            .style("font-size", "12px")



        vis.x = d3.scaleTime()
            .domain([d3.min(dataset, d => d.date), d3.max(dataset, d => d.date)])
            .range([vis.padding, vis.width - vis.padding]);

        let xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(d3.timeMonth.every(3))
            .tickFormat(d3.timeFormat("%d-%b-%y"));

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + (vis.height - vis.padding) + ")")
            .transition()
            .duration(1000)
            .call(xAxis);
    }

    updateVis() {
        let vis = this;

        let dataset = vis.data;

        vis.currentStep++;

        if (vis.currentStep === 8) {
            vis.Legend();
            return;
        } else if (vis.currentStep === 9) {

        }

        let stack = d3.stack()
            .order(d3.stackOrderAscending);

        let keys = ["Americas", "Europe", "South_East_Asia", "Eastern_Mediterranean", "Africa", "Western_Pacific", "Other"];
        keys.splice(0, keys.length - vis.currentStep);
        stack.keys(keys);
        console.log("keys", keys);

        let series = stack(dataset);
        series.splice(0, series.length - vis.currentStep);
        console.log("series", series);

        let sumOfRegions = d3.max(dataset, d => {
            let sum = 0;
            keys.forEach(k => sum += d[k]);
            return sum;
        });
        console.log("sum", sumOfRegions);

        vis.y = d3.scaleLinear()
            .domain([0, sumOfRegions])
            .range([vis.height - vis.padding, vis.padding]);

        let area = d3.area()
            .x(d => vis.x(d.data.date))
            .y0(d => vis.y(d[0]))
            .y1(d => vis.y(d[1]));

        let accent = ["#feac3d", "#c0d058", "#47199c", "#00a687", "#206fbe", "#bf2183", "grey"];
        accent.splice(0, accent.length - vis.currentStep);

        let areas = vis.svg.selectAll(".area").data(series);
        areas
            .enter()
            .append("path")
            .attr("class", "area")
            .merge(areas)
            .transition()
            .delay((_, i) => i * 1000)
            .duration(3000)
            //.ease(d3.easeBounceOut)
            .attr("d", area)
            .attr("fill", (_, i) => accent[i]);
        areas.exit().remove();

        let yAxis = d3.axisLeft().scale(vis.y);

        let axis = vis.svg.selectAll(".y-axis").data(series);
        axis
            .enter()
            .append("g")
            .merge(axis)
            // .transition()
            // .style(opacity, 0.5)
            .attr("class", "y-axis axis")
            .attr("transform", "translate(" + vis.padding + ",0)")
            .transition()
            // .delay(1000)
            .duration(3000)
            .call(yAxis);



        axis.exit()
           .remove();

    }


    Legend() {
        let vis = this;

        let dataset = vis.data;

        vis.currentStep++;

        let date = new Date(2021, 0, 10);

        vis.svg.append('line')
            .attr('x1', vis.x(date))
            .attr('y1', vis.y("807017"))
            .attr('x2', vis.x(date))
            .attr('y2', vis.y("364132"))
            .attr("stroke", "#666362")
            .attr("stroke-width", 1.5)
            .style("stroke", 2)
            .transition()
            .delay(1000)
            .style("opacity", 0)

        //807,017 - 364,132= 442,885


        vis.svg.append("text")
            .attr("x", vis.x(date) - 110)
            .attr("y", vis.y("807017") -12)
            .text("Americas")
            .style("fill", "#feac3d")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .transition()
            .delay(2000 )
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 10)
            .style("font-size", "9px")
            .style("font-weight", "normal")
            .style('fill', "#feac3d")

        vis.svg.append("text")
            .attr("x", vis.x(date) -110)
            .attr("y", vis.y("807017"))
            .text("442,885 new cases")
            .style("fill", "#feac3d")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .transition()
            .delay(2000 )
            .attr("x", vis.x(date) -110)
            .attr("y", vis.y("807017"))
            .style("font-size", "9px")
            .style("font-weight", "normal")
            .style('fill', "none")



        vis.svg.append('circle')
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 25)
            .transition()
            .delay(1500)
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 5)
            .attr('r', 5)
            .attr('fill', "#feac3d")


        vis.svg.append('circle')
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 25)
            .transition()
            .delay(2500)
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 25)
            .attr('r', 5)

            .attr('fill', "#c0d058");

        vis.svg.append("text")
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 30)
            .transition()
            .delay(2500 )
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 30)
            .text("Europe")
            .style("fill", "#c0d058")
            .style("font-size", "9px")
            .style("font-weight", "normal")


        vis.svg.append('circle')
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 25)
            .transition()
            .delay(2500)
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 45)
            .attr('r', 5)
            .attr('fill', "#47199c");

        vis.svg.append("text")
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 50)
            .transition()
            .delay(2500 )
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 50)
            .text("South East Asia")
            .style("fill", "#47199c")
            .style("font-size", "9px")
            .style("font-weight", "normal")


        vis.svg.append('circle')
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 25)
            .transition()
            .delay(2500)
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 65)
            .attr('r', 5)
            .attr('fill', "#00a687");

        vis.svg.append("text")
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 70)
            .transition()
            .delay(2500 )
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 70)
            .text("Eastern Mediterranean")
            .style("fill", "#00a687")
            .style("font-size", "9px")
            .style("font-weight", "normal")


        vis.svg.append('circle')
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 25)
            .transition()
            .delay(2500)
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 85)
            .attr('r', 5)
            .attr('fill', "#206fbe");

        vis.svg.append("text")
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 90)
            .transition()
            .delay(2500 )
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 90)
            .text("Africa")
            .style("fill", "#206fbe")
            .style("font-size", "9px")
            .style("font-weight", "normal")


        vis.svg.append('circle')
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 25)
            .transition()
            .delay(2500)
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 105)
            .attr('r', 5)
            .attr('fill', "#bf2183");

        vis.svg.append("text")
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 110)
            .transition()
            .delay(2500)
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 110)
            .text("Western Pacific")
            .style("fill", "#bf2183")
            .style("font-size", "9px")
            .style("font-weight", "normal")


        vis.svg.append('circle')
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 25)
            .transition()
            .delay(2500)
            .attr('cx', vis.x(date) + 170)
            .attr('cy', vis.y("807017") + 125)
            .attr('r', 5)
            .attr('fill', "grey");

        vis.svg.append("text")
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 130)
            .transition()
            .delay(2500 )
            .attr("x", vis.x(date) + 180)
            .attr("y", vis.y("807017") + 130)
            .text("Other")
            .style("fill", "grey")
            .style("font-size", "9px")
            .style("font-weight", "normal")



        // let defs = svg.append("defs")
        //
        // defs.append("marker")
        //     .attr({
        //         "id":"arrow",
        //         "viewBox":"0 -5 10 10",
        //         "refX":5,
        //         "refY":0,
        //         "markerWidth":4,
        //         "markerHeight":4,
        //         "orient":"auto"
        //     })
        //     .append("path")
        //     .attr("d", "M0,-5L10,0L0,5")
        //     .attr("class","arrowHead");

        // defs.append("marker")
        //     .attr({
        //         "id":"turtle",
        //         "viewBox":"0 0 100 100",
        //         "refX":50,
        //         "refY":50,
        //         "markerWidth":10,
        //         "markerHeight":10,
        //         "orient":"auto"
        //     });
        //     // .node().appendChild(importedNode);


    }
}