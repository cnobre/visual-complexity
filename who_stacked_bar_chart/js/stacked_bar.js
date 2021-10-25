
const margin = {top: 70, right: 150, bottom: 50, left: 100},
    width = 800 - margin.left - margin.right,
    height = 500- margin.top - margin.bottom;

const padding = 70;

const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


    d3.csv("data/daily_cases_weekly2.csv")

        .then( function(data) {

        const subgroups = data.columns.slice(1);

        const groups = data.map(d => (d.group));

        const x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2]);

        const y = d3.scaleLinear()
            .domain([0,5721835])
            .range([ height, 0 ]);

        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(["#bf2183", "#206fbe", "#00a687", "#47199c", "#606e04",  "#ee8c07"])
            //


        const stackedData = d3.stack()
            .keys(subgroups)
            (data)


        bottom_axis = d3.axisBottom(x).tickValues(x.domain().filter(function(d,i){ return !(i%10)}));


        const tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("box-shadow", "2px 2px 4px lightgrey")
            .style("padding", "10px")
            //.style("color", d=>d.color)
            // .attr("fill", d => color(d.key))

        const mouseover = function(event, d) {
            const subgroupName = d3.select(this.parentNode).datum().key;
            const subgroupValue = d.data[subgroupName];
            let date = d.data.group;

            let dataForDate = data.filter(f => f.group === date)[0];
            let total = 0;
            subgroups.forEach(sg => total += parseInt(dataForDate[sg]));


            tooltip
                .html(`<b>Week:</b> ${d.data.group}<br>
                       <b>Total cases:</b> ${total}<br>
                       <br>
                       <span style="font-size:11px;color: ${color(subgroupName)}"><b>Region:</b> ${subgroupName}</span><br>
                       <span style="font-size:11px;color: ${color(subgroupName)}"><b>New cases:</b> ${subgroupValue}</span><br>`)
                .style("opacity", 1)
                .style("font-size", "12px");

            let rects = d3.selectAll(".date-" + date);
            let rect = rects._groups[0][rects._groups[0].length-1].getBBox();
            svg
                .append("rect")
                .attr('class', "hover")
                .attr('x', rect.x)
                .attr('y', rect.y)
                .attr('width', rect.width)
                .attr('height', height - rect.y)
                .attr('stroke', 'black')
                .style("stroke-width", "2.5")
                .attr('fill', 'none');
        }


        var mousemove = function(event, d) {
            tooltip
                .style("left", (event.x)/2 + 100+ "px")
                .style("top", (event.y)/2 + 100+"px")
        }



        const mouseleave = function(event, d) {
            tooltip
                .style("opacity", 0)
            d3.selectAll(".hover")
                .style("stroke", "none")
                // .style("stroke-width", "2.5")
        }



        svg
        .append("text")
        .attr("x", width/4)
        .attr("y", padding-100)
        .attr("class", "title")
        .text("New Covid-19 cases across regions per week")
        .attr("fill","black")
        .attr("font-size", "16")
        .attr("font-weight","bold")


        svg.append("text")
            // .attr("class", "x labels")
            .attr("text-anchor", "middle")
            .attr("font-size","12")
            .attr("x", width/2)
            .attr("y", height+50)
            .text("week");


        svg.append("text")
            // .attr("class", "y labels")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -width/3)
            .attr("y", padding-140)
            .attr("font-size", "12")
            .text("No. of new Covid-19 cases");



        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottom_axis)



        svg.append("g")
            .call(d3.axisLeft(y));




        svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", d => x(d.data.group))
            .attr("y", d => y(d[1]))
            .attr("class", d => "date date-" + d.data.group)
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width",x.bandwidth())
            .attr("total", d=>d.total)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);



        const size = 10;
        let legendGroups = subgroups.slice().reverse();
        svg.selectAll("mylegend")
            .data(legendGroups)
            .enter()
            .append("rect")
            .attr("x", width+35)
            .attr("y", function(d,i){ return 110 + i*(size+5)})
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d){ return color(d)});

        svg.selectAll("mylegendlabels")
            .data(legendGroups)
            .enter()
            .append("text")
            .attr("x", width+35 + size*1.2)
            .attr("y", function(d,i){ return 110 + i*(size+5) + (size/2)})
            .style("fill", function(d){ return color(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("font-size", "10")
            .style("alignment-baseline", "middle")


        })
