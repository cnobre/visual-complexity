
d3.json('data/dataset.json')
    .then(data => {
        UpSetPlot(data);
        animate();
    });


function UpSetPlot(data) {
    // Process data: check set membership for each combination
    const allSetIds = data.sets.map(d => d.setId);

    data.combinations.forEach(combination => {
        combination.sets = [];
        allSetIds.forEach(d => {
            combination.sets.push({
                setId: d,
                member: combination.setMembership.includes(d)
            });
        });

    });


    const containerWidth = 1000;
    const containerHeight = 350;

    const margin = { top: 100, right: 0, bottom: 0, left: 0 };
    const innerMargin = 12;
    const tooltipMargin = 10;

    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.left;

    const leftColWidth = 250;
    const setIdWidth = 120;
    const MainChartWidth = leftColWidth - setIdWidth;
    const rightColWidth = width - leftColWidth -120;

    const topRowHeight = 130;
    const bottomRowHeight = height - topRowHeight - innerMargin;


    const IntersectionChartScale = d3.scaleLinear()
        .range([topRowHeight, 0])
        .domain([0, d3.max(data.combinations, (d) => d.test)]);

    const MainChartScale = d3.scaleLinear()
        .range([MainChartWidth, 0])
        .domain([0, d3.max(data.sets, (d) => d.size)]);

    const xScale = d3.scaleBand()
        .range([0, rightColWidth])
        .domain(data.combinations.map((d) => d.combinationId))
        .paddingInner(0.2);

    const yScale = d3.scaleBand()
        .range([0, bottomRowHeight])
        .domain(allSetIds)
        .paddingInner(0.2);

    const svg = d3.select('#upset-plot')
        .append('svg')
        .attr('width', containerWidth)
        .attr('height', containerHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const MainChart = svg.append('g')
        .attr('class', 'intersection-size')
        .attr('transform', `translate(0, ${topRowHeight + innerMargin})`);

    const IntersectionChart = svg.append('g')
        .attr('class', 'intersection-size')
        .attr('transform', `translate(${leftColWidth}, 0)`);

    const combinationMatrix = svg.append('g')
        .attr('transform', `translate(${leftColWidth}, ${topRowHeight + innerMargin})`);


    const combinationGroup = combinationMatrix.selectAll('.combination')
        .data(data.combinations)
        .join('g')
        .attr('class', 'combination')
        .attr('transform', (d) => `translate(${xScale(d.combinationId) + xScale.bandwidth()/2.5}, 0)`);


    const circle = combinationGroup.selectAll('circle')
        .data((combination) => combination.sets)
        .join('circle')
        .classed('member', (d) => d.member)
        .attr('cy', (d) => yScale(d.setId) + yScale.bandwidth()/2.5)
        .attr('r', (d) => yScale.bandwidth()/2);


    MainChart.selectAll('.bar')
        .data(data.sets)
        .join('rect')
        .attr('class', 'bar')
        .attr('width', (d) => MainChartWidth - MainChartScale(d.size))
        .attr('height', yScale.bandwidth())
        .attr('x', 900)
        .attr('y', (d) => yScale(d.setId))
        .on('mouseover', (event,d) => {
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(d.label.join('<br/>'));
        })
        .on('mousemove', (event) => {
            d3.select('#tooltip')
                .style('left', (event.pageX + tooltipMargin) + 'px')
                .style('top', (event.pageY + tooltipMargin) + 'px')
        })
        .on('mouseout', () => {
            d3.select('#tooltip').style('opacity', 0);
        });


    MainChart.selectAll('.set-name')
        .data(data.sets)
        .join('text')
        .attr('class', 'set-name')
        .attr('text-anchor', 'end')
        .attr('font-size', "14px")
        .style("font-family",'Arial')
        .attr("fill", "#b3b1b1")
        .attr('x', 230)
        .attr('y', (d) => yScale(d.setId) + yScale.bandwidth()/2.5)
        .attr('dy', '0.35em')
        .text((d) => d.setId);


    IntersectionChart.selectAll('.bar')
        .data(data.combinations)
        .join('rect')
        .attr('class', 'bar')
        .attr('height', (d) => topRowHeight - IntersectionChartScale(d.test))
        .attr('width', xScale.bandwidth())
        .attr('x', (d) => xScale(d.combinationId))
        .attr('y', (d) => IntersectionChartScale(d.test))
        .on('mouseover', (event,d) => {
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(d.labels.join('<br/>'));
        })
        .on('mousemove', (event) => {
            d3.select('#tooltip')
                .style('left', (event.pageX + tooltipMargin) + 'px')
                .style('top', (event.pageY + tooltipMargin) + 'px')
        })
        .on('mouseout', () => {
            d3.select('#tooltip').style('opacity', 0);
        });

    svg.append("text")
        .attr("x", 250)
        .attr("y", -20 - (margin.top / 2))
        .attr('class', 'title-text')
        .attr("text-anchor", "start")
        .style("font-size", "22px")
        .style("font-weight", 700)
        .style("text-decoration", "bold")
        .style("font-family",'Arial')
        .text("Which symptoms do COVID patients have?");

    svg.append("text")
        .attr("x", 250)
        .attr("y", 0 - (margin.top / 2))
        .attr('class', 'title-text_2')
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-weight", 100)
        .style("text-decoration", "bold")
        .style("font-family",'Arial')
        .text("The users of the COVID Symptoms tracker reported their symptoms.");

    svg.append("text")
        .attr("x", 250)
        .attr("y", 20 - (margin.top / 2))
        .attr('class', 'title-text_2')
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-weight", 100)
        .style("text-decoration", "bold")
        .style("font-family",'Arial')
        .text("The infographic shows the frequency of each symptom and combination of symptoms.");

}

function animate(){
    gsap.from(".bar", {opacity:0, rotation: 360, x: 100, duration: 2});
}
