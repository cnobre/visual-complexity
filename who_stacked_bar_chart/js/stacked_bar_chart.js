class StackedChart {

    constructor(data) {

        this.subgroups = data.columns.slice(1);

        this.groups = data.map(d => (d.group));

        this.data = data;

        console.log(this.data)

        this.initVis();

    }


    initVis() {

        let vis = this;

        vis.margin = {top: 70, right: 150, bottom: 50, left: 100},
            vis.width = 800 - vis.margin.left - vis.margin.right,
            vis.height = 500 - vis.margin.top - vis.margin.bottom;

        vis.number_format = d3.format(',');

        vis.padding = 70;

        vis.svg = d3.select("#stackedchart")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);


        vis.x = d3.scaleBand()
            .domain(vis.groups)
            .range([0, vis.width])
            .padding([0.2]);

        vis.y = d3.scaleLinear()
            .domain([0, 5721835])
            .range([vis.height, 0]);

        vis.color = d3.scaleOrdinal()
            .domain(vis.subgroups)
            .range(["#bf2183", "#206fbe", "#00a687", "#47199c", "#606e04", "#ee8c07"])


        vis.stackedData = d3.stack()
            .keys(vis.subgroups)
            (vis.data)

        console.log(vis.stackedData[0])


        vis.bottom_axis = d3.axisBottom(vis.x).tickValues(vis.x.domain().filter(function (d, i) {
            return !(i % 10)
        }));


        //append tooltip
        vis.tooltip = d3.select("#stackedchart")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("box-shadow", "2px 2px 4px lightgrey")
            .style("padding", "10px")


        //overall title
        vis.svg
            .append("text")
            .attr("x", vis.width / 4)
            .attr("y", vis.padding - 100)
            .attr("class", "title")
            .text("New Covid-19 cases across regions per week")
            .attr("fill", "black")
            .attr("font-size", "16")
            .attr("font-weight", "bold")

        //x axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", "12")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + 50)
            .text("week");

        //y axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.width / 3)
            .attr("y", vis.padding - 140)
            .attr("font-size", "12")
            .text("No. of new Covid-19 cases");


        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(vis.bottom_axis)


        vis.svg.append("g")
            .call(d3.axisLeft(vis.y));


        //draw stacked rectangles
        vis.svg.append("g")
            .selectAll("g")
            .data(vis.stackedData)
            .join("g")
            .attr("fill", d => vis.color(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", d => vis.x(d.data.group))
            .attr("y", d => vis.y(d[1]))
            .attr("class", d => "date date-" + d.data.group)
            .attr("height", d => vis.y(d[0]) - vis.y(d[1]))
            .attr("width", vis.x.bandwidth())
            .attr("total", d => d.total)
            .on("mouseover", function(e,d) {vis.Mouseover(this,e,d)})
            .on("mouseout", function() {vis.Mouseleave(this)});


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
        vis.size = 10;
        vis.legendGroups = vis.subgroups.slice().reverse();
        vis.svg.selectAll("mylegend")
            .data(vis.legendGroups)
            .enter()
            .append("rect")
            .attr("x", vis.width + 35)
            .attr("y", function (d, i) {
                return 110 + i * (vis.size + 5)
            })
            .attr("width", vis.size)
            .attr("height", vis.size)
            .style("fill", function (d) {
                return vis.color(d)
            });

        //display legend labels
        vis.svg.selectAll("mylegendlabels")
            .data(vis.legendGroups)
            .enter()
            .append("text")
            .attr("x", vis.width + 35 + vis.size * 1.2)
            .attr("y", function (d, i) {
                return 110 + i * (vis.size + 5) + (vis.size / 2)
            })
            .style("fill", function (d) {
                return vis.color(d)
            })
            .text(function (d) {
                return d
            })
            .attr("text-anchor", "left")
            .style("font-size", "10")
            .style("alignment-baseline", "middle")


    }


    //mouseover which displays a tooltip
    Mouseover(element,e,d) {

        let vis = this;


        vis.subgroupName = d3.select(element.parentNode).datum().key;
        vis.subgroupValue = d.data[vis.subgroupName];
        vis.date = d.data.group;

        vis.dataForDate = vis.data.filter(f => f.group === vis.date)[0];
        vis.total = 0;
        vis.subgroups.forEach(sg => vis.total += parseInt(vis.dataForDate[sg]));

        // console.log(dataForDate)

        //display tooltip
        vis.tooltip
            .html(`<b>Week:</b> ${d.data.group}<br>
                       <b>Total cases:</b> ${vis.number_format(vis.total)}<br>
                       <br>
                  
                       <span style="font-size:11px;color: ${vis.color('Americas')}"> <b>Americas:</b></span>
                       <span style="font-size:11px;color: ${vis.color('Americas')}"> ${vis.number_format(vis.dataForDate['Americas'])}</span><br>
                       <span style="font-size:11px;color: ${vis.color('Europe')}"> <b>Europe:</b></span>
                       <span style="font-size:11px;color: ${vis.color('Europe')}"> ${vis.number_format(vis.dataForDate['Europe'])}</span><br>
                       <span style="font-size:11px;color: ${vis.color('South East Asia')}"> <b>South East Asia:</b></span>
                       <span style="font-size:11px;color: ${vis.color('South East Asia')}"> ${vis.number_format(vis.dataForDate['South East Asia'])}</span><br>
                       <span style="font-size:11px;color: ${vis.color('Eastern Mediterranean')}"> <b>Eastern Mediterranean:</b></span>
                       <span style="font-size:11px;color: ${vis.color('Eastern Mediterranean')}"> ${vis.number_format(vis.dataForDate['Eastern Mediterranean'])}</span><br>
                       <span style="font-size:11px;color: ${vis.color('Africa')}"> <b>Africa:</b></span>
                       <span style="font-size:11px;color: ${vis.color('Africa')}"> ${vis.number_format(vis.dataForDate['Africa'])}</span><br>
                       <span style="font-size:11px;color: ${vis.color('Western Pacific')}"> <b>Western Pacific:</b></span>
                       <span style="font-size:11px;color: ${vis.color('Western Pacific')}"> ${vis.number_format(vis.dataForDate['Western Pacific'])}</span><br>`)

            .style("opacity", 1)
            .style("font-size", "11px")
            .style("left", ((e.x) +10) + "px")
            .style("top", ((e.y) +10) + "px");


        //"dim" unselected rectangles
        d3.selectAll(".date").style("opacity", 0.5);

        vis.rects = d3.selectAll(".date-" + vis.date);
        vis.rect = vis.rects._groups[0][vis.rects._groups[0].length-1].getBBox();

        //tooltip boarder
        vis.svg
            .append("rect")
            .attr('class', "hover")
            .attr('x', vis.rect.x)
            .attr('y', vis.rect.y)
            .attr('width', vis.rect.width)
            .attr('height', vis.height - vis.rect.y)
            .attr('stroke', 'black')
            .style("stroke-width", "1.5")
            .attr('fill', 'none');


        vis.rects.style("opacity", 1);

    }

    ////mouseleave after a tooltip is shown
    Mouseleave(element) {

        let vis = this;

        vis.tooltip
            .style("opacity", 0)
        d3.selectAll(".hover")
            .style("stroke", "none");


        d3.selectAll("rect")
            .style("opacity", 1)
    }


};