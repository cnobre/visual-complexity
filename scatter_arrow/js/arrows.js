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

    // console.log(row)
})

    .then(data => {
        let svg = d3.select("body")
            .append("svg")
            .attr("width",width)
            .attr("height",height);


        let vaccinationScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.vaccination_rate)-0.01, d3.max(data, d => d.vaccination_rate)+0.01])
            // .domain([d3.min(data, d => 0.18), d3.max(data, d => 0.35)])
            .range([padding, width-padding]);



        let changeScale = d3.scaleLinear()
            // .domain([d3.min(data, d => d.initial_value), d3.max(data, d => d.subsequent_value)])
            .domain([d3.min(data, d => 0), d3.max(data, d => 25)])
            .range([height-padding, padding]);



        function make_x_gridlines() {
            return d3.axisBottom(vaccinationScale)
                .ticks(10)
        }


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

        svg.selectAll("line")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", d => vaccinationScale(d.vaccination_rate))
            .attr("y1", d => changeScale(d.initial_value))
            .attr("x2", d => vaccinationScale(d.vaccination_rate))
            .attr("y2", d => changeScale(d.subsequent_value))
            .attr("stroke-width", 2)
            .attr("stroke", d => d.colour)
            .attr("marker-end", d => "url(#end-" + d.colour + ")")
            .on("mouseover", function(e, d) { tip.show(d, this); })
            .on("mouseout", tip.hide);


        svg.selectAll("line-legend-red")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", width-70)
            .attr("y1", height-270)
            .attr("x2", width-70)
            .attr("y2", height-320)
            .attr("stroke-width", 2)
            .attr("stroke", "red")
            .attr("marker-end", "url(#end-" + "red" + ")")

        svg.selectAll("line-legend-purple")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", width-20)
            .attr("y1", height-320)
            .attr("x2", width-20)
            .attr("y2", height-270)
            .attr("stroke-width", 2)
            .attr("stroke", "purple")
            .attr("marker-end", "url(#end-" + "purple" + ")")


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
            .attr("font-size", "12")
            // .attr("font-weight","bold")
            // .attr("text-decoration","underline")


        //red arrow legend text
        svg
            .append("text")
            .attr("x", width-90)
            .attr("y", height-325)
            .attr("class", "title")
            .text("Increase")
            .attr("fill","red")
            .attr("font-size", "10")
            .attr("font-weight","bold")



        //purple arrow legend text
        svg
            .append("text")
            .attr("x", width-45)
            .attr("y", height-260)
            .attr("class", "title")
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
            .attr("y", height-10)
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
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(xAxis);




        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);






    });