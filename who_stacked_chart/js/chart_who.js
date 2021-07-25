class Chart_WHO {
    constructor() {
        let vis = this;

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
            vis.data = data;
            vis.series = stack(data);
            console.log(data)
        });
    }

    Step1() {
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
                d3.min(dataset, function (d) {
                    return d.date;
                }),
                d3.max(dataset, function (d) {
                    return d.date;
                })
            ])
            .range([vis.padding, vis.width - vis.padding]);

        let sumOfRegions = d3.max(dataset, function (d) {
            let sum = 0;
            for (let i = 0; i < vis.keys.length; i++) {
                sum += d[vis.keys[i]];
            }

            return sum;
        });

        vis.y = d3.scaleLinear()
            .domain([0, sumOfRegions])
            .range([vis.height - vis.padding, vis.padding]);

        let xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(d3.timeMonth.every(3))
            .tickFormat(d3.timeFormat("%d-%b-%y"));

        let yAxis = d3.axisLeft().scale(vis.y);

        vis.svg.append("g")
            .transition()
            .delay(100)
            .duration(1000)
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + (vis.height - vis.padding) + ")")
            .call(xAxis);

        vis.svg.append("g")
            .transition()
            .delay(500)
            .duration(1000)
            .attr("transform", "translate(" + vis.padding + ",0)")
            .call(yAxis);

    }

    Step2() {
        let vis = this;

        vis.svg.append("text")
            .transition()
            .delay(200)
            .duration(1000)
            .attr("x", (vis.width / 2))
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .text("New Covid Cases")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("text-decoration", "underline")
    }

    Step3() {
        let vis = this;
        this.addArea(vis.series.length - 7);

    }

    Step4() {
        let vis = this;
        this.addArea(vis.series.length - 6);
    }

    Step5() {
        let vis = this;
        this.addArea(vis.series.length - 5);
    }

    Step6() {
        let vis = this;
        this.addArea(vis.series.length - 4);
    }

    Step7() {
        let vis = this;
        this.addArea(vis.series.length - 3);
    }

    Step8() {
        let vis = this;
        this.addArea(vis.series.length - 2);
    }

    Step9() {
        let vis = this;
        this.addArea(vis.series.length - 1);
    }


    addArea(index) {
        let vis = this;
        console.log(index);

        let area = d3.area()
            .x(function (d) {
                return vis.x(d.data.date);
            })
            .y0(function (d) {
                return vis.y(d[0]);
            })
            .y1(function (d) {
                return vis.y(d[1]);
            });

        let accent = ["#feac3d", "#c0d058", "#47199c", "#00a687", "#206fbe", "#bf2183", "grey"];

        vis.svg.append("path")
            .datum(vis.series[index])
            .attr("class", "area")
            .attr("d", area)
            .attr("fill", accent[index])
            .append("title") //Make tooltip
            .text(vis.keys[index]);
    }

    Step10() {
        let vis = this;

        let date = new Date(2021, 0, 10);

        vis.svg.append('line')
            .attr('x1', vis.x(date))
            .attr('y1', vis.y("807017"))
            .attr('x2', vis.x(date))
            .attr('y2', vis.y("364132"))
            .attr("stroke", "#fa7704")
            .attr("stroke-width", 1.5)
            .style("stroke-dasharray", ("10,3"))
            .transition()
            .delay(1000)
                .style("opacity", 0)


        vis.svg.append("text")
            .attr("x", vis.x(date) + 0)
            .attr("y", vis.y("807017") -10)
            .text("Americas")
            .style("fill", "#feac3d")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .transition()
            .delay(1000 )
                .attr("x", vis.x(date) + 160)
                .attr("y", vis.y("807017") + 10)
                .style("font-size", "9px")
                .style("font-weight", "normal")
                .style('fill', "#feac3d")


        vis.svg.append('circle')
            .transition()
            .delay(1500)
            .attr('cx', vis.x(date) + 150)
            .attr('cy', vis.y("807017") + 5)
            .attr('r', 5)
            .attr('fill', "#feac3d")


        vis.svg.append('circle')
            .transition()
            .delay(2500)
            .attr('cx', vis.x(date) + 150)
            .attr('cy', vis.y("807017") + 25)
            .attr('r', 5)

            .attr('fill', "#c0d058");

        vis.svg.append("text")
            .transition()
            .delay(2500 )
            .attr("x", vis.x(date) + 160)
            .attr("y", vis.y("807017") + 30)
            .text("Europe")
            .style("fill", "#c0d058")
            .style("font-size", "9px")
            .style("font-weight", "normal")


        vis.svg.append('circle')
            .transition()
            .delay(2500)
            .attr('cx', vis.x(date) + 150)
            .attr('cy', vis.y("807017") + 45)
            .attr('r', 5)
            .attr('fill', "#47199c");

        vis.svg.append("text")
            .transition()
            .delay(2500 )
            .attr("x", vis.x(date) + 160)
            .attr("y", vis.y("807017") + 50)
            .text("South East Asia")
            .style("fill", "#47199c")
            .style("font-size", "9px")
            .style("font-weight", "normal")


        vis.svg.append('circle')
            .transition()
            .delay(2500)
            .attr('cx', vis.x(date) + 150)
            .attr('cy', vis.y("807017") + 65)
            .attr('r', 5)
            .attr('fill', "#00a687");

        vis.svg.append("text")
            .transition()
            .delay(2500 )
            .attr("x", vis.x(date) + 160)
            .attr("y", vis.y("807017") + 70)
            .text("Eastern Mediterranean")
            .style("fill", "#00a687")
            .style("font-size", "9px")
            .style("font-weight", "normal")


        vis.svg.append('circle')
            .transition()
            .delay(2500)
            .attr('cx', vis.x(date) + 150)
            .attr('cy', vis.y("807017") + 85)
            .attr('r', 5)
            .attr('fill', "#206fbe");

        vis.svg.append("text")
            .transition()
            .delay(2500 )
            .attr("x", vis.x(date) + 160)
            .attr("y", vis.y("807017") + 90)
            .text("Africa")
            .style("fill", "#206fbe")
            .style("font-size", "9px")
            .style("font-weight", "normal")


        vis.svg.append('circle')
            .transition()
            .delay(2500)
            .attr('cx', vis.x(date) + 150)
            .attr('cy', vis.y("807017") + 105)
            .attr('r', 5)
            .attr('fill', "#bf2183");

        vis.svg.append("text")
            .transition()
            .delay(2500)
            .attr("x", vis.x(date) + 160)
            .attr("y", vis.y("807017") + 110)
            .text("Western Pacific")
            .style("fill", "#bf2183")
            .style("font-size", "9px")
            .style("font-weight", "normal")


        vis.svg.append('circle')
            .transition()
            .delay(2500)
            .attr('cx', vis.x(date) + 150)
            .attr('cy', vis.y("807017") + 125)
            .attr('r', 5)
            .attr('fill', "grey");

        vis.svg.append("text")
            .transition()
            .delay(2500 )
            .attr("x", vis.x(date) + 160)
            .attr("y", vis.y("807017") + 130)
            .text("Other")
            .style("fill", "grey")
            .style("font-size", "9px")
            .style("font-weight", "normal")



    }

    Step11() {
        let vis = this;

        let date = new Date(2021, 0, 10);

        let dataset = vis.data;

        vis.svg.append("path")
            .datum(dataset)
            .transition()
            .delay(2500 )
            .duration(1000)
            .attr("class", "test123")
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("d", d3.line()
                .x(function (d) {
                    return vis.x(d.date)
                })
                .y(function (d) {
                    return vis.y(d.day_average)
                })
            )

        vis.svg.append('line')
            .transition()
            .delay(2500 )
            .attr('x1', vis.x(date) + 145)
            .attr('y1', vis.y("807017") + 145)
            .attr('x2', vis.x(date) + 152)
            .attr('y2', vis.y("807017") + 145)
            .attr("stroke", "red")
            .attr("stroke-width", 1)

        vis.svg.append("text")
            .transition()
            .delay(2500 )
            .attr("x", vis.x(date) + 160)
            .attr("y", vis.y("807017") + 150)
            .text("7-day average")
            .style("fill", "red")
            .style("font-size", "9px")
            .style("font-weight", "normal")

    }

}