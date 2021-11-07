class ScatterChart {
    constructor(data) {

        this.data = data;

        this.initVis();
    }


    initVis() {
        let vis = this;

        vis.width = 850;
        vis.height = 600;

        vis.padding = 100;

        vis.formatPercent = d3.format(".0%");

        vis.svg = d3.select("body")
                .append("svg")
                .attr("width",vis.width)
                .attr("height",vis.height);

        vis.vaccinationScale = d3.scaleLinear()
            .domain([d3.min(vis.data, d => 0.34 - 0.01), d3.max(vis.data, d => 0.67 + 0.01)])
            .range([vis.padding, vis.width - vis.padding]);


        vis.changeScale = d3.scaleLinear()
            //.domain([d3.min(data, d => d.initial_value), d3.max(data, d => d.subsequent_value)])
            .domain([d3.min(vis.data, d => 0), d3.max(vis.data, d => 25)])
            .range([vis.height - vis.padding, vis.padding]);


        //grey x gridlines
        vis.make_x_gridlines= function() {
            return d3.axisBottom(vis.vaccinationScale)
                .ticks(10)
        }


        //grey y gridlines
        vis.make_y_gridlines= function() {
            return d3.axisLeft(vis.changeScale)
                .ticks(10)
        }


        vis.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + (vis.height - vis.padding) + ")")
            .style("stroke-dasharray", "3 3")
            .call(vis.make_x_gridlines()
                .tickSize(-vis.height + vis.padding + vis.padding)
                .tickFormat("")
            )


        vis.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + vis.padding + ",0)")
            .style("stroke-dasharray", "3 3")
            .call(vis.make_y_gridlines()
                .tickSize(-vis.width + vis.padding + vis.padding)
                .tickFormat("")
            )

        //tooltip
        vis.tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function (d) {
                d3.select(".d3-tip").style("color", d.colour);
                return d.state;
            });

        vis.svg.call(vis.tip);

        //show subsequent value in the tooltip
        vis.scatter_value_subsequent_tip = d3.tip()
            .attr("class", "d3-tip2")
            .offset([0+8, 15])
            .html(function(d) {
                d3.select(".d3-tip2").style("color", d.colour);
                return d.subsequent_value < d.initial_value ? d.initial_value : d.subsequent_value;
            });

        //append the subsequent value to svg
        vis.svg.call(vis.scatter_value_subsequent_tip);

        //show initial value in the tooltip
        vis.scatter_value_initial_tip = d3.tip()
            .attr("class", "d3-tip3")
            .offset(function (d) {
                let value = d.subsequent_value > d.initial_value ?
                    d.subsequent_value - d.initial_value :
                    d.initial_value - d.subsequent_value;
                return [vis.height-vis.padding+7 - vis.changeScale(value), 15];
            })
            .html(function(d) {
                d3.select(".d3-tip3").style("color", d.colour);
                return d.subsequent_value > d.initial_value ? d.initial_value : d.subsequent_value;
            });

        //append the initial value to svg
        vis.svg.call(vis.scatter_value_initial_tip);


        //draw lines & append arrow markers; option to filter only red or only purple arrows
        vis.svg.selectAll("line")
            .data(vis.data)
            .enter()
            .append("line")
            //.filter(function(d){ return d.colour == 'red' }) //filters red arrows only
            // .filter(function(d){ return d.colour == 'purple' }) //filters purple arrows only
            .attr("class", "arrow")
            .attr("id", d => "arrow-line-" + d.state_short)
            .attr("x1", d => vis.vaccinationScale(d.vaccination_rate))
            .attr("y1", d => vis.changeScale(d.initial_value))
            .attr("x2", d => vis.vaccinationScale(d.vaccination_rate))
            .attr("y2", d => vis.changeScale(d.subsequent_value))
            .attr("stroke-width", 2)
            .attr("stroke", d => d.colour)
            .attr("marker-end", d => "url(#end-" + d.colour + ")");



        //transparent behind-the-arrows rectangles helping with the mouseover - i.e. less precision
        vis.svg
            .selectAll("rect")
            .data(vis.data)
            .join("rect")
            .attr("class", "arrow-rect")
            .attr('x', function (d) { return vis.vaccinationScale(d.vaccination_rate) -10; })
            .attr('y', function (d) {
                let value = d.subsequent_value > d.initial_value ?
                    vis.changeScale(d.subsequent_value) :
                    vis.changeScale(d.initial_value);
                return value;})
            .attr('width', "20px")
            .attr('height',
                function (d) {
                    let value = d.subsequent_value < d.initial_value ?
                        vis.changeScale(d.subsequent_value) - vis.changeScale(d.initial_value) :
                        vis.changeScale(d.initial_value) - vis.changeScale(d.subsequent_value) ;
                    return (value);
                }
            )
            .style("opacity", "0" )
            .on("mouseover", function(e, d) {vis.updateVis1(this, e, d)})
            .on("mouseout", function(d) {vis.updateVis2(this, d)});

        //red arrow - legend
        vis.svg
            .append("line")
            .attr("id", "legend_red")
            .attr("class", "legend-arrow")
            .attr("x1", vis.width-70)
            .attr("y1", vis.height-270)
            .attr("x2", vis.width-70)
            .attr("y2", vis.height-320)
            .attr("stroke-width", 2)
            .attr("stroke", "red")
            .attr("marker-end", "url(#end-" + "red" + ")");

        //purple arrow - legend
        vis.svg
            .append("line")
            .attr("id", "legend_purple")
            .attr("class", "legend-arrow")
            .attr("x1", vis.width-20)
            .attr("y1", vis.height-320)
            .attr("x2", vis.width-20)
            .attr("y2", vis.height-270)
            .attr("stroke-width", 2)
            .attr("stroke", "purple")
            .attr("marker-end", "url(#end-" + "purple" + ")");

        //red arrow marker
        let defs = vis.svg.append("svg:defs");
        defs
            .append("svg:marker")
            .attr("id", "end-red")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 9)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "red");

        //purple arrow marker
        defs
            .append("svg:marker")
            .attr("id", "end-purple")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 9)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "purple");

        vis.xAxis = d3.axisBottom()
            .scale(vis.vaccinationScale)
            .tickFormat(vis.formatPercent);

        vis.yAxis = d3.axisLeft()
            .scale(vis.changeScale);

        //legend title
        vis.svg
            .append("text")
            .attr("x", vis.width-60)
            .attr("y", vis.height-360)
            .attr("class", "title")
            .text("Legend")
            .attr("fill","black")
            .attr("font-size", "12");

        //red arrow legend text
        vis.svg
            .append("text")
            .attr("id","legend_text_red")
            .attr("x", vis.width-90)
            .attr("y", vis.height-325)
            .attr("class", "legend-text")
            .text("Increase")
            .attr("fill","red")
            .attr("font-size", "10")
            .attr("font-weight","bold");

        //purple arrow legend text
        vis.svg
            .append("text")
            .attr("id","legend_text_purple")
            .attr("x", vis.width-45)
            .attr("y", vis.height-260)
            .attr("class", "legend-text")
            .text("Decrease")
            .attr("fill","purple")
            .attr("font-size", "10")
            .attr("font-weight","bold")


        //overall chart title
        vis.svg
            .append("text")
            .attr("x", vis.width/4)
            .attr("y", vis.padding-30)
            .attr("class", "title")
            .text("Change in Covid-19 hospitalizations in past two weeks")
            .attr("fill","black")
            .attr("font-size", "16")
            .attr("font-weight","bold")

        //x axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size","12")
            .attr("x", vis.width/2)
            .attr("y", vis.height-40)
            .text("Share of fully vaccinated");

        //y axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.width/3)
            .attr("y", vis.padding-40)
            .attr("font-size", "12")
            .text("No. of hospitalized per  100,000 people");

        vis.svg.append("g")
            // .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + (vis.height - vis.padding) + ")")
            .attr("class", "x_axis")
            .call(vis.xAxis);


        vis.svg.append("g")
            .attr("transform", "translate(" + vis.padding + ",0)")
            .attr("class", "y_axis")
            .call(vis.yAxis);

        //show values on y axis
        vis.scatter_value_subsequent_tip_on_axis = d3.tip()
            .attr("class", "d3-tip5")
            .offset(function(d){
                let value = (d.vaccination_rate)
                return [0+7.3, -(vis.vaccinationScale(value)-vis.padding+15.2-27)];
            })
            .html(function(d) {
                d3.select(".d3-tip5").style("font-size","10px").style("color", d.colour);
                return d.subsequent_value < d.initial_value ? d.initial_value : d.subsequent_value;
            });

        //append the subsequent value on x - only for Nevanda and Maryland
        vis.svg.call(vis.scatter_value_subsequent_tip_on_axis);

        vis.scatter_value_initial_tip_on_axis = d3.tip()
            .attr("class", "d3-tip6")
            .offset(function(d){
                let value = (d.vaccination_rate)
                let value2 = d.subsequent_value > d.initial_value ?
                    d.subsequent_value - d.initial_value :
                    d.initial_value - d.subsequent_value;
                return [vis.height-vis.padding+7 - vis.changeScale(value2), -(vis.vaccinationScale(value)-vis.padding+15.2-27)];
            })
            .html(function(d) {
                d3.select(".d3-tip6").style("font-size","10px").style("color", d.colour);
                return d.subsequent_value > d.initial_value ? d.initial_value : d.subsequent_value;
            });

        //append the initial value on x - only for Nevanda and Maryland
        vis.svg.call(vis.scatter_value_initial_tip_on_axis);
    }

    updateVis1(element, e, d) {
        let vis = this;

        vis.tip.show(d, element);

        vis.scatter_value_subsequent_tip.show(d, element);

        vis.scatter_value_initial_tip.show(d, element);

        if (d.state =="Nevada" || d.state =="Maryland") {
            vis.scatter_value_subsequent_tip_on_axis.show(d, element);

            vis.scatter_value_initial_tip_on_axis.show(d, element);
        }

        //filter only 2 states that would demonstrate increase/decrease
        if (d.state =="Nevada" || d.state =="Maryland") {
            //dashed initial x value line
            vis.svg.append("line")
                .attr("class", "line-helper")
                .attr("x1", vis.padding+23)
                .attr("y1", vis.changeScale(d.initial_value))
                .attr("x2", vis.vaccinationScale(d.vaccination_rate))
                .attr("y2", vis.changeScale(d.initial_value))
                .attr("stroke-width", 1.5)
                .attr("stroke", d.colour)
                .style("stroke-dasharray", "3 3")
                .attr("opacity", 0.7);

            //dashed subsequent x value line
            vis.svg.append("line")
                .attr("class", "line-helper")
                .attr("x1", vis.padding+23)
                .attr("y1", vis.changeScale(d.subsequent_value))
                .attr("x2", vis.vaccinationScale(d.vaccination_rate))
                .attr("y2", vis.changeScale(d.subsequent_value))
                .attr("stroke-width", 1.5)
                .attr("stroke", d.colour)
                .style("stroke-dasharray", "3 3")
                .attr("opacity", 0.7);


            //dashed y value line
            vis.svg.append("line")
                .attr("class", "line-helper")
                .attr("x1", vis.vaccinationScale(d.vaccination_rate))
                .attr("y1", vis.changeScale(d.initial_value))
                .attr("x2", vis.vaccinationScale(d.vaccination_rate))
                .attr("y2", vis.height - vis.padding)
                .attr("stroke-width", 1.5)
                .attr("stroke", d.colour)
                .style("stroke-dasharray", "3 3")
                .attr("opacity", 0.7);


            //text helper - x label axis
            vis.svg.append("text")
                .attr("class", 'text-helper')
                .attr("x", vis.vaccinationScale(d.vaccination_rate) - 110)
                .attr("y", vis.height - vis.padding + 30)
                .attr("font-size", "10")
                .text(`${vis.formatPercent(d.vaccination_rate)} of people in ${d.state} are fully vaccinated`)
                .attr("fill", d.colour);

            //text helper - 2 weeks ago
            vis.svg.append("text")
                .attr("class", 'text-helper')
                .attr("x", vis.vaccinationScale(d.vaccination_rate) + 30)
                .attr("y", vis.changeScale(d.initial_value) + 2)
                .attr("font-size", "11")
                .text("Two weeks ago")
                .attr("fill", "#3B3B3B");


            //text helper - today
            vis.svg.append("text")
                .attr("class", 'text-helper')
                .attr("x", vis.vaccinationScale(d.vaccination_rate) + 30)
                .attr("y", vis.changeScale(d.subsequent_value) + 3)
                .attr("font-size", "11")
                .text("Today")
                .attr("fill", "#3B3B3B");


            //label helper function
            vis.increase_decrease_label = "decreased";
            vis.increase_decrease_color = "purple";
            if (d.initial_value < d.subsequent_value) {
                vis.increase_decrease_label = "increased";
                vis.increase_decrease_color = "red";
            }

            vis.increase_decrease_x = vis.vaccinationScale(d.vaccination_rate) + 30;
            vis.increase_decrease_y = vis.changeScale(d.initial_value) + ((vis.changeScale(d.subsequent_value) - (vis.changeScale(d.initial_value))) / 2) + 2.5;

            vis.increase_decrease_text = vis.svg
                .append("text")
                .attr("x", vis.increase_decrease_x)
                .attr("y", vis.increase_decrease_y)
                .attr("font-size", "10")
                .attr("class", "text-helper");

            vis.increase_decrease_text
                .append("tspan")
                .text("No. of hospitalized people ")
                .attr("font-size", "10")
                .attr("fill", "#3B3B3B");

            vis.increase_decrease_text
                .append("tspan")
                .text(vis.increase_decrease_label)
                .attr("fill", vis.increase_decrease_color);
        }

        //change opacity to all non-highlighted arrows
        vis.svg.selectAll("line.arrow").style("opacity", 0.1)

        //reference this particular, highlighted arrow with 1 opacity
        vis.svg.select("#arrow-line-" + d.state_short).style("opacity", 1);

        //change opacity based on a selected arrow for legend arrows
        if (d.initial_value < d.subsequent_value) {
            vis.svg.select("#legend_purple").style("opacity", 0.1);
            vis.svg.select("#legend_text_purple").style("opacity", 0.1);
        } else {
            vis.svg.select("#legend_red").style("opacity", 0.1);
            vis.svg.select("#legend_text_red").style("opacity", 0.1);
        }
    }

    updateVis2(element, d) {
        let vis = this;

        vis.tip.hide(d, element);

        vis.scatter_value_subsequent_tip.hide(d, element);

        vis.scatter_value_initial_tip.hide(d, element);

        vis.scatter_value_subsequent_tip_on_axis.hide(d,element);

        vis.scatter_value_initial_tip_on_axis.hide(d,element);

        //change opacity to initial state 1
        vis.svg
            .selectAll("line.arrow")
            .style("opacity", 1);

        //remove text helpers for Nevada & Maryland (e.g. today & 2 weeks ago)
        vis.svg.selectAll(".text-helper")
            .remove();

        //remove dashed line helpers for Nevada & Maryland
        vis.svg.selectAll(".line-helper")
            .remove();

        //change opacity to initial state 1
        vis.svg.selectAll("line.legend-arrow").style("opacity", 1);
        vis.svg.selectAll("text.legend-text").style("opacity", 1);
    }
}