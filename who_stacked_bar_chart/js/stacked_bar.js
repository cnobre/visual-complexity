
const margin = {top: 70, right: 100, bottom: 50, left: 100},
    width = 800 - margin.left - margin.right,
    height = 500- margin.top - margin.bottom;

const padding = 70;

const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


    d3.csv("data/daily_cases_weekly.csv")

        .then( function(data) {

        const subgroups = data.columns.slice(1)


        const groups = data.map(d => (d.group))


        const x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2]);

        bottom_axis = d3.axisBottom(x).tickValues(x.domain().filter(function(d,i){ return !(i%10)}));


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


        const y = d3.scaleLinear()
            .domain([0,895030])
            .range([ height, 0 ]);

        svg.append("g")
            .call(d3.axisLeft(y));

        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(["grey", "#bf2183", "#206fbe", "#00a687", "#47199c", "#c0d058", "#feac3d"])


        const stackedData = d3.stack()
            .keys(subgroups)
            (data)

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
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width",x.bandwidth())
    })
