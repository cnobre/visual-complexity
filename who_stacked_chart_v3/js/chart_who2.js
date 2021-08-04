class Chart_WHO {
    constructor() {
        let vis = this;

        vis.currentStep = 0;

        let parseTime = d3.timeParse("%d-%b-%y");

        vis.keys = ["Americas", "Europe", "South_East_Asia", "Eastern_Mediterranean", "Africa", "Western_Pacific", "Other"];

        vis.height = 550;
        vis.width = 700;
        vis.padding = 150;

        let stack = d3.stack()
            .order(d3.stackOrderAscending);

        // Americas, Europe, South_East Asia, Eastern Mediterranean, Africa, Western Pacific, Other
        stack.keys(vis.keys);

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
            vis.master = data;
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
            .delay(100)
            .duration(1000)
            .attr("text-anchor", "end")
            .attr("x", vis.width - 80)
            .attr("y", vis.height - 110)
            .text("Date")
            .style("font-size", "12px");

        vis.svg.append("text")
            .transition()
            .delay(500)
            .duration(1000)
            .attr("text-anchor", "end")
            .attr("x", 80)
            .attr("y", 110)
            .text("# of New Covid Cases")
            .attr("text-anchor", "start")
            .style("font-size", "12px");

        vis.x = d3.scaleTime()
            .domain([
                d3.min(dataset, function(d) {
                    return d.date;
                }),
                d3.max(dataset, function(d) {
                    return d.date;
                })
            ])
            .range([vis.padding, vis.width - vis.padding]);

        // let sumOfRegions = d3.max(dataset, function(d) {
        //     let sum = 0;
        //     for (let i = 0; i < vis.keys.length; i++) {
        //         sum += d[vis.keys[i]];
        //     }
        //
        //     return sum;
        // });
        //
        // vis.y = d3.scaleLinear()
        //     .domain([0, sumOfRegions])
        //     .range([vis.height - vis.padding, vis.padding]);
        //
        let xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(d3.timeMonth.every(3))
            .tickFormat(d3.timeFormat("%d-%b-%y"));
        //
        // let yAxis = d3.axisLeft().scale(vis.y);
        //
        //
        vis.svg.append("g")
            .transition()
            .delay(100)
            .duration(1000)
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + (vis.height - vis.padding) + ")")
            .call(xAxis);
        //
        // vis.svg.append("g")
        //     .transition()
        //     .delay(500)
        //     .duration(1000)
        //     .attr("class", "y-axis axis")
        //     .attr("transform", "translate(" + vis.padding + ",0)")
        //     .call(yAxis);
        //

    }

    updateVis() {
        let vis = this;

        let dataset = vis.data;

        vis.currentStep++;

        let stack = d3.stack()
            .order(d3.stackOrderAscending);

        console.log(stack)

        let keys = ["Americas", "Europe", "South_East_Asia", "Eastern_Mediterranean", "Africa", "Western_Pacific", "Other"];
        keys.splice(0, keys.length - vis.currentStep);
        console.log("keys", keys);
        stack.keys(keys);

        let series = stack(dataset);

        series.splice(0, series.length - vis.currentStep);
        console.log("series", series);

        let x = d3.scaleTime()
            .domain([
                d3.min(dataset, function(d) {
                    return d.date;
                }),
                d3.max(dataset, function(d) {
                    return d.date;
                })
            ])
            .range([vis.padding, vis.width - vis.padding]);


        let sumOfRegions = d3.max(dataset, function(d) {
            let sum = 0;
            for (let i = 0; i < vis.keys.length; i++) {
                sum += d[vis.keys[i]];
            }

            return sum;
        });

        //     let sumOfRegions = d3.max(dataset, function(d) {
        //         let sum = 0;
        //         for (let i = 0; i < vis.keys.length; i++) {
        //             sum += d[vis.keys[i]];
        //         }
        //
        //         return sum;


        let y = d3.scaleLinear()
            .domain([0, sumOfRegions])
            .range([vis.height - vis.padding, vis.padding]);

        let area = d3.area()
            .x(function(d) {
                return x(d.data.date);
            })
            .y0(function(d) {
                return y(d[0]);
            })
            .y1(function(d) {
                return y(d[1]);
            });

        let accent = ["#feac3d", "#c0d058", "#47199c", "#00a687", "#206fbe", "#bf2183", "grey"];
        accent.splice(0, accent.length - vis.currentStep);
        console.log("accent", accent);


        //https://stackoverflow.com/questions/64874938/d3-js-repeat-transition-on-each-element-with-different-durations
        //https://stackoverflow.com/questions/38595719/javascript-d3-js-multiple-transitions-of-points-on-a-scatter-plot
        let areas = vis.svg.selectAll(".area").data(series);
        areas
            .enter()
            .append("path")
            .attr("class", "area")
            .merge(areas)
            .transition().delay(500).duration(10000).ease(d3.easeBounceOut)
            .attr("d", area)
            .attr("fill", function(d, i) {
                return accent[i]
            });
        //.append("title") //Make tooltip
        //        .text(function(d, i) {
        //           return keys[i];
        //  });

        areas.exit().remove();


        let xAxis = d3.axisBottom()
            .scale(x)
            .ticks(d3.timeMonth.every(3))
            .tickFormat(d3.timeFormat("%d-%b-%y"));

        let yAxis = d3.axisLeft().scale(y);

        let axis = vis.svg.selectAll(".y-axis axis").data(series);
        axis
            .enter()
            .append("g")
            .merge(axis)
            .transition().duration(1000)
            // .call(vis.xAxis);
            .attr("class", "y-axis axis")
            .attr("transform", "translate(" + vis.padding + ",0)")
            .call(yAxis);
        // .attr("fill", function(d, i) {
        //     return accent[i];

        /*.append("title") //Make tooltip
        .text(function(d, i) {
            return keys[i];
        });*/

        // axis.exit().remove();

        // vis.svg.select(".x-axis").call(vis.xAxis);
        // vis.svg.select(".y-axis").call(vis.yAxis);




        // vis.svg.append("g")
        //     .transition()
        //     .delay(100)
        //     .duration(1000)
        //     .attr("class", "x-axis axis")
        //     .attr("transform", "translate(0," + (vis.height - vis.padding) + ")")
        //     .call(xAxis);

        // vis.svg.append("g")
        //     .transition()
        //     .delay(500)
        //     .duration(1000)
        //     .attr("class", "y-axis axis")
        //     .attr("transform", "translate(" + vis.padding + ",0)")
        //     .call(yAxis);

    }
}