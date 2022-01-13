
const margin = {top: 70, right: 150, bottom: 50, left: 100},
    width = 800 - margin.left - margin.right,
    height = 500- margin.top - margin.bottom;

const padding = 70;

const svg = d3.select("#stackedchart")
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

        console.log(stackedData[0])


        bottom_axis = d3.axisBottom(x).tickValues(x.domain().filter(function(d,i){ return !(i%10)}));


        const tooltip = d3.select("#stackedchart")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("box-shadow", "2px 2px 4px lightgrey")
            .style("padding", "10px")


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
                .style("font-size", "12px")
                .style("left", ((event.x) +10) + "px")
                .style("top", ((event.y) +10) + "px");



            d3.selectAll(".date").style("opacity", 0.5);

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
                .style("stroke-width", "1.5")
                .attr('fill', 'none');


            rects.style("opacity", 1);

        }


        const mouseleave = function(event, d) {
            tooltip
                .style("opacity", 0)
            d3.selectAll(".hover")
                .style("stroke", "none");



            d3.selectAll("rect")
                .style("opacity", 1)
        }


    //overall title
        svg
            .append("text")
            .attr("x", width/4)
            .attr("y", padding-100)
            .attr("class", "title")
            .text("New Covid-19 cases across regions per week")
            .attr("fill","black")
            .attr("font-size", "16")
            .attr("font-weight","bold")

    //x axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size","12")
            .attr("x", width/2)
            .attr("y", height+50)
            .text("week");

        //ya axis label
        svg.append("text")
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


        //draw stacked rectangles
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
            .on("mouseleave", mouseleave);


        // // zero baseline bar chart - Europe
        // svg.selectAll("mybar")
        //     .data(stackedData[5])
        //     .join("rect")
        //     .attr("x", d => x(d.data.group))
        //     .attr("y", d => y(d[1] - d[0]))
        //     .attr("width", x.bandwidth())
        //     .attr("height", d => y(0) - y(d[1] - d[0]))
        //     .attr("fill", "#606e04");

        //stacked bar chart
        // stackedData.slice(0, 4).forEach((region, i) => {
        //     svg.selectAll("mybar")
        //         .data(region)
        //         .join("rect")
        //         .attr("x", d => x(d.data.group))
        //         .attr("y", d => y(d[1]))
        //         .attr("width", x.bandwidth())
        //         .attr("height", d => y(d[0]) - y(d[1]))
        //         .attr("fill", d => color(i));
        // });


    //legend rectangles
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
