let width = 850,
    height = 600;

let padding = 100;

let formatPercent = d3.format(".0%");


d3.csv("data/dataset2.csv", (row,i) => {
    row.vaccination_rate = +row.vaccination_rate;
    row.initial_value = +row.initial_value;
    row.subsequent_value = +row.subsequent_value;
    // row.initial_value = d3.randomInt(0, 25)(); //random data generator
    // row.subsequent_value = d3.randomInt(0, 25)(); //random data generator

    return row;

})

    .then(data => {
        let svg = d3.select("body")
            .append("svg")
            .attr("width",width)
            .attr("height",height);

        // console.log(data)

        let vaccinationScale = d3.scaleLinear()
            .domain([d3.min(data, d => 0.34-0.01), d3.max(data, d => 0.67+0.01)])
            .range([padding, width-padding]);



        let changeScale = d3.scaleLinear()
            //.domain([d3.min(data, d => d.initial_value), d3.max(data, d => d.subsequent_value)])
            .domain([d3.min(data, d => 0), d3.max(data, d => 25)])
            .range([height-padding, padding]);


         //grey x gridlines
        function make_x_gridlines() {
            return d3.axisBottom(vaccinationScale)
                .ticks(10)
        }


        //grey y gridlines
        function make_y_gridlines() {
            return d3.axisLeft(changeScale)
                .ticks(10)
        }



        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .style("stroke-dasharray", "3 3")
            .call(make_x_gridlines()
                .tickSize(-height+padding+padding)
                .tickFormat("")
            )



        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + padding + ",0)")
            .style("stroke-dasharray", "3 3")
            .call(make_y_gridlines()
                .tickSize(-width+padding+padding)
                .tickFormat("")
            )



        let tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function(d) {
                d3.select(".d3-tip").style("color", d.colour);
                return d.state;
            });

        svg.call(tip);



        let scatter_value_subsequent_tip = d3.tip()
            .attr("class", "d3-tip2")
            .offset([0+8, 15])
            .html(function(d) {
                d3.select(".d3-tip2").style("color", d.colour);
                return d.subsequent_value < d.initial_value ? d.initial_value : d.subsequent_value;
            });

        svg.call(scatter_value_subsequent_tip);


        //show values on y axis
        let scatter_value_subsequent_tip_on_axis = d3.tip()
            .attr("class", "d3-tip5")
            .offset(function(d){
                    let value = (d.vaccination_rate)
                    return [0+7.3, -(vaccinationScale(value)-padding+15.2)];
            })
            .html(function(d) {
                    d3.select(".d3-tip5").style("font-size","10px").style("color", d.colour);
                    return d.subsequent_value < d.initial_value ? d.initial_value : d.subsequent_value;
            });


        svg.call(scatter_value_subsequent_tip_on_axis);

        let scatter_value_initial_tip = d3.tip()
            .attr("class", "d3-tip3")
            .offset(function (d) {
                let value = d.subsequent_value > d.initial_value ?
                    d.subsequent_value - d.initial_value :
                    d.initial_value - d.subsequent_value;
                return [height-padding+7 - changeScale(value), 15];
            }) //position of the label needs to be changed based on the initial value
            .html(function(d) {
                d3.select(".d3-tip3").style("color", d.colour);
                return d.subsequent_value > d.initial_value ? d.initial_value : d.subsequent_value;
            });



        svg.call(scatter_value_initial_tip);

        let scatter_value_initial_tip_on_axis = d3.tip()
            .attr("class", "d3-tip6")
            .offset(function(d){
                    let value = (d.vaccination_rate)
                    let value2 = d.subsequent_value > d.initial_value ?
                        d.subsequent_value - d.initial_value :
                        d.initial_value - d.subsequent_value;
                    return [height-padding+7 - changeScale(value2), -(vaccinationScale(value)-padding+15.2)];
            })
            .html(function(d) {
                    d3.select(".d3-tip6").style("font-size","10px").style("color", d.colour);
                    return d.subsequent_value > d.initial_value ? d.initial_value : d.subsequent_value;
            });



        svg.call(scatter_value_initial_tip_on_axis);


        var mouseover =  function(e, d) {

            tip.show(d, this);

            scatter_value_subsequent_tip.show(d, this);

            scatter_value_initial_tip.show(d, this);

            if (d.state =="Nevada" || d.state =="Maryland") {
                scatter_value_subsequent_tip_on_axis.show(d, this);

                scatter_value_initial_tip_on_axis.show(d, this);
            }


            //filter only 2 states that would demonstrate increase/decrease
            if (d.state =="Nevada" || d.state =="Maryland") {
                //dashed initial x value line
                svg.append("line")
                    .attr("class", "line-helper")
                    .attr("x1", padding)
                    .attr("y1", changeScale(d.initial_value))
                    .attr("x2", vaccinationScale(d.vaccination_rate))
                    .attr("y2", changeScale(d.initial_value))
                    .attr("stroke-width", 1.5)
                    .attr("stroke", d.colour)
                    .style("stroke-dasharray", "3 3")
                    .attr("opacity", 0.7);


                //dashed subsequent x value line
                svg.append("line")
                    .attr("class", "line-helper")
                    .attr("x1", padding)
                    .attr("y1", changeScale(d.subsequent_value))
                    .attr("x2", vaccinationScale(d.vaccination_rate))
                    .attr("y2", changeScale(d.subsequent_value))
                    .attr("stroke-width", 1.5)
                    .attr("stroke", d.colour)
                    .style("stroke-dasharray", "3 3")
                    .attr("opacity", 0.7);


                //dashed y value line
                svg.append("line")
                    .attr("class", "line-helper")
                    .attr("x1", vaccinationScale(d.vaccination_rate))
                    .attr("y1", changeScale(d.initial_value))
                    .attr("x2", vaccinationScale(d.vaccination_rate))
                    .attr("y2", height - padding)
                    .attr("stroke-width", 1.5)
                    .attr("stroke", d.colour)
                    .style("stroke-dasharray", "3 3")
                    .attr("opacity", 0.7);


                //text helper - y axis
                svg.append("text")
                    .attr("class", 'text-helper')
                    .attr("x", vaccinationScale(d.vaccination_rate) - 110)
                    .attr("y", height - padding + 30)
                    .attr("font-size", "10")
                    .text(`${formatPercent(d.vaccination_rate)} of people in ${d.state} are fully vaccinated`)
                    .attr("fill", d.colour);


                //text helper - 2 weeks ago
                svg.append("text")
                    .attr("class", 'text-helper')
                    .attr("x", vaccinationScale(d.vaccination_rate) + 30)
                    .attr("y", changeScale(d.initial_value) + 2)
                    .attr("font-size", "11")
                    .text("Two weeks ago")
                    .attr("fill", "#3B3B3B");
                // .attr("font-weight","bold");


                //text helper - today
                svg.append("text")
                    .attr("class", 'text-helper')
                    .attr("x", vaccinationScale(d.vaccination_rate) + 30)
                    .attr("y", changeScale(d.subsequent_value) + 3)
                    .attr("font-size", "11")
                    .text("Today")
                    .attr("fill", "#3B3B3B");
                // .attr("font-weight","bold");


                //label helper function
                let increase_decrease_label = "decreased";
                let increase_decrease_color = "purple";
                if (d.initial_value < d.subsequent_value) {
                    increase_decrease_label = "increased";
                    increase_decrease_color = "red";
                }

                let increase_decrease_x = vaccinationScale(d.vaccination_rate) + 30;
                let increase_decrease_y = changeScale(d.initial_value) + ((changeScale(d.subsequent_value) - (changeScale(d.initial_value))) / 2) + 2.5;

                let increase_decrease_text = svg
                    .append("text")
                    .attr("x", increase_decrease_x)
                    .attr("y", increase_decrease_y)
                    .attr("font-size", "10")
                    .attr("class", "text-helper");

                increase_decrease_text
                    .append("tspan")
                    .text("No. of hospitalized people ")
                    .attr("font-size", "10")
                    .attr("fill", "#3B3B3B");

                increase_decrease_text
                    .append("tspan")
                    .text(increase_decrease_label)
                    .attr("fill", increase_decrease_color);
            }

            //change opacity to all non-highlighted arrows
            d3.selectAll("line.arrow")
                .style("opacity", 0.1)

            //reference this particular, highlighted arrow with 1 opacity
            d3.select(this)
                .style("opacity", 1)

            //change opacity based on a selected arrow for legend arrows
            if (d.initial_value < d.subsequent_value) {
                svg.select("#legend_purple").style("opacity", 0.1);
                svg.select("#legend_text_purple").style("opacity", 0.1);
            } else {
                svg.select("#legend_red").style("opacity", 0.1);
                svg.select("#legend_text_red").style("opacity", 0.1);
            }
        }


        var mouseout = function(d) {

            tip.hide(d, this);

            scatter_value_subsequent_tip.hide(d, this);

            scatter_value_initial_tip.hide(d, this);

            scatter_value_subsequent_tip_on_axis.hide(d,this);

            scatter_value_initial_tip_on_axis.hide(d,this);

            //change opacity to initial state 1
            svg
                .selectAll("line.arrow")
                .style("opacity", 1);

            //change opacity to initial state 1
            svg.selectAll("line.legend-arrow").style("opacity", 1);
            svg.selectAll("text.legend-text").style("opacity", 1);



            //remove all line helpers
            svg.selectAll("line.line-helper")
                .attr("opacity",0);

            svg.selectAll("text.text-helper")
                .attr("opacity",0);
        }



        //draw lines & append arrow markers; option to filter only red or only purple arrows
        svg.selectAll("line")
            .data(data)
            .enter()
            .append("line")
            //.filter(function(d){ return d.colour == 'red' }) //filters red arrows
            // .filter(function(d){ return d.colour == 'purple' }) //filters purple arrows
            .attr("class", "arrow")
            .attr("x1", d => vaccinationScale(d.vaccination_rate))
            .attr("y1", d => changeScale(d.initial_value))
            .attr("x2", d => vaccinationScale(d.vaccination_rate))
            .attr("y2", d => changeScale(d.subsequent_value))
            .attr("stroke-width", 2)
            .attr("stroke", d => d.colour)
            .attr("marker-end", d => "url(#end-" + d.colour + ")")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)


        //red arrow - legend
        svg
            .append("line")
            .attr("id", "legend_red")
            .attr("class", "legend-arrow")
            .attr("x1", width-70)
            .attr("y1", height-270)
            .attr("x2", width-70)
            .attr("y2", height-320)
            .attr("stroke-width", 2)
            .attr("stroke", "red")
            .attr("marker-end", "url(#end-" + "red" + ")");


        //purple arrow - legend
        svg
            .append("line")
            .attr("id", "legend_purple")
            .attr("class", "legend-arrow")
            .attr("x1", width-20)
            .attr("y1", height-320)
            .attr("x2", width-20)
            .attr("y2", height-270)
            .attr("stroke-width", 2)
            .attr("stroke", "purple")
            .attr("marker-end", "url(#end-" + "purple" + ")");

        //red arrow marker
        let defs = svg.append("svg:defs");
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



        let xAxis = d3.axisBottom()
            .scale(vaccinationScale)
            .tickFormat(formatPercent);

        let yAxis = d3.axisLeft()
            .scale(changeScale);


        //legend title
        svg
            .append("text")
            .attr("x", width-60)
            .attr("y", height-360)
            .attr("class", "title")
            .text("Legend")
            .attr("fill","black")
            .attr("font-size", "12");


        //red arrow legend text
        svg
            .append("text")
            .attr("id","legend_text_red")
            .attr("x", width-90)
            .attr("y", height-325)
            .attr("class", "legend-text")
            .text("Increase")
            .attr("fill","red")
            .attr("font-size", "10")
            .attr("font-weight","bold");



        //purple arrow legend text
        svg
            .append("text")
            .attr("id","legend_text_purple")
            .attr("x", width-45)
            .attr("y", height-260)
            .attr("class", "legend-text")
            .text("Decrease")
            .attr("fill","purple")
            .attr("font-size", "10")
            .attr("font-weight","bold")


    //overall chart title
        svg
            .append("text")
            .attr("x", width/4)
            .attr("y", padding-30)
            .attr("class", "title")
            .text("Change in Covid-19 hospitalizations in past two weeks")
            .attr("fill","black")
            .attr("font-size", "16")
            .attr("font-weight","bold")

    //x axis label
        svg.append("text")
            // .attr("class", "x labels")
            .attr("text-anchor", "middle")
            .attr("font-size","12")
            .attr("x", width/2)
            .attr("y", height-40)
            .text("Share of fully vaccinated");

    //y axis label
        svg.append("text")
            // .attr("class", "y labels")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -width/3)
            .attr("y", padding-40)
            .attr("font-size", "12")
            .text("No. of hospitalized per  100,000 people");


        svg.append("g")
            // .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .attr("class", "x_axis")
            .call(xAxis);


        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .attr("class", "y_axis")
            .call(yAxis);



    });